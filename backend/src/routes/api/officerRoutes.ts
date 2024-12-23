// backend/src/routes/api/officerRoutes.ts
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

// Officer data interface
interface OfficerData {
    officer_no: string;
    officer_name: string;
    photo: string; // Assuming photo is a URL or base64 string
}

// Create a new officer record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const officerData: OfficerData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officerData.officer_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Officer record already exists' });
            return;
        }

        // Insert the new officer data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_officer (officer_no, officer_name, photo) 
            VALUES (?, ?, ?)`,
            [
                officerData.officer_no,
                officerData.officer_name,
                officerData.photo,
            ]
        );

        res.status(201).json({ message: 'Officer record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating officer record', error });
    } finally {
        connection.end();
    }
});

// Read all officer records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer records', error });
    } finally {
        connection.end();
    }
});

// Read a single officer record by officer_no
router.get('/:officer_no', async (req: Request, res: Response) => {
    const { officer_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officer_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Officer record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer record', error });
    } finally {
        connection.end();
    }
});

// Update an officer record
router.put('/:officer_no', async (req: Request, res: Response): Promise<void> => {
    const { officer_no } = req.params;
    const officerData: OfficerData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officerData.officer_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Officer record does not exist' });
            return;
        }
        // Update the officer data
        const [result] = await connection.execute(
            `UPDATE tb_officer SET officer_name = ?, photo = ? 
            WHERE officer_no = ?`,
            [
                officerData.officer_name,
                officerData.photo,
                officer_no
            ]
        );
      
        res.status(200).json({ message: 'Officer record updated successfully' });
       return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating officer record', error });
    } finally {
        connection.end();
    }
});

// Delete an officer record
router.delete('/:officer_no', async (req: Request, res: Response) => {
    const { officer_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officer_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Officer record does not exist' });
            return;
        }
        // Delete the officer record
        const [result] = await connection.execute('DELETE FROM tb_officer WHERE officer_no = ?', [officer_no]);
      
      res.status(200).json({ message: 'Officer record deleted successfully' });
      return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer record', error });
    } finally {
        connection.end();
    }
});

export default router;