# Vercel Deployment Guide for CreditWise Nigeria

This guide explains how to deploy the CreditWise Nigeria application to Vercel.

## Prerequisites

1. A Vercel account (free at [vercel.com](https://vercel.com))
2. The project repository connected to Vercel

## Project Structure

The project is organized with:
- Frontend in the `/frontend` directory (React + Vite)
- Backend API in the `/backend/api` directory (Express.js with serverless functions)

## Deployment Configuration

The project uses:
- `vercel.json` for build and routing configuration
- Environment variables for configuration

## Steps to Deploy

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up or log in
2. Click "New Project"
3. Import your Git repository or upload the project folder

### 2. Configure Project Settings

When setting up the project, Vercel should automatically detect the configuration from `vercel.json`.

### 3. Set Environment Variables

In your Vercel project settings, go to the "Environment Variables" section and add:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

These are required for the backend API to function properly.

### 4. Deploy

Click "Deploy" and Vercel will:
1. Build the frontend using Vite
2. Deploy the backend API as serverless functions
3. Set up routing between the frontend and API

## API Routing

The API is available at `/api/*` and is automatically routed to the serverless functions in `/backend/api/`.

## Custom Domain (Optional)

To use a custom domain:
1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

If you encounter issues:
1. Check the deployment logs in Vercel
2. Verify all environment variables are set correctly
3. Ensure your MongoDB connection string is correct and the database is accessible