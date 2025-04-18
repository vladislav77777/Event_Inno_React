import React, { useState } from 'react';
import api from '../services/api';
import '../styles/UserRegistrationForm.css';
import { useNavigate } from 'react-router-dom';
import '../styles/LightningLoader.css';
import mcqueen from '../assets/lightning-mcqueen.png';

const LightningLoader = () => (
  <div className="loader-container">
    <div className="loading-bar">
      <img src={mcqueen} alt="Lightning McQueen" className="mcqueen-car" />
      <div className="loading-progress" />
    </div>
    <div className="loader-text">Speeding up… Lightning-fast registration!</div>
  </div>
);

const UserRegistrationForm = ({ onRegister }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'code' | 'done'
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const sendVerificationCode = async () => {
    try {
      await api.post('/participants/send-code', { email: form.email });
      setStep('code');
    } catch (err) {
      setErrorMessage('⚠️ Failed to send verification code. Try again.');
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/participants/verify-code', {
        email: form.email,
        code: verificationCode,
      });

      if (response.data.success) {
        await registerParticipant();
      } else {
        setErrorMessage('❌ Invalid verification code.');
      }
    } catch (err) {
      setErrorMessage('❌ Code verification failed. Try again.');
    }
  };

  const registerParticipant = async () => {
    setErrorMessage('');
    try {
      const { firstName, lastName } = form;
      const { data } = await api.post('/participants', form);
      const { id } = data;

      localStorage.setItem('participantId', id);
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
      if (onRegister) {
        onRegister(`${firstName} ${lastName}`);
      }

      setSuccessMessage(`🎉 Welcome, ${firstName}! Your ID is ${id}`);
      setForm({ firstName: '', lastName: '', email: '' });
      setStep('done');
      setIsLoading(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage('❌ Failed to register. Please try again.');
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!form.email || !form.firstName || !form.lastName) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    await sendVerificationCode();
  };

  if (isLoading) return <LightningLoader />;

  return (
    <div className="registration-container">
      <h2 className="title">Join Our Platform</h2>

      {step === 'form' && (
        <form onSubmit={handleInitialSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Send Verification Code
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleCodeSubmit} className="verification-form">
          <div className="form-group">
            <label htmlFor="verificationCode">Enter 4-digit Code from Email:</label>
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              maxLength={4}
              pattern="\d{4}"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Verify & Register
          </button>
        </form>
      )}

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default UserRegistrationForm;