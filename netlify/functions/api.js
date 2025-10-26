const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

// Create a simple proxy that forwards requests to your Render backend
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configure CORS for Netlify Functions
const corsOptions = {
  origin: true, // Allow all origins in production
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Proxy all API requests to your Render backend
app.use('/api', createProxyMiddleware({
  target: 'https://creditwise-backend-p14g.onrender.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // remove /api prefix
  },
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Wrap the Express app with serverless-http
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  return handler(event, context);
};