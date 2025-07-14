// backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Signup handler
exports.signup = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: "User already registered" }); // not error
    }

    const existingUsername = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ user: { email: newUser.email, username: newUser.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login handler
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    res.json({ user: { email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset password controller
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ error: "Email and new password are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10); // 👈 Hash the new password
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

exports.checkUsername = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already taken." });
    } else {
      return res.status(200).json({ message: "Username is available." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};

exports.getUsername = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.resetPassword = resetPassword;
