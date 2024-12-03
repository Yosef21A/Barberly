const express = require("express");
const router = express.Router();
const { register, login, logout, verifyToken, registerAdmin } = require("../controllers/authController");

// User Registration
router.post("/register", register);

// Admin Registration
//router.post("/register-admin", registerAdmin);

// User Login
router.post("/login", login);

// User Logout
router.post("/logout", logout);

// Verify Token
router.get("/verify", verifyToken);

module.exports = router;
