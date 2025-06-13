import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
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
const env = process.env.NODE_ENV || 'development'; // Defaults to 'development'
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
let sslConfig;
if (process.env.NODE_ENV === 'production') {
    sslConfig = { rejectUnauthorized: true }; // Important for Render.com
}
else {
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
// Create a new property use record
router.post('/', async (req, res) => {
    const propertyUseData = req.body;
    const client = await pool.connect(); // Get a client from the pool
    //await client.connect();
    try {
        const { rows } = await client.query('SELECT * FROM propertyuse WHERE PropertyUse = $1', [propertyUseData.PropertyUse]);
        if (rows.length > 0) {
            res.status(409).json({ message: 'Property use record already exists' });
            return;
        }
        // Insert the new property use data
        const result = await client.query('INSERT INTO propertyuse (PropertyUse, Propertyrate) VALUES ($1, $2) RETURNING *', [
            propertyUseData.PropertyUse,
            propertyUseData.Propertyrate,
        ]);
        res.status(201).json({ message: 'Property use record created successfully', data: result.rows[0] });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property use record', error: error.message });
    }
    finally {
        client.release();
    }
});
// Read all property use records
router.get('/', async (req, res) => {
    const client = await pool.connect(); // Get a client from the pool
    await client.connect();
    try {
        const { rows } = await client.query('SELECT * FROM propertyuse');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property use records', error });
    }
    finally {
        client.release();
    }
});
// Read a single property use record by PropertyUse
router.get('/:PropertyUse', async (req, res) => {
    const { PropertyUse } = req.params;
    const pool = new Pool(dbConfig);
    const client = await pool.connect(); // Get a client from the pool
    try {
        const { rows } = await client.query('SELECT * FROM propertyuse WHERE PropertyUse = $1', [PropertyUse]);
        if (rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'Property use record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property use record', error });
    }
    finally {
        client.release();
    }
});
// Update a property use record
router.put('/:PropertyUse', async (req, res) => {
    const { PropertyUse } = req.params;
    const propertyUseData = req.body;
    const client = await pool.connect(); // Get a client from the pool
    await client.connect();
    try {
        const { rows } = await client.query('SELECT * FROM propertyuse WHERE PropertyUse = $1', [PropertyUse]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'Property use record not found' });
            return;
        }
        // Update the property use data
        const result = await client.query('UPDATE propertyuse SET Propertyrate = $1 WHERE PropertyUse = $2 RETURNING *', [
            propertyUseData.Propertyrate,
            PropertyUse
        ]);
        res.status(200).json({ message: 'Property use record updated successfully', data: result.rows[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property use record', error });
    }
    finally {
        client.release();
    }
});
// Delete a property use record
router.delete('/:PropertyUse', async (req, res) => {
    const { PropertyUse } = req.params;
    const client = await pool.connect(); // Get a client from the pool
    await client.connect();
    try {
        const { rows } = await client.query('SELECT * FROM propertyuse WHERE PropertyUse = $1', [PropertyUse]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'Property use record not found' });
            return;
        }
        // Delete the property use record
        await client.query('DELETE FROM propertyuse WHERE PropertyUse = $1', [PropertyUse]);
        res.status(200).json({ message: 'Property use record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property use record', error });
    }
    finally {
        client.release();
    }
});
export default router;
//# sourceMappingURL=propertyUseRoutes.js.map