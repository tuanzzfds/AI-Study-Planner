import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';

const AddTaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('Pending');
  const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', {
        title,
        description,
        priority,
        status,
        startDate, // Added
        endDate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle('');
      setDescription('');
      setPriority('Low');
      setStatus('Pending');
      setStartDate(''); // Reset
      setEndDate('');   // Reset
      onTaskAdded();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
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