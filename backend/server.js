const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for dev
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api', apiRoutes);

// Root route for Render browser verification
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Ashiana Sweets, Bakery & Restaurant Backend API',
    message: 'Backend is active and serving requests for Shimla branches.',
    endpoints: {
      health: '/health',
      categories: '/api/categories',
      branches: '/api/branches',
      menu: '/api/menu'
    },
    time: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Ashiana Sweets, Bakery & Restaurant Backend API',
    time: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  Ashiana Restaurant & Bakery Backend running on:   `);
  console.log(`  http://localhost:${PORT}`);
  console.log(`====================================================`);
});
