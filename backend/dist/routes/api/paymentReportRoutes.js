// backend/src/routes/api/paymentReportRoutes.ts
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
// Create a new payment report record
router.post('/', async (req, res) => {
    const paymentReportData = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM paymentreport WHERE buss_no = $1 AND fiscalyear = $2', [paymentReportData.buss_no, paymentReportData.fiscalyear]);
        if (result.rows.length > 0) {
            res.status(409).json({ message: 'Payment report record already exists' });
            return;
        }
        await client.query(`INSERT INTO paymentreport 
            (transdate, buss_name, amount, receiptno, fiscalyear, officer_no, buss_no) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            paymentReportData.transdate,
            paymentReportData.buss_name,
            paymentReportData.amount,
            paymentReportData.receiptno,
            paymentReportData.fiscalyear,
            paymentReportData.officer_no,
            paymentReportData.buss_no,
        ]);
        res.status(201).json({ message: 'Payment report record created successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error creating record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error creating record', error });
        }
    }
    finally {
        client.release();
    }
});
// Read all payment report records
router.get('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM paymentreport');
        res.json(result.rows);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
    }
    finally {
        client.release();
    }
});
// Read a single payment report record by buss_no
router.get('/:buss_no/:fiscalyear', async (req, res) => {
    const { buss_no, fiscalyear } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM paymentreport WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'Payment report record not found' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
    }
    finally {
        client.release();
    }
});
// Update a payment report record
router.put('/:buss_no/:fiscalyear', async (req, res) => {
    const { buss_no, fiscalyear } = req.params;
    const paymentReportData = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM paymentreport WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);
        if (result.rows.length === 0) {
            res.status(409).json({ message: 'Payment report record does not exist' });
            return;
        }
        await client.query(`UPDATE paymentreport 
            SET transdate = $1, buss_name = $2, amount = $3, receiptno = $4, fiscalyear = $5, officer_no = $6 
            WHERE buss_no = $7`, [
            paymentReportData.transdate,
            paymentReportData.buss_name,
            paymentReportData.amount,
            paymentReportData.receiptno,
            paymentReportData.fiscalyear,
            paymentReportData.officer_no,
            buss_no
        ]);
        res.status(200).json({ message: 'Payment report record updated successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error updating record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error updating record', error });
        }
    }
    finally {
        client.release();
    }
});
// Delete a payment report record
router.delete('/:buss_no/:fiscalyear', async (req, res) => {
    const { buss_no, fiscalyear } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM paymentreport WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);
        if (result.rows.length === 0) {
            res.status(409).json({ message: 'Payment report record does not exist' });
            return;
        }
        await client.query('DELETE FROM paymentreport WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);
        res.status(200).json({ message: 'Payment report record deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error deleting record', error });
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
//# sourceMappingURL=paymentReportRoutes.js.map