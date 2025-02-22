import * as dotenv from 'dotenv';
import { Router } from 'express';
import pg from 'pg';
const { Pool } = pg;
const router = Router();
// Load environment variables from .env file
dotenv.config();
// PostgreSQL connection pool configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432'), // PostgreSQL default port is 5432
});
// Create a new BussCurrBalance record
router.post('/', async (req, res) => {
    const bussCurrBalanceData = req.body;
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM tb_BussCurrBalance WHERE buss_no = $1 AND fiscalyear = $2', [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]);
        if (rows.length > 0) {
            res.status(404).json({ message: 'BussCurrBalance record exists' });
            return;
        }
        // Insert the new BussCurrBalance data
        const result = await client.query(`INSERT INTO tb_BussCurrBalance (buss_no, fiscalyear, balancebf, current_balance, totalAmountDue, transdate, electoralarea) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            bussCurrBalanceData.buss_no,
            bussCurrBalanceData.fiscalyear,
            bussCurrBalanceData.balancebf,
            bussCurrBalanceData.current_balance,
            bussCurrBalanceData.totalAmountDue,
            bussCurrBalanceData.transdate,
            bussCurrBalanceData.electoralarea,
        ]);
        res.status(201).json({ message: 'BussCurrBalance record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BussCurrBalance record', error });
    }
    finally {
        client.release();
    }
});
// Read all BussCurrBalance records
router.get('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM tb_BussCurrBalance');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BussCurrBalance records', error });
    }
    finally {
        client.release();
    }
});
// Read a single BussCurrBalance record by buss_no and fiscalyear
router.get('/:buss_no/:fiscalyear', async (req, res) => {
    const { buss_no, fiscalyear } = req.params;
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM tb_BussCurrBalance WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);
        if (rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'BussCurrBalance record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BussCurrBalance record', error });
    }
    finally {
        client.release();
    }
});
// Update a BussCurrBalance record
router.put('/:buss_no/:fiscalyear', async (req, res) => {
    const { buss_no } = req.params;
    const bussCurrBalanceData = req.body;
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM tb_BussCurrBalance WHERE buss_no = $1 AND fiscalyear = $2', [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'BussCurrBalance record not exist' });
            return;
        }
        // Update the BussCurrBalance data
        const result = await client.query(`UPDATE tb_BussCurrBalance SET fiscalyear = $1, balancebf = $2, current_balance = $3, totalAmountDue = $4, 
            transdate = $5, electoralarea = $6 
            WHERE buss_no = $7 AND fiscalyear = $8`, [
            bussCurrBalanceData.fiscalyear,
            bussCurrBalanceData.balancebf,
            bussCurrBalanceData.current_balance,
            bussCurrBalanceData.totalAmountDue,
            bussCurrBalanceData.transdate,
            bussCurrBalanceData.electoralarea,
            buss_no,
            bussCurrBalanceData.fiscalyear
        ]);
        res.status(200).json({ message: 'BussCurrBalance record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BussCurrBalance record', error });
    }
    finally {
        client.release();
    }
});
// Delete a BussCurrBalance record
router.delete('/:buss_no/:fiscalyear', async (req, res) => {
    const { buss_no, fiscalyear } = req.params;
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM tb_BussCurrBalance WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'BussCurrBalance record not exist' });
            return;
        }
        // Delete the BussCurrBalance record
        const result = await client.query('DELETE FROM tb_BussCurrBalance WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);
        res.status(200).json({ message: 'BussCurrBalance record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BussCurrBalance record', error });
    }
    finally {
        client.release();
    }
});
export default router;
// // backend/src/routes/api/bussCurrBalanceRoutes.ts
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
// // BussCurrBalance data interface
// interface BussCurrBalanceData {
//     buss_no: string;
//     fiscalyear: string;
//     balancebf: number;
//     current_balance: number;
//     totalAmountDue: number;
//     transdate: string;
//     electoralarea: string;
// }
// // Create a new BussCurrBalance record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const bussCurrBalanceData: BussCurrBalanceData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?',
//          [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]
//         );
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(404).json({ message: 'BussCurrBalance record exists' });
//             return
//         }
//         // Insert the new BussCurrBalance data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_BussCurrBalance (buss_no, fiscalyear, balancebf, current_balance, totalAmountDue, transdate, electoralarea) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 bussCurrBalanceData.buss_no,
//                 bussCurrBalanceData.fiscalyear,
//                 bussCurrBalanceData.balancebf,
//                 bussCurrBalanceData.current_balance,
//                 bussCurrBalanceData.totalAmountDue,
//                 bussCurrBalanceData.transdate,
//                 bussCurrBalanceData.electoralarea,
//             ]
//         );
//         res.status(201).json({ message: 'BussCurrBalance record created successfully' });
//         return
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating BussCurrBalance record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read all BussCurrBalance records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BussCurrBalance records', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single BussCurrBalance record by buss_no
// router.get('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
//     const { buss_no, fiscalyear } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?', [buss_no, fiscalyear]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.json(rows[0]); // Return the first row
//         } else {
//             res.status(404).json({ message: 'BussCurrBalance record not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BussCurrBalance record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Update a BussCurrBalance record
// router.put('/:buss_no/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
//     const { buss_no } = req.params;
//     const bussCurrBalanceData: BussCurrBalanceData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?',
//          [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]
//         );
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'BussCurrBalance record not exist' });
//             return
//         }
//         // Update the BussCurrBalance data
//         const [result] = await connection.execute(
//             `UPDATE tb_BussCurrBalance SET fiscalyear = ?, balancebf = ?, current_balance = ?, totalAmountDue = ?, 
//             transdate = ?, electoralarea = ? 
//             WHERE buss_no = ? AND fiscalyear = ?`,
//             [
//                 bussCurrBalanceData.fiscalyear,
//                 bussCurrBalanceData.balancebf,
//                 bussCurrBalanceData.current_balance,
//                 bussCurrBalanceData.totalAmountDue,
//                 bussCurrBalanceData.transdate,
//                 bussCurrBalanceData.electoralarea,
//                 buss_no
//             ]
//         );
//    res.status(200).json({ message: 'BussCurrBalance record updated successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating BussCurrBalance record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Delete a BussCurrBalance record
// router.delete('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
//     const { buss_no, fiscalyear } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?',
//          [buss_no, fiscalyear]
//         );
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'BussCurrBalance record not exist' });
//             return
//         }
//         // Delete the BussCurrBalance record
//         const [result] = await connection.execute('DELETE FROM tb_BussCurrBalance WHERE buss_no = ?', [buss_no]);
//         res.status(200).json({ message: 'BussCurrBalance record deleted successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting BussCurrBalance record', error });
//     } finally {
//         connection.end();
//     }
// });
// export default router;
//# sourceMappingURL=bussCurrBalanceRoutes.js.map