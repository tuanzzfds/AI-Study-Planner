import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from '../config/config';
import axios from 'axios';
const apiKey = config.geminiApiKey;

if (!apiKey) {
  console.error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeSchedule = async (tasks) => {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze this task schedule and provide structured feedback in the following format:

    1. Schedule Status Overview:
       - Assess the current task load
       - Identify any immediate concerns
       - Note if schedule is empty and implications

    2. Task Prioritization Recommendations:
       - Categorize tasks using Eisenhower Matrix
       - Identify urgent vs. important tasks
       - Suggest task sequence optimization

    3. Time Management Analysis:
       - Review time allocation patterns
       - Identify potential scheduling conflicts
       - Suggest time blocking improvements

    4. Work-Life Balance Assessment:
       - Evaluate distribution of work vs. breaks
       - Check for potential burnout indicators
       - Recommend balance improvements

    5. Action Steps:
       - List 3-5 specific actions to improve schedule
       - Suggest schedule adjustments if needed
       - Provide time management tips

    Please analyze the following tasks and provide detailed recommendations in each category:
    ${JSON.stringify(tasks, null, 2)}
    
    If no tasks are present, provide guidance for effective schedule creation and time management.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing schedule:', error);
    throw new Error('Failed to analyze schedule. Please check your API key configuration.');
  }
};

export const analyzeAnalytics = async (dailyData, taskStatusData, progressPercentage) => {
  const prompt = `As a study analytics AI assistant, analyze this data and provide feedback:
    - Daily time spent pattern: ${JSON.stringify(dailyData)}
    - Task completion status: ${JSON.stringify(taskStatusData)}
    - Overall progress: ${progressPercentage}%
    
    Please provide:
    1. Areas where the user is excelling
    2. Subjects or tasks that need more attention
    3. Motivational feedback for improvement`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error analyzing analytics:', error);
    throw error;
  }
};
export const createTask = async (taskData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5001/api/ai/tasks/create', taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:5001/api/ai/tasks/update/${taskId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5001/api/ai/tasks/delete/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const startTimer = async (taskId, duration) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5001/api/ai/timer/start', { taskId, duration }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.timer;
  } catch (error) {
    console.error('Error starting timer:', error);
    throw error;
  }
};

export const stopTimer = async (timerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5001/api/ai/timer/stop', { timerId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.timer;
  } catch (error) {
    console.error('Error stopping timer:', error);
    throw error;
  }
};