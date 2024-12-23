// backend/src/routes/api/busMobiRoutes.ts
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

// BusMobi data interface
interface BusMobiData {
    buss_no: string;
    fiscal_year: string;
    dateofbilling: string;
    buss_type: string;
    balancebf: number;
    currentPayable: number;
    totalAmount: number;
    firstD: string;
    secondE: string;
    outstanding: number;
    firstPaymentDate: string;
    secondPaymentDate: string;
    firstreceiptno: string;
    secondreceiptno: string;
    remarks: string;
    officer_no: string;
}

// Create a new BusMobi record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const busMobiData: BusMobiData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        // Insert the new BusMobi data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_busmobi (buss_no, fiscal_year, dateofbilling, buss_type, balancebf, currentPayable, 
            totalAmount, firstD, secondE, outstanding, firstPaymentDate, secondPaymentDate, 
            firstreceiptno, secondreceiptno, remarks, officer_no) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
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
            ]
        );

        res.status(201).json({ message: 'BusMobi record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BusMobi record', error });
    } finally {
        connection.end();
    }
});

// Read all BusMobi records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_busmobi');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusMobi records', error });
    } finally {
        connection.end();
    }
});

// Read a single BusMobi record by buss_no
router.get('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_busmobi WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'BusMobi record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusMobi record', error });
    } finally {
        connection.end();
    }
});

// Update a BusMobi record
router.put('/:buss_no', async (req: Request, res: Response): Promise<void> => {
    const { buss_no } = req.params;
    const busMobiData: BusMobiData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_busmobi WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'BusMobi record not found' });
            return
        }
        
        // Update the BusMobi data
        const [result] = await connection.execute(
            `UPDATE tb_busmobi SET fiscal_year = ?, dateofbilling = ?, buss_type = ?, balancebf = ?, 
            currentPayable = ?, totalAmount = ?, firstD = ?, secondE = ?, outstanding = ?, 
            firstPaymentDate = ?, secondPaymentDate = ?, firstreceiptno = ?, 
            secondreceiptno = ?, remarks = ?, officer_no = ? 
            WHERE buss_no = ?`,
            [
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
            ]
        );
      
        res.status(200).json({ message: 'BusMobi record updated successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BusMobi record', error });
    } finally {
        connection.end();
    }
});

// Delete a BusMobi record
router.delete('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        // Delete the BusMobi record
        const [rows] = await connection.execute('SELECT * FROM tb_busmobi WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'BusMobi record not found' });
            return
        }
        const [result] = await connection.execute('DELETE FROM tb_busmobi WHERE buss_no = ?', [buss_no]);
     
        res.status(200).json({ message: 'BusMobi record deleted successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BusMobi record', error });
    } finally {
        connection.end();
    }
});

export default router;