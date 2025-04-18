import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/EventList.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [myEventIds, setMyEventIds] = useState(new Set());
    const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
    const [registrationStatus, setRegistrationStatus] = useState({});

    const participantId = localStorage.getItem('participantId');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('myCreatedEventIds') || '[]');
        setMyEventIds(new Set(stored));
    }, []);

    useEffect(() => {
        // Fetch all events
        api.get('/events')
            .then(response => setEvents(response.data))
            .catch(error => console.error('Failed to fetch events:', error));

        // Fetch registered events for the participant
        if (participantId) {
            api.get(`/participants/${participantId}/events`)
                .then(response => {
                    const ids = response.data.map(event => event.id);
                    setRegisteredEventIds(new Set(ids));
                })
                .catch(error => console.error('Failed to fetch participant events:', error));
        }
    }, [participantId]);

    const handleDelete = (eventId) => {
        api.delete(`/events/${eventId}`)
            .then(() => {
                setEvents(prev => prev.filter(e => e.id !== eventId));
            })
            .catch(error => {
                console.error('Error deleting event:', error);
                alert('Failed to delete the event.');
            });
    };

    const handleRegister = (eventId) => {
        if (!participantId) {
            alert('Please register as a participant first!');
            return;
        }

        api.post(`/participants/${participantId}/register/${eventId}`)
            .then(() => {
                setRegisteredEventIds(prev => new Set(prev).add(eventId));
                setRegistrationStatus(prev => ({
                    ...prev,
                    [eventId]: 'Successfully registered!'
                }));
            })
            .catch(error => {
                console.error('Error registering for event:', error);
                setRegistrationStatus(prev => ({
                    ...prev,
                    [eventId]: 'Registration failed'
                }));
            });
    };

    const handleUnregister = (eventId) => {
        if (!participantId) {
            alert('Please register as a participant first!');
            return;
        }

        api.delete(`/participants/${participantId}/unregister/${eventId}`)
            .then(() => {
                setRegisteredEventIds(prev => {
                    const updated = new Set(prev);
                    updated.delete(eventId);
                    return updated;
                });
                setRegistrationStatus(prev => ({
                    ...prev,
                    [eventId]: 'Successfully unregistered!'
                }));
            })
            .catch(error => {
                console.error('Error unregistering from event:', error);
                setRegistrationStatus(prev => ({
                    ...prev,
                    [eventId]: 'Unregistration failed'
                }));
            });
    };

    return (
        <div className="event-list-outer">
        <div className="event-list-container">
            <h2>All Events</h2>
            <div className="scroll-wrapper">
                <ul className="event-list">
                    {events.map(event => (
                        <li key={event.id} className="event-card">
                            <div className="event-header">
                                <h3>{event.title}</h3>
                                {myEventIds.has(event.id) && (
                                    <button className="delete-btn" onClick={() => handleDelete(event.id)} title="Delete event">✖</button>
                                )}
                            </div>

                            <p><strong>Type:</strong> {event.eventType}</p>
                            <p><strong>Date:</strong> {new Date(event.eventDateTime).toLocaleString()}</p>

                            <div className="event-actions">
                                <a className="participants-link" href={`/event/${event.id}/participants`}>
                                    👥 View Participants
                                </a>
                                {registeredEventIds.has(event.id) ? (
                                    <button className="unregister-btn" onClick={() => handleUnregister(event.id)}>🚫 Unregister</button>
                                ) : (
                                    <button className="register-btn" onClick={() => handleRegister(event.id)}>✅ Register</button>
                                )}
                            </div>

                            {registrationStatus[event.id] && (
                                <p
                                    className={
                                        `status-message ${registrationStatus[event.id].toLowerCase().includes('failed') ? 'error' : 'success'
                                        }`
                                    }
                                >
                                    {registrationStatus[event.id]}
                                </p>
                            )}

                        </li>

                    ))}

                </ul>
            </div>
            <div className="create-link">
                <Link to="/create-event">+ Create New Event</Link>
            </div>
        </div>
        </div>
    );
};

export default EventList;
