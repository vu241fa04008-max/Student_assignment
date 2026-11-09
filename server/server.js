import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import assignmentRoutes from './routes/assignmentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vite frontend
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers with generous limits for PDF payloads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateCode = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    service: "Vignan's Student Assignment Portal Backend",
    regulation: 'R22 C24',
    studentId: '241FA04008',
    database: {
      user: 'vu241fa04008_db_user',
      cluster: 'cluster0.svhi6nc.mongodb.net',
      connectionState: states[stateCode] || 'unknown',
      connected: stateCode === 1
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

// Database Connection & Server Startup
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<db_password>')) {
  console.log('\n============================================================');
  console.log('⚠️  ACTION REQUIRED: Set your MongoDB Atlas password in .env');
  console.log('File: server/.env');
  console.log('Format: mongodb+srv://vu241fa04008_db_user:YOUR_PASSWORD@cluster0.svhi6nc.mongodb.net/vignan_assignment_portal?retryWrites=true&w=majority');
  console.log('============================================================\n');
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      console.log('✓ Successfully connected to MongoDB Atlas (cluster0.svhi6nc.mongodb.net)');
      console.log('Database User: vu241fa04008_db_user');
      // Run automatic initial seed check
      await seedDatabase();
    })
    .catch((err) => {
      console.error('✗ MongoDB Atlas Connection Error:', err.message);
      if (err.message.includes('bad auth')) {
        console.error('Hint: The password provided for user "vu241fa04008_db_user" was rejected by MongoDB Atlas.');
      }
    });
}

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
