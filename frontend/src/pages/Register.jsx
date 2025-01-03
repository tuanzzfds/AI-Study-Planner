import { useState } from 'react';
import axios from 'axios'; // Add axios import
import './Register.css'; // Custom CSS for styling the page
import { useNavigate } from 'react-router-dom';
// Add FontAwesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'; // Import Firebase functions
import { auth } from '../services/firebase'; // Import Firebase auth

const Register = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState(''); // Add fullName state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Add message state
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate all fields
    const emailValidation = validateEmail(email);
    const nameValidation = validateName(fullName);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      setError(emailValidation.message);
      return;
    }

    if (!nameValidation.isValid) {
      setError(nameValidation.message);
      return;
    }

    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Set success message
      setMessage('Registration successful! Please check your email to verify your account.');

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 5000); // Redirect after 5 seconds
    } catch (error) {
      setError(error.message || 'Registration failed.');
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
          {message && <div className="success-message">{message}</div>}

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