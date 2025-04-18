import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../services/api';
import '../styles/EventForm.css';

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDateTime, setEventDateTime] = useState(null); // now Date object
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [errors, setErrors] = useState({});
  const [showShrek, setShowShrek] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!eventType.trim()) newErrors.eventType = 'Event type is required';

    const now = new Date();

    if (!eventDateTime) {
      newErrors.eventDateTime = 'Valid date/time is required';
    } else if (eventDateTime < now) {
      newErrors.eventDateTime = 'Event date must be in the future';
    }

    if (!numberOfSeats || isNaN(numberOfSeats) || parseInt(numberOfSeats) <= 0) {
      newErrors.numberOfSeats = 'Positive number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newEvent = {
      title,
      eventType,
      eventDateTime: eventDateTime.toISOString(),
      numberOfSeats: parseInt(numberOfSeats)
    };

    api.post('/events', newEvent)
      .then(response => {
        const createdEventId = response.data.id;
        const storedIds = JSON.parse(localStorage.getItem('myCreatedEventIds') || '[]');
        const updatedIds = [...storedIds, createdEventId];
        localStorage.setItem('myCreatedEventIds', JSON.stringify(updatedIds));

        console.log('Event created:', response.data);
        setTitle('');
        setEventType('');
        setEventDateTime(null);
        setNumberOfSeats('');
        setShowShrek(true);

        setTimeout(() => {
          setShowShrek(false);
          navigate('/');
        }, 5000);
      })
      .catch(error => {
        console.error('Error creating event:', error);
      });
  };

  return (
    <div className="event-form-container">
      {showShrek ? (
        <div className="shrek-video-container">
          <video width="100%" autoPlay muted>
            <source src="/shrek.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <>
          <h1>Create New Event</h1>
          <form onSubmit={handleSubmit} noValidate>
            <label>Event Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}

            <label>Event Type:</label>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className={errors.eventType ? 'error' : ''}
            />
            {errors.eventType && <span className="error-message">{errors.eventType}</span>}

            <label>Event Date & Time:</label>
            <DatePicker
              selected={eventDateTime}
              onChange={(date) => setEventDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select date and time"
              className={`datepicker-input ${errors.eventDateTime ? 'error' : ''}`}
            />
            {errors.eventDateTime && <span className="error-message">{errors.eventDateTime}</span>}

            <label>Number of Seats:</label>
            <input
              type="number"
              value={numberOfSeats}
              onChange={(e) => setNumberOfSeats(e.target.value)}
              className={errors.numberOfSeats ? 'error' : ''}
            />
            {errors.numberOfSeats && <span className="error-message">{errors.numberOfSeats}</span>}

            <button type="submit">Create Event</button>
          </form>
        </>
      )}
    </div>
  );
};

export default EventForm;
