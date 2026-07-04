import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import adminGalleryRoutes from './routes/adminGalleryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// CORS middleware configurations
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://bir-billing-gjh4.vercel.app'
];
if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bir Billing API is active' });
});

// Bind routers
app.use('/api/admin', adminAuthRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin/gallery', adminGalleryRoutes);
app.use('/api/contact', contactRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
