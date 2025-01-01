import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import Navbar
import PropTypes from 'prop-types';
import themeImage from '../assets/theme.png';

const HomePage = ({ currentUser }) => {
  return (
    <>
      {/* Navbar */}
      <Navbar currentUser={currentUser} />

      {/* Hero Section */}
      <Container className="mt-5 text-center">
        <h1 className="display-4 fw-bold">Organize Your Study Life</h1>
        <p className="lead mx-auto" style={{ maxWidth: '600px' }}>
          Manage your classes, assignments, exams, and schedules all in one place.
          Stay on top of your academic responsibilities with ease.
        </p>
        <div className="d-flex justify-content-center mb-4">
          <Button variant="primary" as={Link} to="/register" className="me-2">
            Get Started
          </Button>
          <Button variant="outline-primary" as={Link} to="/login">
            Login
          </Button>
        </div>
      </Container>
      <div className="d-flex justify-content-center">
        <img
          src={themeImage}
          alt="Study Life Illustration"
          className="img-fluid rounded shadow-lg"
          style={{ width: '100%', objectFit: 'cover' }}
        />
      </div>
      {/* Features Section */}
      <Container className="mt-5">
        <Row>
          <Col xs={12} md={4} className="text-center mb-4">
            <FontAwesomeIcon icon={faBook} size="3x" className="mb-3 text-primary" />
            <h3>Manage Classes</h3>
            <p>Keep track of your classes and schedules effortlessly.</p>
          </Col>
          <Col xs={12} md={4} className="text-center mb-4">
            <FontAwesomeIcon icon={faUser} size="3x" className="mb-3 text-success" />
            <h3>Track Assignments</h3>
            <p>Never miss a deadline with our comprehensive assignment tracker.</p>
          </Col>
          <Col xs={12} md={4} className="text-center mb-4">
            <FontAwesomeIcon icon={faUser} size="3x" className="mb-3 text-success" />
            <h3>Stay Organized</h3>
            <p>Keep all your study materials and schedules organized in one place.</p>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-5">
        <Container>
          <p>&copy; {new Date().getFullYear()} MyStudyLife Clone. All rights reserved.</p>
        </Container>
      </footer>
    </>
  );
};

HomePage.propTypes = {
  currentUser: PropTypes.object,
};

export default HomePage;
