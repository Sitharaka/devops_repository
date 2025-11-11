const express = require("express");
const mongoose = require("mongoose");
const user_router = require("./Route/userRoute");
const task_router = require("./Route/taskRoute");

// Create app in Express
const app = express();
app.use(express.json()); // Parse incoming JSON

// Routes
app.use("/users", user_router);
app.use("/tasks", task_router);

// MongoDB connection using env var
const mongoURI = process.env.MONGO_URI || "mongodb+srv://Admin:RJPTG25fUYFpyJpA@cluster0.zunewah.mongodb.net/devops";
const port = process.env.PORT || 3000;

mongoose.connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Exit if connection fails
  });