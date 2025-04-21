// backend/src/routes/api/receiptRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pkg from 'pg';
import type { PoolClient } from 'pg';
const { Pool } = pkg;
import type { QueryResult } from 'pg';  // Import QueryResult as a type
import { createClient } from '../../db.js';



const router = Router();

// Load environment variables from .env file
dotenv.config();

const nodeEnv = process.env.NODE_ENV;

let frontendUrl = "" // Set frontend URL based on node environment

if (nodeEnv === 'development'){
    frontendUrl = "http://localhost:5173";
} else if (nodeEnv === 'production'){
    frontendUrl = "https://revenue-monitor-system.onrender.com";
} else if (nodeEnv === 'test'){
    console.log('Just testing')
} else {
    console.log('Invalid node environment variable') //.slice()
}

// Postgres connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: Number(process.env.DB_PORT) || 5432,
});

// Receipt data interface
interface ReceiptData {
    buss_no: string;
    receiptno: string;
    description: string;
    transdate: Date; // Adjust based on your date format
    amount: number;
    buss_name: string;
}

// Create a new receipt record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const receiptData: ReceiptData = req.body;


const client = createClient();
    try {
        const { rows } = await client.query('SELECT * FROM receipt WHERE buss_no = $1 AND receiptno = $2',
                [receiptData.buss_no, receiptData.receiptno]
        );

        if (rows.length > 0) {
            res.status(409).json({ message: 'Receipt record already exists' });
            return;
        }

        // Insert the new receipt data
        await client.query(
            `INSERT INTO receipt 
            (buss_no, receiptno, description, transdate, amount, buss_name) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                receiptData.buss_no,
                receiptData.receiptno,
                receiptData.description,
                receiptData.transdate,
                receiptData.amount,
                receiptData.buss_name,
            ]
        );

        res.status(201).json({ message: 'Receipt record created successfully' });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating receipt record', error });
    }finally{
        client.end()
    }
});

// Read all receipt records
router.get('/', async (req: Request, res: Response) => {

const client = createClient();
    try {
        const { rows } = await client.query('SELECT * FROM receipt');
        res.json(rows);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching receipt records', error });
    }finally{
        client.end()
    }
});

// Read a single receipt record by buss_no
router.get('/:buss_no/:receiptno', async (req: Request, res: Response) => {
    const { buss_no, receiptno } = req.params;

    console.log('in router.get(/:buss_no/:receiptno', { buss_no, receiptno })

const client = createClient();

    try {
        const { rows } = await client.query('SELECT * FROM receipt WHERE buss_no = $1 AND receiptno = $2',
             [buss_no, receiptno]
        );

        if (rows.length == 0) {
            res.status(404).json({ message: 'Receipt record not found' });
            return;
        }
        res.json(rows[0]); // Return the first row
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching receipt record', error });
    }finally{
        client.end()
    }
});

// Update a receipt record
router.put('/:buss_no/:receiptno', async (req: Request, res: Response): Promise<void> => {
    const { receiptno } = req.params;
    const receiptData: ReceiptData = req.body;

const client = createClient();

    try {
        const { rows } = await client.query('SELECT * FROM receipt WHERE buss_no = $1 AND receiptno = $2',
             [receiptData.buss_no, receiptno]
        );

        if (rows.length == 0) {
            res.status(404).json({ message: 'Receipt record not found' });
            return;
        }

        // Update the receipt data
        await client.query(
            `UPDATE receipt 
            SET buss_no = $1, description = $2, transdate = $3, amount = $4, buss_name = $5 
            WHERE receiptno = $6`,
            [
                receiptData.buss_no,
                receiptData.description,
                receiptData.transdate,
                receiptData.amount,
                receiptData.buss_name,
                receiptno
            ]
        );
    
        res.status(200).json({ message: 'Receipt record updated successfully' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error updating receipt record', error });
    }finally{
        client.end()
    }
});

// Delete a receipt record
router.delete('/:buss_no/:receiptno', async (req: Request, res: Response) => {
    const { receiptno, buss_no } = req.params;

const client = createClient();

    try {
        const { rows } = await client.query('SELECT * FROM receipt WHERE buss_no = $1 AND receiptno = $2',
            [buss_no, receiptno]
        );

        if (rows.length == 0) {
            res.status(404).json({ message: 'Receipt record not found' });
            return;
        }

        // Delete the receipt record
        await pool.query('DELETE FROM receipt WHERE receiptno = $1', [receiptno]);
     
        res.status(200).json({ message: 'Receipt record deleted successfully' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting receipt record', error });
    }finally{
        client.end()
    }
});

export default router;





// // backend/src/routes/api/receiptRoutes.ts
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

// // Receipt data interface
// interface ReceiptData {
//     buss_no: string;
//     receiptno: string;
//     description: string;
//     transdate: Date; // Adjust based on your date format
//     amount: number;
//     buss_name: string;
// }

// // Create a new receipt record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const receiptData: ReceiptData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_receipt WHERE buss_no = ? AND receiptno = ?',
//                 [receiptData.buss_no, receiptData.receiptno]
//         );

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(404).json({ message: 'Receipt record already exists' });
//             return
//         }

//         // Insert the new receipt data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_receipt 
//             (buss_no, receiptno, description, transdate, amount, buss_name) 
//             VALUES (?, ?, ?, ?, ?, ?)`,
//             [
//                 receiptData.buss_no,
//                 receiptData.receiptno,
//                 receiptData.description,
//                 receiptData.transdate,
//                 receiptData.amount,
//                 receiptData.buss_name,
//             ]
//         );

//         res.status(201).json({ message: 'Receipt record created successfully'});
//         return
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating receipt record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Read all receipt records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_receipt');
//         res.json(rows);
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching receipt records', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Read a single receipt record by buss_no
// router.get('/:buss_no/:receiptno', async (req: Request, res: Response) => {
//     const { buss_no, receiptno } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_receipt WHERE buss_no = ? AND receiptno = ?',
//              [buss_no, receiptno]
//         );

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Receipt record not found' });
//             return
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching receipt record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Update a receipt record
// router.put('/:buss_no/:receiptno', async (req: Request, res: Response): Promise<void> => {
//     const { receiptno } = req.params;
//     const receiptData: ReceiptData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_receipt WHERE buss_no = ? AND receiptno = ?',
//              [receiptData.buss_no, receiptData.receiptno]
//         );

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Receipt record not found' });
//             return
//         }

//         // Update the receipt data
//         const [result] = await connection.execute(
//             `UPDATE tb_receipt 
//             SET buss_no = ?, description = ?, transdate = ?, amount = ?, buss_name = ? 
//             WHERE receiptno = ?`,
//             [
//                 receiptData.buss_no,
//                 receiptData.description,
//                 receiptData.transdate,
//                 receiptData.amount,
//                 receiptData.buss_name,
//                 receiptno
//             ]
//         );
    
//         res.status(200).json({ message: 'Receipt record updated successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating receipt record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Delete a receipt record
// router.delete('/:buss_no/:receiptno', async (req: Request, res: Response) => {
//     const { receiptno, buss_no } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_receipt WHERE buss_no = ? AND receiptno = ?',
//             [buss_no, receiptno]
//         );

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Receipt record not found' });
//             return
//         }

//         // Delete the receipt record
//         const [result] = await connection.execute('DELETE FROM tb_receipt WHERE receiptno = ?', [receiptno]);
     
//         res.status(200).json({ message: 'Receipt record deleted successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting receipt record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// export default router;