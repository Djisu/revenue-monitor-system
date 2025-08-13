// backend/src/routes/api/propertyOfficerRoutes.ts
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import type { QueryResult } from 'pg';  // Import QueryResult as a type

// import bcrypt from 'bcrypt';
//import { createClient } from '../../db.js';


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
// PropertyOfficer data interface
interface PropertyOfficerData {
    officer_no: string;
    officer_name: string;
    photo: string;
}

// Create a new property officer record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    const propertyOfficerData: PropertyOfficerData = req.body;

    let client = null
    try {
        client = await pool.connect();
        const result: QueryResult = await client.query('SELECT * FROM propertyofficer WHERE officer_no = $1', [propertyOfficerData.officer_no]);

        if (result.rows.length > 0) {
            res.status(409).json({ message: 'Property officer record already exists' });
            return;
        }

        // Insert the new property officer data
        const insertResult: QueryResult = await client.query(
            `INSERT INTO propertyofficer 
            (officer_no, officer_name, photo) 
            VALUES ($1, $2, $3)`,
            [
                propertyOfficerData.officer_no,
                propertyOfficerData.officer_name,
                propertyOfficerData.photo,
            ]
        );

        res.status(201).json({ message: 'Property officer record created successfully', data: insertResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property officer record', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read all property officer records
router.get('/', async (req: Request, res: Response) => {
    let client = null
    try {
        client = await pool.connect();
        const result: QueryResult = await client.query('SELECT * FROM propertyofficer');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property officer records', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read a single property officer record by officer_no
router.get('/:officer_no', async (req: Request, res: Response) => {
    const { officer_no } = req.params;

    let client = null
    try {
        client = await pool.connect();
        const result: QueryResult = await client.query('SELECT * FROM propertyofficer WHERE officer_no = $1', [officer_no]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Property officer record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property officer record', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Update a property officer record
router.put('/update/:officer_no', async (req: Request, res: Response): Promise<void> => {
    const { officer_no } = req.params;
    const propertyOfficerData: PropertyOfficerData = req.body;

    let client = null
    try {
        client = await pool.connect();
        const result: QueryResult = await client.query('SELECT * FROM propertyofficer WHERE officer_no = $1', [propertyOfficerData.officer_no]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Property officer record not found' });
            return;
        }

        // Update the property officer data
        await client.query(
            `UPDATE propertyofficer 
            SET officer_name = $2, photo = $3 
            WHERE officer_no = $1`,
            [
                officer_no,
                propertyOfficerData.officer_name,
                propertyOfficerData.photo,
            ]
        );

        res.status(200).json({ message: 'Property officer record updated successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property officer record', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Delete a property officer record
router.delete('/delete/:officer_no', async (req: Request, res: Response) => {
    const { officer_no } = req.params;

    let client = null
    try {
        client = await pool.connect();
        const result: QueryResult = await client.query('SELECT * FROM propertyofficer WHERE officer_no = $1', [officer_no]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Property officer record not found' });
            return;
        }

        // Delete the property officer record
        await client.query('DELETE FROM propertyofficer WHERE officer_no = $1', [officer_no]);

        res.status(200).json({ message: 'Property officer record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property officer record', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

export default router;


