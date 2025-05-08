import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import colors from 'colors';
import morgan from 'morgan';
import path from 'path'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { HttpError } from 'http-errors';

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
dotenv.config(); 

// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());

// Load environment variables
const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${environment}` });
dotenv.config();

console.log('host:', process.env.DB_HOST);
console.log('user:', process.env.DB_USER);
console.log('database:', process.env.DB_NAME);
console.log('port:', process.env.DB_PORT);

// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
    sslmode: 'disable',
};
console.log(colors.green('PostgreSQL configuration:'), dbConfig);

console.log('About to access cors')

// Middleware setup for CORS
const allowedOrigins = [
    'https://revenue-monitor-system.onrender.com', // Production
    'http://localhost:3000',  // Local development
    'http://localhost:5173',  // Local development
    'http://localhost:8080',  // Local development
];

const corsOptions = {
    origin: allowedOrigins, 
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

console.log('After cors')

app.use(morgan('dev')); // Logging middleware


// Serve static files from the React app first
const frontendPath = path.resolve(dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');
console.log("Resolved frontendPath:", frontendPath);

// Serve static files before routes
app.use(express.static(frontendPath));

console.log('before app.get(/')

console.log('Trying to serve:', path.join(frontendPath, 'index.html'));


// Handle requests for the React app
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
console.log('after app.get(/')

console.log('before app.get(/login')
app.get('/login', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

console.log('after app.get(/login')

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
app.use('/api/transSavings', transSavingsRoutes);
app.use('/api/photos', photosRoute);
app.use('/api/businessType', businessTypeRoute);
app.use('/api/busPayments', busPaymentsRoutes);
app.use('/api/OfficerBudget', officerBudgetRoute);
app.use('/api/CollectorElectoralArea', CollectorElectoralAreaRoute);
app.use('/api/bustypeDetailedReport', bustypeDetailedReportRoute);
app.use('/api/bustypeSummaryReport', bustypeSummaryReportRoute);
app.use('/api/textMessaging', textMessagingRoute);

app.options('*', cors());
app.use(express.static(frontendPath));



console.log('before app.use((error: unknown,')
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
console.log('after app.use((error: unknown,')

console.log('before app.get(/*')
// Catch-all route for frontend app
app.get(/^(?!\/login).*$/, (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

console.log('after app.get(*')


// Start the server
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    console.log(colors.green('PostgreSQL connected'));
});

// Handle process signals
process.once('SIGUSR2', () => {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', async () => {
    console.log(colors.green('PostgreSQL connection closed'));
    process.exit(0);
});

export default app;










// import * as dotenv from 'dotenv';
// import express, { Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';

// //import { diskStorage, StorageEngine } from 'multer';
// import colors from 'colors';
// import morgan from 'morgan';
// import path from 'path'; 



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
// //import officerBudgetWeeklyRoutes from './routes/api/officerBudgetWeeklyRoutes.js'; 
// import officerRoutes from './routes/api/officerRoutes.js'; 
// import operatorDefinitionRoutes from './routes/api/operatorDefinitionRoutes.js'; 
// import operatorPermissionRoutes from './routes/api/operatorPermissionRoutes.js'; 
// import paymentReportRoutes from './routes/api/paymentReportRoutes.js'; 
// //import propertyBalanceRoutes from './routes/api/propertyBalanceRoutes.js'; 
// import propertyClassRoutes from './routes/api/propertyClassRoutes.js'; 
// //import propertyCollectorElectoralareaRoutes from './routes/api/propertyCollectorElectoralareaRoutes.js'; 
// //import propertyOfficerAssessmentRoutes from './routes/api/propertyOfficerAssessmentRoutes.js'; 
// //import propertyOfficerBudgetRoutes from './routes/api/propertyOfficerBudgetRoutes.js'; 
// //import propertyOfficerRoutes from './routes/api/propertyOfficerRoutes.js'; 
// import propertyRateRoutes from './routes/api/propertyRateRoutes.js'; 
// //import propertyTypeRoutes from './routes/api/propertyTypeRoutes.js'; 
// //import propertyUseRoutes from './routes/api/propertyUseRoutes.js'; 
// import receiptRoutes from './routes/api/receiptRoutes.js'; 
// import transSavingsRoutes from './routes/api/transSavingsRoutes.js'; 
// import photosRoute from './routes/api/photosRoutes.js'; 
// import businessTypeRoute from './routes/api/businessTypeRoutes.js';
// import busPaymentsRoutes from './routes/api/busPaymentsRoutes.js'; 
// import officerBudgetRoute from './routes/api/officerBudgetRoute.js';
// import CollectorElectoralAreaRoute from './routes/api/collectorElectoralarea.js';
// import bustypeDetailedReportRoute from './routes/api/bustypeDetailedReportRoute.js';
// import bustypeSummaryReportRoute from './routes/api/busTypeSummaryReportRoute.js';
// import textMessagingRoute from './routes/api/textmessagingRoute.js';

// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import { HttpError } from 'http-errors';

// // interface HttpError extends Error {
// //     status: number;
// //     message: string;
// //   }

// // Load environment variables from .env file
// dotenv.config(); // Load .env file from the default location

// // Initialize the Express application
// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.json({ limit: '10mb' })); // Parse JSON request bodies with limit
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Parse URL-encoded request bodies with limit
// app.use(express.json());

// // Load environment variables from .env file
// const environment = process.env.NODE_ENV || 'development';
// dotenv.config({ path: `.env.${environment}` });
// dotenv.config();

// console.log('host:', process.env.DB_HOST);
// console.log('user:', process.env.DB_USER);
// console.log('database:', process.env.DB_NAME);
// console.log('port:', process.env.DB_PORT);

// // PostgreSQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: parseInt(process.env.DB_PORT || '5432'), // Default PostgreSQL port
//     sslmode: 'disable', // Disable SSL for local development
// };
// console.log(colors.green('PostgreSQL configuration:'), dbConfig);



// // Create PostgreSQL client
// // Function to create a new client
// // export const createClient = (): PgClient => {
// //     console.log('in server createClient function')
// //     return new pkg.Client(dbConfig); // Use pkg.Client to create a new client instance
// // };

// console.log('about to access cors')

// // Middleware setup
// const allowedOrigins = [
//     'https://revenue-monitor-system.onrender.com', // Production
//     'http://localhost:3000',  // Local development
//     'http://localhost:5173',  // Local development
//     'http://localhost:8080',  // Local development
// ];

// const corsOptions = {
//     origin: allowedOrigins, 
//     credentials: true,            // Access-control-allow-credentials:true
//     optionSuccessStatus: 200
// }
// app.use(cors(corsOptions));

// app.use(morgan('dev')); // Logging middleware



// ////////////app.use(express.static(path.join(__dirname, '../frontendNew/frontend/build')));

// //app.use(express.static(path.join(__dirname, '../frontendNew/frontend/build')));
// //app.use(express.static(path.join(url.fileURLToPath(import.meta.url), '../frontendNew/frontend/build')));
// // app.use(express.static(path.join(path.dirname(url.fileURLToPath(import.meta.url)), '../frontendNew/frontend/build')));

// // // Handle any requests that don't match the ones above
// // app.get('*', (req: Request, res: Response) => {
// //     res.sendFile(path.join(path.dirname(url.fileURLToPath(import.meta.url)), '../frontendNew/frontend/build', 'index.html'));
// // });

// // Swagger definition
// // const swaggerOptions = {
// //     definition: {
// //         openapi: '3.0.0',
// //         info: {
// //             title: 'Revenue Monitor API',
// //             version: '1.0.0',
// //             description: 'API documentation for your Node.js backend',
// //         },
// //     },
// //     apis: ['./src/routes/api/*.ts'], // Adjusted path for swagger
// // };

// // const swaggerDocs = swaggerJSDoc(swaggerOptions);
// // console.log('swaggerDocs: ', swaggerDocs);

// // // Serve Swagger docs
// // app.use('/api-docs', ...swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  


// // Use the business routes
// app.use('/api/business', businessRoutes);
// app.use('/api/accReceipts', accReceiptRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/balance', balanceRoutes);
// app.use('/api/budgetAssess', budgetAssessRoutes);
// app.use('/api/bussCurrBalance', bussCurrBalanceRoutes);
// app.use('/api/electoralArea', electoralAreaRoutes);
// app.use('/api/gradeFees', gradeFeesRoutes);
// app.use('/api/gradeRate', gradeRateRoutes);
// app.use('/api/offBudgetAssessment', offBudgetAssessmentRoutes);
// app.use('/api/officerAssessment', officerAssessmentRoutes);
// //app.use('/api/officerBudgetWeekly', officerBudgetWeeklyRoutes);
// app.use('/api/officer', officerRoutes);
// app.use('/api/operatorDefinition', operatorDefinitionRoutes);
// app.use('/api/operatorPermissions', operatorPermissionRoutes);
// app.use('/api/paymentReport', paymentReportRoutes);
// //app.use('/api/propertyBalance', propertyBalanceRoutes);
// app.use('/api/propertyClass', propertyClassRoutes);
// //app.use('/api/propertyCollectorElectoralArea', propertyCollectorElectoralareaRoutes);
// //app.use('/api/propertyOfficerAssessment', propertyOfficerAssessmentRoutes);
// //app.use('/api/propertyOfficerBudget', propertyOfficerBudgetRoutes);
// //app.use('/api/propertyOfficer', propertyOfficerRoutes);
// app.use('/api/propertyRate', propertyRateRoutes);
// //app.use('/api/propertyType', propertyTypeRoutes);
// //app.use('/api/propertyUse', propertyUseRoutes);
// app.use('/api/receipt', receiptRoutes);
// app.use('/api/transSavings', transSavingsRoutes);
// app.use('/api/photos', photosRoute);
// app.use('/api/businessType', businessTypeRoute);
// app.use('/api/busPayments', busPaymentsRoutes);
// app.use('/api/OfficerBudget', officerBudgetRoute);
// app.use('/api/CollectorElectoralArea', CollectorElectoralAreaRoute);
// app.use('/api/bustypeDetailedReport', bustypeDetailedReportRoute);
// app.use('/api/bustypeSummaryReport', bustypeSummaryReportRoute);
// app.use('/api/textMessaging', textMessagingRoute);

// console.log('import.meta.url: ', import.meta.url)
// console.log('dirname(import.meta.url): ', dirname(import.meta.url))

// // Serve static files from the React app
// const frontendPath = path.resolve(dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');
// console.log("Resolved frontendPath:", frontendPath);


// // Default route
// app.get('/', (req: Request, res: Response) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });

// // Login route
// app.get('/login', (req: Request, res: Response) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });

// app.use(express.static(frontendPath));

// // Middleware to log incoming requests
// app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
//     console.log('Request headers:', req.headers);
//     next();
// });

// // Error handling middleware
// app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
//     if (error instanceof HttpError) {
//       res.status(error.status || 500).json({
//         message: error.message,
//         error: process.env.NODE_ENV === 'development' ? error : {}
//       });
//     } else {
//       res.status(500).json({
//         message: 'Internal Server Error',
//         error: process.env.NODE_ENV === 'development' ? error : {}
//       });
//     }
//     next()
//   });

// // Catch-all route to serve the frontend application
// app.get('*', (req: Request, res: Response) => {
//     res.sendFile(path.join(frontendPath, 'index.html'));
// });

// // Start the server and connect to PostgreSQL
// app.listen(port, async () => {
//     console.log(`Server is running on port ${port}`);
//     console.log(colors.green('PostgreSQL connected'));
// });

// // Handle process signals
// process.once('SIGUSR2', () => {
//     process.kill(process.pid, 'SIGUSR2');
// });

// process.on('SIGINT', async () => {
//     console.log(colors.green('PostgreSQL connection closed'));
//     process.exit(0);
// });

// export default app;






