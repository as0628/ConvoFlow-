const bcrypt = require('bcryptjs');          // For hashing passwords
const jwt = require('jsonwebtoken');         // For creating JWT tokens
require("dotenv").config();                  // Load environment variables
const SECRET_KEY = process.env.SECRET_KEY || "defaultsecret";
const Signup = require('../models/signupModel');

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    // Check if user already exists
    const existing = await Signup.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password using bcrypt (10 salt rounds)
    const hashed = await bcrypt.hash(password, 10);

    // Insert user into DB using Sequelize
    const newUser = await Signup.create({
      name,
      email,
      password: hashed,
    });

    res.status(201).json({
      message: "User created successfully",
      userId: newUser.id
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
};

// =====================
//        LOGIN
// =====================
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Find user by email
    const user = await Signup.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare entered password with stored hashed password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email},
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      userId: user.id,
    
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

module.exports = { signup, login };


