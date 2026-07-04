import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide an email and password');
    }

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private/Admin
export const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (admin) {
      res.json(admin);
    } else {
      res.status(404);
      throw new Error('Admin not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout admin
// @route   POST /api/admin/logout
// @access  Private/Admin
export const logoutAdmin = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, code } = req.body;

    if (!email || !password || !code) {
      res.status(400);
      throw new Error('Email, password, and registration code are required.');
    }

    if (code !== 'bir.billing') {
      res.status(400);
      throw new Error('Invalid registration security code.');
    }

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      res.status(400);
      throw new Error('Admin with this email already exists.');
    }

    const admin = await Admin.create({
      name: name || 'Administrator',
      email,
      password,
      role: 'admin',
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid admin data.');
    }
  } catch (error) {
    next(error);
  }
};
