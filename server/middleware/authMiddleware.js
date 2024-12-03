const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id); // Fetch the user to get the role
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = {
      id: user._id,
      role: user.role,
    };
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
