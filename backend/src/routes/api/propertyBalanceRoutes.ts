// backend/src/routes/api/propertyBalanceRoutes.ts
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

// PropertyBalance data interface
interface PropertyBalanceData {
    house_no: string;
    billamount: number;
    paidamount: number;
    balance: number;
}

// Create a new property balance record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const propertyBalanceData: PropertyBalanceData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyBalance WHERE house_no = ?', [propertyBalanceData.house_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Property balance record already exists' });
            return
        }

        // Insert the new property balance data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_PropertyBalance 
            (house_no, billamount, paidamount, balance) 
            VALUES (?, ?, ?, ?)`,
            [
                propertyBalanceData.house_no,
                propertyBalanceData.billamount,
                propertyBalanceData.paidamount,
                propertyBalanceData.balance,
            ]
        );

        res.status(201).json({ message: 'Property balance record created successfully' });
        return
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property balance record', error });
        return
    } finally {
        connection.end();
    }
});

// Read all property balance records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyBalance');
        res.json(rows);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property balance records', error });
        return
    } finally {
        connection.end();
    }
});

// Read a single property balance record by house_no
router.get('/:house_no', async (req: Request, res: Response) => {
    const { house_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyBalance WHERE house_no = ?', [house_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Property balance record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property balance record', error });
    } finally {
        connection.end();
    }
});

// Update a property balance record
router.put('/:house_no', async (req: Request, res: Response): Promise<void> => {
    const { house_no } = req.params;
    const propertyBalanceData: PropertyBalanceData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyBalance WHERE house_no = ?', [house_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property balance record not found' });
        }

        // Update the property balance data
        const [result] = await connection.execute(
            `UPDATE tb_PropertyBalance 
            SET billamount = ?, paidamount = ?, balance = ? 
            WHERE house_no = ?`,
            [
                propertyBalanceData.billamount,
                propertyBalanceData.paidamount,
                propertyBalanceData.balance,
                house_no
            ]
        );

        res.status(200).json({ message: 'Property balance record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property balance record', error });
    } finally {
        connection.end();
    }
});

// Delete a property balance record
router.delete('/:house_no', async (req: Request, res: Response) => {
    const { house_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyBalance WHERE house_no = ?', [house_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property balance record not found' });
            return
        }
        // Delete the property balance record
        const [result] = await connection.execute('DELETE FROM tb_PropertyBalance WHERE house_no = ?', [house_no]);

        res.status(200).json({ message: 'Property balance record deleted successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property balance record', error });
        return
    } finally {
        connection.end();
    }
});

export default router;