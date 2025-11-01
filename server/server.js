const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const wasteRoutes = require('./routes/wasteRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/waste', wasteRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart Waste Collection System API is running!',
    endpoints: {
      'GET /api/waste': 'Get all waste collection records',
      'POST /api/waste': 'Create new waste collection record',
      'GET /api/waste/:id': 'Get single record by ID',
      'PUT /api/waste/:id': 'Update record by ID',
      'DELETE /api/waste/:id': 'Delete record by ID'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    status: 'OK', 
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

const uri = "mongodb://127.0.0.1:27017/waste-management"; // Your MongoDB connection string
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/waste`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🏠 Home: http://localhost:${PORT}/`);
});