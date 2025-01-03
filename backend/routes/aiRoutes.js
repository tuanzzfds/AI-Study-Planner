// backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');

// Endpoint for AI to create a task
router.post('/tasks/create', authMiddleware, aiController.createTask);

// Endpoint for AI to update a task
router.put('/tasks/update/:taskId', authMiddleware, aiController.updateTask);

// Endpoint for AI to delete a task
router.delete('/tasks/delete/:taskId', authMiddleware, aiController.deleteTask);

// Endpoint for AI to start a timer
router.post('/timer/start', authMiddleware, aiController.startTimer);

// Endpoint for AI to stop a timer
router.post('/timer/stop', authMiddleware, aiController.stopTimer);

module.exports = router;