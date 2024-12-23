// backend/src/routes/api/propertyOfficerRoutes.ts
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

// PropertyOfficer data interface
interface PropertyOfficerData {
    officer_no: string;
    officer_name: string;
    photo: string;
}

// Create a new property officer record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const propertyOfficerData: PropertyOfficerData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficer WHERE officer_no = ?', [propertyOfficerData.officer_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'Property officer record found' });
        }
        // Insert the new property officer data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_PropertyOfficer 
            (officer_no, officer_name, photo) 
            VALUES (?, ?, ?)`,
            [
                propertyOfficerData.officer_no,
                propertyOfficerData.officer_name,
                propertyOfficerData.photo,
            ]
        );

        res.status(201).json({ message: 'Property officer record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property officer record', error });
    } finally {
        connection.end();
    }
});

// Read all property officer records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficer');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property officer records', error });
    } finally {
        connection.end();
    }
});

// Read a single property officer record by officer_no
router.get('/:officer_no', async (req: Request, res: Response) => {
    const { officer_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficer WHERE officer_no = ?', [officer_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Property officer record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property officer record', error });
    } finally {
        connection.end();
    }
});

// Update a property officer record
router.put('/:officer_no', async (req: Request, res: Response): Promise<void> => {
    const { officer_no } = req.params;
    const propertyOfficerData: PropertyOfficerData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficer WHERE officer_no = ?', [propertyOfficerData.officer_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property officer record not found' });
        }

        // Update the property officer data
        const [result] = await connection.execute(
            `UPDATE tb_PropertyOfficer 
            SET officer_name = ?, photo = ? 
            WHERE officer_no = ?`,
            [
                propertyOfficerData.officer_name,
                propertyOfficerData.photo,
                officer_no
            ]
        );

        res.status(200).json({ message: 'Property officer record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property officer record', error });
    } finally {
        connection.end();
    }
});

// Delete a property officer record
router.delete('/:officer_no', async (req: Request, res: Response) => {
    const { officer_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficer WHERE officer_no = ?', [officer_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property officer record not found' });
        }
        
        // Delete the property officer record
        const [result] = await connection.execute('DELETE FROM tb_PropertyOfficer WHERE officer_no = ?', [officer_no]);

        res.status(200).json({ message: 'Property officer record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property officer record', error });
    } finally {
        connection.end();
    }
});

export default router;