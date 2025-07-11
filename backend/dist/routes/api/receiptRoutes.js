// backend/src/routes/api/receiptRoutes.ts
import * as dotenv from 'dotenv';
import { Router } from 'express';
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
// Create a new receipt record
router.post('/', async (req, res) => {
    const receiptData = req.body;
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM receipt WHERE buss_no = $1 AND receiptno = $2', [receiptData.buss_no, receiptData.receiptno]);
        if (rows.length > 0) {
            res.status(409).json({ message: 'Receipt record already exists' });
            return;
        }
        // Insert the new receipt data
        await client.query(`INSERT INTO receipt 
            (buss_no, receiptno, description, transdate, amount, buss_name) 
            VALUES ($1, $2, $3, $4, $5, $6)`, [
            receiptData.buss_no,
            receiptData.receiptno,
            receiptData.description,
            receiptData.transdate,
            receiptData.amount,
            receiptData.buss_name,
        ]);
        res.status(201).json({ message: 'Receipt record created successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error creating record', error: error.message });
        }
        else {
            res.status(500).json({ success: false, message: 'Error creating record', error });
        }
    }
    finally {
        client.release();
    }
});
// Read all receipt records
router.get('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM receipt');
        res.json(rows);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error getting record', error: error.message });
        }
        else {
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
    }
    finally {
        client.release();
    }
});
// Read a single receipt record by buss_no
router.get('/:buss_no/:receiptno', async (req, res) => {
    const { buss_no, receiptno } = req.params;
    console.log('in router.get(/:buss_no/:receiptno', { buss_no, receiptno });
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM receipt WHERE buss_no = $1 AND receiptno = $2', [buss_no, receiptno]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'Receipt record not found' });
            return;
        }
        res.json(rows[0]); // Return the first row
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error getting record', error: error.message });
        }
        else {
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
    }
    finally {
        client.release();
    }
});
// Update a receipt record
router.put('/:buss_no/:receiptno', async (req, res) => {
    const { receiptno } = req.params;
    const receiptData = req.body;
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM receipt WHERE buss_no = $1 AND receiptno = $2', [receiptData.buss_no, receiptno]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'Receipt record not found' });
            return;
        }
        // Update the receipt data
        await client.query(`UPDATE receipt 
            SET buss_no = $1, description = $2, transdate = $3, amount = $4, buss_name = $5 
            WHERE receiptno = $6`, [
            receiptData.buss_no,
            receiptData.description,
            receiptData.transdate,
            receiptData.amount,
            receiptData.buss_name,
            receiptno
        ]);
        res.status(200).json({ message: 'Receipt record updated successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error updating record', error: error.message });
        }
        else {
            res.status(500).json({ success: false, message: 'Error updating record', error });
        }
    }
    finally {
        client.release();
    }
});
// Delete a receipt record
router.delete('/:buss_no/:receiptno', async (req, res) => {
    const { receiptno, buss_no } = req.params;
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM receipt WHERE buss_no = $1 AND receiptno = $2', [buss_no, receiptno]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'Receipt record not found' });
            return;
        }
        // Delete the receipt record
        await pool.query('DELETE FROM receipt WHERE receiptno = $1', [receiptno]);
        res.status(200).json({ message: 'Receipt record deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error deleting record', error: error.message });
        }
        else {
            res.status(500).json({ success: false, message: 'Error deleting record', error });
        }
    }
    finally {
        client.release();
    }
});
export default router;
//# sourceMappingURL=receiptRoutes.js.map