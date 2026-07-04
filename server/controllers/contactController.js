import ContactMessage from '../models/ContactMessage.js';

// @desc    Submit a new contact inquiry
// @route   POST /api/contact
// @access  Public
export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Please fill in all required fields (name, email, message).');
    }

    const newMessage = new ContactMessage({
      name,
      email,
      subject: subject || '',
      message,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/admin/contact
// @access  Private/Admin
export const getAdminContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a contact inquiry
// @route   DELETE /api/admin/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const message = await ContactMessage.findById(messageId);

    if (!message) {
      res.status(404);
      throw new Error('Message not found.');
    }

    await message.deleteOne();
    res.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
