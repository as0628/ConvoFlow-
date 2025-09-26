const express = require("express");
const router = express.Router();
const Signup = require("../models/signupModel"); // your user model
const authMiddleware = require("../middleware/authMiddleware"); // verify JWT

// Validate if user exists by email
router.get("/validate", authMiddleware, async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ exists: false, message: "Email required" });

  try {
    const user = await Signup.findOne({ where: { email } });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ exists: false, message: "Server error" });
  }
});

module.exports = router;
