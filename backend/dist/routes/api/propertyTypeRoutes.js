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
let client = null;
// Create a new property type record
router.post('/', async (req, res) => {
    const propertyTypeData = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM propertytype WHERE property_type = $1', [propertyTypeData.property_type]);
        if (rows.length > 0) {
            res.json(rows[0]); // Return the first row
            return;
        }
        // Insert the new property type data
        const result = await pool.query(`INSERT INTO propertytype 
            (property_type, rate) 
            VALUES ($1, $2)`, [
            propertyTypeData.property_type,
            propertyTypeData.rate,
        ]);
        res.status(201).json({ message: 'Property type record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property type record', error });
    }
});
// Read all property type records
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM propertytype');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property type records', error });
    }
});
// Read a single property type record by property_type
router.get('/:property_type', async (req, res) => {
    const { property_type } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM propertytype WHERE property_type = $1', [property_type]);
        if (rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'Property type record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property type record', error });
    }
});
// Update a property type record
router.put('/:property_type', async (req, res) => {
    const { property_type } = req.params;
    const propertyTypeData = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM propertytype WHERE property_type = $1', [property_type]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'Property type record not found' });
            return;
        }
        // Update the property type data
        await pool.query(`UPDATE propertytype 
            SET rate = $1 
            WHERE property_type = $2`, [
            propertyTypeData.rate,
            property_type
        ]);
        res.status(200).json({ message: 'Property type record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property type record', error });
    }
});
// Delete a property type record
router.delete('/:property_type', async (req, res) => {
    const { property_type } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM propertytype WHERE property_type = $1', [property_type]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'Property type record not found' });
            return;
        }
        // Delete the property type record
        await pool.query('DELETE FROM propertytype WHERE property_type = $1', [property_type]);
        res.status(200).json({ message: 'Property type record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property type record', error });
    }
});
export default router;
//# sourceMappingURL=propertyTypeRoutes.js.map