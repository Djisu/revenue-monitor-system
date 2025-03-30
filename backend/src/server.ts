import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import multer, { diskStorage, StorageEngine } from 'multer';
import colors from 'colors';
import morgan from 'morgan';

import pg from 'pg'
const { Pool } = pg
 
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
import photosRoute from './routes/api/photosRoutes.js'; 
import businessTypeRoute from './routes/api/businessTypeRoutes.js';
import busPaymentsRoutes from './routes/api/busPaymentsRoutes.js'; 
import OfficerBudgetRoute  from './routes/api/officerBudgetRoute.js';
import CollectorElectoralAreaRoute  from './routes/api/collectorElectoralarea.js';
import bustypeDetailedReportRoute from './routes/api/bustypeDetailedReportRoute.js'
import bustypeSummaryReportRoute from './routes/api/busTypeSummaryReportRoute.js'

// Load environment variables from .env file
const environment = process.env.NODE_ENV || 'development';
dotenv.config(); // Load .env file from the default location

// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' })); // Parse JSON request bodies with limit
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Parse URL-encoded request bodies with limit

// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'), // Default PostgreSQL port
};
console.log(colors.green('PostgreSQL configuration:'), dbConfig);

//let pool: Pool | undefined;
let pool: InstanceType<typeof Pool> | undefined;
let isPoolEnding = false;

// Create PostgreSQL connection
const connectDB = async () => {
    try {
        pool = new Pool(dbConfig);
        await pool.connect();
        console.log(colors.green('PostgreSQL connected'));
    } catch (error) {
        console.error(colors.red('PostgreSQL connection error:'), error);
    }
};

// Middleware setup
const allowedOrigins = [
    'https://typescript-church-new.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
];

const corsOptions ={
    origin: allowedOrigins, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
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
app.get('/', (req: Request, res: Response) => {
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
app.use('/api/OfficerBudget', OfficerBudgetRoute);
app.use('/api/CollectorElectoralArea', CollectorElectoralAreaRoute);
app.use('/api/bustypeDetailedReport', bustypeDetailedReportRoute);
app.use('/api/bustypeSummaryReport', bustypeSummaryReportRoute);

// Set up multer storage  CollectorElectoralArea bustypeSummaryReportRoute
const storage: StorageEngine = diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
        cb(null, 'uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
        cb(null, file.originalname);
    },
});

// Initialize multer with storage and file size limit
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to log incoming requests
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    console.log('Request headers:', req.headers);
    next();
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start the server and connect to PostgreSQL
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await connectDB(); // Connect to PostgreSQL here
});

// Handle process signals
process.once('SIGUSR2', () => {
    process.kill(process.pid, 'SIGUSR2');
});



// Handle process signals
process.on('SIGINT', async () => {
    if (pool && !isPoolEnding) {
        isPoolEnding = true; // Prevent further calls to end the pool
        await pool.end();
        console.log(colors.green('PostgreSQL connection closed'));
    }
    process.exit(0);
});

export default app;
































// import * as dotenv from 'dotenv';
// import express, { Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import swaggerUi from 'swagger-ui-express';
// import multer, { diskStorage, StorageEngine } from 'multer';
// import colors from 'colors';
// import morgan from 'morgan';
// import mysql from 'mysql2/promise.js'; 
// import swaggerJSDoc from 'swagger-jsdoc';
// import businessRoutes from './routes/api/businessRoutes.js';  
// import accReceiptRoutes from './routes/api/accReceiptRoutes.js'; 
// import authRoutes from './routes/api/authRoutes.js'; 
// import balanceRoutes from './routes/api/balanceRoutes.js'; 
// import budgetAssessRoutes from './routes/api/budgetAssessRoutes.js'; 
// import bussCurrBalanceRoutes from './routes/api/bussCurrBalanceRoutes.js'; 
// import electoralAreaRoutes from './routes/api/electoralArea.js'; 
// import gradeFeesRoutes from './routes/api/gradeFeesRoutes.js'; 
// import gradeRateRoutes from './routes/api/gradeRateRoutes.js'; 
// import offBudgetAssessmentRoutes from './routes/api/offBudgetAssessmentRoutes.js'; 
// import officerAssessmentRoutes from './routes/api/officerAssessmentRoutes.js'; 
// import officerBudgetWeeklyRoutes from './routes/api/officerBudgetWeeklyRoutes.js'; 
// import officerRoutes from './routes/api/officerRoutes.js'; 
// import operatorDefinitionRoutes from './routes/api/operatorDefinitionRoutes.js'; 
// import operatorPermissionRoutes from './routes/api/operatorPermissionRoutes.js'; 
// import paymentReportRoutes from './routes/api/paymentReportRoutes.js'; 
// import propertyBalanceRoutes from './routes/api/propertyBalanceRoutes.js'; 
// import propertyClassRoutes from './routes/api/propertyClassRoutes.js'; 
// import propertyCollectorElectoralareaRoutes from './routes/api/propertyCollectorElectoralareaRoutes.js'; 
// import propertyOfficerAssessmentRoutes from './routes/api/propertyOfficerAssessmentRoutes.js'; 
// import propertyOfficerBudgetRoutes from './routes/api/propertyOfficerBudgetRoutes.js'; 
// import propertyOfficerRoutes from './routes/api/propertyOfficerRoutes.js'; 
// import propertyRateRoutes from './routes/api/propertyRateRoutes.js'; 
// import propertyTypeRoutes from './routes/api/propertyTypeRoutes.js'; 
// import propertyUseRoutes from './routes/api/propertyUseRoutes.js'; 
// import receiptRoutes from './routes/api/receiptRoutes.js'; 
// import transSavingsRoutes from './routes/api/transSavingsRoutes.js'; 
// import photosRoute from './routes/api/photosRoutes.js'; 
// import businessTypeRoute from './routes/api/businessTypeRoutes.js';
// import busPaymentsRoutes from './routes/api/busPaymentsRoutes.js'; 

// // Load environment variables from .env file
// const environment = process.env.NODE_ENV || 'development';
// dotenv.config(); // Load .env file from the default location

// // console.log(colors.green(`Environment: ${environment}`));

// // console.log(colors.green(`DB_HOST: ${process.env.DB_HOST}`));
// // console.log(colors.green(`DB_USER: ${process.env.DB_USER}`));
// // console.log(colors.green(`DB_PASSWORD: ${process.env.DB_PASSWORD}`));
// // console.log(colors.green(`DB_NAME: ${process.env.DB_NAME}`));

// // console.log('Email User:', process.env.EMAIL_USER);
// // console.log('App Password:', process.env.APP_PASSWORD);
// // console.log('MongoDB URI:', process.env.MONGODB_URI);

// // Initialize the Express application
// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.json({ limit: '10mb' })); // Parse JSON request bodies with limit
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Parse URL-encoded request bodies with limit

// // MySQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// };
// console.log(colors.green('MySQL configuration:'), dbConfig);

// let connection: mysql.Connection;

// // Create MySQL connection
// const connectDB = async () => {
//     try {
//         connection = await mysql.createConnection(dbConfig);
//         console.log(colors.green('MySQL connected'));
//     } catch (error) {
//         console.error(colors.red('MySQL connection error:'), error);
//     }
// };

// // // Middleware setup
// const allowedOrigins = [
//     'https://typescript-church-new.onrender.com',
//     'http://localhost:3000',
//     'http://localhost:5173',
// ];

// const corsOptions ={
//     origin: allowedOrigins, 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));

// // // Middleware setup
// // const allowedOrigins = [
// //     'https://typescript-church-new.onrender.com',
// //     'http://localhost:3000',
// //     'http://localhost:5173',
// // ];

// // //Use CORS middleware
// // app.use(cors({
// //     origin: allowedOrigins,
// //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //     allowedHeaders: ['Content-Type', 'Authorization'],
// //     credentials: true,
// // }));

// // app.use(cors({
// //     origin: (origin, callback) => {
// //         if (allowedOrigins.includes(origin) || !origin) { // Allow requests without origin (e.g., curl)
// //             callback(null, true);
// //         } else {
// //             callback(new Error('Not allowed by CORS'));
// //         }
// //     },
// //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //     allowedHeaders: ['Content-Type', 'Authorization'],
// //     credentials: true,
// // }));


// app.use(morgan('dev')); // Logging middleware

// // Swagger definition
// const swaggerOptions = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Revenue Monitor API',
//             version: '1.0.0',
//             description: 'API documentation for your Node.js backend',
//         },
//     },
//     apis: ['./src/routes/api/*.ts'], // Adjusted path for swagger
// };

// const swaggerDocs = swaggerJSDoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// // Default route
// app.get('/', (req: Request, res: Response) => {
//     res.send('Welcome to the API!');
// });

// // Use the business routes
// app.use('/api/business', businessRoutes);
// app.use('/api/accReceipt', accReceiptRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/balance', balanceRoutes);
// app.use('/api/budgetAssess', budgetAssessRoutes);
// app.use('/api/bussCurrBalance', bussCurrBalanceRoutes);
// app.use('/api/electoralArea', electoralAreaRoutes);
// app.use('/api/gradeFees', gradeFeesRoutes);
// app.use('/api/gradeRate', gradeRateRoutes);
// app.use('/api/offBudgetAssessment', offBudgetAssessmentRoutes);
// app.use('/api/officerAssessment', officerAssessmentRoutes);
// app.use('/api/officerBudgetWeekly', officerBudgetWeeklyRoutes);
// app.use('/api/officer', officerRoutes);
// app.use('/api/operatorDefinition', operatorDefinitionRoutes);
// app.use('/api/operatorPermissions', operatorPermissionRoutes);
// app.use('/api/paymentReport', paymentReportRoutes);
// app.use('/api/propertyBalance', propertyBalanceRoutes);
// app.use('/api/propertyClass', propertyClassRoutes);
// app.use('/api/propertyCollectorElectoralArea', propertyCollectorElectoralareaRoutes);
// app.use('/api/propertyOfficerAssessment', propertyOfficerAssessmentRoutes);
// app.use('/api/propertyOfficerBudget', propertyOfficerBudgetRoutes);
// app.use('/api/propertyOfficer', propertyOfficerRoutes);
// app.use('/api/propertyRate', propertyRateRoutes);
// app.use('/api/propertyType', propertyTypeRoutes);
// app.use('/api/propertyUse', propertyUseRoutes);
// app.use('/api/receipt', receiptRoutes);
// app.use('/api/transSavings', transSavingsRoutes);
// app.use('/api/photos', photosRoute);
// app.use('/api/businessType', businessTypeRoute);
// app.use('/api/busPayments', busPaymentsRoutes);

// // Set up multer storage
// const storage: StorageEngine = diskStorage({
//     destination: (req: Request, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req: Request, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
//         cb(null, file.originalname);
//     },
// });

// // Initialize multer with storage and file size limit
// const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
// });

// // Middleware to log incoming requests
// app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
//     console.log('Request headers:', req.headers);
//     next();
// });

// // Error handling middleware
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//     console.error(err.stack);
//     res.status(err.status || 500).json({
//         message: err.message || 'Internal Server Error',
//         error: process.env.NODE_ENV === 'development' ? err : {}
//     });
// });

// // Start the server and connect to MySQL
// app.listen(port, async () => {
//     console.log(`Server is running on port ${port}`);
//     await connectDB(); // Connect to MySQL here
// });

// // Handle process signals
// process.once('SIGUSR2', () => {
//     process.kill(process.pid, 'SIGUSR2');
// });

// process.on('SIGINT', async () => {
//     if (connection) {
//         await connection.end();
//         console.log(colors.green('MySQL connection closed'));
//     }
//     process.exit(0);
// });

// export default app;














