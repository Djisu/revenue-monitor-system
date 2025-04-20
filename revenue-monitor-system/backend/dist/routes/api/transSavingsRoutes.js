import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import { createClient } from '../../db';
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
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432'), // PostgreSQL default port is 5432
});
// Create a new transaction savings record
router.post('/', async (req, res) => {
    const transSavingsData = req.body;
    const client = createClient();
    try {
        const rows = await client.query('SELECT * FROM tb_transSavings WHERE buss_no = $1 AND transdate = $2', [transSavingsData.buss_no, transSavingsData.transdate]);
        if (rows.rowCount > 0) {
            res.status(409).json({ message: 'Transaction Savings record already exists' });
            return;
        }
        // Insert the new transaction savings data
        await client.query(`INSERT INTO transsavings 
            (buss_no, transdate, details, debit, credit, balance, userid, yearx, term) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
            transSavingsData.buss_no,
            transSavingsData.transdate,
            transSavingsData.details,
            transSavingsData.debit,
            transSavingsData.credit,
            transSavingsData.balance,
            transSavingsData.userid,
            transSavingsData.yearx,
            transSavingsData.term,
        ]);
        res.status(201).json({ message: 'Transaction Savings record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating Transaction Savings record', error: error.message });
    }
    finally {
        client.end();
    }
});
// Read all transaction savings records
router.get('/', async (req, res) => {
    const client = createClient();
    try {
        const rows = await client.query('SELECT * FROM transsavings');
        res.json(rows.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Transaction Savings records', error: error.message });
    }
    finally {
        client.end();
    }
});
// Read a single transaction savings record by buss_no and transdate
router.get('/:buss_no/:transdate', async (req, res) => {
    const { buss_no, transdate } = req.params;
    const client = createClient();
    try {
        const rows = await client.query('SELECT * FROM transsavings WHERE buss_no = $1 AND transdate = $2', [buss_no, transdate]);
        if (rows.rowCount > 0) {
            res.json(rows.rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'Transaction Savings record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Transaction Savings record', error: error.message });
    }
    finally {
        client.end();
    }
});
// Update a transaction savings record
router.put('/:buss_no/:transdate', async (req, res) => {
    const { buss_no, transdate } = req.params;
    const transSavingsData = req.body;
    const client = createClient();
    try {
        const rows = await client.query('SELECT * FROM transsavings WHERE buss_no = $1 AND transdate = $2', [buss_no, transdate]);
        if (rows.rowCount == 0) {
            res.status(404).json({ message: 'Transaction Savings record not found' });
            return;
        }
        // Update the transaction savings data
        await client.query(`UPDATE transsavings 
            SET transdate = $1, details = $2, debit = $3, credit = $4, balance = $5, userid = $6, yearx = $7, term = $8 
            WHERE buss_no = $9`, [
            transSavingsData.transdate,
            transSavingsData.details,
            transSavingsData.debit,
            transSavingsData.credit,
            transSavingsData.balance,
            transSavingsData.userid,
            transSavingsData.yearx,
            transSavingsData.term,
            buss_no
        ]);
        res.status(200).json({ message: 'Transaction Savings record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating Transaction Savings record', error: error.message });
    }
    finally {
        client.end();
    }
});
// Delete a transaction savings record
router.delete('/:buss_no/:transdate', async (req, res) => {
    const { buss_no, transdate } = req.params;
    const client = createClient();
    try {
        const rows = await client.query('SELECT * FROM transsavings WHERE buss_no = $1 AND transdate = $2', [buss_no, transdate]);
        if (rows.rowCount == 0) {
            res.status(404).json({ message: 'Transaction Savings record not found' });
            return;
        }
        // Delete the transaction savings record
        await client.query('DELETE FROM transsavings WHERE buss_no = $1 AND transdate = $2', [buss_no, transdate]);
        res.status(200).json({ message: 'Transaction Savings record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Transaction Savings record', error: error.message });
    }
    finally {
        client.end();
    }
});
export default router;
// // backend/src/routes/api/transSavingsRoutes.ts
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
// // Transaction Savings data interface
// interface TransSavingsData {
//     buss_no: string;
//     transdate: string; // Adjust based on your date format
//     details: string;
//     debit: number;
//     credit: number;
//     balance: number;
//     userid: string;
//     yearx: number;
//     term: string;
// }
// // Create a new transaction savings record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const transSavingsData: TransSavingsData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM transsavings WHERE buss_no = ?  AND transdate = ?', 
//         [transSavingsData.buss_no, transSavingsData.transdate]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(404).json({ message: 'Transaction Savings record not found' });
//            return
//         }
//         // Insert the new transaction savings data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_transSavings 
//             (buss_no, transdate, details, debit, credit, balance, userid, yearx, term) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 transSavingsData.buss_no,
//                 transSavingsData.transdate,
//                 transSavingsData.details,
//                 transSavingsData.debit,
//                 transSavingsData.credit,
//                 transSavingsData.balance,
//                 transSavingsData.userid,
//                 transSavingsData.yearx,
//                 transSavingsData.term,
//             ]
//         );
//         res.status(201).json({ message: 'Transaction Savings record created successfully'});
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating Transaction Savings record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read all transaction savings records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_transSavings');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching Transaction Savings records', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single transaction savings record by buss_no
// router.get('/:buss_no/:transdate', async (req: Request, res: Response) => {
//     const { buss_no, transdate } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_transSavings WHERE buss_no = ?  AND transdate = ?', 
//         [buss_no, transdate]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Transaction Savings record not found' });
//            return
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching Transaction Savings record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });
// // Update a transaction savings record
// router.put('/:buss_no/:transdate', async (req: Request, res: Response): Promise<void> => {
//     const { buss_no } = req.params;
//     const transSavingsData: TransSavingsData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_transSavings WHERE buss_no = ?  AND transdate = ?', 
//         [transSavingsData.buss_no, transSavingsData.transdate]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(404).json({ message: 'Transaction Savings record not found' });
//            return
//         }
//         // Update the transaction savings data
//         const [result] = await connection.execute(
//             `UPDATE tb_transSavings 
//             SET transdate = ?, details = ?, debit = ?, credit = ?, balance = ?, userid = ?, yearx = ?, term = ? 
//             WHERE buss_no = ?`,
//             [
//                 transSavingsData.transdate,
//                 transSavingsData.details,
//                 transSavingsData.debit,
//                 transSavingsData.credit,
//                 transSavingsData.balance,
//                 transSavingsData.userid,
//                 transSavingsData.yearx,
//                 transSavingsData.term,
//                 buss_no
//             ]
//         );
//         res.status(200).json({ message: 'Transaction Savings record updated successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating Transaction Savings record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Delete a transaction savings record
// router.delete('/:buss_no/:transdate', async (req: Request, res: Response) => {
//     const { buss_no, transdate } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Delete the transaction savings record
//         const [result] = await connection.execute('DELETE FROM tb_transSavings WHERE buss_no = ? AND transdate = ?', 
//             [buss_no, transdate]
//         );
//         res.status(200).json({ message: 'Transaction Savings record deleted successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting Transaction Savings record', error });
//     } finally {
//         connection.end();
//     }
// });
// export default router;
//# sourceMappingURL=transSavingsRoutes.js.map