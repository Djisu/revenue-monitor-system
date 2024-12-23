// backend/src/routes/api/businessTypeRoutes.ts
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

// BusinessType data interface
interface BusinessTypeData {
    Business_Type: string;
}

// Create a new BusinessType record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const businessTypeData: BusinessTypeData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', 
        [businessTypeData.Business_Type]
        );
        if (Array.isArray(rows) && rows.length > 0) {          
            res.status(409).json({ message: 'Business Type record already exists.' });
            return;
        }

        // Insert the new BusinessType data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_BusinessType (Business_Type) 
            VALUES (?)`,
            [businessTypeData.Business_Type]
        );

        res.status(201).json({ message: 'BusinessType record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BusinessType record', error });
    } finally {
        connection.end();
    }
});

// Read all BusinessType records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BusinessType');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusinessType records', error });
    } finally {
        connection.end();
    }
});

// Read a single BusinessType record by Business_Type
router.get('/:Business_Type', async (req: Request, res: Response) => {
    const { Business_Type } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', [Business_Type]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'BusinessType record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusinessType record', error });
    } finally {
        connection.end();
    }
});

// Update a BusinessType record
router.put('/:Business_Type', async (req: Request, res: Response): Promise<void> => {
    const { Business_Type } = req.params;
    const businessTypeData: BusinessTypeData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', 
        [businessTypeData.Business_Type]
        );
        if (Array.isArray(rows) && rows.length > 0) {          
            res.status(409).json({ message: 'Business Type record already exists.' });
            return;
        }

        // Update the BusinessType data
        const [result] = await connection.execute(
            `UPDATE tb_BusinessType SET Business_Type = ? 
            WHERE Business_Type = ?`,
            [
                businessTypeData.Business_Type,
                Business_Type
            ]
        );

      
        res.status(200).json({ message: 'BusinessType record updated successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BusinessType record', error });
    } finally {
        connection.end();
    }
});

// Delete a BusinessType record
router.delete('/:Business_Type', async (req: Request, res: Response) => {
    const { Business_Type } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', 
        [Business_Type]
        );
        if (Array.isArray(rows) && rows.length > 0) {          
            res.status(409).json({ message: 'Business Type record already exists.' });
            return;
        }

        // Delete the BusinessType record
        const [result] = await connection.execute('DELETE FROM tb_BusinessType WHERE Business_Type = ?', [Business_Type]);
       
        res.status(200).json({ message: 'BusinessType record deleted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BusinessType record', error });
    } finally {
        connection.end();
    }
});

export default router;