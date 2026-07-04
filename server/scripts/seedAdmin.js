import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || 'admin@birbilling.com';
    const name = process.env.ADMIN_NAME || 'Bir Billing Admin';
    const password = process.env.ADMIN_PASSWORD || 'Admin@BirBilling2026';

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin user with email ${email} already exists.`);
      process.exit(0);
    }

    const admin = new Admin({
      name,
      email,
      password, // Password will be hashed automatically by Schema pre-save middleware
      role: 'admin',
    });

    await admin.save();
    console.log('-------------------------------------------');
    console.log(' Admin user seeded successfully! ');
    console.log(` Name:     ${name}`);
    console.log(` Email:    ${email}`);
    console.log(` Password: ${password}`);
    console.log('Please change this password after logging in.');
    console.log('-------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
