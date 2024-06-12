import React, { useState } from "react";
import Modal from "react-modal";
import Datetime from "react-datetime";
import PropTypes from "prop-types";
import "../css/AddEventModal.css"; // Import CSS file for styling

const AddEventModal = ({ isOpen, onClose, onEventAdded }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const onSubmit = (event) => {
    event.preventDefault();

    // Check if start date is later than end date
    if (start > end) {
      alert("Start date cannot be later than end date");
      return;
    }

    const eventData = {
      title,
      start: start.toISOString(),
      end: end.toISOString(),
    };

    onEventAdded(eventData);
    onClose();
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
