// backend/src/routes/api/offBudgetAssessmentRoutes.ts
import express, { Request, Response, Router } from 'express';
import * as dotenv from 'dotenv';

import pkg from 'pg';
import { createClient } from '../../db.js';
const { Pool } = pkg;

const router = Router();

// Load environment variables from .env file
dotenv.config();

const nodeEnv = process.env.NODE_ENV;

let frontendUrl = "" // Set frontend URL based on node environment

if (nodeEnv === 'development'){
    frontendUrl = "http://localhost:5173";
} else if (nodeEnv === 'production'){
    frontendUrl = "https://revenue-monitor-system.onrender.com";
} else if (nodeEnv === 'test'){
    console.log('Just testing')
} else {
    console.log('Invalid node environment variable') //.slice()
}

// PostgreSQL connection configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'revmonitor',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

interface FiscalYear {
    fiscal_year: number;
}

interface Officer {
    officer_no: string;
    officer_name: string;
}

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

interface OfficerBudget {
    januaryAmount: number;
    februaryAmount: number;
    marchAmount: number;
    aprilAmount: number;
    mayAmount: number;
    juneAmount: number;
    julyAmount: number;
    augustAmount: number;
    septemberAmount: number;
    octoberAmount: number;
    novemberAmount: number;
    decemberAmount: number;
    totalValue: number;
}

interface AssessmentData {
    month: string;    // Assuming month is a string like 'January'
    budget: number;   // Assuming budget is a number (decimal)
    amount: number;   // Assuming amount is a number (decimal)
    fiscalYear: number; // Assuming fiscal year is a number (integer)
    assessmentby: string; // Assuming assessmentby is a string
}

// Experimental code to get fiscal years
router.get('/fiscalYears', async (req: Request, res: Response) => {
    try {
        const fiscalYears = await getFiscalYears();
        res.json(fiscalYears);
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

router.get('/officers', async (req: Request, res: Response) => {
    try {
        const officers = await getOfficers();
        res.json(officers);
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

router.get('/officerbudget', async (req: Request, res: Response) => {
    try {
        const { fiscalYear, officerNo } = req.query as { fiscalYear: string; officerNo: string };

        const officerBudget = await getOfficerBudget(Number(fiscalYear), officerNo);

        res.json(officerBudget);
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

router.delete('/budgetAssess', async (req: Request, res: Response) => {
    try {
        await deleteBudgetAssess();
        res.send('Budget assess deleted');
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

router.post('/budgetAssess', async (req: Request, res: Response) => {
    try {
        const data = req.body as AssessmentData[];
        await insertBudgetAssess(data);
        res.send('Budget assess inserted');
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

// Create a new OffBudgetAssessment record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const assessmentData: OffBudgetAssessmentData = req.body;

    const client = createClient();

    try {
       
        // Insert the new OffBudgetAssessment data
        const result = await client.query(
            `INSERT INTO offbudgetassessment 
            (officer_name, january_amount, january_budget, february_amount, february_budget, 
            march_amount, march_budget, april_amount, april_budget, may_amount, may_budget, 
            june_amount, june_budget, july_amount, july_budget, august_amount, august_budget, 
            september_amount, september_budget, october_amount, october_budget, 
            november_amount, november_budget, december_amount, december_budget) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)`,
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

        res.status(201).json({ message: 'OffBudgetAssessment record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating OffBudgetAssessment record', error });
    } finally {
        if (client) {
            client.end();
        }
    }
});

// Read all OffBudgetAssessment records
router.get('/', async (req: Request, res: Response) => {
    const client = createClient();

    try {
       
        const result = await client.query('SELECT * FROM offbudgetassessment');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching OffBudgetAssessment records', error });
    } finally {
        if (client) {
            client.end();
        }
    }
});

// Read a single OffBudgetAssessment record by officer_name
router.get('/:officer_name', async (req: Request, res: Response) => {
    const { officer_name } = req.params;

    const client = createClient();

    try {
       
        const result = await client.query('SELECT * FROM offbudgetassessment WHERE officer_name = $1', [officer_name]);

        if (Array.isArray(result.rows) && result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'OffBudgetAssessment record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching OffBudgetAssessment record', error });
    } finally {
        if (client) {
            client.end();
        }
    }
});

// Read a single OffBudgetAssessment record by officer_name
router.get('/:officer_no/:fiscalYear', async (req: Request, res: Response) => {
    const { officer_no, fiscalYear } = req.params;

    const client = createClient();

    try {
       
        const result = await client.query('SELECT * FROM offbudgetassessment WHERE officer_name = $1', [officer_no]);

        if (Array.isArray(result.rows) && result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'OffBudgetAssessment record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching OffBudgetAssessment record', error });
    } finally {
        if (client) {
            client.end();
        }
    }
});

// Update an OffBudgetAssessment record
router.put('/:officer_name', async (req: Request, res: Response): Promise<void> => {
    const { officer_name } = req.params;
    const assessmentData: OffBudgetAssessmentData = req.body;

    const client = createClient();

    try {
       
        // Update the OffBudgetAssessment data
        await client.query(
            `UPDATE offbudgetassessment SET 
            january_amount = $1, january_budget = $2, february_amount = $3, february_budget = $4, 
            march_amount = $5, march_budget = $6, april_amount = $7, april_budget = $8, 
            may_amount = $9, may_budget = $10, june_amount = $11, june_budget = $12, 
            july_amount = $13, july_budget = $14, august_amount = $15, august_budget = $16, 
            september_amount = $17, september_budget = $18, october_amount = $19, october_budget = $20, 
            november_amount = $21, november_budget = $22, december_amount = $23, december_budget = $24 
            WHERE officer_name = $25`,
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating OffBudgetAssessment record', error });
    } finally {
        if (client) {
            client.end();
        }
    }
});

// Delete an OffBudgetAssessment record
router.delete('/:officer_name', async (req: Request, res: Response) => {
    const { officer_name } = req.params;

    const client = createClient();

    try {
       
        // Delete the OffBudgetAssessment record
        await client.query('DELETE FROM offbudgetassessment WHERE officer_name = $1', [officer_name]);
        res.status(200).json({ message: 'OffBudgetAssessment record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting OffBudgetAssessment record', error });
    } finally {
        if (client) {
            client.end();
        }
    }
});

// Fetch fiscal years from tb_officerbudget
async function getFiscalYears(): Promise<number[]> {
    const client = createClient();

    try {
       
        const result = await client.query('SELECT DISTINCT fiscal_year FROM tb_officerbudget ORDER BY fiscal_year');

        return result.rows.map(row => row.fiscal_year);
    } catch (err) {
        console.error('Error fetching fiscal years:', err);
        throw err;
    } finally {
        if (client) {
            client.end();
        }
    }
}

// Fetch all officers from tb_officer
async function getOfficers(): Promise<{ officer_no: string; officer_name: string }[]> {
    const client = createClient();
    try {
       
        const result = await client.query('SELECT * FROM tb_officer');

        return result.rows;
    } catch (err) {
        console.error('Error fetching officers:', err);
        throw err;
    } finally {
        if (client) {
            client.end();
        }
    }
}

// Get officer budget from tb_buspayments
async function getOfficerBudget(fiscalYear: number, officerNo: string): Promise<OfficerBudget[]> {
    const client = createClient();

    try {
       
        const result = await client.query(
            `SELECT 
              SUM(CASE WHEN monthpaid IN ('1', 'January') THEN amount ELSE 0 END) AS januaryAmount,
              SUM(CASE WHEN monthpaid IN ('2', 'February') THEN amount ELSE 0 END) AS februaryAmount,
              SUM(CASE WHEN monthpaid IN ('3', 'March') THEN amount ELSE 0 END) AS marchAmount,
              SUM(CASE WHEN monthpaid IN ('4', 'April') THEN amount ELSE 0 END) AS aprilAmount,
              SUM(CASE WHEN monthpaid IN ('5', 'May') THEN amount ELSE 0 END) AS mayAmount,
              SUM(CASE WHEN monthpaid IN ('6', 'June') THEN amount ELSE 0 END) AS juneAmount,
              SUM(CASE WHEN monthpaid IN ('7', 'July') THEN amount ELSE 0 END) AS julyAmount,
              SUM(CASE WHEN monthpaid IN ('8', 'August') THEN amount ELSE 0 END) AS augustAmount,
              SUM(CASE WHEN monthpaid IN ('9', 'September') THEN amount ELSE 0 END) AS septemberAmount,
              SUM(CASE WHEN monthpaid IN ('10', 'October') THEN amount ELSE 0 END) AS octoberAmount,
              SUM(CASE WHEN monthpaid IN ('11', 'November') THEN amount ELSE 0 END) AS novemberAmount,
              SUM(CASE WHEN monthpaid IN ('12', 'December') THEN amount ELSE 0 END) AS decemberAmount,
              SUM(amount) AS totalValue
            FROM tb_buspayments
            WHERE fiscal_year = $1 AND officer_no = $2
            GROUP BY officer_no, fiscal_year`,
            [fiscalYear, officerNo]
        );

        return result.rows;
    } catch (err) {
        console.error('Error fetching officer budget:', err);
        throw err;
    } finally {
        if (client) {
            client.end();
        }
    }
}

// Delete all records from tb_BudgetAssess
async function deleteBudgetAssess() {
    const client = createClient();

    try {
       
        await client.query('DELETE FROM tb_budgetassess');
    } catch (err) {
        console.error('Error deleting budget assess:', err);
        throw err;
    } finally {
        if (client) {
            client.end();
        }
    }
}

// // Insert records into tb_BudgetAssess
async function insertBudgetAssess(data: AssessmentData[]) {
    const client = createClient();

    try {
       
        for (let item of data) {
            await client.query(
                `INSERT INTO tb_budgetassess (month, budget, amount, variance, fiscalyear, assessmentby) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    item.month,
                    item.budget,
                    item.amount,
                    item.budget - item.amount, // Calculate variance here
                    item.fiscalYear,
                    item.assessmentby
                ]
            );
        }
    } catch (err) {
        console.error('Error inserting budget assess:', err);
        throw err;
    } finally {
        if (client) {
            client.end();
        }
    }
}

export default router;







