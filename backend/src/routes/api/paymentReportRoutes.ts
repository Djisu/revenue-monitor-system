// backend/src/routes/api/paymentReportRoutes.ts
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

// PaymentReport data interface
interface PaymentReportData {
    transdate: string; // Adjust the type based on your actual date format
    buss_name: string;
    amount: number;
    receiptno: string;
    fiscalyear: number;
    officer_no: string;
    buss_no: string;
}

// Create a new payment report record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const paymentReportData: PaymentReportData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        // Insert the new payment report data
        const paymentReportData: PaymentReportData = req.body;

        const [rows] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ? AND fiscalyear = ?', 
            [paymentReportData.buss_no, paymentReportData.fiscalyear]
        );
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Payment report record already exists' });
            return;
        }

        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_PaymentReport 
            (transdate, buss_name, amount, receiptno, fiscalyear, officer_no, buss_no) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                paymentReportData.transdate,
                paymentReportData.buss_name,
                paymentReportData.amount,
                paymentReportData.receiptno,
                paymentReportData.fiscalyear,
                paymentReportData.officer_no,
                paymentReportData.buss_no,
            ]
        );

        res.status(201).json({ message: 'Payment report record created successfully' });
        return
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating payment report record', error });
        return
    } finally {
        connection.end();
    }
});

// Read all payment report records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PaymentReport');
        res.json(rows);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching payment report records', error });
        return;
    } finally {
        connection.end();
    }
});

// Read a single payment report record by buss_no
router.get('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [result] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ? AND fiscalyear = ?', 
            [buss_no, fiscalyear]
        );
        if (Array.isArray(result) && result.length > 0) {
            res.status(409).json({ message: 'Payment report record already exists' });
            return;
        }
        const [rows] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
            return;
        } else {
            res.status(404).json({ message: 'Payment report record not found' });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching payment report record', error });
        return;
    } finally {
        connection.end();
    }
});

// Update a payment report record
router.put('/:buss_no/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
    const { buss_no, fiscalyear } = req.params;
    const paymentReportData: PaymentReportData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [row] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ? AND fiscalyear = ?', 
            [buss_no, fiscalyear]
        );
        if (Array.isArray(row) && row.length == 0) {
            res.status(409).json({ message: 'Payment report record does not exist' });
            return;
        }
        // Update the payment report data
        const [result] = await connection.execute(
            `UPDATE tb_PaymentReport 
            SET transdate = ?, buss_name = ?, amount = ?, receiptno = ?, fiscalyear = ?, officer_no = ? 
            WHERE buss_no = ?`,
            [
                paymentReportData.transdate,
                paymentReportData.buss_name,
                paymentReportData.amount,
                paymentReportData.receiptno,
                paymentReportData.fiscalyear,
                paymentReportData.officer_no,
                buss_no
            ]
        );

        res.status(200).json({ message: 'Payment report record updated successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating payment report record', error });
        return
    } finally {
        connection.end();
    }
});

// Delete a payment report record
router.delete('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [row] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ? AND fiscalyear = ?', 
            [buss_no, fiscalyear]
        );
        if (Array.isArray(row) && row.length == 0) {
            res.status(409).json({ message: 'Payment report record does not exist' });
            return;
        }
        // Delete the payment report record
        const [result] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ? AND fiscalyear = ?', 
             [buss_no, fiscalyear]
        );

        res.status(200).json({ message: 'Payment report record deleted successfully'});
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting payment report record', error });
        return
    } finally {
        connection.end();
    }
});

export default router;