const express = require("express");
const router = express.Router();
const taskController = require("../Controllers/taskController");
const authenticate = require("../Middleware/authenticate");

// Protect all task routes
router.use(authenticate);

router.post("/", taskController.createTask);
router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Add a route to delete all tasks for a specific day
router.delete("/", taskController.deleteTasksByDay);

module.exports = router;
