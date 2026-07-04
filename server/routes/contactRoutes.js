import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { 
  createContactMessage, 
  getAdminContactMessages, 
  deleteContactMessage 
} from '../controllers/contactController.js';

const router = express.Router();

// Public submission route
router.post('/', createContactMessage);

// Secure admin inbox routes
router.get('/admin', protect, adminOnly, getAdminContactMessages);
router.delete('/admin/:id', protect, adminOnly, deleteContactMessage);

export default router;
