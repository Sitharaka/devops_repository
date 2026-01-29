//Test.
console.log("hello, world. Test two.");

const express = require("express");
const mongoose = require("mongoose");
const user_router = require("./Route/userRoute");
const task_router = require("./Route/taskRoute");

//Creating app in express.
const app = express();
app.use(express.json()); // Parse incoming JSON

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Simple CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Use routes
app.use("/users", user_router);

// Protect task routes (authentication is applied inside taskRoute)
app.use("/tasks", task_router);

//Adding connection to mongodb. Specify a database name for clarity
const PORT = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI || "mongodb://localhost:27017/devops";
mongoose.connect(mongoUrl)
.then(()=>console.log("Connected to mongoDB"))
.then(()=>{
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });

