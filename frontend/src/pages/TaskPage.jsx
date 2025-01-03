import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import './TaskPage.css';
import axios from 'axios';
import EditTaskForm from '../components/EditTaskForm';
import { Modal, Button } from 'react-bootstrap';
import { analyzeSchedule } from '../services/geminiServiceTaskPage';

const TasksPage = () => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  useEffect(() => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    setTimeStr(time);
    setDateStr(date);
  }, []);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const handleTaskEdit = () => {
    setIsEditing(false);
    fetchTasks();
    handleCloseModal();
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filterPriority, filterStatus, sortField, sortOrder]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search,
          priority: filterPriority,
          status: filterStatus,
          sortField,
          sortOrder,
        },
      });
      setTasks(response.data.tasks); // Use response.data.tasks
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterPriority = (e) => {
    setFilterPriority(e.target.value);
  };

  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleSort = (field) => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleMarkCompleted = async () => {
    if (!selectedTask) return;
    try {
      const token = localStorage.getItem('token');
      const updatedTask = { ...selectedTask, status: 'Completed' };
      await axios.put(`http://localhost:5001/api/tasks/${selectedTask._id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleUpdateTask(updatedTask);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleAnalyzeSchedule = async () => {
    try {
      setIsAnalyzing(true);
      const result = await analyzeSchedule(tasks);
      setAnalysisResult(result);
      setShowAnalysisModal(true);
    } catch (error) {
      console.error('Error analyzing schedule:', error);
      // Handle error appropriately
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter(task => (filterPriority ? task.priority === filterPriority : true))
    .filter(task => (filterStatus ? task.status === filterStatus : true))
    .sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  return (
    <>
      <Sidebar activeTab="tasks" />
      <div className="main-content">
        <div className="tasks-page-container">
          <div className="top-bar">
            <span>{dateStr} {timeStr}</span>
          </div>
          <div className="tasks-content">
            <h2>Tasks</h2>
            <div className="task-controls mb-3">
              <input
                type="text"
                placeholder="Search tasks"
                value={search}
                onChange={handleSearch}
                className="form-control mb-2"
              />
              <div className="d-flex gap-2 mb-2">
                <select value={filterPriority} onChange={handleFilterPriority} className="form-select">
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select value={filterStatus} onChange={handleFilterStatus} className="form-select">
                  <option value="">All Statuses</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Expired">Expired</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button onClick={() => handleSort('priority')} className="btn btn-outline-secondary">
                  Sort by Priority {sortField === 'priority' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </button>
                <button onClick={() => handleSort('status')} className="btn btn-outline-secondary">
                  Sort by Status {sortField === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </button>
              </div>
              <Button
                onClick={handleAnalyzeSchedule}
                disabled={isAnalyzing}
                className="btn btn-primary mt-2"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Schedule'}
              </Button>
            </div>
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <div key={task._id} className="task-card" onClick={() => handleSelectTask(task)}>
                  <div className="task-info">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                    <div className="task-details">
                      <span className={`task-priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                      <span className={`task-status status-${task.status.replace(' ', '-').toLowerCase()}`}>{task.status}</span>
                      <span className="task-start-date">Start: {task.startDate ? new Date(task.startDate).toLocaleString() : 'N/A'}</span>
                      <span className="task-end-date">End: {task.endDate ? new Date(task.endDate).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="task-actions">
                    <FaEdit onClick={() => handleUpdateTask(task._id)} className="edit-icon me-2" />
                    <FaTrash onClick={(e) => { e.stopPropagation(); handleDeleteTask(task._id); }} className="delete-icon" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Update Modal */}
      {selectedTask && (
        <Modal show={showModal} onHide={handleCloseModal} className="dark-theme-modal">
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Edit Task' : 'Task Details'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isEditing ? (
              <EditTaskForm task={selectedTask} onTaskEdit={handleTaskEdit} />
            ) : (
              <>
                <p><strong>Title:</strong> {selectedTask.title}</p>
                <p><strong>Description:</strong> {selectedTask.description}</p>
                <p><strong>Priority:</strong> {selectedTask.priority}</p>
                <p><strong>Status:</strong> {selectedTask.status}</p>
                <p><strong>Start Date:</strong> {selectedTask.startDate ? new Date(selectedTask.startDate).toLocaleString() : 'N/A'}</p>
                <p><strong>End Date:</strong> {selectedTask.endDate ? new Date(selectedTask.endDate).toLocaleString() : 'N/A'}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              if (isEditing) {
                setIsEditing(false);
              } else {
                handleCloseModal();
              }
            }}>
              {isEditing ? 'Cancel' : 'Close'}
            </Button>
            {!isEditing && (
              <>
                {selectedTask.status !== 'Completed' && (
                  <Button variant="success" onClick={handleMarkCompleted}>
                    Mark as Completed
                  </Button>
                )}
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      )}

      {/* Analysis Modal */}
      <Modal show={showAnalysisModal} onHide={() => setShowAnalysisModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ whiteSpace: 'pre-line' }}>
            {analysisResult}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnalysisModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default TasksPage;