import { Router } from 'express';
import * as dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
import { createClient } from '../../db.js';
const router = Router();
// Load environment variables from .env file
dotenv.config();
const nodeEnv = process.env.NODE_ENV;
let frontendUrl = ""; // Set frontend URL based on node environment
if (nodeEnv === 'development') {
    frontendUrl = "http://localhost:5173";
}
else if (nodeEnv === 'production') {
    frontendUrl = "https://revenue-monitor-system.onrender.com";
}
else if (nodeEnv === 'test') {
    console.log('Just testing');
}
else {
    console.log('Invalid node environment variable'); //.slice()
}
// PostgreSQL connection pool configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
const pool = new Pool(dbConfig);
// Create a new balance record
router.post('/', async (req, res) => {
    const balanceData = req.body;
    //let client: PoolClient | null = null;
    const client = createClient();
    try {
        // Check if a balance record with the same business number already exists
        const result = await client.query('SELECT * FROM balance WHERE buss_no = $1', [balanceData.buss_no]);
        if (result.rows.length > 0) {
            res.status(409).json({ message: 'Balance record with this business number already exists.' });
            return;
        }
        // Insert the new balance data
        const insertResult = await client.query(`INSERT INTO balance (buss_no, buss_name, billamount, paidamount, balance, electroral_area, street_name) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            balanceData.buss_no,
            balanceData.buss_name,
            balanceData.billamount,
            balanceData.paidamount,
            balanceData.balance,
            balanceData.electroral_area,
            balanceData.street_name,
        ]);
        res.status(201).json({ message: 'Balance record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating balance record', error });
    }
    finally {
        if (client) {
            client.end();
        }
    }
});
// Read all balance records
router.get('/all', async (req, res) => {
    const client = createClient();
    console.log('in router.get(/all)');
    try {
        // client = await pool.connect();
        const result = await client.query('SELECT * FROM balance');
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No balance records found', data: [] });
            return;
        }
        console.log('in router.get(/all) result.rows', result.rows);
        res.status(200).json({ message: 'Balances fetched', data: result.rows });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching balance records', error });
    }
    finally {
        if (client) {
            client.end();
        }
    }
});
// Read a single balance record by buss_no
router.get('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const client = createClient();
    try {
        //client = await pool.connect();
        const result = await client.query('SELECT * FROM balance WHERE buss_no = $1', [buss_no]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'Balance record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching balance record', error });
    }
    finally {
        if (client) {
            client.end();
        }
    }
});
// Update a balance record
router.put('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const balanceData = req.body;
    const client = createClient();
    try {
        //client = await pool.connect();
        // Check if a balance record with the same business number exists
        const result = await client.query('SELECT * FROM balance WHERE buss_no = $1', [balanceData.buss_no]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Balance record with this business number not found.' });
            return;
        }
        // Update the balance data
        const updateResult = await client.query(`UPDATE balance SET buss_name = $1, billamount = $2, paidamount = $3, balance = $4, electroral_area = $5, street_name = $6 
            WHERE buss_no = $7`, [
            balanceData.buss_name,
            balanceData.billamount,
            balanceData.paidamount,
            balanceData.balance,
            balanceData.electroral_area,
            balanceData.street_name,
            buss_no
        ]);
        res.status(200).json({ message: 'Balance record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating balance record', error });
    }
    finally {
        if (client) {
            client.end();
        }
    }
});
// Delete a balance record
router.delete('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const client = createClient();
    try {
        //client = await pool.connect();
        // Check if a balance record with the same business number exists
        const result = await client.query('SELECT * FROM balance WHERE buss_no = $1', [buss_no]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Balance record with this business number not found.' });
            return;
        }
        // Delete the balance record
        const deleteResult = await client.query('DELETE FROM balance WHERE buss_no = $1', [buss_no]);
        res.status(200).json({ message: 'Balance record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting balance record', error });
    }
    finally {
        if (client) {
            client.end();
        }
    }
});
export default router;
// // backend/src/routes/api/balanceRoutes.ts
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
// // Balance data interface
// interface BalanceData {
//     buss_no: string;
//     buss_name: string;
//     billamount: number;
//     paidamount: number;
//     balance: number;
//     electroral_area: string;
//     street_name: string;
// }
// // Create a new balance record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const balanceData: BalanceData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         let [existingBalance] = await connection.execute(
//             'SELECT * FROM balance WHERE buss_no = ?', 
//             [balanceData.buss_no]
//         );
//         if (Array.isArray(existingBalance) && existingBalance.length > 0) {
//             res.status(409).json({ message: 'Balance record with this business number already exists.' });
//             return;
//         }
//         // Insert the new balance data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_balance (buss_no, buss_name, billamount, paidamount, balance, electroral_area, street_name) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 balanceData.buss_no,
//                 balanceData.buss_name,
//                 balanceData.billamount,
//                 balanceData.paidamount,
//                 balanceData.balance,
//                 balanceData.electroral_area,
//                 balanceData.street_name,
//             ]
//         );
//         res.status(201).json({ message: 'Balance record created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating balance record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read all balance records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_balance');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching balance records', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single balance record by buss_no
// router.get('/:buss_no', async (req: Request, res: Response) => {
//     const { buss_no } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_balance WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.json(rows[0]); // Return the first row
//         } else {
//             res.status(404).json({ message: 'Balance record not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching balance record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Update a balance record
// router.put('/:buss_no', async (req: Request, res: Response): Promise<void> => {
//     const { buss_no } = req.params;
//     const balanceData: BalanceData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         let [existingBalance] = await connection.execute(
//             'SELECT * FROM tb_balance WHERE buss_no = ?', 
//             [balanceData.buss_no]
//         );
//         if (Array.isArray(existingBalance) && existingBalance.length > 0) {
//             res.status(409).json({ message: 'Balance record with this business number already exists.' });
//             return;
//         }
//         // Update the balance data
//         const [result] = await connection.execute(
//             `UPDATE tb_balance SET buss_name = ?, billamount = ?, paidamount = ?, balance = ?, electroral_area = ?, street_name = ? 
//             WHERE buss_no = ?`,
//             [
//                 balanceData.buss_name,
//                 balanceData.billamount,
//                 balanceData.paidamount,
//                 balanceData.balance,
//                 balanceData.electroral_area,
//                 balanceData.street_name,
//                 buss_no
//             ]
//         );
//         res.status(200).json({ message: 'Balance record updated successfully' });
//         return;
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating balance record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Delete a balance record
// router.delete('/:buss_no', async (req: Request, res: Response) => {
//     const { buss_no } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         let [existingBalance] = await connection.execute(
//             'SELECT * FROM tb_balance WHERE buss_no = ?', 
//             [buss_no]
//         );
//         if (Array.isArray(existingBalance) && existingBalance.length > 0) {
//             res.status(409).json({ message: 'Balance record with this business number already exists.' });
//             return;
//         }
//         // Delete the balance record
//         const [result] = await connection.execute('DELETE FROM tb_balance WHERE buss_no = ?', [buss_no]);
//         res.status(200).json({ message: 'Balance record deleted successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting balance record', error });
//     } finally {
//         connection.end();
//     }
// });
// export default router;
//# sourceMappingURL=balanceRoutes.js.map