// backend/controllers/aiController.js
const Task = require('../models/Task');
const Timer = require('../models/Timer'); // Assuming a Timer model exists

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, startDate, endDate } = req.body;
    const userId = req.user.id;

    const newTask = new Task({
      user: userId,
      title,
      description,
      priority,
      startDate,
      endDate,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.startTimer = async (req, res) => {
  try {
    const { taskId, duration } = req.body;
    const userId = req.user.id;

    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const newTimer = new Timer({
      user: userId,
      task: taskId,
      duration,
      startTime: new Date(),
    });

    await newTimer.save();
    res.status(201).json({ message: 'Timer started', timer: newTimer });
  } catch (error) {
    console.error('Error starting timer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.stopTimer = async (req, res) => {
  try {
    const { timerId } = req.body;
    const userId = req.user.id;

    const timer = await Timer.findOne({ _id: timerId, user: userId });
    if (!timer) {
      return res.status(404).json({ message: 'Timer not found' });
    }

    timer.endTime = new Date();
    await timer.save();
    res.status(200).json({ message: 'Timer stopped', timer });
  } catch (error) {
    console.error('Error stopping timer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFocusSessionData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Assuming you have a FocusSession model to fetch the data
    const focusSessionData = await FocusSession.find({ user: userId });

    const totalTimeSpent = focusSessionData.reduce((acc, session) => acc + session.duration, 0);
    const totalEstimatedTime = focusSessionData.reduce((acc, session) => acc + session.estimatedTime, 0);
    const totalTimeSpentDaily = focusSessionData.reduce((acc, session) => {
      const date = session.startTime.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + session.duration;
      return acc;
    }, {});
    const totalTasksOfEachStatus = focusSessionData.reduce((acc, session) => {
      acc[session.status] = (acc[session.status] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      totalTimeSpent,
      totalEstimatedTime,
      totalTimeSpentDaily: Object.values(totalTimeSpentDaily),
      totalTasksOfEachStatus,
    });
  } catch (error) {
    console.error('Error fetching focus session data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
