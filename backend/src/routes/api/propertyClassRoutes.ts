// backend/src/routes/api/propertyClassRoutes.ts
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

// PropertyClass data interface
interface PropertyClassData {
    property_class: string;
    rate: number;
}

// Create a new property class record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    console.log('in create property class', req.body)

    const propertyClassData: PropertyClassData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_propertyclass WHERE property_class = ?', [propertyClassData.property_class]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Property class record already exists' });
            return
        }

        // Insert the new property class data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_propertyclass 
            (property_class, rate) 
            VALUES (?, ?)`,
            [
                propertyClassData.property_class,
                propertyClassData.rate,
            ]
        );

        //res.status(201).json({  success: true, message: 'Electoral area record created successfully' });
        res.status(201).json({ success: true, message: propertyClassData.property_class });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({   success: false, message: 'Error creating property class record', error });
    } finally {
        connection.end();
    }
});

// Read all property class records
router.get('/all', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_propertyclass');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({  success: false, message: 'Error fetching property class records', error });
    } finally {
        connection.end();
    }
});

// Read a single property class record by property_class
router.get('/:property_class', async (req: Request, res: Response) => {
    const { property_class } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_propertyclass WHERE property_class = ?', [property_class]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(200).json({ success: true, data: rows[0] });
        } else {
            res.status(404).json({  success: false, message: 'Electoral area record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching property class record', error });
    } finally {
        connection.end();
    }
});

// Update a property class record
router.put('/:property_class', async (req: Request, res: Response): Promise<void> => {
    const { property_class } = req.params;
    const propertyClassData: PropertyClassData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_propertyclass WHERE property_class = ?', [property_class]);

        if (Array.isArray(rows) && rows.length === 0) {
            res.status(404).json({ success: false, message: 'Property class record not found' });
            return;
        }

        // Update the property class data
        const [result] = await connection.execute(
            `UPDATE tb_propertyclass 
            SET rate = ? 
            WHERE property_class = ?`,
            [
                propertyClassData.rate,
                property_class
            ]
        );

        res.status(200).json({  success: true, message: 'Property class record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating property class record', error });
    } finally {
        connection.end();
    }
});

// Delete a property class record
router.delete('/delete/:property_class', async (req: Request, res: Response) => {
    console.log('in property class delete', req.params)
    const { property_class } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_propertyclass WHERE property_class = ?', [property_class]);

        if (Array.isArray(rows) && rows.length === 0) {
            res.status(404).json({ success: false, message: 'Property class record not found' });
            return;
        }

        // Delete the property class record
        const [result] = await connection.execute('DELETE FROM tb_propertyclass WHERE property_class = ?', [property_class]);

        res.status(200).json({ message: 'Property class record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: true, message: 'Error deleting property class record', error });
    } finally {
        connection.end();
    }
});

export default router;