// backend/src/routes/api/transSavingsRoutes.ts
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

// Transaction Savings data interface
interface TransSavingsData {
    buss_no: string;
    transdate: string; // Adjust based on your date format
    details: string;
    debit: number;
    credit: number;
    balance: number;
    userid: string;
    yearx: number;
    term: string;
}

// Create a new transaction savings record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const transSavingsData: TransSavingsData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_transSavings WHERE buss_no = ?  AND transdate = ?', 
        [transSavingsData.buss_no, transSavingsData.transdate]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'Transaction Savings record not found' });
           return
        }

        // Insert the new transaction savings data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_transSavings 
            (buss_no, transdate, details, debit, credit, balance, userid, yearx, term) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                transSavingsData.buss_no,
                transSavingsData.transdate,
                transSavingsData.details,
                transSavingsData.debit,
                transSavingsData.credit,
                transSavingsData.balance,
                transSavingsData.userid,
                transSavingsData.yearx,
                transSavingsData.term,
            ]
        );

        res.status(201).json({ message: 'Transaction Savings record created successfully'});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating Transaction Savings record', error });
    } finally {
        connection.end();
    }
});

// Read all transaction savings records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_transSavings');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Transaction Savings records', error });
    } finally {
        connection.end();
    }
});

// Read a single transaction savings record by buss_no
router.get('/:buss_no/:transdate', async (req: Request, res: Response) => {
    const { buss_no, transdate } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_transSavings WHERE buss_no = ?  AND transdate = ?', 
        [buss_no, transdate]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Transaction Savings record not found' });
           return
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Transaction Savings record', error });
        return
    } finally {
        connection.end();
    }
});

// Update a transaction savings record
router.put('/:buss_no/:transdate', async (req: Request, res: Response): Promise<void> => {
    const { buss_no } = req.params;
    const transSavingsData: TransSavingsData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_transSavings WHERE buss_no = ?  AND transdate = ?', 
        [transSavingsData.buss_no, transSavingsData.transdate]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'Transaction Savings record not found' });
           return
        }

        // Update the transaction savings data
        const [result] = await connection.execute(
            `UPDATE tb_transSavings 
            SET transdate = ?, details = ?, debit = ?, credit = ?, balance = ?, userid = ?, yearx = ?, term = ? 
            WHERE buss_no = ?`,
            [
                transSavingsData.transdate,
                transSavingsData.details,
                transSavingsData.debit,
                transSavingsData.credit,
                transSavingsData.balance,
                transSavingsData.userid,
                transSavingsData.yearx,
                transSavingsData.term,
                buss_no
            ]
        );

       
        res.status(200).json({ message: 'Transaction Savings record updated successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating Transaction Savings record', error });
    } finally {
        connection.end();
    }
});

// Delete a transaction savings record
router.delete('/:buss_no/:transdate', async (req: Request, res: Response) => {
    const { buss_no, transdate } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        // Delete the transaction savings record
        const [result] = await connection.execute('DELETE FROM tb_transSavings WHERE buss_no = ? AND transdate = ?', 
            [buss_no, transdate]
        );

        res.status(200).json({ message: 'Transaction Savings record deleted successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Transaction Savings record', error });
    } finally {
        connection.end();
    }
});

export default router;