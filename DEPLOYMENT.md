# Deployment Guide

This guide explains how to deploy the CreditWise Nigeria application with the frontend on Netlify and the backend on Vercel.

## Prerequisites

1. Accounts:
   - Netlify account (for frontend deployment)
   - Vercel account (for backend deployment)
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
REACT_APP_API_URL=https://your-vercel-app.vercel.app/api
```

## Netlify Deployment (Frontend)

1. Connect your GitHub repository to Netlify
2. Set the build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
3. Add environment variables in Netlify dashboard:
   - `REACT_APP_API_URL` = `https://your-vercel-app.vercel.app/api`

## Vercel Deployment (Backend)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `/backend`
3. Set the build command to `npm install`
4. Add environment variables in Vercel dashboard:
   - `MONGODB_URI` = `your_mongodb_connection_string`
   - `JWT_SECRET` = `your_jwt_secret_key`
   - `NODE_ENV` = `production`

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

### Backend to Vercel

1. Deploy to Vercel using Vercel CLI:
   ```bash
   cd backend
   vercel --prod
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from your frontend domain
2. **Environment Variables**: Ensure all required environment variables are set in both platforms
3. **MongoDB Connection**: Verify your MongoDB connection string and IP whitelist
4. **API Routes**: Check that API routes are correctly configured in both Netlify and Vercel

### Logs and Monitoring

- Check Netlify function logs for frontend API calls
- Check Vercel function logs for backend API calls
- Monitor MongoDB Atlas for connection issues

## Updating Deployments

To update your deployments:

1. Push changes to your Git repository
2. Netlify and Vercel will automatically redeploy if continuous deployment is enabled
3. Or manually trigger deployments using the CLI or dashboard

## Security Considerations

1. Never commit sensitive information like API keys or passwords to Git
2. Use environment variables for all sensitive data
3. Regularly rotate your JWT secret and MongoDB credentials
4. Use proper IP whitelisting for MongoDB Atlas
5. Enable HTTPS for all production deployments