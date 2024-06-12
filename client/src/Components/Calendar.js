import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import AddEventModal from "./AddEventModal";

const Calendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/calendar/get-events"
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchCalendars = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/calendar/get-calendars"
        );
        setCalendars(response.data);
      } catch (error) {
        console.error("Error fetching calendars", error);
      }
    }

    fetchEvents();
  }, []);

  const onEventAdded = async (event) => {
    try {
      const response = await axios.post(
        "http://localhost:5002/api/calendar/create-event",
        event
      );
      setEvents([...events, response.data]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleEventDelete = async (eventId) => {
    console.log(events);
    try {
      await axios.delete(
        `http://localhost:5002/api/calendar/delete-event/${eventId}`
      );
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEventClick = (info) => {
    // Handle event click here
  };

  return (
    <section>
      <button onClick={() => setModalOpen(true)}>Add Event</button>
      <div style={{ position: "relative", zIndex: 0 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={(info) => handleEventClick(info)}
          eventContent={(arg) => (
            <div>
              <b>{arg.timeText}</b>
              <i>{arg.event.title}</i>
              <button
                onClick={() => handleEventDelete(arg.event.extendedProps._id)}
              >
                Delete
              </button>
            </div>
          )}
        />
      </div>
      <AddEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEventAdded={(event) => onEventAdded(event)}
      />
    </section>
  );
};

export default Calendar;
