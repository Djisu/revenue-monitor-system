// backend/src/routes/api/receiptRoutes.ts
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

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_receipt WHERE buss_no = ? AND receiptno = ?',
                [receiptData.buss_no, receiptData.receiptno]
        );

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'Receipt record already exists' });
            return
        }

        // Insert the new receipt data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_receipt 
            (buss_no, receiptno, description, transdate, amount, buss_name) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                receiptData.buss_no,
                receiptData.receiptno,
                receiptData.description,
                receiptData.transdate,
                receiptData.amount,
                receiptData.buss_name,
            ]
        );

        res.status(201).json({ message: 'Receipt record created successfully'});
        return
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating receipt record', error });
        return
    } finally {
        connection.end();
    }
});

// Read all receipt records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_receipt');
        res.json(rows);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching receipt records', error });
        return
    } finally {
        connection.end();
    }
});

// Read a single receipt record by buss_no
router.get('/:buss_no/:receiptno', async (req: Request, res: Response) => {
    const { buss_no, receiptno } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_receipt WHERE buss_no = ? AND receiptno = ?',
             [buss_no, receiptno]
        );

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Receipt record not found' });
            return
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching receipt record', error });
        return
    } finally {
        connection.end();
    }
});

// Update a receipt record
router.put('/:buss_no/:receiptno', async (req: Request, res: Response): Promise<void> => {
    const { receiptno } = req.params;
    const receiptData: ReceiptData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_receipt WHERE buss_no = ? AND receiptno = ?',
             [receiptData.buss_no, receiptData.receiptno]
        );

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Receipt record not found' });
            return
        }

        // Update the receipt data
        const [result] = await connection.execute(
            `UPDATE tb_receipt 
            SET buss_no = ?, description = ?, transdate = ?, amount = ?, buss_name = ? 
            WHERE receiptno = ?`,
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
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating receipt record', error });
        return
    } finally {
        connection.end();
    }
});

// Delete a receipt record
router.delete('/:buss_no/:receiptno', async (req: Request, res: Response) => {
    const { receiptno, buss_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_receipt WHERE buss_no = ? AND receiptno = ?',
            [buss_no, receiptno]
        );

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Receipt record not found' });
            return
        }

        // Delete the receipt record
        const [result] = await connection.execute('DELETE FROM tb_receipt WHERE receiptno = ?', [receiptno]);
     
        res.status(200).json({ message: 'Receipt record deleted successfully' });
       return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting receipt record', error });
        return
    } finally {
        connection.end();
    }
});

export default router;