import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Image } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { validateName, validatePassword } from '../utils/validation';

const SettingsPage = () => {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [newsletters, setNewsletters] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateInputs = () => {
    const errors = {};

    if (fullName) {
      const nameValidation = validateName(fullName);
      if (!nameValidation.isValid) {
        errors.fullName = nameValidation.message;
      }
    }

    if (password) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateInputs()) {
      setError('Please correct the validation errors');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      if (fullName) formData.append('fullName', fullName);
      if (password) formData.append('password', password);
      if (profilePicture) formData.append('profilePicture', profilePicture);

      await axios.put(
        'http://localhost:5001/api/users/profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Container className="my-5">
          <h3 className="mb-4">Profile</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSave}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Group as={Row} className="mb-3" controlId="profilePicture">
                  <Form.Label column sm="3">Profile Picture</Form.Label>
                  <Col sm="9" className="d-flex align-items-center">
                    <Image
                      src="https://via.placeholder.com/50"
                      alt="Profile"
                      roundedCircle
                      className="me-3"
                    />
                    <Form.Control
                      type="file"
                      onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="fullName">
                  <Form.Label column sm="3">Full Name</Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      isInvalid={!!validationErrors.fullName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.fullName}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-4" controlId="password">
                  <Form.Label column sm="3">Password</Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!validationErrors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.password}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-4" controlId="newsletters">
                  <Col sm={{ span: 9, offset: 3 }}>
                    <Form.Check
                      type="checkbox"
                      label="I'd like to receive updates from time to time"
                      checked={newsletters}
                      onChange={(e) => setNewsletters(e.target.checked)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Col sm={{ span: 9, offset: 3 }}>
                    <Button variant="success" type="submit">Save</Button>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default SettingsPage;