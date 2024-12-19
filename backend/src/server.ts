import * as dotenv from 'dotenv';
import express, { Request, Response, Express, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import multer, { diskStorage, StorageEngine } from 'multer';
import colors from 'colors';
import path from 'path';
import morgan from 'morgan';
import mysql from 'mysql2/promise';  // Use promise-based mysql client
import swaggerJSDoc from 'swagger-jsdoc';
import businessRoutes from './routes/api/businessRoutes.js';  // Adjusted path

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
const app: Express = express();
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

let connection: mysql.Connection;

// Create MySQL connection
const connectDB = async () => {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log(colors.green('MySQL connected'));
    } catch (error) {
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
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API!');
});

// Use the business routes
app.use('/api/business', businessRoutes);
//app.use('/api/events', Events);

// Set up multer storage
const storage: StorageEngine = diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
        cb(null, 'uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
        cb(null, file.originalname);
    },
});

// Initialize multer with storage
const upload = multer({ storage });

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