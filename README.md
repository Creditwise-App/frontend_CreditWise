# CreditWise Nigeria - Separated Project Structure

This repository contains the CreditWise Nigeria financial education platform, now organized with a clear separation between frontend and backend components.

## Project Structure

```
creditwise-nigeria/
├── backend/          # Node.js/Express backend API
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── ...
├── frontend/         # React/TypeScript frontend application
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── ...
├── README.md         # This file
└── package.json      # Root package.json with workspace scripts
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Install root dependencies:
   ```bash
   npm run install:all
   ```

   Or install manually:
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

### Environment Setup

1. Create a `.env` file in the `backend/` directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Running the Application

1. Start the backend server:
   ```bash
   npm run dev:backend
   ```
   
   Or from the backend directory:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   npm run dev:frontend
   ```
   
   Or from the frontend directory:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

### Building for Production

1. Build the frontend:
   ```bash
   npm run build:frontend
   ```
   
   Or from the frontend directory:
   ```bash
   cd frontend
   npm run build
   ```

## Deployment

### Frontend Deployment (Netlify)

1. Connect your GitHub repository to Netlify
2. Set the build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
3. Add environment variables in Netlify dashboard:
   - `REACT_APP_API_URL` = `https://your-render-app.onrender.com`

### Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up or log in
3. Click "New+" and select "Web Service"
4. Connect your GitHub repository
5. Fill in the service settings:
   - Name: `creditwise-backend`
   - Region: Choose the closest region to your users
   - Branch: `main` (or your default branch)
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Click "Advanced" and add environment variables:
   - [MONGODB_URI](file://c:\Users\Dell\Downloads\creditwise-nigeria\backend\server.js#L40-L40) = your MongoDB connection string
   - `JWT_SECRET` = your JWT secret key
   - `NODE_ENV` = `production`
7. Click "Create Web Service"

### Manual Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## API Documentation

The backend API is available at `http://localhost:5000/api` in development mode.