import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, MenuItem, FormHelperText } from '@mui/material';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { validateTaskTitle, validateTaskDescription, validatePriority, validateDateRange } from '../utils/validation';

const EditTaskForm = ({ task, onTaskEdit }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority);
  const [startDate, setStartDate] = useState(task.startDate ? new Date(task.startDate) : null);
  const [endDate, setEndDate] = useState(task.endDate ? new Date(task.endDate) : null);

  // Add error states
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const titleValidation = validateTaskTitle(title);
    if (!titleValidation.isValid) newErrors.title = titleValidation.message;

    const descValidation = validateTaskDescription(description);
    if (!descValidation.isValid) newErrors.description = descValidation.message;

    const priorityValidation = validatePriority(priority);
    if (!priorityValidation.isValid) newErrors.priority = priorityValidation.message;

    if (startDate && endDate) {
      const dateValidation = validateDateRange(startDate, endDate);
      if (!dateValidation.isValid) newErrors.dateRange = dateValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/tasks/${task._id}`, {
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
        error={!!errors.title}
        helperText={errors.title}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        className="mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={!!errors.description}
        helperText={errors.description}
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
        error={!!errors.priority}
        helperText={errors.priority}
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
          className={`form-control ${errors.dateRange ? 'is-invalid' : ''}`}
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
          className={`form-control ${errors.dateRange ? 'is-invalid' : ''}`}
          required
        />
        {errors.dateRange && (
          <FormHelperText error>{errors.dateRange}</FormHelperText>
        )}
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