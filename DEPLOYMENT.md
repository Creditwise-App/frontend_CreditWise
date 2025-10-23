# Deployment Guide

## Environment Variables

When deploying to Netlify, you must set the following environment variables in the Netlify dashboard:

1. `MONGODB_URI` - Your MongoDB connection string (e.g., MongoDB Atlas connection string)
2. `JWT_SECRET` - A strong secret key for JWT token generation
3. `NODE_ENV` - Set to "production"

## MongoDB Configuration

Make sure your MongoDB database is accessible from the internet if deploying to a cloud platform. If using MongoDB Atlas:

1. Create a cluster
2. Add your IP address to the IP whitelist (or allow access from anywhere for testing)
3. Create a database user
4. Get the connection string and set it as `MONGODB_URI`

## Netlify Deployment Steps

1. Push all code to your GitHub repository
2. Connect Netlify to your repository
3. Set the build command to `npm run build`
4. Set the publish directory to `dist`
5. Add the environment variables mentioned above
6. Deploy the site

## Common Issues and Solutions

### Environment Variables Not Set
If you get authentication or database errors, make sure all required environment variables are set in Netlify.

### CORS Errors
The application is configured to allow all origins in production. If you want to restrict origins, modify the CORS configuration in `netlify/functions/api.js`.

### Database Connection Issues
Ensure your MongoDB URI is correct and the database is accessible from the internet.