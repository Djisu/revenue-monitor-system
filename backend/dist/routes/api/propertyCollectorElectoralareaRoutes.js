// backend/src/routes/api/propertyCollectorElectoralareaRoutes.ts
import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
//import type { QueryResult } from 'pg';  // Import QueryResult as a type
//import bcrypt from 'bcrypt';
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
// Connection using database url
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}
import { parse } from 'pg-connection-string';
const parsedConfig = parse(connectionString);
const configDB = {
    ...parsedConfig,
    ssl: {
        rejectUnauthorized: false
    }
};
// Create the pool
const pool = new Pool(configDB);
// Create a new property collector electoral area record
router.post('/', async (req, res) => {
    const propertyCollectorData = req.body;
    try {
        // Check if an operator permission with the same OperatorID already exists
        const existingPermissionQuery = 'SELECT * FROM propertycollectorelectoralarea WHERE officer_no = $1 AND electoralarea = $2';
        const existingPermissionResult = await pool.query(existingPermissionQuery, [propertyCollectorData.officer_no, propertyCollectorData.electoralarea]);
        if (existingPermissionResult.rows.length > 0) {
            res.status(409).json({ message: 'Property collector electoral area record already exists' });
            return;
        }
        // Insert the new property collector electoral area data
        const insertQuery = `INSERT INTO propertycollectorelectoralarea (officer_no, electoralarea) VALUES ($1, $2)`;
        await pool.query(insertQuery, [propertyCollectorData.officer_no, propertyCollectorData.electoralarea]);
        res.status(201).json({ message: 'Property collector electoral area record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property collector electoral area record', error });
    }
});
// Read all property collector electoral area records
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM propertycollectorelectoralarea');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property collector electoral area records', error });
    }
});
// Read a single property collector electoral area record by officer_no
router.get('/:officer_no/:electoralarea', async (req, res) => {
    const { officer_no, electoralarea } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM propertycollectorelectoralarea WHERE officer_no = $1 AND electoralarea = $2', [officer_no, electoralarea]);
        if (rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'Property collector electoral area record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property collector electoral area record', error });
    }
});
// Update a property collector electoral area record
router.put('/:officer_no/:electoralarea', async (req, res) => {
    const { officer_no, electoralarea } = req.params;
    const propertyCollectorData = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM propertycollectorelectoralarea WHERE officer_no = $1 AND electoralarea = $2', [officer_no, electoralarea]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'Property collector electoral area record not found' });
            return;
        }
        // Update the property collector electoral area data
        const updateQuery = `UPDATE propertycollectorelectoralarea SET electoralarea = $1 WHERE officer_no = $2`;
        await pool.query(updateQuery, [propertyCollectorData.electoralarea, officer_no]);
        res.status(200).json({ message: 'Property collector electoral area record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property collector electoral area record', error });
    }
});
// Delete a property collector electoral area record
router.delete('/:officer_no/:electoralarea', async (req, res) => {
    const { officer_no, electoralarea } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM propertycollectorelectoralarea WHERE officer_no = $1 AND electoralarea = $2', [officer_no, electoralarea]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'Property collector electoral area record not found' });
            return;
        }
        // Delete the property collector electoral area record
        await pool.query('DELETE FROM propertycollectorelectoralarea WHERE officer_no = $1 AND electoralarea = $2', [officer_no, electoralarea]);
        res.status(200).json({ message: 'Property collector electoral area record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property collector electoral area record', error });
    }
});
export default router;
//# sourceMappingURL=propertyCollectorElectoralareaRoutes.js.map