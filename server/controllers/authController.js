const User = require("../models/User");
const jwt = require("jsonwebtoken");
const secretKey = 'your-hardcoded-secret-key';

exports.register = (req, res) => {
  User.create(req.body)
    .then((user) => {
      // Generate JWT token after successful registration
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token expiration time (e.g., 1 day)
      );
      console.log(token);
      // Send the token in the response body
      res
        .cookie("token", token, {
          httpOnly: true, // Secure cookie
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
        })
        .json({
          msg: "Registration successful!",
          token: token, // Include token in the response body
          user, // Include user data if needed
        });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((error) => error.message);
        return res.status(400).json({ errors });
      }
      console.error("Error during registration:", err);
      res
        .status(500)
        .json({ message: "Error during registration", error: err.message });
    });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ errors: ['Invalid email or password'] });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    console.log('Logged in user:', { id: user._id, email: user.email, role: user.role });
    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.logout = (req, res) => {
  // Logout logic
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(500).json({ message: "Failed to authenticate token" });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({ role: user.role });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};