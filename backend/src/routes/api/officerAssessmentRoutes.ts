// backend/src/routes/api/officerAssessmentRoutes.ts
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

// OfficerAssessment data interface
interface OfficerAssessmentData {
    officer_no: string;
    officer_name: string;
    Noofclientsserved: number;
    valueofbillsdistributed: number;
    bus_year: number;
    JanuaryAmount: number;
    FebruaryAmount: number;
    MarchAmount: number;
    AprilAmount: number;
    MayAmount: number;
    JuneAmount: number;
    JulyAmount: number;
    AugustAmount: number;
    SeptemberAmount: number;
    OctoberAmount: number;
    NovemberAmount: number;
    DecemberAmount: number;
    totalReceiptTodate: number;
    balance: number;
    remarks: string;
}

// Create a new officer assessment record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const officerAssessmentData: OfficerAssessmentData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', 
        [officerAssessmentData.officer_no, officerAssessmentData.bus_year]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Officer assessment record already exists' });
            return
        }
        // Insert the new officer assessment data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_officerAssessment 
            (officer_no, officer_name, Noofclientsserved, valueofbillsdistributed, bus_year, 
            JanuaryAmount, FebruaryAmount, MarchAmount, AprilAmount, MayAmount, 
            JuneAmount, JulyAmount, AugustAmount, SeptemberAmount, OctoberAmount, 
            NovemberAmount, DecemberAmount, totalReceiptTodate, balance, remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                officerAssessmentData.officer_no,
                officerAssessmentData.officer_name,
                officerAssessmentData.Noofclientsserved,
                officerAssessmentData.valueofbillsdistributed,
                officerAssessmentData.bus_year,
                officerAssessmentData.JanuaryAmount,
                officerAssessmentData.FebruaryAmount,
                officerAssessmentData.MarchAmount,
                officerAssessmentData.AprilAmount,
                officerAssessmentData.MayAmount,
                officerAssessmentData.JuneAmount,
                officerAssessmentData.JulyAmount,
                officerAssessmentData.AugustAmount,
                officerAssessmentData.SeptemberAmount,
                officerAssessmentData.OctoberAmount,
                officerAssessmentData.NovemberAmount,
                officerAssessmentData.DecemberAmount,
                officerAssessmentData.totalReceiptTodate,
                officerAssessmentData.balance,
                officerAssessmentData.remarks,
            ]
        );

        res.status(201).json({ message: 'Officer assessment record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating officer assessment record', error });
    } finally {
        connection.end();
    }
});

// Read all officer assessment records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment records', error });
    } finally {
        connection.end();
    }
});

// Read a single officer assessment record by officer_no
router.get('/:officer_no/:bus_year', async (req: Request, res: Response) => {
    const { officer_no, bus_year } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', 
        [officer_no, bus_year]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Officer assessment record not found' });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment record', error });
    } finally {
        connection.end();
    }
});

// Update an officer assessment record
router.put('/:officer_no/:bus_year', async (req: Request, res: Response): Promise<void> => {
    const { officer_no, bus_year } = req.params;
    const officerAssessmentData: OfficerAssessmentData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', 
        [officer_no, bus_year]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Officer assessment record not found' });
            return;
        }
        // Update the officer assessment data
        const [result] = await connection.execute(
            `UPDATE tb_officerAssessment SET 
            officer_name = ?, Noofclientsserved = ?, valueofbillsdistributed = ?, bus_year = ?, 
            JanuaryAmount = ?, FebruaryAmount = ?, MarchAmount = ?, AprilAmount = ?, 
            MayAmount = ?, JuneAmount = ?, JulyAmount = ?, AugustAmount = ?, 
            SeptemberAmount = ?, OctoberAmount = ?, NovemberAmount = ?, 
            DecemberAmount = ?, totalReceiptTodate = ?, balance = ?, remarks = ? 
            WHERE officer_no = ?`,
            [
                officerAssessmentData.officer_name,
                officerAssessmentData.Noofclientsserved,
                officerAssessmentData.valueofbillsdistributed,
                officerAssessmentData.bus_year,
                officerAssessmentData.JanuaryAmount,
                officerAssessmentData.FebruaryAmount,
                officerAssessmentData.MarchAmount,
                officerAssessmentData.AprilAmount,
                officerAssessmentData.MayAmount,
                officerAssessmentData.JuneAmount,
                officerAssessmentData.JulyAmount,
                officerAssessmentData.AugustAmount,
                officerAssessmentData.SeptemberAmount,
                officerAssessmentData.OctoberAmount,
                officerAssessmentData.NovemberAmount,
                officerAssessmentData.DecemberAmount,
                officerAssessmentData.totalReceiptTodate,
                officerAssessmentData.balance,
                officerAssessmentData.remarks,
                officer_no
            ]
        );

        res.status(200).json({ message: 'Officer assessment record updated successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating officer assessment record', error });
    } finally {
        connection.end();
    }
});

// Delete an officer assessment record
router.delete('/:officer_no/:bus_year', async (req: Request, res: Response) => {
    const { officer_no, bus_year } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', 
        [officer_no, bus_year]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Officer assessment record does not exists' });
            return
        }
        // Delete the officer assessment record
        const [result] = await connection.execute('DELETE FROM tb_officerAssessment WHERE officer_no = ?', [officer_no]);
       
        res.status(200).json({ message: 'Officer assessment record deleted successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer assessment record', error });
        return
    } finally {
        connection.end();
    }
});

export default router;