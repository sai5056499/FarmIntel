# FarmIntel Deployment Guide for Render

## Overview
This guide will help you deploy your FarmIntel full-stack application on Render.

## Prerequisites
- A Render account (free tier available)
- Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Prepare Your Repository
Make sure your repository contains:
- `app.py` (Flask backend)
- `requirements.txt` (Python dependencies)
- `package.json` (Node.js dependencies)
- `render.yaml` (Render configuration)
- All model files (`.joblib` files)
- All CSV data files

### 2. Deploy Backend First
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `farmintel-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - **Plan**: Free

### 3. Deploy Frontend
1. In Render Dashboard, click "New +" → "Static Site"
2. Connect the same Git repository
3. Configure the service:
   - **Name**: `farmintel-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variable**: 
     - Key: `VITE_API_URL`
     - Value: `https://your-backend-name.onrender.com`

### 4. Alternative: Use render.yaml (Recommended)
1. Push your code with the `render.yaml` file
2. In Render Dashboard, click "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically create both services

## Environment Variables
- `VITE_API_URL`: Your backend URL (set automatically by render.yaml)
- `PORT`: Set automatically by Render
- `FLASK_ENV`: Set to `production` in production

## Testing Your Deployment
1. Backend health check: `https://your-backend-name.onrender.com/health`
2. Frontend: `https://your-frontend-name.onrender.com`

## Troubleshooting
- Check Render logs for build errors
- Ensure all model files are included in your repository
- Verify environment variables are set correctly
- Check CORS settings if frontend can't connect to backend

## Local Development
Create a `.env.local` file in your project root:
```
VITE_API_URL=http://127.0.0.1:5000
```

## File Structure for Deployment
```
your-repo/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── render.yaml           # Render configuration
├── *.joblib             # ML models
├── *.csv                # Data files
├── src/                 # React frontend
└── public/              # Static assets
``` 