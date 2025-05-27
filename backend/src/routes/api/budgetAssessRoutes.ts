// backend/src/routes/api/budgetAssessRoutes.ts
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';

import pkg from 'pg';
const { Pool } = pkg;

const router = Router();
// experiment ///
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';


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



// BudgetAssess data interface
interface BudgetAssessData {
    month: string;
    budget: number;
    amount: number;
    variance: number;
    fiscalyear: string;
    assessmentby: string;
}

// Create a new BudgetAssess record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const budgetAssessData: BudgetAssessData = req.body;

    const client = await pool.connect()

    try {
        const { rows } = await client.query(
            'SELECT * FROM budgetassess WHERE month = $1 AND fiscalyear = $2',
            [budgetAssessData.month, budgetAssessData.fiscalyear]
        );

        if (rows.length > 0) {
            res.status(409).json({ message: 'Budget Assess record with this month and fiscal year already exists.' });
            return;
        }

        // Insert the new BudgetAssess data
        await client.query(
            `INSERT INTO budgetassess (month, budget, amount, variance, fiscalyear, assessmentby) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                budgetAssessData.month,
                budgetAssessData.budget,
                budgetAssessData.amount,
                budgetAssessData.variance,
                budgetAssessData.fiscalyear,
                budgetAssessData.assessmentby,
            ]
        );

        res.status(201).json({ message: 'BudgetAssess record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BudgetAssess record', error });
    }
});

// Read all BudgetAssess records
router.get('/', async (req: Request, res: Response) => {
    const client = await pool.connect()
    try {
        const { rows } = await client.query('SELECT * FROM budgetassess');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BudgetAssess records', error });
    }
});

// Read a single BudgetAssess record by month and fiscalyear
router.get('/:month/:fiscalyear', async (req: Request, res: Response) => {
    const { month, fiscalyear } = req.params;
    const client = await pool.connect()

    try {
        const { rows } = await client.query('SELECT * FROM budgetassess WHERE month = $1 AND fiscalyear = $2', [month, fiscalyear]);

        if (rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'BudgetAssess record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BudgetAssess record', error });
    }
});

// Update a BudgetAssess record
router.put('/:month/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
    const { month, fiscalyear } = req.params;
    const budgetAssessData: BudgetAssessData = req.body;

    const client = await pool.connect()
    try {
        const { rows } = await client.query('SELECT * FROM budgetassess WHERE month = $1 AND fiscalyear = $2', [month, fiscalyear]);

        if (rows.length === 0) {
            res.status(404).json({ message: 'BudgetAssess record not found' });
            return;
        }

        await pool.query(
            `UPDATE budgetassess SET budget = $1, amount = $2, variance = $3, assessmentby = $4 
            WHERE month = $5 AND fiscalyear = $6`,
            [
                budgetAssessData.budget,
                budgetAssessData.amount,
                budgetAssessData.variance,
                budgetAssessData.assessmentby,
                month,
                fiscalyear
            ]
        );

        res.status(200).json({ message: 'BudgetAssess record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BudgetAssess record', error });
    }
});

// Delete a BudgetAssess record
router.delete('/:month/:fiscalyear', async (req: Request, res: Response) => {
    const { month, fiscalyear } = req.params;
    const client = await pool.connect()

    try {
        const { rows } = await client.query('SELECT * FROM budgetassess WHERE month = $1 AND fiscalyear = $2', [month, fiscalyear]);

        if (rows.length === 0) {
            res.status(404).json({ message: 'BudgetAssess record not found' });
            return;
        }

        // Delete the BudgetAssess record
        await pool.query('DELETE FROM budgetassess WHERE month = $1 AND fiscalyear = $2', [month, fiscalyear]);

        res.status(200).json({ message: 'BudgetAssess record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BudgetAssess record', error });
    }
});

export default router;









// // backend/src/routes/api/budgetAssessRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader } from 'mysql2/promise';

// const router = Router();

// // Load environment variables from .env file
// dotenv.config();

// // MySQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
// };

// // BudgetAssess data interface
// interface BudgetAssessData {
//     month: string;
//     budget: number;
//     amount: number;
//     variance: number;
//     fiscalyear: string;
//     assessmentby: string;
// }

// // Create a new BudgetAssess record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const budgetAssessData: BudgetAssessData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BudgetAssess WHERE month = ? AND fiscalyear = ?', 
//         [budgetAssessData.month, budgetAssessData.fiscalyear]
//         );
//         if (Array.isArray(rows) && rows.length > 0) {          
//             res.status(409).json({ message: 'Budget Assess record with this month and fiscal year already exists.' });
//             return;
//         }
        
//         // Insert the new BudgetAssess data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_BudgetAssess (month, budget, amount, variance, fiscalyear, assessmentby) 
//             VALUES (?, ?, ?, ?, ?, ?)`,
//             [
//                 budgetAssessData.month,
//                 budgetAssessData.budget,
//                 budgetAssessData.amount,
//                 budgetAssessData.variance,
//                 budgetAssessData.fiscalyear,
//                 budgetAssessData.assessmentby,
//             ]
//         );

//         res.status(201).json({ message: 'BudgetAssess record created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating BudgetAssess record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read all BudgetAssess records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BudgetAssess');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BudgetAssess records', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read a single BudgetAssess record by month and fiscalyear
// router.get('/:month/:fiscalyear', async (req: Request, res: Response) => {
//     const { month, fiscalyear } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BudgetAssess WHERE month = ? AND fiscalyear = ?', [month, fiscalyear]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.json(rows[0]); // Return the first row
//         } else {
//             res.status(404).json({ message: 'BudgetAssess record not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BudgetAssess record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Update a BudgetAssess record
// router.put('/:month/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
//     const { month, fiscalyear } = req.params;
//     const budgetAssessData: BudgetAssessData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Update the BudgetAssess data
//         const [rows] = await connection.execute('SELECT * FROM tb_BudgetAssess WHERE month = ? AND fiscalyear = ?', [month, fiscalyear]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'BudgetAssess record not found' });
//             return
//         } 

//         const [result] = await connection.execute(
//             `UPDATE tb_BudgetAssess SET budget = ?, amount = ?, variance = ?, assessmentby = ? 
//             WHERE month = ? AND fiscalyear = ?`,
//             [
//                 budgetAssessData.budget,
//                 budgetAssessData.amount,
//                 budgetAssessData.variance,
//                 budgetAssessData.assessmentby,
//                 month,
//                 fiscalyear
//             ]
//         );

//         res.status(200).json({ message: 'BudgetAssess record updated successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating BudgetAssess record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Delete a BudgetAssess record
// router.delete('/:month/:fiscalyear', async (req: Request, res: Response) => {
//     const { month, fiscalyear } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BudgetAssess WHERE month = ? AND fiscalyear = ?', [month, fiscalyear]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'BudgetAssess record not found' });
//             return
//         } 

//         // Delete the BudgetAssess record
//         const [result] = await connection.execute('DELETE FROM tb_BudgetAssess WHERE month = ? AND fiscalyear = ?', [month, fiscalyear]);
       
//        res.status(200).json({ message: 'BudgetAssess record deleted successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting BudgetAssess record', error });
//     } finally {
//         connection.end();
//     }
// });

// export default router;