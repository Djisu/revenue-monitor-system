import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
//import bodyParser from 'body-parser'; //, { CorsOptions }
import colors from 'colors';

import { HttpError } from 'http-errors';
import fs from 'fs'; // Import the fs module to check file existence

// Import routes
import businessRoutes from './routes/api/businessRoutes.js';  
import accReceiptRoutes from './routes/api/accReceiptRoutes.js'; 
import authRoutes from './routes/api/authRoutes.js'; 
import balanceRoutes from './routes/api/balanceRoutes.js'; 
import budgetAssessRoutes from './routes/api/budgetAssessRoutes.js'; 
import bussCurrBalanceRoutes from './routes/api/bussCurrBalanceRoutes.js'; 
import electoralAreaRoutes from './routes/api/electoralArea.js'; 
import gradeFeesRoutes from './routes/api/gradeFeesRoutes.js'; 
import gradeRateRoutes from './routes/api/gradeRateRoutes.js'; 
import offBudgetAssessmentRoutes from './routes/api/offBudgetAssessmentRoutes.js'; 
import officerAssessmentRoutes from './routes/api/officerAssessmentRoutes.js'; 
import officerRoutes from './routes/api/officerRoutes.js'; 
import operatorDefinitionRoutes from './routes/api/operatorDefinitionRoutes.js'; 
import operatorPermissionRoutes from './routes/api/operatorPermissionRoutes.js'; 
import paymentReportRoutes from './routes/api/paymentReportRoutes.js'; 
import propertyClassRoutes from './routes/api/propertyClassRoutes.js'; 
import receiptRoutes from './routes/api/receiptRoutes.js'; 
import photosRoute from './routes/api/photosRoutes.js'; 
import businessTypeRoute from './routes/api/businessTypeRoutes.js';
import busPaymentsRoutes from './routes/api/busPaymentsRoutes.js'; 
import officerBudgetRoute from './routes/api/officerBudgetRoute.js';
import CollectorElectoralAreaRoute from './routes/api/collectorElectoralarea.js';
import bustypeDetailedReportRoute from './routes/api/bustypeDetailedReportRoute.js';
import bustypeSummaryReportRoute from './routes/api/busTypeSummaryReportRoute.js';

import pkg from 'pg';
const { Pool } = pkg;

// Initialize the Express application
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// latest solution for loading .env.development
// Determine the environment (development or production)
const env = process.env.NODE_ENV || 'development';  // Defaults to 'development'
console.log('[BACKEND] Initial NODE_ENV:', process.env.NODE_ENV); // Debugging log

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.resolve(__dirname, `../.env.${env}`);

console.log('[BACKEND] envPath:', envPath); // Debugging log

if (env === 'production') {
  console.log('[BACKEND] Running in production mode — skipping dotenv file loading.');
} else {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('[BACKEND] Loaded environment variables from', envPath);
  } else {
    console.warn(`[BACKEND] .env file not found at ${envPath}. Skipping dotenv config.`);
  }
}

console.log('[BACKEND] NODE_ENV after dotenv.config:', process.env.NODE_ENV);

// Example usage of environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('Initial NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', DB_HOST);
console.log('DB_USER:', DB_USER);
console.log('DB_NAME:', DB_NAME);
console.log('DB_PORT:', DB_PORT);
console.log('DB_PASSWORD:', DB_PASSWORD);
console.log('JWT_SECRET:', JWT_SECRET);

// SSL configuration
let sslConfig: false | { rejectUnauthorized: boolean };

if (process.env.NODE_ENV === 'production') { 
  sslConfig = { rejectUnauthorized: true }; // Important for Render.com
} else {
  sslConfig = false;
}

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);  // Trust first proxy (required for HTTPS)
}

// Display environment variables
console.log('[BACKEND] host:', process.env.DB_HOST);
console.log('[BACKEND] user:', process.env.DB_USER);
console.log('[BACKEND] database:', process.env.DB_NAME);
console.log('[BACKEND] port:', process.env.DB_PORT);

// Create a connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: sslConfig,
});

// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: sslConfig,
};

//const port = process.env.PORT || 5000;
const port = process.env.BACKEND_PORT || 4000;

console.log(colors.green('[BACKEND] PostgreSQL configuration:'), dbConfig);

// Define allowed origins array
// const allowedOrigins: string[] = [
//   'https://revenue-monitor-system-v6sq.onrender.com', 
//   'https://revenue-monitor-system.onrender.com',
//   'http://localhost:5173', // Local development
// ];

const allowedOrigins: string[] = [
  'https://revenue-monitor-system-v6sq.onrender.com', 
  'https://revenue-monitor-system.onrender.com',
  'http://localhost:5173', // Local development
];

// Define corsOptions with correct type
// const corsOptions: CorsOptions = {
//   origin: (origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => {
//     console.log('[BACKEND] Checking origin:', origin); // Debugging log
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true); // Allow origin
//     } else {
//       console.warn('[BACKEND] Blocked by CORS:', origin); // Log blocked origin
//       callback(new Error('Not allowed by CORS')); // Reject with error
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
//   credentials: true, // Allow credentials such as cookies
// };

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600,
}));

app.use((req, res, next) => {
  console.log('CORS Request:', req.method, req.url);
  console.log('CORS Headers:', req.headers);
  next();
});

app.use((req, res, next) => {
  console.log('CORS Response:', res.statusCode);
  console.log('CORS Headers:', res.getHeader('Content-Type')); // Get the Content-Type header
  next();
});

// Apply CORS to all routes
//app.use(cors(corsOptions));

// Handle preflight requests for all routes
// app.options('*', cors(corsOptions), (_req: Request, res: Response) => {
//   res.sendStatus(200); // Respond to preflight request with 200 status
// });

// Serve static files from the React app first
const frontendPath = path.resolve(__dirname, '../../frontend/dist');
console.log('[BACKEND] Resolved frontendPath:', frontendPath);

// Serve static files before routes, including correct Content-Type for manifest.json
app.use(express.static(frontendPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('manifest.json')) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  },
}));



// Handle requests for the React app
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/login', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Define your API routes after static files
app.use('/api/business', businessRoutes);
app.use('/api/accReceipts', accReceiptRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/budgetAssess', budgetAssessRoutes);
app.use('/api/bussCurrBalance', bussCurrBalanceRoutes);
app.use('/api/electoralArea', electoralAreaRoutes);
app.use('/api/gradeFees', gradeFeesRoutes);
app.use('/api/gradeRate', gradeRateRoutes);
app.use('/api/offBudgetAssessment', offBudgetAssessmentRoutes);
app.use('/api/officerAssessment', officerAssessmentRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/operatorDefinition', operatorDefinitionRoutes);
app.use('/api/operatorPermissions', operatorPermissionRoutes);
app.use('/api/paymentReport', paymentReportRoutes);
app.use('/api/propertyClass', propertyClassRoutes);
app.use('/api/receipt', receiptRoutes);
app.use('/api/photos', photosRoute);
app.use('/api/businessType', businessTypeRoute);
app.use('/api/busPayments', busPaymentsRoutes);
app.use('/api/OfficerBudget', officerBudgetRoute);
app.use('/api/CollectorElectoralArea', CollectorElectoralAreaRoute);
app.use('/api/bustypeDetailedReport', bustypeDetailedReportRoute);
app.use('/api/bustypeSummaryReport', bustypeSummaryReportRoute);

// Error handling middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof HttpError) {
      res.status(error.status || 500).json({
        message: error.message,
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    } else {
      res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
    next();
});

// Catch-all route for frontend app
app.get(/^(?!\/login).*$/, (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start the server
app.listen(port, async () => {
  console.log(`[BACKEND] Server is running on port ${port}`);
  console.log(colors.green('[BACKEND] PostgreSQL connected'));

  const client = await pool.connect();

  // Test database connection
  try {
      const result = await client.query('SELECT NOW()');
      console.log('[BACKEND] Database connection test successful:', result.rows);
      client.release();
  } catch (err) {
      console.error('[BACKEND] Database connection test failed:', err);
  }
});



console.log('[BACKEND] after app.listen');

// Handle process signals
process.once('SIGUSR2', () => {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', async () => {
    console.log(colors.green('[BACKEND] PostgreSQL connection closed'));
    process.exit(0);
});

export default app;




































