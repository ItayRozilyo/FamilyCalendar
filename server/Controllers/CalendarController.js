const express = require("express");
const Event = require("../Models/Event");
const moment = require("moment");
const getTokenFromReq = require("../utils")

const router = express.Router();

router.post("/create-event", async (req, res) => {
  try {
    console.log("Data received from frontend:", req.body);
    const event = new Event(req.body);
    token = getTokenFromReq(req)
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
    const events = await Event.find();
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
