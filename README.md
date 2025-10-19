# Proof_Hire
# Decentralized Hiring Platform

A Web3-based hiring and reputation platform built on Moca Network with AIR verify integration.

## Features

- **Moca Network Integration**: Web3 authentication and credential management
- **AIR Verify API**: Automated credential verification for job applicants
- **File Upload**: PDF resume upload with hash generation
- **Role-based Access**: Separate interfaces for job seekers and employers
- **Real-time Verification**: Instant credential verification during application process

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file with:
   ```
   VITE_MOCA_API_BASE=https://api.air.moca.network
   VITE_MOCA_ISSUER_DID=your_issuer_did_here
   VITE_MOCA_PARTNER_ID=your_partner_id_here
   MOCA_PRIVATE_KEY=your_private_key_here
   VITE_AIR_VERIFY_API_URL=your_air_verify_api_url_here
   VITE_AIR_VERIFY_API_KEY=your_air_verify_api_key_here
   ```

3. **Start Development Servers**:
   ```bash
   npm run dev:full
   ```
   This starts both the frontend (port 5173) and backend API server (port 3001).

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js API server
- **Authentication**: Privy + Moca Network
- **File Storage**: Local file system (uploads/)
- **Verification**: AIR Verify API integration

## API Endpoints

- `POST /api/update-role` - Update user role (candidate/company)
- `POST /api/set-user-metadata` - Set user metadata
- `POST /api/upload-resume` - Upload PDF resume
- `POST /generate-moca-jwt` - Generate Moca JWT token

## Usage Flow

1. User logs in with Moca Network
2. Selects role (Job Seeker or Employer)
3. Job Seeker uploads PDF resume
4. System generates file hash and calls AIR Verify API
5. Verification result updates application status
6. Employer can review verified applications

## Troubleshooting

- **Port Conflicts**: Ensure ports 5173 and 3001 are available
- **File Upload Issues**: Check uploads/ directory permissions
- **API Errors**: Verify environment variables are set correctly
- **Verification Failures**: Check AIR Verify API credentials and network connectivity
