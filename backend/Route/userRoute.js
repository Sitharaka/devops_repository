const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const authenticate = require("../Middleware/authenticate");

// Public routes
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);

// Protect routes below
router.use(authenticate);

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/debug/log", userController.logUsersToConsole);

module.exports = router;
