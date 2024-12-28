// frontend/src/components/AIAgentControls.jsx
import { Button } from 'react-bootstrap';
import { createTask } from '../services/geminiServiceTaskPage';

const AIAgentControls = () => {
  const handleCreateTask = async () => {
    const taskData = {
      title: 'AI Generated Task',
      description: 'This task was created by Gemini AI.',
      priority: 'High',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3600000), // 1 hour later
    };
    const task = await createTask(taskData);
    console.log('Task created:', task);
  };

  
  return (
    <div>
      <Button onClick={handleCreateTask} className="mb-2">AI Create Task</Button>
      {/* Add buttons for update, delete, start, stop as needed */}
    </div>
  );
};

export default AIAgentControls;