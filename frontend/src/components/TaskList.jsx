import PropTypes from 'prop-types';
import { Button, Table, Form } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskDeleted();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task.');
    }
  };

  const handleSort = (field) => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const filteredTasks = tasks
    .filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(task =>
      filterPriority ? task.priority === filterPriority : true
    )
    .filter(task =>
      filterStatus ? task.status === filterStatus : true
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortOrder === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

  return (
    <div>
      <Form className="mb-3 d-flex flex-wrap gap-2">
        <Form.Control
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        <Form.Select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{ maxWidth: '150px' }}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Form.Select>
        <Form.Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ maxWidth: '150px' }}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Form.Select>
      </Form>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
              Title {sortField === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Description</th>
            <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>
              Priority {sortField === 'priority' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Estimated Time (hrs)</th>
            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
              Status {sortField === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.priority}</td>
              <td>{task.status}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => onTaskUpdated(task)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(task._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      priority: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onTaskUpdated: PropTypes.func.isRequired,
  onTaskDeleted: PropTypes.func.isRequired,
};

export default TaskList;