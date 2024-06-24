import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import AddEventModal from "./AddEventModal";
import PermissionsModal from "./PermissionSelector";

axios.defaults.withCredentials = true;

const Calendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState({
    editors: [],
    viewers: [],
    noPermissions: [],
  });
  const [calendars, setCalendars] = useState({ owned: [], edit: [], view: [] });
  const [privilegedCalendars, setPrivilegedCalendars] = useState([]);
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
        setPrivilegedCalendars([...response.data.owned, ...response.data.edit]);
      } catch (error) {
        console.error("Error fetching calendars", error);
      }
    };

    fetchCalendars();
    fetchEvents();
    fetchUsers();
  }, []);

  const isPrivilegedCalendar = (calendarId) => {
    return privilegedCalendars.some((cal) => cal.id === calendarId);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/api/calendar/get-users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const updatePermissions = async (newPermissions) => {
    console.log(newPermissions);
    try {
      await axios.post(
        "http://localhost:5002/api/calendar/edit-permissions",
        newPermissions
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  const onEventAdded = async (event) => {
    console.log(event);
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

  const handleEventClick = (info) => {};

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div style={{ alignSelf: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setPermissionsOpen(true)}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s, box-shadow 0.3s",
            marginRight: "10px",
          }}
        >
          Change Permissions
        </button>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s, box-shadow 0.3s",
            marginRight: "10px",
          }}
        >
          Add Event
        </button>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s, box-shadow 0.3s",
          }}
        >
          Logout
        </button>
      </div>
      <div style={{ position: "relative", zIndex: 0, width: "100%" }}>
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
              {isPrivilegedCalendar(arg.event.extendedProps.calendar) && (
                <button
                  onClick={() => handleEventDelete(arg.event.extendedProps._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s, box-shadow 0.3s",
                    marginTop: "5px",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        />
      </div>
      <AddEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEventAdded={(event) => onEventAdded(event)}
        calendars={calendars}
      />
      <PermissionsModal
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsOpen(false)}
        onPermissionsUpdated={(newPermissions) =>
          updatePermissions(newPermissions)
        }
        users={users}
      />
    </section>
  );
};

export default Calendar;
