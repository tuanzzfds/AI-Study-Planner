import { useState } from 'react';
import axios from 'axios'; // Add axios import
import './Register.css'; // Custom CSS for styling the page
import { useNavigate } from 'react-router-dom';
// Add FontAwesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState(''); // Add fullName state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple front-end validation example
    if (!email.trim()) {
      setError('Please enter a valid email.');
      return;
    }
    if (!fullName.trim()) { // Validate fullName
      setError('Please enter your full name.');
      return;
    }
    if (!password || !confirmPassword) {
      setError('Please fill out both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
       await axios.post('http://localhost:5000/api/users/signup', {
        email,
        password,
        fullName, // Send fullName to backend
      });
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        {/* Replace with your actual logo file */}
        <FontAwesomeIcon icon={faBook} className="register-logo" />
        <h1>Create an account</h1>
        <p className="register-subtitle">Organise your classes, assignments and exams for free.</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-field">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="underline"></div>

          </div>
          <div className="input-field">
            <input
              type="text"
              placeholder="Full Name" // Add Full Name input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <div className="underline"></div>
          </div>

          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="underline"></div>
          </div>

          <div className="input-field">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="underline"></div>
          </div>
          
          <button type="submit" className="confirm-button">Confirm</button>
        </form>
      </div>
    </div>
  );
};

export default Register;