// backend/src/routes/api/offBudgetAssessmentRoutes.ts
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

// OffBudgetAssessment data interface
interface OffBudgetAssessmentData {
    officer_name: string;
    JanuaryAmount: number;
    JanuaryBudget: number;
    FebruaryAmount: number;
    FebruaryBudget: number;
    MarchAmount: number;
    MarchBudget: number;
    AprilAmount: number;
    AprilBudget: number;
    MayAmount: number;
    MayBudget: number;
    JuneAmount: number;
    JuneBudget: number;
    JulyAmount: number;
    JulyBudget: number;
    AugustAmount: number;
    AugustBudget: number;
    SeptemberAmount: number;
    SeptemberBudget: number;
    OctoberAmount: number;
    OctoberBudget: number;
    NovemberAmount: number;
    NovemberBudget: number;
    DecemberAmount: number;
    DecemberBudget: number;
}

// Create a new OffBudgetAssessment record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const assessmentData: OffBudgetAssessmentData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        // Insert the new OffBudgetAssessment data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_OffBudgetAssessment 
            (officer_name, JanuaryAmount, JanuaryBudget, FebruaryAmount, FebruaryBudget, 
            MarchAmount, MarchBudget, AprilAmount, AprilBudget, MayAmount, MayBudget, 
            JuneAmount, JuneBudget, JulyAmount, JulyBudget, AugustAmount, AugustBudget, 
            SeptemberAmount, SeptemberBudget, OctoberAmount, OctoberBudget, 
            NovemberAmount, NovemberBudget, DecemberAmount, DecemberBudget) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                assessmentData.officer_name,
                assessmentData.JanuaryAmount,
                assessmentData.JanuaryBudget,
                assessmentData.FebruaryAmount,
                assessmentData.FebruaryBudget,
                assessmentData.MarchAmount,
                assessmentData.MarchBudget,
                assessmentData.AprilAmount,
                assessmentData.AprilBudget,
                assessmentData.MayAmount,
                assessmentData.MayBudget,
                assessmentData.JuneAmount,
                assessmentData.JuneBudget,
                assessmentData.JulyAmount,
                assessmentData.JulyBudget,
                assessmentData.AugustAmount,
                assessmentData.AugustBudget,
                assessmentData.SeptemberAmount,
                assessmentData.SeptemberBudget,
                assessmentData.OctoberAmount,
                assessmentData.OctoberBudget,
                assessmentData.NovemberAmount,
                assessmentData.NovemberBudget,
                assessmentData.DecemberAmount,
                assessmentData.DecemberBudget,
            ]
        );

        res.status(201).json({ message: 'OffBudgetAssessment record created successfully'});
        return
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating OffBudgetAssessment record', error });
    } finally {
        connection.end();
    }
});

// Read all OffBudgetAssessment records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_OffBudgetAssessment');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching OffBudgetAssessment records', error });
    } finally {
        connection.end();
    }
});

// Read a single OffBudgetAssessment record by officer_name
router.get('/:officer_name', async (req: Request, res: Response) => {
    const { officer_name } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_OffBudgetAssessment WHERE officer_name = ?', [officer_name]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'OffBudgetAssessment record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching OffBudgetAssessment record', error });
    } finally {
        connection.end();
    }
});

// Update an OffBudgetAssessment record
router.put('/:officer_name', async (req: Request, res: Response): Promise<void> => {
    const { officer_name } = req.params;
    const assessmentData: OffBudgetAssessmentData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        // Update the OffBudgetAssessment data
        const [result] = await connection.execute(
            `UPDATE tb_OffBudgetAssessment SET 
            JanuaryAmount = ?, JanuaryBudget = ?, FebruaryAmount = ?, FebruaryBudget = ?, 
            MarchAmount = ?, MarchBudget = ?, AprilAmount = ?, AprilBudget = ?, 
            MayAmount = ?, MayBudget = ?, JuneAmount = ?, JuneBudget = ?, 
            JulyAmount = ?, JulyBudget = ?, AugustAmount = ?, AugustBudget = ?, 
            SeptemberAmount = ?, SeptemberBudget = ?, OctoberAmount = ?, OctoberBudget = ?, 
            NovemberAmount = ?, NovemberBudget = ?, DecemberAmount = ?, DecemberBudget = ? 
            WHERE officer_name = ?`,
            [
                assessmentData.JanuaryAmount,
                assessmentData.JanuaryBudget,
                assessmentData.FebruaryAmount,
                assessmentData.FebruaryBudget,
                assessmentData.MarchAmount,
                assessmentData.MarchBudget,
                assessmentData.AprilAmount,
                assessmentData.AprilBudget,
                assessmentData.MayAmount,
                assessmentData.MayBudget,
                assessmentData.JuneAmount,
                assessmentData.JuneBudget,
                assessmentData.JulyAmount,
                assessmentData.JulyBudget,
                assessmentData.AugustAmount,
                assessmentData.AugustBudget,
                assessmentData.SeptemberAmount,
                assessmentData.SeptemberBudget,
                assessmentData.OctoberAmount,
                assessmentData.OctoberBudget,
                assessmentData.NovemberAmount,
                assessmentData.NovemberBudget,
                assessmentData.DecemberAmount,
                assessmentData.DecemberBudget,
                officer_name
            ]
        );
       
        res.status(200).json({ message: 'OffBudgetAssessment record updated successfully' });
       return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating OffBudgetAssessment record', error });
    } finally {
        connection.end();
    }
});

// Delete an OffBudgetAssessment record
router.delete('/:officer_name', async (req: Request, res: Response) => {
    const { officer_name } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        // Delete the OffBudgetAssessment record
        const [result] = await connection.execute('DELETE FROM tb_OffBudgetAssessment WHERE officer_name = ?', [officer_name]);       
        res.status(200).json({ message: 'OffBudgetAssessment record deleted successfully' });
       return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting OffBudgetAssessment record', error });
    } finally {
        connection.end();
    }
});

export default router;