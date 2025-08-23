# Dynamic Leaderboard Application

A real-time leaderboard application with MongoDB backend and React frontend.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally on port 27017)

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory with:
   ```
   MONGO_URI=mongodb://localhost:27017/leaderboard
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- Real-time leaderboard updates
- Point claiming system
- User management
- History tracking
- Responsive design

## API Endpoints

- `POST /api/claim` - Claim points for a user
- `GET /api/users` - Get all users
- `GET /api/history` - Get claim history

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).
