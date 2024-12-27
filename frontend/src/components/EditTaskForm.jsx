import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditTaskForm = ({ task, onTaskEdit }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority);
  const [startDate, setStartDate] = useState(task.startDate ? new Date(task.startDate) : null);
  const [endDate, setEndDate] = useState(task.endDate ? new Date(task.endDate) : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
        title,
        description,
        priority,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskEdit();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        className="mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        className="mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        label="Priority"
        select
        variant="outlined"
        fullWidth
        className="mb-3"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
      >
        <MenuItem value="Low">Low</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="High">High</MenuItem>
      </TextField>
      <div className="mb-3">
        <label>Start Date and Time</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label>End Date and Time</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="form-control"
          required
        />
      </div>
      <Button variant="contained" color="primary" type="submit">
        Update Task
      </Button>
    </form>
  );
};

EditTaskForm.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string.isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
  onTaskEdit: PropTypes.func.isRequired,
};

export default EditTaskForm;