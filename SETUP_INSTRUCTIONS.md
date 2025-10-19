# ProofHire - Decentralized Hiring Platform Setup Instructions

## Overview
ProofHire is a decentralized hiring and reputation platform built on the Moca network (Web3) that integrates:
- **Moca Login**: Web3 authentication
- **Privy**: Wallet integration
- **AIR Verify API**: Credential verification
- **PDF Resume Upload**: With hash verification
- **Job Application System**: Complete application flow

## Fixed Issues
✅ **API Endpoints**: Fixed role update and user metadata endpoints
✅ **Port Configuration**: Resolved port conflicts (Frontend: 5173, Backend: 3001)
✅ **File Upload**: Created comprehensive resume upload with verification
✅ **Moca Integration**: Integrated Moca login with existing Privy auth
✅ **AIR Verify**: Added credential verification API integration
✅ **Job Application Form**: Complete application submission system

## Quick Start

### 1. Environment Setup
Create a `.env.local` file in the `client` directory with your credentials:

```env
# Moca Network Configuration
VITE_MOCA_API_BASE=https://api.air.moca.network
VITE_MOCA_ISSUER_DID=did:moca:issuer:your-issuer-did
VITE_MOCA_PARTNER_ID=your-partner-id
VITE_MOCA_PRIVATE_KEY=your-private-key

# AIR Verify API Configuration
VITE_AIR_VERIFY_API_URL=https://api.air.moca.network/verify
VITE_AIR_VERIFY_API_KEY=your-air-verify-api-key

# Privy Configuration
VITE_PRIVY_APP_ID=your-privy-app-id
VITE_PRIVY_CLIENT_ID=your-privy-client-id

# Server Configuration
VITE_SERVER_URL=http://localhost:3001
```

### 2. Install Dependencies
```bash
cd client
npm install
```

### 3. Start Development Servers

#### Option A: Use the startup script (Recommended)
```bash
# Windows
./start-dev.bat

# Linux/Mac
./start-dev.sh
```

#### Option B: Manual startup
```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Server  
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Test API**: http://localhost:3001/api/test

## Key Features

### 🔐 Authentication Flow
1. **Login Page**: Choose between Privy or Moca authentication
2. **Role Selection**: Select "Job Seeker" or "Employer" 
3. **Dashboard**: Access role-specific features

### 📄 Resume Upload & Verification
1. **PDF Upload**: Secure file upload with validation
2. **Hash Generation**: SHA-256 file hashing
3. **AIR Verification**: Automatic credential verification
4. **Status Tracking**: Real-time upload and verification status

### 📝 Job Application System
1. **Complete Form**: Personal info, skills, experience, cover letter
2. **File Integration**: Resume upload with verification
3. **Submission**: Secure application submission
4. **Tracking**: Application status monitoring

## API Endpoints

### Backend Server (Port 3001)
- `POST /api/update-role` - Update user role
- `POST /api/set-user-metadata` - Set user metadata
- `POST /api/upload-resume` - Upload PDF resume
- `POST /api/submit-application` - Submit job application
- `POST /api/verify-credentials` - Verify credentials via AIR API
- `POST /generate-moca-jwt` - Generate Moca JWT token
- `GET /api/test` - Test endpoint
- `GET /health` - Health check

### Frontend Routes
- `/` - Login page
- `/option` - Role selection
- `/candidate/*` - Candidate dashboard and features
- `/company/*` - Company dashboard and features
- `/candidate/apply` - Complete application flow (upload + form)
- `/candidate/test` - Test page for all components

## File Structure
```
client/
├── src/
│   ├── components/
│   │   ├── JobApplicationForm.tsx    # Complete application form
│   │   ├── FileUploadWithVerification.tsx  # Resume upload component
│   │   ├── MocaLoginButton.jsx       # Moca authentication
│   │   └── ...
│   ├── moca/
│   │   └── AirProvider.jsx           # Moca service provider
│   ├── scripts/
│   │   └── issuePdfCredential.js     # PDF credential utilities
│   └── ...
├── server.js                         # Backend API server
├── .env.local                        # Environment variables
├── start-dev.bat                     # Windows startup script
└── start-dev.sh                      # Linux/Mac startup script
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Frontend: 5173
   - Backend: 3001
   - Ensure no other services are using these ports

2. **API Errors**
   - Check that backend server is running on port 3001
   - Verify proxy configuration in `vite.config.ts`

3. **Environment Variables**
   - Ensure `.env.local` exists in client directory
   - Add your actual Moca and Privy credentials

4. **File Upload Issues**
   - Only PDF files are accepted
   - Maximum file size: 10MB
   - Check uploads directory permissions

### Development Tips

1. **Backend Logs**: Check terminal running `npm run server` for API logs
2. **Frontend Logs**: Check browser console for client-side errors
3. **Network Tab**: Monitor API calls in browser dev tools
4. **Test Endpoint**: Visit http://localhost:3001/api/test to verify backend

## Next Steps

1. **Configure Credentials**: Add your actual Moca and Privy API keys
2. **Test Authentication**: Try both Privy and Moca login flows
3. **Upload Resume**: Test PDF upload and verification
4. **Submit Application**: Complete the job application process
5. **Test Components**: Visit `/candidate/test` to test individual components
6. **Customize**: Modify job titles, company names, and form fields as needed

## Support

If you encounter issues:
1. Check the console logs (both browser and terminal)
2. Verify all environment variables are set
3. Ensure both servers are running
4. Test individual API endpoints

The platform is now fully functional with all major issues resolved!



