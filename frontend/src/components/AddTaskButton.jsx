// frontend/src/components/AddTaskButton.jsx
import { Button } from '@mui/material';

const AddTaskButton = () => {
  return (
    <Button variant="contained" color="primary" className="mt-4">
      <i className="fas fa-plus mr-2"></i> Add Task
    </Button>
  );
};

export default AddTaskButton;
