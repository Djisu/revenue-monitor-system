// backend/src/routes/api/propertyOfficerBudgetRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import type { QueryResult } from 'pg';  // Import QueryResult as a type

const router = Router();

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

// PropertyOfficerBudget data interface
interface PropertyOfficerBudgetData {
    officer_no: string;
    officer_name: string;
    fiscal_year: number;
    annual_budget: number;
    monthly_budget: number;
    January_budget: number;
    January_Actual: number;
    February_budget: number;
    February_Actual: number;
    March_budget: number;
    March_Actual: number;
    April_budget: number;
    April_Actual: number;
    May_budget: number;
    May_Actual: number;
    June_budget: number;
    June_Actual: number;
    July_budget: number;
    July_Actual: number;
    August_budget: number;
    August_Actual: number;
    September_budget: number;
    September_Actual: number;
    October_budget: number;
    October_Actual: number;
    November_budget: number;
    November_Actual: number;
    December_budget: number;
    December_Actual: number;
    Actual_total: number;
    outstanding: number;
    electoral_area: string;
}

// Create a new property officer budget record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const propertyOfficerBudgetData: PropertyOfficerBudgetData = req.body;
    let client = null

    try {
        client = await pool.connect();

        const result: QueryResult = await client.query(
            'SELECT * FROM propertyofficerbudget WHERE officer_no = $1 AND fiscal_year = $2',
            [propertyOfficerBudgetData.officer_no, propertyOfficerBudgetData.fiscal_year]
        );

        if (result.rows.length > 0) {
            res.status(409).json({ message: 'Property officer budget record already exists' });
            return;
        }

        // Insert the new property officer budget data
        await client.query(
            `INSERT INTO propertyofficerbudget 
            (officer_no, officer_name, fiscal_year, annual_budget, monthly_budget, 
            January_budget, January_Actual, February_budget, February_Actual, 
            March_budget, March_Actual, April_budget, April_Actual, May_budget, 
            May_Actual, June_budget, June_Actual, July_budget, July_Actual, 
            August_budget, August_Actual, September_budget, September_Actual, 
            October_budget, October_Actual, November_budget, November_Actual, 
            December_budget, December_Actual, Actual_total, outstanding, electoral_area) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)`,
            [
                propertyOfficerBudgetData.officer_no,
                propertyOfficerBudgetData.officer_name,
                propertyOfficerBudgetData.fiscal_year,
                propertyOfficerBudgetData.annual_budget,
                propertyOfficerBudgetData.monthly_budget,
                propertyOfficerBudgetData.January_budget,
                propertyOfficerBudgetData.January_Actual,
                propertyOfficerBudgetData.February_budget,
                propertyOfficerBudgetData.February_Actual,
                propertyOfficerBudgetData.March_budget,
                propertyOfficerBudgetData.March_Actual,
                propertyOfficerBudgetData.April_budget,
                propertyOfficerBudgetData.April_Actual,
                propertyOfficerBudgetData.May_budget,
                propertyOfficerBudgetData.May_Actual,
                propertyOfficerBudgetData.June_budget,
                propertyOfficerBudgetData.June_Actual,
                propertyOfficerBudgetData.July_budget,
                propertyOfficerBudgetData.July_Actual,
                propertyOfficerBudgetData.August_budget,
                propertyOfficerBudgetData.August_Actual,
                propertyOfficerBudgetData.September_budget,
                propertyOfficerBudgetData.September_Actual,
                propertyOfficerBudgetData.October_budget,
                propertyOfficerBudgetData.October_Actual,
                propertyOfficerBudgetData.November_budget,
                propertyOfficerBudgetData.November_Actual,
                propertyOfficerBudgetData.December_budget,
                propertyOfficerBudgetData.December_Actual,
                propertyOfficerBudgetData.Actual_total,
                propertyOfficerBudgetData.outstanding,
                propertyOfficerBudgetData.electoral_area,
            ]
        );

        res.status(201).json({ message: 'Property officer budget record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property officer budget record', error });
    } finally {
       if (client) {
            client.release(); // Release the client back to the pool if it was acquired
        }
    }
});

// Read all property officer budget records
router.get('/', async (req: Request, res: Response) => {
    let client = null

    try {
        client = await pool.connect();
        const result: QueryResult = await client.query('SELECT * FROM propertyofficerbudget');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property officer budget records', error });
    } finally {
       if (client) {
            client.release(); // Release the client back to the pool if it was acquired
        }
    }
});

// Read a single property officer budget record by officer_no
router.get('/:officer_no/:fiscal_year', async (req: Request, res: Response) => {
    const { officer_no, fiscal_year } = req.params;
    let client = null

    try {
        client = await pool.connect();
        const result: QueryResult = await client.query(
            'SELECT * FROM propertyofficerbudget WHERE officer_no = $1 AND fiscal_year = $2',
            [officer_no, fiscal_year]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Property officer budget record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property officer budget record', error });
    } finally {
       if (client) {
            client.release(); // Release the client back to the pool if it was acquired
        }
    }
});

// Update a property officer budget record
router.put('/:officer_no/:fiscal_year', async (req: Request, res: Response): Promise<void> => {
    const { officer_no, fiscal_year } = req.params;
    const propertyOfficerBudgetData: PropertyOfficerBudgetData = req.body;
    let client = null;

    try {
        client = await pool.connect();

        const result: QueryResult = await client.query(
            'SELECT * FROM propertyofficerbudget WHERE officer_no = $1 AND fiscal_year = $2',
            [propertyOfficerBudgetData.officer_no, propertyOfficerBudgetData.fiscal_year]
        );

        if (result.rows.length > 0) {
            res.status(409).json({ message: 'Property officer budget record already exists' });
            return;
        }

        // Update the property officer budget data
        await client.query(
            `UPDATE propertyofficerbudget 
            SET officer_name = $1, fiscal_year = $2, annual_budget = $3, monthly_budget = $4, 
            January_budget = $5, January_Actual = $6, February_budget = $7, February_Actual = $8, 
            March_budget = $9, March_Actual = $10, April_budget = $11, April_Actual = $12, 
            May_budget = $13, May_Actual = $14, June_budget = $15, June_Actual = $16, 
            July_budget = $17, July_Actual = $18, August_budget = $19, August_Actual = $20, 
            September_budget = $21, September_Actual = $22, October_budget = $23, 
            October_Actual = $24, November_budget = $25, November_Actual = $26, 
            December_budget = $27, December_Actual = $28, Actual_total = $29, 
            outstanding = $30, electoral_area = $31 
            WHERE officer_no = $32`,
            [
                propertyOfficerBudgetData.officer_name,
                propertyOfficerBudgetData.fiscal_year,
                propertyOfficerBudgetData.annual_budget,
                propertyOfficerBudgetData.monthly_budget,
                propertyOfficerBudgetData.January_budget,
                propertyOfficerBudgetData.January_Actual,
                propertyOfficerBudgetData.February_budget,
                propertyOfficerBudgetData.February_Actual,
                propertyOfficerBudgetData.March_budget,
                propertyOfficerBudgetData.March_Actual,
                propertyOfficerBudgetData.April_budget,
                propertyOfficerBudgetData.April_Actual,
                propertyOfficerBudgetData.May_budget,
                propertyOfficerBudgetData.May_Actual,
                propertyOfficerBudgetData.June_budget,
                propertyOfficerBudgetData.June_Actual,
                propertyOfficerBudgetData.July_budget,
                propertyOfficerBudgetData.July_Actual,
                propertyOfficerBudgetData.August_budget,
                propertyOfficerBudgetData.August_Actual,
                propertyOfficerBudgetData.September_budget,
                propertyOfficerBudgetData.September_Actual,
                propertyOfficerBudgetData.October_budget,
                propertyOfficerBudgetData.October_Actual,
                propertyOfficerBudgetData.November_budget,
                propertyOfficerBudgetData.November_Actual,
                propertyOfficerBudgetData.December_budget,
                propertyOfficerBudgetData.December_Actual,
                propertyOfficerBudgetData.Actual_total,
                propertyOfficerBudgetData.outstanding,
                propertyOfficerBudgetData.electoral_area,
                officer_no
            ]
        );

        res.status(200).json({ message: 'Property officer budget record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property officer budget record', error });
    } finally {
       if (client) {
            client.release(); // Release the client back to the pool if it was acquired
        }
    }
});

// Delete a property officer budget record
router.delete('/:officer_no/:fiscal_year', async (req: Request, res: Response) => {
    const { officer_no, fiscal_year } = req.params;
    const client = await pool.connect();

    try {
        await client.query(
            'SELECT * FROM propertyofficerbudget WHERE officer_no = $1 AND fiscal_year = $2',
            [officer_no, fiscal_year]
        );

        res.status(200).json({ message: 'Property officer budget record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property officer budget record', error });
    } finally {
       if (client) {
            client.release(); // Release the client back to the pool if it was acquired
        }
    }
});

export default router;


