import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import pg from 'pg'
const { Pool } = pg

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

export interface collectorElectoralArea {
    officer_no: string;
    electoralarea: string;
}

const router = express.Router();

// Create a new "collectorElectoralArea"
router.post('/create', async (req: Request<object, object, collectorElectoralArea>, res: Response): Promise<void> => {
    console.log('Creating a new collector electoral area...', req.body);

   const client = await pool.connect();

    try {
        const { officer_no, electoralarea } = req.body;

        console.log('officer_no, electoralarea ', officer_no, electoralarea);

        // Validate input
        if (!officer_no || !electoralarea) {
             res.status(400).json({ message: 'Please provide both officer_no and electoralarea.' });
            return
        }

        // Find the name of the collector based on the officer number
        const result1 = await client.query(
            `SELECT officer_name FROM officer WHERE officer_no = $1`,
            [ officer_no]
        );

        // if no collector is found, return an error
        if (result1.rowCount === 0) {
             res.status(201).json({ message: 'Collector not found in businesses.' });
            return
        }
        
        // Execute the database query
        await client.query(
            `INSERT INTO "collectorelectoralarea" (officer_no, electoralarea) VALUES ($1, $2)`,
            [officer_no, electoralarea]
        );

      

        // Update business collector based on the electoral area
        const result2 = await client.query(
            `UPDATE business SET assessmentby = $1 WHERE electroral_area = $2`,
            [ result1.rows[0].officer_name, electoralarea,]
        );

        console.log('result2: ', result2);

        // Respond with success message
        res.status(201).json({ message: 'Collector electoral area created successfully.' });
        return
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        client.release(); // Ensure the client is end back to the pool
    }
});

// GET endpoint to retrieve all collector electoral areas
router.get('/all', async (req: Request, res: Response): Promise<void> => {
    console.log('Retrieving all collector electoral areas...');

   const client = await pool.connect();

    console.log('I AM HERE, HERE')
    try {
        // Execute the database query
        const result = await client.query(
            `SELECT officer_no, electoralarea FROM "collectorelectoralarea"`
        );

        if (result.rowCount === 0) {
             res.status(200).json([]);
            return
        }
        // Respond with the retrieved data
        res.status(200).json(result.rows);
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    }finally{
        client.release()
    }
});

// Update a "collectorelectoralarea"
router.put('/update/:officer_no', async (req: Request<{ officer_no: string }, unknown, { electoralarea: string }>, res: Response): Promise<void> => {
    console.log('Updating a collector electoral area...')

   const client = await pool.connect();

    try {
        const { officer_no } = req.params;
        const { electoralarea } = req.body;

        // Execute the database query
        const result = await client.query(
            `UPDATE "collectorelectoralarea" SET electoralarea = $1 WHERE officer_no = $2`,
            [electoralarea, officer_no]
        );

        // Check if any rows were updated
        if (result.rowCount === 0) {
             res.status(404).json({ message: 'Collector electoral area not found.' });
            return
        }

        // Respond with success message
        res.status(200).json({ message: 'Collector electoral area updated successfully.' });
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    }finally{
        client.release()
    }
});

// Delete a "collectorElectoralArea"
router.delete('/delete/:officer_no', async (req: Request<{ officer_no: string }>, res: Response): Promise<void> => {
    console.log('Deleting a collector electoral area...')

   const client = await pool.connect();

    try {
        const { officer_no } = req.params;

        // Execute the database query
        const result = await client.query(
            `DELETE FROM "collectorelectoralarea" WHERE officer_no = $1`,
            [officer_no]
        );

        // Check if any rows were deleted
        if (result.rowCount === 0) {
             res.status(404).json({ message: 'Collector electoral area not found.' });
            return
        }

        // Respond with success message
        res.status(200).json({ message: 'Collector electoral area deleted successfully.' });
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    }finally{
        client.release()
    }
});
export default router;