import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/ParticipantList.css';

const ParticipantList = () => {
  const { id: eventId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {

    api.get(`/events/${eventId}`)
    .then(response => {
      setEventTitle(response.data.title);
    })
    .catch(error => console.error('Failed to load event title:', error));

    api.get(`/events/${eventId}/participants`)
      .then(response => {
        console.log(response.data);
        setParticipants(response.data);
      })
      .catch(error => console.error('Failed to load participants:', error));
  }, [eventId]);

  return (
    <div className="participant-list-container">
      <h2>👥 Participants for Event “{eventTitle || 'event'}”</h2>
      {participants.length > 0 ? (
        <>
          <div className="participant-summary">
            <span>Total: <strong>{participants.length}</strong></span>
          </div>
          <table className="participant-table">
            <thead>
              <tr>
                <th>#</th>
                <th>🧑 First Name</th>
                <th>😎 Last Name</th>
                <th>📧 Email</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={participant.id || index}>
                  <td>{index + 1}</td>
                  <td>{participant.firstName}</td>
                  <td>{participant.lastName}</td>
                  <td>{participant.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="no-participants-meme">
          <p className="no-participants-text">No registered participants yet.</p>
          <img
            src="/travolta-meme.png"
            alt="No participants meme"
            className="no-participants-image"
          />
        </div>
      )}
    </div>
  );
};

export default ParticipantList;
