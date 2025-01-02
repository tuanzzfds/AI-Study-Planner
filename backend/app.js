// backend/app.js

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dotenv = require('dotenv');
dotenv.config();
const Task = require('./models/Task'); // Import the Task model
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://ai-study-planner-frontend.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Add Cross-Origin headers
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'credentialless');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api', taskRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Define the /api/task-status endpoint
app.get('/api/task-status', async (req, res) => {
  try {
    const todoCount = await Task.countDocuments({ status: 'Todo' });
    const inProgressCount = await Task.countDocuments({ status: 'In Progress' });
    const completedCount = await Task.countDocuments({ status: 'Completed' });
    const expiredCount = await Task.countDocuments({ status: 'Expired' });
    const notStartedCount = await Task.countDocuments({ status: 'Not Started' });

    const taskStatusData = {
      todo: todoCount,
      inProgress: inProgressCount,
      completed: completedCount,
      expired: expiredCount,
      notStarted: notStartedCount,
    };

    res.json(taskStatusData);
  } catch (error) {
    console.error('Error fetching task status data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define the /api/daily-time endpoint
app.get('/api/daily-time', async (req, res) => {
  const userId = req.query.userId; // Get the user ID from query parameters

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const timers = await Timer.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dayOfWeek: "$endTime" },
          totalDuration: { $sum: "$duration" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const dailyData = {
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      datasets: [
        {
          label: 'Time Spent (minutes)',
          data: Array(7).fill(0), // Initialize with zeros
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };

    timers.forEach(timer => {
      dailyData.datasets[0].data[timer._id - 1] = timer.totalDuration; // Adjust for dayOfWeek starting from 1 (Sunday)
    });

    res.json(dailyData);
  } catch (error) {
    console.error('Error fetching daily time data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = app;