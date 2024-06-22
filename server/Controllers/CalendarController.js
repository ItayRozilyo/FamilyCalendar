const express = require("express");
const Event = require("../Models/Event");
const Calendar = require("../Models/Calendar");
const User = require("../Models/User");
const moment = require("moment");
const getTokenFromReq = require("../utils");

const router = express.Router();

router.get("/get-calendars", async (req, res) => {
  try {
    token = getTokenFromReq(req);
    // TODO - return as json of owned, edit, view (so the frontend knows)
    const owned = await Calendar.find({ owner: token.userId }).populate(
      "owner",
      "name"
    );
    const edit = await Calendar.find({ editors: token.userId }).populate(
      "owner",
      "name"
    );
    const view = await Calendar.find({ viewers: token.userId }).populate(
      "owner",
      "name"
    );
    const formatCalendars = (calendars) => {
      return calendars.map((calendar) => ({
        name: calendar.owner.name,
        id: calendar._id,
      }));
    };

    const response = {
      owned: formatCalendars(owned),
      edit: formatCalendars(edit),
      view: formatCalendars(view),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting calendaers", error);
  }
});

router.get("/get-users", async (req, res) => {
  try {
    const token = getTokenFromReq(req);
    const userId = token.userId;

    // Get all users
    const allUsers = await User.find({ _id: { $ne: userId } }).select(
      "id name"
    );

    // Get the user's single calendar
    const myCalendar = await Calendar.findOne({ owner: userId }).populate(
      "editors viewers"
    );

    if (!myCalendar) {
      return res
        .status(404)
        .json({ message: "No calendar found for the user." });
    }

    // Create sets to store unique editor and viewer IDs
    const editorIds = new Set(myCalendar.editors.map((editor) => editor.id));
    const viewerIds = new Set(myCalendar.viewers.map((viewer) => viewer.id));

    // Categorize users based on their roles
    const editors = [];
    const viewers = [];
    const noPermissions = [];

    allUsers.forEach((user) => {
      if (editorIds.has(user.id)) {
        editors.push({ id: user.id, name: user.name });
      } else if (viewerIds.has(user.id)) {
        viewers.push({ id: user.id, name: user.name });
      } else {
        noPermissions.push({ id: user.id, name: user.name });
      }
    });

    // Format the response
    const response = {
      editors,
      viewers,
      noPermissions,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting users", error);
    res.status(500).send("Error getting users");
  }
});

router.post("/edit-permissions", async (req, res) => {
  // {editors: [id1, id2], viewers: [id3, id4]}
  try {
    token = getTokenFromReq(req);
    const myCalendar = await Calendar.findOne({ owner: token.userId });
    myCalendar.editors = req.body.editors;
    myCalendar.viewers = req.body.viewers;
    myCalendar.save();
    res.status(200).send();
  } catch (error) {
    console.error("Error handling permissions!: ", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/create-event", async (req, res) => {
  try {
    console.log("Data received from frontend:", req.body);
    const event = new Event(req.body);
    console.log("Event to be created:", event);
    await event.save();
    res.status(201).send(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/get-events", async (req, res) => {
  try {
    const token = getTokenFromReq(req);
    const userId = token.userId;

    // Find all calendars the user has access to
    const ownedCalendars = await Calendar.find({ owner: userId }).select("_id");
    const editCalendars = await Calendar.find({ editors: userId }).select(
      "_id"
    );
    const viewCalendars = await Calendar.find({ viewers: userId }).select(
      "_id"
    );

    // Extract calendar IDs
    const calendarIds = [
      ...ownedCalendars.map((calendar) => calendar._id),
      ...editCalendars.map((calendar) => calendar._id),
      ...viewCalendars.map((calendar) => calendar._id),
    ];

    // Find all events in the accessible calendars
    const events = await Event.find({ calendar: { $in: calendarIds } });
    console.log("calendars: ", calendarIds);
    console.log("Fetched events:", events);
    res.status(200).send(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
router.delete("/delete-event/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(req.params);
    await Event.findByIdAndDelete(eventId);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
