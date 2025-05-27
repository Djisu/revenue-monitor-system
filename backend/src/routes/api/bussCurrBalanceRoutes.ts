// backend/src/routes/api/bussCurrBalanceRoutes.ts
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pg from 'pg'
const { Pool } = pg

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



// BussCurrBalance data interface
interface BussCurrBalanceData {
    buss_no: string;
    fiscalyear: string;
    balancebf: number;
    current_balance: number;
    totalAmountDue: number;
    transdate: string;
    electoralarea: string;
}

// Create a new BussCurrBalance record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const bussCurrBalanceData: BussCurrBalanceData = req.body;

    const client = await pool.connect()
    
    try {
        const { rows } = await client.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2',
         [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]
        );

        if (rows.length > 0) {
            res.status(404).json({ message: 'BussCurrBalance record exists' });
            return;
        }

        // Insert the new BussCurrBalance data
        await client.query(
            `INSERT INTO busscurrbalance (buss_no, fiscalyear, balancebf, current_balance, totalAmountDue, transdate, electoralarea) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                bussCurrBalanceData.buss_no,
                bussCurrBalanceData.fiscalyear,
                bussCurrBalanceData.balancebf,
                bussCurrBalanceData.current_balance,
                bussCurrBalanceData.totalAmountDue,
                bussCurrBalanceData.transdate,
                bussCurrBalanceData.electoralarea,
            ]
        );

        res.status(201).json({ message: 'BussCurrBalance record created successfully' });
        return
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        client.release();
    }
});

// Read all BussCurrBalance records
router.get('/', async (req: Request, res: Response) => {
    const client = await pool.connect()

    try {
        const { rows } = await client.query('SELECT * FROM busscurrbalance');
        res.json(rows);
        return
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        client.release();
    }
});

// Read a single BussCurrBalance record by buss_no and fiscalyear
router.get('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;

   const client = await pool.connect()

    try {
        const { rows } = await client.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);

        if (rows.length > 0) {
            res.json(rows[0]); // Return the first row
            return
        } else {
            res.status(404).json({ message: 'busscurrbalance record not found' });
            return
        }
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        client.release();
    }
});

// Update a BussCurrBalance record
router.put('/:buss_no/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
    const { buss_no } = req.params;
    const bussCurrBalanceData: BussCurrBalanceData = req.body;

    const client = await pool.connect()

    try {
        const { rows } = await client.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2',
         [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]
        );

        if (rows.length == 0) {
            res.status(404).json({ message: 'BussCurrBalance record not exist' });
            return;
        }

        // Update the BussCurrBalance data
        await client.query(
            `UPDATE busscurrbalance SET fiscalyear = $1, balancebf = $2, current_balance = $3, totalAmountDue = $4, 
            transdate = $5, electoralarea = $6 
            WHERE buss_no = $7 AND fiscalyear = $8`,
            [
                bussCurrBalanceData.fiscalyear,
                bussCurrBalanceData.balancebf,
                bussCurrBalanceData.current_balance,
                bussCurrBalanceData.totalAmountDue,
                bussCurrBalanceData.transdate,
                bussCurrBalanceData.electoralarea,
                buss_no,
                bussCurrBalanceData.fiscalyear
            ]
        );

        res.status(200).json({ message: 'BussCurrBalance record updated successfully' });
        return
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        client.release();
    }
});

// Delete a BussCurrBalance record
router.delete('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;

    const client = await pool.connect()

    try {
        const { rows } = await client.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2',
         [buss_no, fiscalyear]
        );

        if (rows.length == 0) {
            res.status(404).json({ message: 'BussCurrBalance record not exist' });
            return;
        }

        // Delete the BussCurrBalance record
        await client.query('DELETE FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);

        res.status(200).json({ message: 'BussCurrBalance record deleted successfully' });
        return
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        client.release();
    }
});

export default router;












