//import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
// import PDFDocument from 'pdfkit';
// import nodemailer, { SendMailOptions } from 'nodemailer';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// import { QueryResult, PoolClient } from 'pg';

import pkg from 'pg';
const { Pool } = pkg;

export interface AddBudgetRequest {
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

interface UpdateBudgetRequest {
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

// PostgreSQL connection pool
const emailPassword = process.env.EMAIL_PASSWORD;
const appPassword = process.env.APP_PASSWORD;
const emailUser = process.env.EMAIL_USER;
const port = process.env.PORT || 3001;

// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});


const router = Router();

// Load environment variables from .env file
dotenv.config();

router.get('/officerbudget/:officer_no/:fiscal_year/:electoral_area', async (req: Request, res: Response) => {
    const {officer_no, fiscal_year, electoral_area} = req.params;

    try {
        const result = await pool.query(`SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2 AND electoral_area = $3`, 
             [officer_no, fiscal_year, electoral_area]
        );

        // Check if there are any rows returned
        if (result.rows.length > 0) {
            return res.status(200).json({ exists: true, data: result.rows });
        } else {
            return res.status(200).json({ exists: false });
        }

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ exists: false, message: 'Error fetching officer budget' });

    }
});

// Function to populate electoral areas based on officer number
router.get('/electoralArea/:officerNo', async (req: Request, res: Response) => {
    const {officerNo} = req.params;

    try {
        const result = await pool.query(`
            SELECT electoralarea FROM collectorElectoralArea 
            WHERE officer_no = $1
            ORDER BY officer_no`, [officerNo]);

        res.json(result.rows);
    } catch (error: any) {
        console.error(error);
        res.status(500).send('Error fetching electoral areas');
    }
});

// Function to get the total number of businesses for a given electoral area
router.get('/businessCount/:electoralArea', async (req: Request, res: Response) => {
    const {electoralArea} = req.params;

    try {
        const result = await pool.query(`
            SELECT COUNT(buss_no) AS total FROM business 
            WHERE electoral_area = $1`, [electoralArea]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching business count');
    }
});

// Function to add a budget record
router.post('/addBudget', async (req: Request<{}, {}, AddBudgetRequest>, res: Response) => {
    const { officer_no, fiscal_year, electoral_area } = req.body;

    try {       
        // Find officer's electoral areas
        const electoralArea = await pool.query(`
            SELECT electoralarea FROM collectorElectoralArea 
            WHERE officer_no = $1
            ORDER BY officer_no`, [officer_no]);

        if (electoralArea.rows.length === 0) {
            res.status(404).send('Officer not found');
            return;
        }

        // Find Annual Budget
        const annual_budget = await pool.query(`
            SELECT SUM(current_rate) AS totsum FROM business 
            WHERE officer_no = $1`, [officer_no]);

        if (annual_budget.rows.length === 0) {
            res.status(404).send('Annual budget not found');
            return;
        }

        const monthly_budget = parseFloat(annual_budget.rows[0].totsum) / 12;

        // Check if record exists
        const checkRecord = await pool.query(`
            SELECT * FROM officerbudget 
            WHERE officer_no = $1 AND fiscal_year = $2`, [officer_no, fiscal_year]);

        if (checkRecord.rowCount === null) {
            res.status(500).send('Internal server error: rowCount is null');
            return;
        }

        if (checkRecord.rowCount === 0) {
            res.status(404).send('Record not found');
            return;
        }

        // Find the existing record
        const businesses = await pool.query(`
            SELECT * FROM business 
            WHERE officer_no = $1`, [officer_no]);

        if (businesses.rows.length === 0) {
            res.status(404).send('Businesses not found');
            return;
        }

        if (checkRecord.rowCount === 0) {         
            // Insert new record
            const result = await pool.query(`
            INSERT INTO officerbudget (
                officer_no, officer_name, fiscal_year, annual_budget, monthly_budget, 
                January_budget, January_Actual, February_budget, February_Actual, 
                March_budget, March_Actual, April_budget, April_Actual, 
                May_budget, May_Actual, June_budget, June_Actual, 
                July_budget, July_Actual, August_budget, August_Actual, 
                September_budget, September_Actual, October_budget, October_Actual, 
                November_budget, November_Actual, December_budget, December_Actual, 
                Actual_total, outstanding, electoral_area
            ) VALUES (
                $1, $2, $3, $4, $5, 
                $6, $7, $8, $9, 
                $10, $11, $12, $13, 
                $14, $15, $16, $17, 
                $18, $19, $20, $21, 
                $22, $23, $24, $25, 
                $26, $27, $28, $29, 
                $30, $31, $32, $33, 
                $34, $35
            )`, [
                businesses.rows[0].officer_no,
                businesses.rows[0].officer_name,
                fiscal_year,
                annual_budget,
                monthly_budget,
                monthly_budget,
                0,
                monthly_budget,
                0,
                monthly_budget,
                0,
                monthly_budget,
                0,
                monthly_budget,
                0,
                monthly_budget,
                0,
                monthly_budget,
                0,
                monthly_budget,
                0,
                monthly_budget,
                0,
                monthly_budget,
                0,
                monthly_budget,
                0,
                monthly_budget,
                0,
                0,
                0,
                electoral_area
            ]);
        }

        res.status(200).send('Budget record added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding budget record');
    }
});

// Function to update a budget record
router.put('/updateBudget', async (req: Request<{}, {}, UpdateBudgetRequest>, res: Response) => {
    const {
        officer_no,
        fiscal_year,
        electoral_area
    } = req.body;

    try {
        // Find Annual Budget
        const annual_budget = await pool.query(`
        SELECT SUM(current_rate) AS totsum FROM business 
        WHERE officer_no = $1`, [officer_no]);

        if (annual_budget.rows.length === 0) {
            res.status(404).send('Annual budget not found');
            return;
        }

        const monthly_budget = parseFloat(annual_budget.rows[0].totsum) / 12;

        // Check if record exists
        const checkRecord = await pool.query(`
            SELECT * FROM officerbudget 
            WHERE officer_no = $1 AND fiscal_year = $2 AND electoral_area = $3`, [officer_no, fiscal_year, electoral_area]);

        if (checkRecord.rowCount === null) {
            res.status(500).send('Internal server error: rowCount is null');
            return;
        }

        // Find the existing record
        const businesses = await pool.query(`
            SELECT * FROM business 
            WHERE officer_no = $1`, [officer_no]);

        if (businesses.rows.length === 0) {
            res.status(404).send('Businesses not found');
            return;
        }

        // Update the existing record
        const result = await pool.query(`
        UPDATE officerbudget
        SET 
            officer_name = $1,
            annual_budget = $2,
            monthly_budget = $3,
            January_budget = $4,
            January_Actual = $5,
            February_budget = $6,
            February_Actual = $7,
            March_budget = $8,
            March_Actual = $9,
            April_budget = $10,
            April_Actual = $11,
            May_budget = $12,
            May_Actual = $13,
            June_budget = $14,
            June_Actual = $15,
            July_budget = $16,
            July_Actual = $17,
            August_budget = $18,
            August_Actual = $19,
            September_budget = $20,
            September_Actual = $21,
            October_budget = $22,
            October_Actual = $23,
            November_budget = $24,
            November_Actual = $25,
            December_budget = $26,
            December_Actual = $27,
            Actual_total = $28,
            outstanding = $29
        WHERE 
            officer_no = $30 AND 
            fiscal_year = $31 AND 
            electoral_area = $32
    `, [
        businesses.rows[0].officer_name,
        annual_budget,
        monthly_budget,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        0,
        0,
        businesses.rows[0].officer_no,
        fiscal_year,
        electoral_area
    ]);

        res.status(200).send('Budget record updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating budget record');
    }
});

export default router;