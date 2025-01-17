import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import multer, { diskStorage } from 'multer';
import colors from 'colors';
import morgan from 'morgan';
import mysql from 'mysql2/promise';
import swaggerJSDoc from 'swagger-jsdoc';
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
// Load environment variables from .env file
const environment = process.env.NODE_ENV || 'development';
dotenv.config(); // Load .env file from the default location
console.log(process.env); // Log all environment variables to check loading
// Log environment variables
console.log(colors.green(`Environment: ${environment}`));
console.log(colors.green(`DB_HOST: ${process.env.DB_HOST}`));
console.log(colors.green(`DB_USER: ${process.env.DB_USER}`));
console.log(colors.green(`DB_PASSWORD: ${process.env.DB_PASSWORD}`));
console.log(colors.green(`DB_NAME: ${process.env.DB_NAME}`));
// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000;
// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
console.log(colors.green('MySQL configuration:'), dbConfig);
let connection;
console.log('Email User:', process.env.EMAIL_USER);
console.log('App Password:', process.env.APP_PASSWORD);
console.log('MongoDB URI:', process.env.MONGODB_URI);
// Create MySQL connection
const connectDB = async () => {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log(colors.green('MySQL connected'));
    }
    catch (error) {
        console.error(colors.red('MySQL connection error:'), error);
    }
};
// Middleware setup
const allowedOrigins = [
    'https://typescript-church-new.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
];
// Use CORS middleware
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
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
app.use('/api/accReceipt', accReceiptRoutes);
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
// Set up multer storage
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
// Initialize multer with storage
const upload = multer({ storage });
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
// Start the server and connect to MySQL
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await connectDB(); // Connect to MySQL here
});
// Handle process signals
process.once('SIGUSR2', () => {
    process.kill(process.pid, 'SIGUSR2');
});
process.on('SIGINT', async () => {
    if (connection) {
        await connection.end();
        console.log(colors.green('MySQL connection closed'));
    }
    process.exit(0);
});
export default app;
//# sourceMappingURL=server.js.map