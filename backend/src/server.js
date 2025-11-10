import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/config.js';
import authRoutes from './routes/auth.routes.js';  
import expenseRouter from './routes/expense.routes.js';
import incomeRouter from './routes/income.routes.js';
import categoryRoutes from './routes/category.routes.js';
import adminRoutes from './routes/admin.routes.js';
import errorHandler from './middleware/errorHandler.middleware.js';

const app = express();

// Globals Middlewares
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow non-browser requests like Postman
        if (config.frontendUrls.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
    },
    
    credentials: true,  // Allow cookies 
}));
app.use(express.json());          
app.use(express.urlencoded({ extended: true })); 

// logger

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else if(process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
}  

// old logger
/*
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${ip}`);

    // log response status
    res.on('finish', () => {
        console.log(`[${timestamp}] ${req.method} ${req.path} - Status: ${res.statusCode}`);
    });

    next();
});
*/

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRouter);
app.use('/api/incomes', incomeRouter);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes); 


app.get('/api/auth', (req, res) => {
  res.json({
    message: 'Auth API Endpoint',
    endpoints: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      validate: '/api/auth/validate'
    }
  });
});

app.get('/api/auth/login', (req, res) => {
  res.json({
    message: 'Login endpoint'
  });
});

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
  res.status(404).json({
  error: 'Route not found',
  path: req.path
  });
});

app.use(errorHandler);

// Start server
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log('=================================');
  console.log(` Server running on http://localhost:${config.port}`);
  console.log(` Frontend URLs:`);
  config.frontendUrls.forEach(url => console.log(`   - ${url}`));
  console.log(` Environment: ${config.nodeEnv}`);
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