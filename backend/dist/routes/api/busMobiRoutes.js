// backend/src/routes/api/busMobiRoutes.ts
import { Router } from 'express';
import * as dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
const router = Router();
// Load environment variables from .env file
dotenv.config();
// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
const pool = new Pool(dbConfig);
// Function to sanitize input data
function sanitizeBusMobiData(data) {
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
router.post('/', async (req, res) => {
    console.log('Creating a new BusMobi record');
    const busMobiData = sanitizeBusMobiData(req.body);
    const client = await pool.connect();
    try {
        // Check if a BusMobi record with the same buss_no and fiscal_year already exists
        const existingResult = await client.query('SELECT * FROM busmobi WHERE buss_no = $1 AND fiscal_year = $2', [busMobiData.buss_no, busMobiData.fiscal_year]);
        if (existingResult.rows.length > 0) {
            res.status(409).json({ message: 'BusMobi record with this business number and fiscal year already exists.' });
            return;
        }
        // Insert the new BusMobi data
        await client.query(`INSERT INTO busmobi (buss_no, fiscal_year, dateofbilling, buss_type, balancebf, currentPayable, 
            totalAmount, firstD, secondE, outstanding, firstPaymentDate, secondPaymentDate, 
            firstreceiptno, secondreceiptno, remarks, officer_no) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`, [
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
        ]);
        res.status(201).json({ message: 'BusMobi record created successfully' });
    }
    catch (err) {
        console.error('Error:', err);
        if (err instanceof Error) {
            res.status(500).json({ message: 'Error creating BusMobi record', err });
        }
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Read all BusMobi records
router.get('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM busmobi');
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusMobi records', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Read a single BusMobi record by buss_no
router.get('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM busmobi WHERE buss_no = $1', [buss_no]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'BusMobi record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusMobi record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Update a BusMobi record
router.put('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const busMobiData = sanitizeBusMobiData(req.body);
    const client = await pool.connect();
    try {
        // Check if a BusMobi record with the same buss_no already exists
        const result = await client.query('SELECT * FROM busmobi WHERE buss_no = $1', [buss_no]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'BusMobi record not found' });
            return;
        }
        // Update the BusMobi data
        await client.query(`UPDATE busmobi SET fiscal_year = $1, dateofbilling = $2, buss_type = $3, balancebf = $4, 
            currentPayable = $5, totalAmount = $6, firstD = $7, secondE = $8, outstanding = $9, 
            firstPaymentDate = $10, secondPaymentDate = $11, firstreceiptno = $12, 
            secondreceiptno = $13, remarks = $14, officer_no = $15 
            WHERE buss_no = $16`, [
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
        ]);
        res.status(200).json({ message: 'BusMobi record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BusMobi record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Delete a BusMobi record
router.delete('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const client = await pool.connect();
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BusMobi record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
export default router;
// // backrelease/src/routes/api/busMobiRoutes.ts
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
// // BusMobi data interface
// interface BusMobiData {
//     buss_no: string;
//     fiscal_year: string;
//     dateofbilling: string;
//     buss_type: string;
//     balancebf: number;
//     currentPayable: number;
//     totalAmount: number;
//     firstD: string;
//     secondE: string;
//     outstanding: number;
//     firstPaymentDate: string;
//     secondPaymentDate: string;
//     firstreceiptno: string;
//     secondreceiptno: string;
//     remarks: string;
//     officer_no: string;
// }
// // Create a new BusMobi record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const busMobiData: BusMobiData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Insert the new BusMobi data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO busmobi (buss_no, fiscal_year, dateofbilling, buss_type, balancebf, currentPayable, 
//             totalAmount, firstD, secondE, outstanding, firstPaymentDate, secondPaymentDate, 
//             firstreceiptno, secondreceiptno, remarks, officer_no) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 busMobiData.buss_no,
//                 busMobiData.fiscal_year,
//                 busMobiData.dateofbilling,
//                 busMobiData.buss_type,
//                 busMobiData.balancebf,
//                 busMobiData.currentPayable,
//                 busMobiData.totalAmount,
//                 busMobiData.firstD,
//                 busMobiData.secondE,
//                 busMobiData.outstanding,
//                 busMobiData.firstPaymentDate,
//                 busMobiData.secondPaymentDate,
//                 busMobiData.firstreceiptno,
//                 busMobiData.secondreceiptno,
//                 busMobiData.remarks,
//                 busMobiData.officer_no,
//             ]
//         );
//         res.status(201).json({ message: 'BusMobi record created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating BusMobi record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read all BusMobi records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_busmobi');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BusMobi records', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single BusMobi record by buss_no
// router.get('/:buss_no', async (req: Request, res: Response) => {
//     const { buss_no } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_busmobi WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.json(rows[0]); // Return the first row
//         } else {
//             res.status(404).json({ message: 'BusMobi record not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BusMobi record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Update a BusMobi record
// router.put('/:buss_no', async (req: Request, res: Response): Promise<void> => {
//     const { buss_no } = req.params;
//     const busMobiData: BusMobiData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_busmobi WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'BusMobi record not found' });
//             return
//         }
//         // Update the BusMobi data
//         const [result] = await connection.execute(
//             `UPDATE tb_busmobi SET fiscal_year = ?, dateofbilling = ?, buss_type = ?, balancebf = ?, 
//             currentPayable = ?, totalAmount = ?, firstD = ?, secondE = ?, outstanding = ?, 
//             firstPaymentDate = ?, secondPaymentDate = ?, firstreceiptno = ?, 
//             secondreceiptno = ?, remarks = ?, officer_no = ? 
//             WHERE buss_no = ?`,
//             [
//                 busMobiData.fiscal_year,
//                 busMobiData.dateofbilling,
//                 busMobiData.buss_type,
//                 busMobiData.balancebf,
//                 busMobiData.currentPayable,
//                 busMobiData.totalAmount,
//                 busMobiData.firstD,
//                 busMobiData.secondE,
//                 busMobiData.outstanding,
//                 busMobiData.firstPaymentDate,
//                 busMobiData.secondPaymentDate,
//                 busMobiData.firstreceiptno,
//                 busMobiData.secondreceiptno,
//                 busMobiData.remarks,
//                 busMobiData.officer_no,
//                 buss_no
//             ]
//         );
//         res.status(200).json({ message: 'BusMobi record updated successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating BusMobi record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Delete a BusMobi record
// router.delete('/:buss_no', async (req: Request, res: Response) => {
//     const { buss_no } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Delete the BusMobi record
//         const [rows] = await connection.execute('SELECT * FROM tb_busmobi WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'BusMobi record not found' });
//             return
//         }
//         const [result] = await connection.execute('DELETE FROM tb_busmobi WHERE buss_no = ?', [buss_no]);
//         res.status(200).json({ message: 'BusMobi record deleted successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting BusMobi record', error });
//     } finally {
//         connection.end();
//     }
// });
// export default router;
//# sourceMappingURL=busMobiRoutes.js.map