import express from 'express';
import cors from 'cors';
import config from './config/config.js';
// import authRoutes from './routes/auth.routes.js';  // ⚠️ Comentado - crearemos después

const app = express();

// Middleware
 
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,              // Allow cookies 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


// Routes (Endpoints)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    enviroment: config.nodeEnv
    });
});

app.get('/', (req, res) => {
  res.json({
    message: 'SmartExpense API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      docs: '/api/docs'
    }
  });
});

// Route not found (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found',
  path: req.path
  });
});

// General error (500)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});


// Start server
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
  console.log('=================================');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${config.port} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
    throw error;
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n SIGTERM received, closing server...');
  server.close(() => {
    console.log(' Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n SIGINT received (Ctrl+C), closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});