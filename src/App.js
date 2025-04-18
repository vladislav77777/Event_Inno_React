import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import UserRegistrationForm from './components/UserRegistrationForm';
import ParticipantList from './components/ParticipantList';
import { Fireworks } from 'fireworks-js';
import './styles/App.css';
import './styles/Bubbles.css';
const basename = process.env.REACT_APP_ROUTER_BASENAME || '/';

const App = () => {
  const [participantName, setParticipantName] = useState('');
  const fireworksRef = useRef(null);
  const fireworksInstanceRef = useRef(null);

  const [clickCount, setClickCount] = useState(0);
  const [showSurprise, setShowSurprise] = useState(false);
  const clickTimerRef = useRef(null);

  const handleLogoClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;

      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => setClickCount(0), 1000); // 1 second gap

      if (newCount === 5) {
        setClickCount(0);
        setShowSurprise(true);
      }

      return newCount;
    });
  };

  useEffect(() => {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    if (firstName && lastName) {
      setParticipantName(`${firstName} ${lastName}`);
    }
  }, []);

  useEffect(() => {
    if (fireworksRef.current && !fireworksInstanceRef.current) {
      fireworksInstanceRef.current = new Fireworks(fireworksRef.current, {
        rocketsPoint: { min: 0, max: 100 },
        hue: { min: 0, max: 360 },
        delay: { min: 15, max: 30 },
        speed: 3,
        acceleration: 1.05,
        friction: 0.95,
        gravity: 1.5,
        particles: 70,
        trace: 3,
        explosion: 5,
        autoresize: true,
        brightness: {
          min: 50,
          max: 80,
          decay: { min: 0.015, max: 0.03 }
        }
      });
      fireworksInstanceRef.current.start();
    }
  }, []);

  return (
    <Router basename={basename}>
      <div className="fireworks-background">
        <div
          ref={fireworksRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            background: 'black',
          }}
        />
        <header className="app-header">
          <div className="logo-container">
            <Link to="/" className="logo-link" onClick={handleLogoClick}>
              <img src="/logo.png" alt="Logo" className="app-logo" />
            </Link>
            <h1 className="app-title">Event Management System</h1>
          </div>
          <div className="top-links">
            {participantName ? (
              <span className="welcome-msg">👋 Welcome, {participantName}</span>
            ) : (
              <Link to="/register" className="register-link">🔐 Log In</Link>
            )}
          </div>
        </header>

        <main className="app-container compact">
          <Routes>
            <Route path="/" exact element={<EventList />} />
            <Route path="/create-event" element={<EventForm />} />
            <Route path="/event/:id/participants" element={<ParticipantList />} />
            <Route
              path="/register"
              element={<UserRegistrationForm onRegister={(name) => setParticipantName(name)} />}
            />
          </Routes>
        </main>

        {/* Surprise Easter Egg */}
        {showSurprise && (
          <div className="surprise-overlay" onClick={() => setShowSurprise(false)}>
            <img src="/surprise.jpg" alt="Surprise!" className="surprise-img" />
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
