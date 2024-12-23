// backend/src/routes/api/gradeFeesRoutes.ts
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

// GradeFees data interface
interface GradeFeesData {
    buss_type: string;
    grade: string;
    description: string;
    fees: number;
}

// Create a new GradeFees record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const gradeFeesData: GradeFeesData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_gradefees WHERE buss_type = ? AND grade = ?', 
        [gradeFeesData.buss_type, gradeFeesData.grade]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'GradeFees record already exists' });
            return;
        }

        // Insert the new GradeFees data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_gradefees (buss_type, grade, description, fees) 
            VALUES (?, ?, ?, ?)`,
            [
                gradeFeesData.buss_type,
                gradeFeesData.grade,
                gradeFeesData.description,
                gradeFeesData.fees,
            ]
        );

        res.status(201).json({ message: 'GradeFees record created successfully'});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating GradeFees record', error });
    } finally {
        connection.end();
    }
});

// Read all GradeFees records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_gradefees');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching GradeFees records', error });
    } finally {
        connection.end();
    }
});

// Read a single GradeFees record by buss_type and grade
router.get('/:buss_type/:grade', async (req: Request, res: Response) => {
    const { buss_type, grade } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {        
        const [result] = await connection.execute('SELECT * FROM tb_gradefees WHERE buss_type = ? AND grade = ?', [buss_type, grade]);

        if (Array.isArray(result) && result.length > 0) {
            res.json(result[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'GradeFees record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching GradeFees record', error });
    } finally {
        connection.end();
    }
});

// Update a GradeFees record
router.put('/:buss_type/:grade', async (req: Request, res: Response): Promise<void> => {
    const { buss_type, grade } = req.params;
    const gradeFeesData: GradeFeesData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_gradefees WHERE buss_type = ? AND grade = ?', [buss_type, grade]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'GradeFees record already exists' });
            return;
        }

        // Update the GradeFees data
        const [result] = await connection.execute(
            `UPDATE tb_gradefees SET description = ?, fees = ? 
            WHERE buss_type = ? AND grade = ?`,
            [
                gradeFeesData.description,
                gradeFeesData.fees,
                buss_type,
                grade
            ]
        );

        
        res.status(200).json({ message: 'GradeFees record updated successfully' });
       return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating GradeFees record', error });
    } finally {
        connection.end();
    }
});

// Delete a GradeFees record
router.delete('/:buss_type/:grade', async (req: Request, res: Response) => {
    const { buss_type, grade } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_gradefees WHERE buss_type = ? AND grade = ?', [buss_type, grade]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'GradeFees record does not exist' });
            return;
        }
        // Delete the GradeFees record
        const [result] = await connection.execute('DELETE FROM tb_gradefees WHERE buss_type = ? AND grade = ?', [buss_type, grade]);

        
        res.status(200).json({ message: 'GradeFees record deleted successfully' });
       return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting GradeFees record', error });
    } finally {
        connection.end();
    }
});

export default router;