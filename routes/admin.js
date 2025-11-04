const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all students (Admin only)
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
});

// Get statistics (Admin only)
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ isAdmin: false });
    const drivers = await User.countDocuments({ role: 'driver' });
    const riders = await User.countDocuments({ role: 'rider' });
    const both = await User.countDocuments({ role: 'both' });

    res.json({
      success: true,
      stats: {
        totalStudents,
        drivers,
        riders,
        both
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;