const mongoose = require('mongoose');
const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, estimatedTime, status, startDate, endDate } = req.body;
    const userId = req.user.id;

    const newTask = new Task({
      user: userId,
      title,
      description,
      priority,
      estimatedTime,
      status,
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
// Function: getAllTasks
// Description: Retrieves all tasks for a specific user with optional filters
exports.getAllTasks = async (req, res) => {
    try {
      const userId = req.user.id;
      const { status, priority, search } = req.query;
  
      // Build query object
      const query = { user: userId };
      if (status) {
        query.status = status;
      }
      if (priority) {
        query.priority = priority;
      }
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
  
      const tasks = await Task.find(query).sort({ dueDate: 1 });
      res.status(200).json({ tasks });
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  exports.getTaskById = async (req, res) => {
    try {
      const userId = req.user.id;
      const { taskId } = req.params;
  
      const task = await Task.findOne({ _id: taskId, user: userId });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ task });
    } catch (error) {
      console.error('Error retrieving task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  // ...existing code...
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const { title, description, priority, estimatedTime, status, startDate, endDate  } = req.body;

    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
   
    if (status !== undefined) task.status = status;
    if (startDate !== undefined) task.startDate = startDate;
    if (endDate !== undefined) task.endDate = endDate;

    await task.save();

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Function: deleteTask
// Description: Removes a task from the database.
// Parameters: Task ID.
// Endpoint: DELETE /api/tasks/:taskId
exports.deleteTask = async (req, res) => {
    try {
      const userId = req.user.id;
      const { taskId } = req.params;
  
      // Find the task by ID and ensure it belongs to the user
      const task = await Task.findOne({ _id: taskId, user: userId });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Delete the task
      await Task.deleteOne({ _id: taskId });
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  // Search Tasks
exports.searchTasks = async (req, res) => {
    try {
      const userId = req.user.id;
      const { query } = req.query;
  
      if (!query) {
        return res.status(400).json({ message: 'Search query is required.' });
      }
  
      const tasks = await Task.find({
        user: userId,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      });
  
      res.status(200).json({ tasks });
    } catch (error) {
      console.error('Error searching tasks:', error);
       // Handle specific Mongoose errors
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Task ID format.' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  // ...existing code...

// Function: updateTaskStatus
// Description: Automatically updates the status of a task based on calendar scheduling.
// Parameters: Task ID, new status.

exports.updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const { status } = req.body;

    // Validate the new status
    const validStatuses = ['Todo', 'In Progress', 'Completed', 'Expired', 'Not Started'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    // Find and update the task
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json({ message: 'Task status updated successfully.', task });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Filter Tasks
exports.filterTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { priority, status } = req.query;

    // Build the filter query
    const filter = { user: userId };

    if (priority) {
      filter.priority = priority;
    }

    if (status) {
      filter.status = status;
    }

    // Retrieve filtered tasks
    const tasks = await Task.find(filter).sort({ dueDate: 1 });

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error filtering tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Sort Tasks
exports.sortTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { field, order } = req.query;

    // Define allowed fields to sort by
    const allowedFields = ['title', 'priority', 'dueDate', 'status', 'estimatedTime'];
    if (!field || !allowedFields.includes(field)) {
      return res.status(400).json({ message: `Invalid sort field. Allowed fields are: ${allowedFields.join(', ')}` });
    }

    // Define sort order
    const sortOrder = order === 'desc' ? -1 : 1;

    // Build the sort object
    const sortOptions = {};
    sortOptions[field] = sortOrder;

    // Retrieve and sort tasks
    const tasks = await Task.find({ user: userId }).sort(sortOptions);

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error sorting tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message, error: error.message });
  }
};
// Function: getDueTodayTasksCount
// Description: Retrieves the count of tasks with endDate equal to today for the authenticated user.
exports.getDueTodayTasksCount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format.' });
    }

    // Get today's date range
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Count tasks with endDate within today
    const count = await Task.countDocuments({
      user: new mongoose.Types.ObjectId(userId), // Use 'new' keyword here
      endDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching tasks due today count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Function: getUpcomingTasks
// Description: Retrieves all tasks with endDate >= tomorrow for the authenticated user.
exports.getUpcomingTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format.' });
    }

    // Calculate tomorrow's date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Retrieve tasks with endDate >= tomorrow
    const upcomingTasks = await Task.find({
      user: new mongoose.Types.ObjectId(userId),
      endDate: { $gte: tomorrow },
    }).sort({ endDate: 1 }); // Optional: Sort by endDate ascending

    res.status(200).json({ tasks: upcomingTasks });
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};