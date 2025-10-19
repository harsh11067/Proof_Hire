// Simple backend startup script
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Mock user database
const users = new Map();

// Update user role endpoint
app.post('/api/update-role', (req, res) => {
  console.log('Received update-role request:', req.body);
  const { address, role } = req.body;
  
  if (!address || !role) {
    console.log('Missing required fields:', { address, role });
    return res.status(400).json({ error: 'Missing address or role' });
  }

  try {
    users.set(address, { role, updatedAt: new Date().toISOString() });
    console.log('Role updated for:', address, 'as:', role);
    res.status(200).json({ success: true, message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Set user metadata endpoint
app.post('/api/set-user-metadata', (req, res) => {
  const { user_id, custom_metadata } = req.body;
  
  if (!user_id || !custom_metadata) {
    return res.status(400).json({ error: 'Missing user_id or custom_metadata' });
  }

  try {
    users.set(user_id, { 
      ...users.get(user_id), 
      custom_metadata,
      updatedAt: new Date().toISOString()
    });
    console.log('Metadata updated for user:', user_id, custom_metadata);
    res.status(200).json({ success: true, message: 'Metadata updated successfully' });
  } catch (error) {
    console.error('Error updating metadata:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload resume endpoint
app.post('/api/upload-resume', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId, fileHash } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const fileInfo = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      fileHash,
      userId,
      uploadedAt: new Date().toISOString()
    };

    console.log('File uploaded:', fileInfo);

    res.json({
      success: true,
      fileInfo,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Submit job application endpoint
app.post('/api/submit-application', (req, res) => {
  try {
    const applicationData = req.body;
    
    if (!applicationData.userId || !applicationData.fullName || !applicationData.email) {
      return res.status(400).json({ error: 'Missing required application data' });
    }

    const applicationId = Date.now().toString();
    const application = {
      id: applicationId,
      ...applicationData,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    console.log('Application submitted:', application);
    
    res.json({
      success: true,
      applicationId,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// AIR Verify API endpoint
app.post('/api/verify-credentials', async (req, res) => {
  try {
    const { applicationId, fileHash, userId } = req.body;
    
    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    // Mock verification for now
    console.log('Verification request for:', { applicationId, fileHash, userId });
    
    res.json({
      success: true,
      verified: true,
      result: {
        applicationId,
        verified: true,
        timestamp: new Date().toISOString(),
        message: 'Mock verification successful'
      }
    });

  } catch (error) {
    console.error('Credential verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Verification failed',
      message: error.message
    });
  }
});

// Generate Moca JWT endpoint
app.post('/generate-moca-jwt', (req, res) => {
  const partnerId = process.env.MOCA_PARTNER_ID || 'mock-partner-id';
  const privateKey = process.env.MOCA_PRIVATE_KEY || 'mock-private-key';
  
  if (!partnerId || !privateKey || privateKey === 'your-private-key') {
    console.warn('MOCA credentials not configured, returning mock token');
    return res.json({ token: 'mock-jwt-token' });
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const payload = { 
      iss: partnerId, 
      iat: now, 
      exp: now + 300 // 5 minutes
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    res.json({ token });
  } catch (err) {
    console.error('JWT signing error:', err);
    res.status(500).json({ error: 'sign_failed' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API server is working!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${path.resolve('uploads')}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

