import React, { useState } from "react";
import Modal from "react-modal";
import Datetime from "react-datetime";
import PropTypes from "prop-types";
import "../css/AddEventModal.css"; 

const AddEventModal = ({ isOpen, onClose, onEventAdded, calendars }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [value, setValue] = useState();
  console.log(calendars);

  const onSubmit = (event) => {
    console.log(event);
    event.preventDefault();

    if (start > end) {
      alert("Start date cannot be later than end date");
      return;
    }

    const calendarId = value ? value : calendars.owned[0].id;

    const eventData = {
      title,
      start: start.toISOString(),
      end: end.toISOString(),
      calendar: calendarId,
    };

    onEventAdded(eventData);
    onClose();
  };

  const handleSelectChange = (event) => {
    console.log(event.target);
    setValue(event.target.value);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="event-modal">
      <form onSubmit={onSubmit} className="event-form">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="event-input"
        />
        <div className="date-picker">
          <label>Start Date</label>
          <Datetime
            value={start}
            onChange={(date) => setStart(date)}
            className="datetime-input"
          />
        </div>
        <div className="date-picker">
          <label>End Date</label>
          <Datetime
            value={end}
            onChange={(date) => setEnd(date)}
            isValidDate={(currentDate) => currentDate.isAfter(start)}
            className="datetime-input"
          />
        </div>
        <div className="calendar-picker">
          <label>Which Calendar?</label>
          <select value={value} onChange={handleSelectChange}>
            {[...calendars.owned, ...calendars.edit].map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Add event
        </button>
      </form>
    </Modal>
  );
};

AddEventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEventAdded: PropTypes.func.isRequired,
};

export default AddEventModal;