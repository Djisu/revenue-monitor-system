// backend/src/routes/api/busPaymentsRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import mysql, { ResultSetHeader } from 'mysql2/promise';

const router = Router();

// Load environment variables from .env file
dotenv.config();

// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};

// BusPayments data interface
interface BusPaymentsData {
    buss_no: string;
    officer_no: string;
    amount: number;
    monthpaid: string;
    transdate: string;
    userid: string;
    fiscal_year: string;
    ReceiptNo: string;
}

// Create a new BusPayments record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const busPaymentsData: BusPaymentsData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [busPaymentsData.buss_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'BusPayments record not exists' });
            return
        }

        // Insert the new BusPayments data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_buspayments (buss_no, officer_no, amount, monthpaid, transdate, userid, fiscal_year, ReceiptNo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                busPaymentsData.buss_no,
                busPaymentsData.officer_no,
                busPaymentsData.amount,
                busPaymentsData.monthpaid,
                busPaymentsData.transdate,
                busPaymentsData.userid,
                busPaymentsData.fiscal_year,
                busPaymentsData.ReceiptNo,
            ]
        );

        res.status(201).json({ message: 'BusPayments record created successfully' });
        return
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BusPayments record', error });
        return
    } finally {
        connection.end();
    }
});

// Read all BusPayments records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments records', error });
    } finally {
        connection.end();
    }
});

// Read a single BusPayments record by buss_no
router.get('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    } finally {
        connection.end();
    }
});

// Update a BusPayments record
router.put('/:buss_no', async (req: Request, res: Response): Promise<void> => {
    const { buss_no } = req.params;
    const busPaymentsData: BusPaymentsData = req.body;

    const isoDate = new Date(busPaymentsData.transdate);
    const mysqlDate = isoDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD


    const connection = await mysql.createConnection(dbConfig);
   
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'BusPayments record exists' });
            return
        }

        // Update the BusPayments data
        const [result] = await connection.execute(
            `UPDATE tb_buspayments SET officer_no = ?, amount = ?, monthpaid = ?, transdate = ?, 
            userid = ?, fiscal_year = ?, ReceiptNo = ? 
            WHERE buss_no = ?`,
            [
                busPaymentsData.officer_no,
                busPaymentsData.amount,
                busPaymentsData.monthpaid,
                mysqlDate,
                busPaymentsData.userid,
                busPaymentsData.fiscal_year,
                busPaymentsData.ReceiptNo,
                buss_no
            ]
        );

        res.status(200).json({ message: 'BusPayments record updated successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BusPayments record', error });
        return
    } finally {
        connection.end();
    }
});

// Delete a BusPayments record
router.delete('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [row] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(row) && row.length == 0) {
            res.status(404).json({ message: 'BusPayments record does not exist' });
            return
        }
        // Delete the BusPayments record
        const [result] = await connection.execute('DELETE FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

        res.status(200).json({ message: 'BusPayments record deleted successfully' });
       return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BusPayments record', error });
    } finally {
        connection.end();
    }
});

export default router;