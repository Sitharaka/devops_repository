const Task = require("../Model/taskModel");
const User = require("../Model/userModel");

// Create task - tie to authenticated user
exports.createTask = async (req, res) => {
  try {
    console.log('createTask request body:', req.body);
    const { task_name, description, day } = req.body;
    const userId = req.user.id; // from authenticate middleware
    const task = new Task({ task_name, description, day, user: userId });
    await task.save();
    console.log('Task saved to DB:', task);

    // Push task to user's task array
    await User.findByIdAndUpdate(userId, { $push: { task: task._id } });

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all tasks for authenticated user
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('getTasks for user:', userId);
    const tasks = await Task.find({ user: userId }).populate("user");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single task (must belong to user)
exports.getTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const task = await Task.findById(req.params.id).populate("user");
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (String(task.user._id) !== userId) return res.status(403).json({ message: "Forbidden" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update task (only owner)
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (String(task.user) !== userId) return res.status(403).json({ message: "Forbidden" });

    Object.assign(task, req.body);
    await task.save();
    res.json({ message: "Task updated", task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete task (only owner)
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (String(task.user) !== userId) return res.status(403).json({ message: "Forbidden" });

    await Task.findByIdAndDelete(req.params.id);

    // Remove task from user's array
    await User.findByIdAndUpdate(userId, { $pull: { task: task._id } });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete all tasks for a specific day (only for authenticated user)
exports.deleteTasksByDay = async (req, res) => {
  try {
    const { day } = req.query;
    const userId = req.user.id;
    if (!day) {
      return res.status(400).json({ error: "Day is required" });
    }

    const tasksToDelete = await Task.find({ day, user: userId });
    const taskIds = tasksToDelete.map(task => task._id);

    // Delete tasks
    await Task.deleteMany({ _id: { $in: taskIds } });

    // Remove tasks from user's task array
    await User.findByIdAndUpdate(userId, { $pull: { task: { $in: taskIds } } });

    res.json({ message: `All tasks for ${day} have been deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
