import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Sidebar from '../components/Sidebar';
import { validateTaskTitle, validateTaskDescription, validateDateRange } from '../utils/validation';

const NewTask = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Todo');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/taskpage');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate inputs
    const titleValidation = validateTaskTitle(title);
    if (!titleValidation.isValid) {
      setError(titleValidation.message);
      return;
    }

    const descValidation = validateTaskDescription(details);
    if (!descValidation.isValid) {
      setError(descValidation.message);
      return;
    }

    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.isValid) {
      setError(dateValidation.message);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const newTask = {
        title,
        description: details,
        estimatedTime: parseFloat(time),
        priority,
        status,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      await axios.post(
        'http://localhost:5001/api/tasks',
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Task created successfully.');
      // Clear the form
      setTitle('');
      setDetails('');
      setTime('');
      setPriority('Medium');
      setStatus('Todo');
      // Redirect to Task Page
      navigate('/taskpage');
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Failed to create task.');
    }
  };

  const setTodayStartDate = () => {
    setStartDate(new Date());
  };

  const setTodayEndDate = () => {
    setEndDate(new Date());
  };

  return (
    <>
      <Sidebar />
      <Container fluid className="py-4" style={{ maxWidth: '900px' }}>
        <div className="d-flex align-items-center mb-4">
          <div className="me-2" style={{ fontSize: '1.5rem' }}>
            {/* Replace the below span with an actual icon if desired */}
            <span role="img" aria-label="new-task" style={{ fontSize: '1.5rem' }}>
              📝
            </span>
          </div>
          <h2>Create New Task</h2>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSave}>
          {/* Task Name Field */}
          <Form.Group className="mb-4" controlId="taskName">
            <Form.Label>
              Task Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          {/* Description Field */}
          <Form.Group className="mb-4" controlId="description">
            <Form.Label>
              Description <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter task description"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </Form.Group>

          {/* Priority Level Field */}
          <Form.Group className="mb-4" controlId="priority">
            <Form.Label>
              Priority Level <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Form.Select>
          </Form.Group>

          {/* Status Field */}
          <Form.Group className="mb-4" controlId="status">
            <Form.Label>
              Status <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Expired">Expired</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-4" controlId="startDate">
            <Form.Label>
              Start Date and Time <span className="text-danger">*</span>
            </Form.Label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              timeIntervals={2}
              dateFormat="Pp tt"
              className="form-control"
              required
            />
            <Button variant="link" onClick={() => setStartDate(null)}>
              Clear
            </Button>
            <Button variant="link" onClick={setTodayStartDate}>
              Today
            </Button>
          </Form.Group>

          {/* End Date and Time Field */}
          <Form.Group className="mb-4" controlId="endDate">
            <Form.Label>
              End Date and Time <span className="text-danger">*</span>
            </Form.Label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              timeIntervals={2}
              dateFormat="Pp tt"
              className="form-control"
              required
            />
            <Button variant="link" onClick={() => setEndDate(null)}>
              Clear
            </Button>
            <Button variant="link" onClick={setTodayEndDate}>
              Today
            </Button>
          </Form.Group>
          {/* Save and Cancel Buttons */}
          <Row className="mb-3">
            <Col sm={{ span: 9, offset: 3 }}>
              <Button variant="outline-secondary" className="me-3" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default NewTask;