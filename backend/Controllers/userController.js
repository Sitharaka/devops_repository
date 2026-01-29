const User = require("../Model/userModel");
const Task = require("../Model/taskModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function sanitizeUser(user) {
  return { _id: user._id, name: user.name, gmail: user.gmail };
}

// Create new user and return token
exports.createUser = async (req, res) => {
  try {
    console.log('createUser request body:', req.body);
    const { name, gmail, password } = req.body;

    // Basic validation
    if (!name || !gmail || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (!gmail.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = new User({ name, gmail, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });
    res.status(201).json({ message: "User created", user: sanitizeUser(user), token });
  } catch (err) {
    // Handle duplicate email error
    console.error('createUser error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(400).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("task");
    res.json(users.map(sanitizeUser));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single user by ID
exports.getUser = async (req, res) => {
  try {
    // Allow user to get their own profile only
    if (req.user.id !== req.params.id) return res.status(403).json({ message: "Forbidden" });

    const user = await User.findById(req.params.id).populate("task");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // Only allow updating own account
    if (req.user.id !== req.params.id) return res.status(403).json({ message: "Forbidden" });

    // If password is being updated, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user: sanitizeUser(user) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user and their tasks
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Only allow deleting own account
    if (req.user.id !== userId) return res.status(403).json({ message: "Forbidden" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete all tasks belonging to this user
    await Task.deleteMany({ user: userId });

    // Remove user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User and related tasks deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { gmail, password } = req.body;
    const user = await User.findOne({ gmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });
    res.json({ message: "Login successful", token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Log all users to the server console (and return sanitized list)
exports.logUsersToConsole = async (req, res) => {
  try {
    const users = await User.find();
    console.log('--- User list (server console) ---');
    users.forEach(u => {
      console.log(`- id: ${u._id} | name: ${u.name} | gmail: ${u.gmail}`);
    });
    console.log('--- end user list ---');
    res.json({ message: 'Users logged to server console', users: users.map(sanitizeUser) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
