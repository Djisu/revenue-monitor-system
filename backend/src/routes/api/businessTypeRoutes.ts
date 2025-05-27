// backend/src/routes/api/businessTypeRoutes.ts

import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import { QueryResult } from 'pg';

import pkg from 'pg';
const { Pool } = pkg;



const router = Router();

// experiment ///
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Load the environment variables from the .env file
dotenv.config();

// Determine the environment (development or production)
const env = process.env.NODE_ENV || 'development';  // Defaults to 'development'
console.log('[BACKEND] Initial NODE_ENV:', process.env.NODE_ENV); // Debugging log

// Construct the path to the appropriate .env file from the root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const permitDir = path.join(__dirname, 'permits');

//const rootDir = path.resolve(__dirname, '..');
const envPath = path.resolve(__dirname, `../.env.${env}`);

console.log('[BACKEND] envPath:', envPath); // Debugging log

// Check if the .env file exists
if (!fs.existsSync(envPath)) {
  console.error(`[BACKEND] .env file not found at ${envPath}. Please ensure the file exists.`);
  process.exit(1); // Exit the process if the file is not found
}

// Load the environment variables from the .env file
dotenv.config({ path: envPath });

console.log('[BACKEND] environment:', env);
console.log('[BACKEND] NODE_ENV after dotenv.config:', process.env.NODE_ENV); // Debugging log

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

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    ssl: sslConfig,
};

const pool = new Pool(dbConfig);
// end of experiment ///

// BusinessType data interface
interface BusinessTypeData {
    Business_Type: string;
}

// Function to sanitize input data
function sanitizeBusinessTypeData(data: BusinessTypeData): BusinessTypeData {
    return {
        Business_Type: data.Business_Type || ''
    };
}

// Create a new BusinessType record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    console.log('Creating a new businessType record');

    const businessTypeData: BusinessTypeData = sanitizeBusinessTypeData(req.body);
     const client = await pool.connect(); // Create a new client instance

    try {
       // Connect to PostgreSQL
        const result: QueryResult = await client.query('SELECT * FROM businesstype WHERE business_type = $1', [businessTypeData.Business_Type]);

        if (Array.isArray(result.rows) && result.rows.length > 0) {          
            res.status(409).json({ message: 'Business Type record already exists.' });
            return;
        }

        // Insert the new BusinessType data
        await client.query('INSERT INTO businesstype (business_type) VALUES ($1)', [businessTypeData.Business_Type]);

        res.status(201).json({ success: true, message: 'BusinessType record created successfully' });
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        await client.release(); // Ensure the client is closed
    }
});

// Read all BusinessType records
router.get('/all', async (req: Request, res: Response) => {
    console.log('Fetching all businessType records');

     const client = await pool.connect(); // Create a new client instance
    try {
       // Connect to PostgreSQL
        const result: QueryResult = await client.query('SELECT business_type FROM businesstype');
        console.log('result.rows: ', result.rows);
        
        res.status(200).json(result.rows);
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        await client.release(); // Ensure the client is closed
    }
});

// Read a single BusinessType record by Business_Type
router.get('/:Business_Type', async (req: Request, res: Response) => {
    const { Business_Type } = req.params;

     const client = await pool.connect(); // Create a new client instance
    try {
       // Connect to PostgreSQL
        const result: QueryResult = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [Business_Type]);

        if (Array.isArray(result.rows) && result.rows.length > 0) {
            res.status(200).json({ success: true, data: result.rows[0] }); // Return the first row
        } else {
            res.status(404).json({ success: false, message: 'BusinessType record not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        await client.release(); // Ensure the client is closed
    }
});

// Update a BusinessType record
router.put('/:Business_Type', async (req: Request, res: Response): Promise<void> => {
    const { Business_Type } = req.params;
    const businessTypeData: BusinessTypeData = sanitizeBusinessTypeData(req.body);

     const client = await pool.connect(); // Create a new client instance
    try {
       // Connect to PostgreSQL
        const result: QueryResult = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [businessTypeData.Business_Type]);

        if (Array.isArray(result.rows) && result.rows.length > 0) {          
            res.status(409).json({ success: false, message: 'Business Type record already exists.' });
            return;
        }

        // Update the BusinessType data
        await client.query('UPDATE businesstype SET Business_Type = $1 WHERE Business_Type = $2', [businessTypeData.Business_Type, Business_Type]);

        res.status(200).json({ success: true, message: 'BusinessType record updated successfully' });
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        await client.release(); // Ensure the client is closed
    }
});

// Delete a BusinessType record
router.delete('/:Business_Type', async (req: Request, res: Response) => {
    const { Business_Type } = req.params;

    console.log('Deleting BusinessType record:', Business_Type);

     const client = await pool.connect(); // Create a new client instance
    try {
       // Connect to PostgreSQL
        const result: QueryResult = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [Business_Type]);

        if (Array.isArray(result.rows) && result.rows.length === 0) {          
            res.status(409).json({ success: true, message: 'Business Type record does not exist.' });
            return;
        }

        // Delete the BusinessType record
        await client.query('DELETE FROM businesstype WHERE Business_Type = $1', [Business_Type]);
       
        res.status(200).json({ success: true, message: 'BusinessType record deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        await client.release(); // Ensure the client is closed
    }
});

// Other routes remain unchanged...

export default router;

