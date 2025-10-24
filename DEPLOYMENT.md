# Deployment Guide

This guide explains how to deploy the CreditWise Nigeria application with different options for frontend and backend.

## Prerequisites

1. Accounts:
   - GitHub account
   - Render account (for backend deployment)
   - Netlify account (for frontend deployment)
   - MongoDB Atlas account (for database)

2. Tools:
   - Git
   - Node.js (v16 or higher)

## MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Whitelist your IP addresses or use `0.0.0.0/0` for development (not recommended for production)
3. Create a database user
4. Get your MongoDB connection string

## Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### Frontend (.env.production)
Create a `.env.production` file in the `frontend` directory with the following variables:

```env
REACT_APP_API_URL=https://your-render-app.onrender.com/api
```

## Render Deployment (Backend)

1. Push your code to GitHub if not already done
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

## Netlify Deployment (Frontend)

1. Connect your GitHub repository to Netlify
2. Set the build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
3. Add environment variables in Netlify dashboard:
   - `REACT_APP_API_URL` = `https://your-render-app.onrender.com`

## Manual Deployment

### Frontend to Netlify

1. Build the frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Deploy to Netlify using Netlify CLI:
   ```bash
   netlify deploy --prod
   ```

### Backend to Render via CLI

1. Install Render CLI:
   ```bash
   npm install -g render-cli
   ```

2. Deploy:
   ```bash
   cd backend
   render deploy
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from your frontend domain
2. **Environment Variables**: Ensure all required environment variables are set in both platforms
3. **MongoDB Connection**: Verify your MongoDB connection string and IP whitelist
4. **API Routes**: Check that API routes are correctly configured

### Logs and Monitoring

- Check Render service logs for backend API calls
- Check Netlify function logs for frontend API calls
- Monitor MongoDB Atlas for connection issues

## Updating Deployments

To update your deployments:

1. Push changes to your Git repository
2. Render and Netlify will automatically redeploy if continuous deployment is enabled
3. Or manually trigger deployments using the CLI or dashboard

## Security Considerations

1. Never commit sensitive information like API keys or passwords to Git
2. Use environment variables for all sensitive data
3. Regularly rotate your JWT secret and MongoDB credentials
4. Use proper IP whitelisting for MongoDB Atlas
5. Enable HTTPS for all production deployments