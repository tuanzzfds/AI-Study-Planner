import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await axios.get('http://localhost:5001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" variant="primary" />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Sidebar />
        <Container className="mt-5">
          <Alert variant="danger">{error}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="profile-card">
              <Card.Body>
                <Row>
                  <Col md={4} className="text-center">
                    {user.profilePicture ? (
                      <Image
                        src={`http://localhost:5001${user.profilePicture}`}
                        roundedCircle
                        fluid
                        className="profile-image mb-3"
                        alt="Profile"
                      />
                    ) : (
                      <div className="profile-placeholder mb-3">
                        <i className="bi bi-person-circle display-4"></i>
                      </div>
                    )}

                  </Col>
                  <Col md={8}>
                    <h3 className="mb-3">{user.fullName}</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    {/* Add more user details here if available */}
                    {/* Example:
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    */}
                  </Col>
                </Row>
                <hr />
                <Row className="mt-3">
                  <Col className="text-end">
                    <Button variant="danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserProfile;