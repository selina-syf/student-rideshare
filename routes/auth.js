const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Student Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, studentId, program, graduationYear, role, carDetails } = req.body;

    // Check required fields
    if (!username || !email || !password || !studentId || !program || !graduationYear || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, email, password, studentId, program, graduationYear, role'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { studentId }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email, student ID, or username'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      studentId,
      program,
      graduationYear,
      role,
      carDetails: role === 'driver' || role === 'both' ? carDetails : undefined
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Student registered successfully!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        studentId: user.studentId,
        program: user.program,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login (for both students and admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      },
      token: 'jwt-token-placeholder' // You'll implement JWT later
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

module.exports = router;