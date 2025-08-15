import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
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
//import { loadEnv } from './utils/loadEnv.js';
import pkg from 'pg';
const { Pool } = pkg;
//loadEnv();
// Initialize the Express application
const app = express();
// // Define allowed origins array 'http://localhost:3000', // Local development
const allowedOrigins = [
    'https://revenue-monitor-system-v6sq.onrender.com',
    'http://localhost:3000', // Local development
];
// CORS options
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // VERY IMPORTANT
};
app.use(cors(corsOptions));
app.options('*', cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[BACKEND] Response Headers for ${req.method} ${req.originalUrl}:`, res.getHeaders());
    });
    next();
});
// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('in server.ts about to check dirname');
// console.log('[BACKEND] __filename:', __filename);
// console.log('[BACKEND] __dirname:', __dirname);
// console.log('[BACKEND] process.cwd():', process.cwd());
// latest solution for loading .env.development
// Determine the environment (development or production)
dotenv.config();
// console.log('[BACKEND] Initial NODE_ENV:', process.env.NODE_ENV); // Debugging log
const env = process.env.NODE_ENV || 'development';
// console.log('[BACKEND] Looking for env file at:', envPath);
// console.log('[BACKEND] File exists:', fs.existsSync(envPath))
if (env !== 'production') {
    // Try multiple possible locations for the env file
    const possiblePaths = [
        path.resolve(__dirname, `../.env.${env}`),
        path.resolve(__dirname, `../../.env.${env}`),
        path.resolve(process.cwd(), `.env.${env}`)
    ];
    let envLoaded = false;
    for (const envPath of possiblePaths) {
        console.log('[BACKEND] Checking for env file at:', envPath);
        if (fs.existsSync(envPath)) {
            dotenv.config({ path: envPath });
            console.log('[BACKEND] Loaded environment variables from:', envPath);
            envLoaded = true;
            break;
        }
    }
    if (!envLoaded) {
        console.warn('[BACKEND] No environment file found. Using default/system environment variables.');
    }
}
else {
    console.log('[BACKEND] Production mode — using system environment variables.');
}
console.log('[BACKEND] NODE_ENV after dotenv.config:', process.env.NODE_ENV);
const isProd = process.env.NODE_ENV === 'production';
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust first proxy (required for HTTPS)
}
// Create a connection pool
// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: parseInt(process.env.DB_PORT || '5432'),
//   ssl: sslConfig,
//   keepAlive: true, // prevents idle connection drops
// });
//const sslCertPath = path.resolve(__dirname, '../config/ca.pem');
const ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, 'certs/ca.pem')).toString(),
};
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    ssl,
});
// PostgreSQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: parseInt(process.env.DB_PORT || '5432'),
//     ssl,
// };
//const port = process.env.PORT || 3000;
const PORT = process.env.PORT || 3000;
console.log(colors.green('[BACKEND] PostgreSQL configuration:'), pool);
// Serve static files from the React app first
const frontendPath = path.resolve(__dirname, '../../frontend/dist');
console.log('[BACKEND] Resolved frontendPath:', frontendPath);
// Define your API routes after static files
app.use('/api/business', businessRoutes);
app.use('/api/accReceipts', accReceiptRoutes);
app.use('/api/auth', authRoutes);
console.log('✅ Mounted /api/auth routes');
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
app.use((error, req, res, next) => {
    if (error instanceof HttpError) {
        res.status(error.status || 500).json({
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    else {
        res.status(500).json({
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
    next();
});
// For testing only
app.get('/api/test-env', (req, res) => {
    const caEnvExists = !!process.env.CA_CERT_BASE64;
    const sample = process.env.CA_CERT_BASE64?.substring(0, 30); // Show only first 30 chars
    res.json({
        CA_CERT_BASE64_exists: caEnvExists,
        sample_start: sample || 'Not set',
    });
});
console.log('[BACKEND] CA_CERT_BASE64 is set:', !!process.env.CA_CERT_BASE64);
// Catch-all route for frontend app
// app.get(/^(?!\/login).*$/, (req: Request, res: Response) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });
// Start the server
app.listen(PORT, async () => {
    console.log(`[BACKEND] Server is running on port ${PORT}`);
    console.log(colors.green('[BACKEND] PostgreSQL connected'));
    console.log('Connecting to DB...');
    const client = await pool.connect(); // this is likely where it hangs
    console.log('DB connected!');
    // const client = await pool.connect();
    // Test database connection
    try {
        const result = await client.query('SELECT NOW()');
        console.log('[BACKEND] Database connection test successful:', result.rows);
        client.release();
    }
    catch (err) {
        console.error('[BACKEND] Database connection test failed:', err);
    }
});
setTimeout(() => {
    console.warn('⚠️ Request is taking too long!');
}, 5000);
pool.on('error', (err) => {
    console.error('[BACKEND] Unexpected error on idle client', err);
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
//# sourceMappingURL=server.js.map