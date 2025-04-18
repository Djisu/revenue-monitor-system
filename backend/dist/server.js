import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import multer, { diskStorage } from 'multer';
import colors from 'colors';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
// import * as pg from 'pg'; // Import the entire pg package
// const Client: any = pg.Client; // Assign the Client class to the Client variable
// import pkg from 'pg'; // Import the entire pg package
// const { Client } = pkg; // Destructure Client from the imported package
import pkg from 'pg'; // Import the entire package and rename Client to PgClient
// ...
// const dbClient = new pg.Client({
//  ...
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
import officerBudgetWeeklyRoutes from './routes/api/officerBudgetWeeklyRoutes.js';
import officerRoutes from './routes/api/officerRoutes.js';
import operatorDefinitionRoutes from './routes/api/operatorDefinitionRoutes.js';
import operatorPermissionRoutes from './routes/api/operatorPermissionRoutes.js';
import paymentReportRoutes from './routes/api/paymentReportRoutes.js';
import propertyBalanceRoutes from './routes/api/propertyBalanceRoutes.js';
import propertyClassRoutes from './routes/api/propertyClassRoutes.js';
import propertyCollectorElectoralareaRoutes from './routes/api/propertyCollectorElectoralareaRoutes.js';
import propertyOfficerAssessmentRoutes from './routes/api/propertyOfficerAssessmentRoutes.js';
import propertyOfficerBudgetRoutes from './routes/api/propertyOfficerBudgetRoutes.js';
import propertyOfficerRoutes from './routes/api/propertyOfficerRoutes.js';
import propertyRateRoutes from './routes/api/propertyRateRoutes.js';
import propertyTypeRoutes from './routes/api/propertyTypeRoutes.js';
import propertyUseRoutes from './routes/api/propertyUseRoutes.js';
import receiptRoutes from './routes/api/receiptRoutes.js';
import transSavingsRoutes from './routes/api/transSavingsRoutes.js';
import photosRoute from './routes/api/photosRoutes.js';
import businessTypeRoute from './routes/api/businessTypeRoutes.js';
import busPaymentsRoutes from './routes/api/busPaymentsRoutes.js';
import officerBudgetRoute from './routes/api/officerBudgetRoute.js';
import CollectorElectoralAreaRoute from './routes/api/collectorElectoralarea.js';
import bustypeDetailedReportRoute from './routes/api/bustypeDetailedReportRoute.js';
import bustypeSummaryReportRoute from './routes/api/busTypeSummaryReportRoute.js';
import textMessagingRoute from './routes/api/textmessagingRoute.js';
// Load environment variables from .env file
dotenv.config(); // Load .env file from the default location
// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000;
// Middleware
app.use(bodyParser.json({ limit: '10mb' })); // Parse JSON request bodies with limit
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Parse URL-encoded request bodies with limit
app.use(express.json());
// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'), // Default PostgreSQL port
};
console.log(colors.green('PostgreSQL configuration:'), dbConfig);
// Create PostgreSQL client
// Function to create a new client
export const createClient = () => {
    return new pkg.Client(dbConfig); // Use pkg.Client to create a new client instance
};
// Middleware setup
const allowedOrigins = [
    'https://revenue-monitor-system.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
];
const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // Access-control-allow-credentials:true
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(morgan('dev')); // Logging middleware
// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Revenue Monitor API',
            version: '1.0.0',
            description: 'API documentation for your Node.js backend',
        },
    },
    apis: ['./src/routes/api/*.ts'], // Adjusted path for swagger
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});
// Use the business routes
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
app.use('/api/officerBudgetWeekly', officerBudgetWeeklyRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/operatorDefinition', operatorDefinitionRoutes);
app.use('/api/operatorPermissions', operatorPermissionRoutes);
app.use('/api/paymentReport', paymentReportRoutes);
app.use('/api/propertyBalance', propertyBalanceRoutes);
app.use('/api/propertyClass', propertyClassRoutes);
app.use('/api/propertyCollectorElectoralArea', propertyCollectorElectoralareaRoutes);
app.use('/api/propertyOfficerAssessment', propertyOfficerAssessmentRoutes);
app.use('/api/propertyOfficerBudget', propertyOfficerBudgetRoutes);
app.use('/api/propertyOfficer', propertyOfficerRoutes);
app.use('/api/propertyRate', propertyRateRoutes);
app.use('/api/propertyType', propertyTypeRoutes);
app.use('/api/propertyUse', propertyUseRoutes);
app.use('/api/receipt', receiptRoutes);
app.use('/api/transSavings', transSavingsRoutes);
app.use('/api/photos', photosRoute);
app.use('/api/businessType', businessTypeRoute);
app.use('/api/busPayments', busPaymentsRoutes);
app.use('/api/OfficerBudget', officerBudgetRoute);
app.use('/api/CollectorElectoralArea', CollectorElectoralAreaRoute);
app.use('/api/bustypeDetailedReport', bustypeDetailedReportRoute);
app.use('/api/bustypeSummaryReport', bustypeSummaryReportRoute);
app.use('/api/textMessaging', textMessagingRoute);
// Set up multer storage
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
// Initialize multer with storage and file size limit
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    console.log('Request headers:', req.headers);
    next();
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
// Start the server and connect to PostgreSQL
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    const client = createClient(); // Create a client instance
    await client.connect(); // Connect to PostgreSQL
    console.log(colors.green('PostgreSQL connected'));
});
// Handle process signals
process.once('SIGUSR2', () => {
    process.kill(process.pid, 'SIGUSR2');
});
process.on('SIGINT', async () => {
    const client = createClient();
    await client.end(); // Ensure connection is closed
    console.log(colors.green('PostgreSQL connection closed'));
    process.exit(0);
});
export default app;
//# sourceMappingURL=server.js.map