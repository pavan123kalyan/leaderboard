# Deployment Guide for Render

## Prerequisites
- MongoDB Atlas account (for cloud database)
- Render account

## Deployment Steps

### 1. MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Format: `mongodb+srv://username:password@cluster.mongodb.net/leaderboard`

### 2. Render Deployment
1. Connect your GitHub repository to Render
2. Create new Web Service
3. Use these settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV`: `production`
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `PORT`: `10000`

### 3. Environment Variables in Render
- `NODE_ENV`: production
- `MONGO_URI`: mongodb+srv://username:password@cluster.mongodb.net/leaderboard
- `PORT`: 10000

## How It Works
- Frontend builds to `frontend/dist/`
- Backend serves the built frontend files
- Single deployment handles both frontend and backend
- API routes work at `/api/*`
- Frontend routes work at all other paths

## Local Development
```bash
npm run dev          # Run both frontend and backend
npm run build        # Build frontend for production
npm start            # Start production server
```
