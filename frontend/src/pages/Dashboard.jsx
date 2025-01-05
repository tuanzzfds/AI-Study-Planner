import './Dashboard.css'; // local CSS
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FaPlus } from 'react-icons/fa';
import AIAgentControls from '../components/AIAgentControls';
import TaskList from '../components/TaskList'; // Import TaskList component
import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [tasksDueToday, setTasksDueToday] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState([]); // New state for upcoming tasks
  const [inProgressTasks, setInProgressTasks] = useState([]); // New state for in-progress tasks
  // Function to update date and time every second
  const timer = setInterval(() => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    setTimeStr(time);
    setDateStr(date);
  }, 1000);

  // Simulating current time and date
  const now = new Date();
  const hour = now.getHours();
  let greeting = '';

  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good night';
  }
  // Add state for profile image

  useEffect(() => {
    const fetchTasksDueToday = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/tasks/due-today', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasksDueToday(response.data.count);
      } catch (error) {
        console.error('Error fetching tasks due today:', error);
      }
    };
    // Fetch upcoming tasks
    const fetchInProgressTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: 'In Progress' },
        });
        setInProgressTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching in-progress tasks:', error);
      }
    };
    const fetchUpcomingTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/tasks/upcoming', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUpcomingTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching upcoming tasks:', error);
        setUpcomingTasks([]);
      }
    };
    fetchTasksDueToday();
    fetchUpcomingTasks();
    fetchInProgressTasks();
    return () => clearInterval(timer);
  }, []);
  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  const handleQuickAddTask = () => {
    navigate('/new-task'); // Redirect to New Task page
  };

  const handleTaskUpdated = async () => {
    const fetchInProgressTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: 'In Progress' },
        });
        setInProgressTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching in-progress tasks:', error);
      }
    };

    await fetchInProgressTasks();
  };

  const handleTaskDeleted = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchInProgressTasks = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5001/api/tasks', {
            headers: { Authorization: `Bearer ${token}` },
            params: { status: 'In Progress' },
          });
          setInProgressTasks(response.data.tasks);
        } catch (error) {
          console.error('Error fetching in-progress tasks:', error);
        }
      };

      await fetchInProgressTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="main-content">
        <div className="top-header">
          <div className="top-header-left">
            <div className="time-info">{timeStr}</div>
            <div className="date-info">{dateStr}</div>
            <AIAgentControls />
          </div>
        </div>

        {/* Row containing main cards */}
        <div className="row">
          {/* Left Column */}
          <div className="col-12 col-md-8">
            <div className="gradient-card mb-4">
              <h2>{greeting}</h2>
              <p>You have {tasksDueToday} tasks due today.</p>
            </div>

            <div className="card-like mb-4">
              <h2>Quick add task</h2>
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Task name" />
                <button className="btn btn-primary" onClick={handleQuickAddTask}><FaPlus /></button>
              </div>
              <div className="d-flex gap-2 flex-wrap">
              </div>
            </div>

            {/* Analytics Box */}
            <div className="card-like mb-4">
              <h2>Analytics</h2>
              <Button variant="primary" onClick={handleViewAnalytics}>
                View Analytics
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-12 col-md-4">
            <div className="card-like mb-3">
              <h2 className="h5 mb-3">{new Date().toLocaleDateString()}</h2>
              {inProgressTasks.length > 0 ? (
                <TaskList tasks={inProgressTasks} onTaskUpdated={handleTaskUpdated} onTaskDeleted={handleTaskDeleted} />
              ) : (
                <p>No items found.</p>
              )}
            </div>

            <div className="upcoming-tasks-section">
              <h2>Upcoming Tasks</h2>
              {upcomingTasks.length > 0 ? (
                <ul className="upcoming-tasks-list">
                  {upcomingTasks.map(task => (
                    <li key={task._id} className="upcoming-task-item">
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <p><strong>Due:</strong> {new Date(task.endDate).toLocaleString()}</p>
                      {/* Add more task details as needed */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You have no upcoming tasks scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;