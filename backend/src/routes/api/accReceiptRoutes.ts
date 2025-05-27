import { Router, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;

const router = Router();


// experiment ///
// Load the environment variables from the .env file
dotenv.config();
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
// end of experiment ///

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    ssl: sslConfig,
};

// Create a connection pool
const pool = new Pool(dbConfig);

// AccReceipt data interface
interface AccReceiptData {
    fiscalyear: number;
    batchno: string;
    firstno: number;
    lastno: number;
}

// Create a new AccReceipt record
router.post('/create', async (req: Request, res: Response): Promise<void> => {

    console.log('router.post(/create)', req.body)

     const client = await pool.connect()
    
    const accReceiptData: AccReceiptData = req.body;
    console.log("accReceiptData: ", accReceiptData)

    try {
        console.log( 'accReceiptData.batchno: ', accReceiptData.batchno)
        console.log( 'accReceiptData.fiscalyear: ', accReceiptData.fiscalyear)
        console.log( 'accReceiptData.firstno: ', accReceiptData.firstno)
        console.log( 'accReceiptData.lastno: ', accReceiptData.lastno)

        // Verification
        if (accReceiptData.firstno > accReceiptData.lastno) {
            res.status(400).json({ success: false, message: 'First number cannot be greater than last number' });
            return;
        }
        console.log( 'after firstno > lastno')

        if (accReceiptData.firstno < 0 || accReceiptData.lastno < 0) {
            res.status(400).json({ success: false, message: 'First number and last number must be greater than 0' });
            return;
        }
        console.log( 'after firstno < 0 || lastno < 0')

        if (accReceiptData.fiscalyear < 2023) {
            res.status(400).json({ success: false, message: 'Fiscal year must be greater than 2023' });
            return;
        }
        console.log( 'after fiscalyear < 2023')

        if (accReceiptData.batchno.includes(' ')) {
            res.status(400).json({ success: false, message: 'Batch number cannot contain spaces' });
            return;
        }
        console.log( 'after batchno.includes(\' \')')

        console.log( 'about to SELECT * FROM accreceipt WHERE batchno = $1 AND fiscalyear = $2')
        // Check if an operator permission with the same OperatorID already exists
        const accReceipt = await client.query(
            'SELECT * FROM accreceipt WHERE batchno = $1 AND fiscalyear = $2 AND firstno = $3 AND lastno = $4',
            [accReceiptData.batchno, accReceiptData.fiscalyear, accReceiptData.firstno, accReceiptData.lastno]
        );

        if (accReceipt.rows.length > 0) {
            res.status(409).json({ success: false, message: 'Account reception with this batch number and fiscal year already exists.' });
            return;
        }
        console.log( 'after SELECT * FROM accreceipt WHERE batchno = $1 AND fiscalyear = $2')

        // Insert the new AccReceipt data
        console.log( 'about to INSERT INTO accreceipt (fiscalyear, batchno, firstno, lastno) VALUES ($1, $2, $3, $4)')
        await client.query(
            `INSERT INTO accreceipt (fiscalyear, batchno, firstno, lastno) 
             VALUES ($1, $2, $3, $4)`,
            [
              accReceiptData.fiscalyear,
              accReceiptData.batchno,
              accReceiptData.firstno,
              accReceiptData.lastno,
            ]
          );
        console.log( 'after INSERT INTO accreceipt (fiscalyear, batchno, firstno, lastno) VALUES ($1, $2, $3, $4)')
        res.status(201).json({ success: true, message: 'AccReceipt created successfully' });
        console.log('about to return')
        return;
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating AccReceipt', error });
    }
});

// Read all AccReceipt records
router.get('/all', async (req: Request, res: Response) => {
    console.log('in router.get(/all)')
     const client = await pool.connect()
    
    try {
        const rows = await client.query('SELECT * FROM accreceipt');
        console.log(rows.rows)
       
        res.status(200).json({message: 'AccReceipts fetched successfully', data: rows.rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching AccReceipts', error });
    }
});

// Read a single AccReceipt by ID (batchno)
router.get('/:batchno/:fiscalyear', async (req: Request, res: Response) => {
    const { batchno, fiscalyear } = req.params;
     const client = await pool.connect()
    

    try {
        // Check if an operator permission with the same OperatorID already exists
        const accReceipt = await client.query(
            'SELECT * FROM accreceipt WHERE batchno = $1 AND fiscalyear = $2',
            [batchno, fiscalyear]
        );

        if (accReceipt.rows.length == 0) {
            res.status(404).json({ message: 'Account reception with this batch number and fiscal year does not exist.' });
            return;
        }

        res.json(accReceipt.rows[0]); // Return the first row
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching AccReceipt', error });
    }
});

// Update an AccReceipt record
router.put('/:batchno/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
    const { batchno, fiscalyear } = req.params;
    const accReceiptData: AccReceiptData = req.body;
     const client = await pool.connect()
    

    try {
        // Check if an operator permission with the same OperatorID already exists
        const accReceipt = await client.query(
            'SELECT * FROM accreceipt WHERE batchno = $1 AND fiscalyear = $2',
            [accReceiptData.batchno, accReceiptData.fiscalyear]
        );

        if (accReceipt.rows.length > 0 && (accReceipt.rows[0].batchno != batchno || accReceipt.rows[0].fiscalyear != Number(fiscalyear))) {
            res.status(409).json({ message: 'Operator permission with this OperatorID already exists.' });
            return;
        }

        // Update the AccReceipt data
        const result = await client.query(
            `UPDATE accreceipt SET fiscalyear = $1, firstno = $2, lastno = $3 
            WHERE batchno = $4 AND fiscalyear = $5`,
            [
                accReceiptData.fiscalyear,
                accReceiptData.firstno,
                accReceiptData.lastno,
                batchno,
                fiscalyear
            ]
        );

        if (result.rowCount as number > 0) {
            res.status(200).json({ message: 'AccReceipt updated successfully' });
        } else {
            res.status(404).json({ message: 'AccReceipt not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating AccReceipt', error });
    }
});

// Delete an AccReceipt record
router.delete('/:batchno/:fiscalyear', async (req: Request, res: Response) => {
    const { batchno, fiscalyear } = req.params;

    try {
        // Delete the AccReceipt record
         const client = await pool.connect()
    
        const result = await client.query('DELETE FROM accreceipt WHERE batchno = $1 AND fiscalyear = $2', [batchno, fiscalyear]);

        if (result.rowCount as number > 0) {
            res.status(200).json({ message: 'AccReceipt deleted successfully' });
        } else {
            res.status(404).json({ message: 'AccReceipt not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting AccReceipt', error });
    }
});

export default router;









// // backend/src/routes/api/accReceiptRoutes.ts
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

// // AccReceipt data interface
// interface AccReceiptData {
//     fiscalyear: string;
//     batchno: string;
//     firstno: number;
//     lastno: number;
// }

// // Create a new AccReceipt record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const accReceiptData: AccReceiptData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         // Insert the new AccReceipt data
//         // Check if an operator permission with the same OperatorID already exists
//         let [accReceipt] = await connection.execute(
//             'SELECT * FROM accreceipt WHERE batchno = ? AND fiscalyear = ?',
//             [accReceiptData.batchno, accReceiptData.fiscalyear]
//         );

//         if ((accReceipt as any).length > 0) {
//             res.status(409).json({ message: 'Account reception with this batch number and fiscal year already exists.' });
//             return;
//         }

//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO accreceipt (fiscalyear, batchno, firstno, lastno) 
//             VALUES (?, ?, ?, ?)`,
//             [
//                 accReceiptData.fiscalyear,
//                 accReceiptData.batchno,
//                 accReceiptData.firstno,
//                 accReceiptData.lastno,
//             ]
//         );

//         res.status(201).json({ message: 'AccReceipt created successfully'});
//         return
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating AccReceipt', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read all AccReceipt records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM accreceipt');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching AccReceipts', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read a single AccReceipt by ID (batchno)
// router.get('/:batchno/:fiscalyear', async (req: Request, res: Response) => {
//     const { batchno, fiscalyear } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//          // Check if an operator permission with the same OperatorID already exists
//          let [accReceipt] = await connection.execute(
//             'SELECT * FROM accreceipt WHERE batchno = ? AND fiscalyear = ?',
//             [batchno, fiscalyear]
//         );

//         if ((accReceipt as any).length == 0) {
//             res.status(409).json({ message: 'Account reception with this batch number and fiscal year does not exist.' });
//             return;
//         }
//         const [rows] = await connection.execute('SELECT * FROM accreceipt WHERE batchno = ? AND fiscalyear = ?', [batchno, fiscalyear]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.json(rows[0]); // Return the first row
//         } else {
//             res.status(404).json({ message: 'AccReceipt not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching AccReceipt', error });
//     } finally {
//         connection.end();
//     }
// });

// // Update an AccReceipt record
// router.put('/:batchno', async (req: Request, res: Response): Promise<void> => {
//     const { batchno } = req.params;
//     const accReceiptData: AccReceiptData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {

//          // Check if an operator permission with the same OperatorID already exists
//          let [accReceipt] = await connection.execute(
//             'SELECT * FROM accreceipt WHERE batchno = ? AND fiscalyear = ?',
//             [accReceiptData.batchno, accReceiptData.fiscalyear]
//         );

//         if ((accReceipt as any).length > 0) {
//             res.status(409).json({ message: 'Operator permission with this OperatorID already exists.' });
//             return;
//         }
//         // Update the AccReceipt data
//         const [result] = await connection.execute(
//             `UPDATE accreceipt SET fiscalyear = ?, firstno = ?, lastno = ? 
//             WHERE batchno = ? AND fiscalyear = ?`,
//             [
//                 accReceiptData.firstno,
//                 accReceiptData.lastno,
//                 batchno,
//                 accReceiptData.fiscalyear
//             ]
//         );
       
//         res.status(200).json({ message: 'AccReceipt updated successfully' });
//         return;
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating AccReceipt', error });
//     } finally {
//         connection.end();
//     }
// });

// // Delete an AccReceipt record
// router.delete('/:batchno/:fiscalyear', async (req: Request, res: Response) => {
//     const { batchno, fiscalyear } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         // Delete the AccReceipt record
//         const [result] = await connection.execute('DELETE FROM accreceipt WHERE batchno = ? AND fiscalyear = ?', [batchno, fiscalyear]);
       
//         res.status(200).json({ message: 'AccReceipt deleted successfully' });
//         return;
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting AccReceipt', error });
//     } finally {
//         connection.end();
//     }
// });

// export default router;