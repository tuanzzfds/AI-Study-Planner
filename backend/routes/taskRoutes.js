const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new task
router.post('/tasks', authMiddleware, taskController.createTask);

// Retrieve all tasks for a user with optional filters
router.get('/tasks', authMiddleware, taskController.getAllTasks);

// Search Tasks Endpoint
router.get('/tasks/search', authMiddleware, taskController.searchTasks);

// Filter Tasks Endpoint
router.get('/tasks/filter', authMiddleware, taskController.filterTasks);

// Sort Tasks Endpoint
router.get('/tasks/sort', authMiddleware, taskController.sortTasks);

// Update Task Status Endpoint
router.patch('/tasks/:taskId/status', authMiddleware, taskController.updateTaskStatus);
// Route to get count of tasks due today
router.get('/tasks/due-today', authMiddleware, taskController.getDueTodayTasksCount);
// Route to get upcoming tasks
router.get('/tasks/upcoming', authMiddleware, taskController.getUpcomingTasks);

// Update an existing task
router.put('/tasks/:taskId', authMiddleware, taskController.updateTask);

// Delete a task
router.delete('/tasks/:taskId', authMiddleware, taskController.deleteTask);
// Specific routes first
router.get('/tasks/:taskId', authMiddleware, taskController.getTaskById);
router.get('/tasks/search', authMiddleware, taskController.searchTasks);
router.get('/tasks/filter', authMiddleware, taskController.filterTasks);
router.get('/tasks/sort', authMiddleware, taskController.sortTasks);

// Dynamic routes after
router.get('/tasks/:taskId', authMiddleware, taskController.getTaskById);
router.put('/tasks/:taskId', authMiddleware, taskController.updateTask);
router.delete('/tasks/:taskId', authMiddleware, taskController.deleteTask);
module.exports = router;