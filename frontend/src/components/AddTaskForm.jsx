import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, MenuItem, Alert } from '@mui/material';
import axios from 'axios';
import { validateTaskTitle, validateTaskDescription, validateDateRange, validatePriority, validateStatus } from '../utils/validation';

const AddTaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('Pending');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    const titleValidation = validateTaskTitle(title);
    if (!titleValidation.isValid) {
      setError(titleValidation.message);
      return;
    }

    const descValidation = validateTaskDescription(description);
    if (!descValidation.isValid) {
      setError(descValidation.message);
      return;
    }

    const priorityValidation = validatePriority(priority);
    if (!priorityValidation.isValid) {
      setError(priorityValidation.message);
      return;
    }

    const statusValidation = validateStatus(status);
    if (!statusValidation.isValid) {
      setError(statusValidation.message);
      return;
    }

    if (startDate && endDate) {
      const dateValidation = validateDateRange(startDate, endDate);
      if (!dateValidation.isValid) {
        setError(dateValidation.message);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/tasks', {
        title,
        description,
        priority,
        status,
        startDate,
        endDate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle('');
      setDescription('');
      setPriority('Low');
      setStatus('Pending');
      setStartDate('');
      setEndDate('');
      onTaskAdded();
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        className="mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        className="mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <TextField
        label="Priority"
        select
        variant="outlined"
        fullWidth
        className="mb-4"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
      >
        <MenuItem value="Low">Low</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="High">High</MenuItem>
      </TextField>
      <TextField
        label="Status"
        select
        variant="outlined"
        fullWidth
        className="mb-4"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
      </TextField>
      <Button variant="contained" color="primary" type="submit">
        Add Task
      </Button>
    </form>
  );
};

AddTaskForm.propTypes = {
  onTaskAdded: PropTypes.func.isRequired,
};

export default AddTaskForm;