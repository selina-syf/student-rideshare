const User = require('../models/User');

// In-memory mock database for development
const mockUsers = [
  {
    id: 'user_1',
    username: 'john_doe',
    email: 'john@student.com',
    password: 'password123', // In real system, this would be hashed
    studentId: '301254789',
    phone: '416-123-4567',
    isDriver: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'user_2', 
    username: 'jane_smith',
    email: 'jane@student.com',
    password: 'password123',
    studentId: '301254790',
    phone: '416-987-6543',
    isDriver: false,
    createdAt: new Date('2024-01-16')
  }
];

// Helper function to find user by email
const findUserByEmail = (email) => {
  return mockUsers.find(user => user.email === email);
};

// Helper function to find user by username or studentId
const findExistingUser = (username, email, studentId) => {
  return mockUsers.find(user => 
    user.username === username || 
    user.email === email || 
    user.studentId === studentId
  );
};

// User Registration
exports.register = (req, res) => {
  try {
    const { username, email, password, studentId, phone, isDriver } = req.body;

    console.log('📝 Registration attempt:', { username, email, studentId });

    // Validation
    if (!username || !email || !password || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, email, password, studentId'
      });
    }

    // Check if user already exists
    const existingUser = findExistingUser(username, email, studentId);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email, username, or student ID already exists'
      });
    }

    // Create new mock user
    const newUser = {
      id: `user_${mockUsers.length + 1}`,
      username,
      email,
      password, // In real system, this would be hashed
      studentId,
      phone: phone || '',
      isDriver: isDriver || false,
      createdAt: new Date()
    };

    mockUsers.push(newUser);

    // Return user without password
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      studentId: newUser.studentId,
      phone: newUser.phone,
      isDriver: newUser.isDriver,
      createdAt: newUser.createdAt
    };

    console.log('✅ New user registered:', userResponse.username);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// User Login
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password (in real system, this would compare hashes)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Set user session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.email = user.email;

    console.log('✅ User logged in:', user.username);

    // Return user without password
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      studentId: user.studentId,
      phone: user.phone,
      isDriver: user.isDriver,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// User Logout
exports.logout = (req, res) => {
  console.log('🚪 Logout attempt by:', req.session.username || 'Unknown user');
  
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Logout error:', err);
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    
    res.clearCookie('connect.sid');
    console.log('✅ User logged out successfully');
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
};

// Get Current User Profile
exports.getProfile = (req, res) => {
  try {
    console.log('👤 Profile request from session:', req.session.userId);

    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please login first.'
      });
    }

    // Find user in mock database
    const user = mockUsers.find(u => u.id === req.session.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user without password
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      studentId: user.studentId,
      phone: user.phone,
      isDriver: user.isDriver,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users (for testing - remove in production)
exports.getAllUsers = (_req, res) => {
  try {
    const usersWithoutPasswords = mockUsers.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      studentId: user.studentId,
      isDriver: user.isDriver,
      createdAt: user.createdAt
    }));

    res.json({
      success: true,
      users: usersWithoutPasswords,
      total: mockUsers.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};