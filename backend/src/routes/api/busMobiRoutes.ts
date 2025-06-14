// backend/src/routes/api/busMobiRoutes.ts
import { Router, Request, Response } from 'express';
import * as dotenv from 'dotenv';


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



// BusMobi data interface
interface BusMobiData {
    buss_no: string;
    fiscal_year: string;
    dateofbilling: string;
    buss_type: string;
    balancebf: number;
    currentPayable: number;
    totalAmount: number;
    firstD: string;
    secondE: string;
    outstanding: number;
    firstPaymentDate: string;
    secondPaymentDate: string;
    firstreceiptno: string;
    secondreceiptno: string;
    remarks: string;
    officer_no: string;
}

// Function to sanitize input data
function sanitizeBusMobiData(data: Partial<BusMobiData>): BusMobiData {
    return {
        buss_no: data.buss_no || '',
        fiscal_year: data.fiscal_year || '',
        dateofbilling: data.dateofbilling || '',
        buss_type: data.buss_type || '',
        balancebf: Number(data.balancebf) || 0,
        currentPayable: Number(data.currentPayable) || 0,
        totalAmount: Number(data.totalAmount) || 0,
        firstD: data.firstD || '',
        secondE: data.secondE || '',
        outstanding: Number(data.outstanding) || 0,
        firstPaymentDate: data.firstPaymentDate || '',
        secondPaymentDate: data.secondPaymentDate || '',
        firstreceiptno: data.firstreceiptno || '',
        secondreceiptno: data.secondreceiptno || '',
        remarks: data.remarks || '',
        officer_no: data.officer_no || '',
    };
}

// Ensure the permits directory exists
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
//const permitDir = path.join(__dirname, 'permits');

//const fsPromises = fs.promises;


// Create a new BusMobi record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    console.log('Creating a new BusMobi record');

    const busMobiData = sanitizeBusMobiData(req.body);

    const client = await pool.connect()
    
    try {
       

        // Check if a BusMobi record with the same buss_no and fiscal_year already exists
        const existingResult = await client.query(
            'SELECT * FROM busmobi WHERE buss_no = $1 AND fiscal_year = $2', 
            [busMobiData.buss_no, busMobiData.fiscal_year]
        );

        if (existingResult.rows.length > 0) {          
            res.status(409).json({ message: 'BusMobi record with this business number and fiscal year already exists.' });
            return;
        }

        // Insert the new BusMobi data
        await client.query(
            `INSERT INTO busmobi (buss_no, fiscal_year, dateofbilling, buss_type, balancebf, currentPayable, 
            totalAmount, firstD, secondE, outstanding, firstPaymentDate, secondPaymentDate, 
            firstreceiptno, secondreceiptno, remarks, officer_no) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
            [
                busMobiData.buss_no,
                busMobiData.fiscal_year,
                busMobiData.dateofbilling,
                busMobiData.buss_type,
                busMobiData.balancebf,
                busMobiData.currentPayable,
                busMobiData.totalAmount,
                busMobiData.firstD,
                busMobiData.secondE,
                busMobiData.outstanding,
                busMobiData.firstPaymentDate,
                busMobiData.secondPaymentDate,
                busMobiData.firstreceiptno,
                busMobiData.secondreceiptno,
                busMobiData.remarks,
                busMobiData.officer_no,
            ]
        );

        res.status(201).json({ message: 'BusMobi record created successfully' });
    } catch (err: unknown) {
        console.error('Error:', err);
        if (err instanceof Error) {
           res.status(500).json({ message: 'Error creating BusMobi record', err });
        }
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read all BusMobi records
router.get('/', async (req: Request, res: Response) => {

    const client = await pool.connect()
    try {
        
        const result = await client.query('SELECT * FROM busmobi');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusMobi records', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read a single BusMobi record by buss_no
router.get('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

    const client = await pool.connect()
    try {
       
        const result = await client.query('SELECT * FROM busmobi WHERE buss_no = $1', [buss_no]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'BusMobi record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusMobi record', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Update a BusMobi record
router.put('/:buss_no', async (req: Request, res: Response): Promise<void> => {
    const { buss_no } = req.params;
    const busMobiData = sanitizeBusMobiData(req.body);

    const client = await pool.connect()
    try {
       

        // Check if a BusMobi record with the same buss_no already exists
        const result = await client.query('SELECT * FROM busmobi WHERE buss_no = $1', [buss_no]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'BusMobi record not found' });
            return;
        }

        // Update the BusMobi data
        await client.query(
            `UPDATE busmobi SET fiscal_year = $1, dateofbilling = $2, buss_type = $3, balancebf = $4, 
            currentPayable = $5, totalAmount = $6, firstD = $7, secondE = $8, outstanding = $9, 
            firstPaymentDate = $10, secondPaymentDate = $11, firstreceiptno = $12, 
            secondreceiptno = $13, remarks = $14, officer_no = $15 
            WHERE buss_no = $16`,
            [
                busMobiData.fiscal_year,
                busMobiData.dateofbilling,
                busMobiData.buss_type,
                busMobiData.balancebf,
                busMobiData.currentPayable,
                busMobiData.totalAmount,
                busMobiData.firstD,
                busMobiData.secondE,
                busMobiData.outstanding,
                busMobiData.firstPaymentDate,
                busMobiData.secondPaymentDate,
                busMobiData.firstreceiptno,
                busMobiData.secondreceiptno,
                busMobiData.remarks,
                busMobiData.officer_no,
                buss_no
            ]
        );

        res.status(200).json({ message: 'BusMobi record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BusMobi record', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Delete a BusMobi record
router.delete('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

    const client = await pool.connect()
    try {
        

        // Check if a BusMobi record with the same buss_no already exists
        const result = await client.query('SELECT * FROM busmobi WHERE buss_no = $1', [buss_no]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'BusMobi record not found' });
            return;
        }

        // Delete the BusMobi record
        await client.query('DELETE FROM busmobi WHERE buss_no = $1', [buss_no]);
       
        res.status(200).json({ message: 'BusMobi record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BusMobi record', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

export default router;










