// frontend/src/components/AIAgentControls.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { createTask, updateTask, deleteTask, startTimer, stopTimer } from '../services/geminiServiceTaskPage';

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

  const handleUpdateTask = async (taskId) => {
    const updates = {
      status: 'In Progress',
    };
    const updatedTask = await updateTask(taskId, updates);
    console.log('Task updated:', updatedTask);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    console.log('Task deleted:', taskId);
  };

  const handleStartTimer = async (taskId) => {
    const duration = 60; // 60 minutes
    const timer = await startTimer(taskId, duration);
    console.log('Timer started:', timer);
  };

  const handleStopTimer = async (timerId) => {
    const timer = await stopTimer(timerId);
    console.log('Timer stopped:', timer);
  };

  return (
    <div>
      <Button onClick={handleCreateTask} className="mb-2">AI Create Task</Button>
      {/* Add buttons for update, delete, start, stop as needed */}
    </div>
  );
};

export default AIAgentControls;