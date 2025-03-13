//import express from 'express';
import * as dotenv from 'dotenv';
import { Router } from 'express';
// import PDFDocument from 'pdfkit';
// import nodemailer, { SendMailOptions } from 'nodemailer';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
import pg from 'pg';
const { Pool } = pg;
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
router.get('/officerbudget/:officer_no/:fiscal_year/:electoral_area', async (req, res) => {
    const { officer_no, fiscal_year, electoral_area } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2 AND electoral_area = $3`, [officer_no, fiscal_year, electoral_area]);
        // Check if there are any rows returned
        if (result.rows.length > 0) {
            return res.status(200).json({ exists: true, data: result.rows });
        }
        else {
            return res.status(200).json({ exists: false });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ exists: false, message: 'Error fetching officer budget' });
    }
});
// Function to populate electoral areas based on officer number
router.get('/electoralArea/:officerNo', async (req, res) => {
    const { officerNo } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT electoralarea FROM collectorElectoralArea 
            WHERE officer_no = $1
            ORDER BY officer_no`, [officerNo]);
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error fetching electoral areas');
    }
});
// Function to get the total number of businesses for a given electoral area
router.get('/businessCount/:electoralArea', async (req, res) => {
    const { electoralArea } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT COUNT(buss_no) AS total FROM business 
            WHERE electoral_area = $1`, [electoralArea]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error fetching business count');
    }
});
// Function to add a budget record
router.post('/addBudget', async (req, res) => {
    const { officer_no, fiscal_year } = req.body;
    console.log("req.body: ", req.body);
    const client = await pool.connect();
    try {
        // // Find officer's electoral areas
        // const electoralArea = await pool.query(`
        //     SELECT electoralarea FROM collectorElectoralArea 
        //     WHERE officer_no = $1
        //     ORDER BY officer_no`, [officer_no]);
        // if (electoralArea.rows.length === 0) {
        //     res.status(404).send('Officer not found');
        //     return;
        // }
        // Find Annual Budget
        const annual_budget = await client.query(`
            SELECT SUM(current_rate) AS totsum FROM business 
            WHERE assessmentby = $1`, [officer_no]);
        if (annual_budget.rows.length === 0) {
            res.status(404).send('Annual budget not found');
            return;
        }
        const monthly_budget = parseFloat(annual_budget.rows[0].totsum) / 12;
        // Check if record exists
        const checkRecord = await client.query(`
            SELECT * FROM officerbudget 
            WHERE officer_no = $1 AND fiscal_year = $2`, [officer_no, fiscal_year]);
        if (checkRecord.rowCount === null) {
            res.status(201).send('Internal server error: rowCount is null');
            return;
        }
        if (checkRecord.rowCount === 0) {
            res.status(201).send('Record not found');
            return;
        }
        // Find the existing record
        const businesses = await client.query(`
            SELECT * FROM business 
            WHERE officer_no = $1`, [officer_no]);
        if (businesses.rows.length === 0) {
            res.status(201).send('Businesses not found');
            return;
        }
        if (checkRecord.rowCount === 0) {
            // Insert new record
            const result = await client.query(`
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
                0
            ]);
        }
        res.status(200).send('Budget record added successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error adding budget record');
    }
});
// Function to update a budget record
router.put('/updateBudget', async (req, res) => {
    const { officer_no, fiscal_year, electoral_area } = req.body;
    const client = await pool.connect();
    try {
        // Find payments for the officer in the given fiscal year
        const payments = await client.query(`
            SELECT SUM(amount) AS totsum FROM buspayments 
            WHERE officer_no = $1 AND fiscal_year = $2`, [officer_no, fiscal_year]);
        if (payments.rows.length === 0) {
            res.status(404).send('Payments not found');
            return;
        }
        const outstanding = parseFloat(payments.rows[0].totsum) - (req.body.annual_budget - req.body.Actual_total);
        // Find the existing record
        const checkRecord = await client.query(`
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
        // Find Annual Budget
        const annual_budget = await client.query(`
        SELECT SUM(current_rate) AS totsum FROM business 
        WHERE officer_no = $1`, [officer_no]);
        if (annual_budget.rows.length === 0) {
            res.status(404).send('Annual budget not found');
            return;
        }
        const monthly_budget = parseFloat(annual_budget.rows[0].totsum) / 12;
        // Check if record exists
        const checkRecord1 = await client.query(`
            SELECT * FROM officerbudget 
            WHERE officer_no = $1 AND fiscal_year = $2`, [officer_no, fiscal_year]);
        if (checkRecord1.rowCount === null) {
            res.status(500).send('Internal server error: rowCount is null');
            return;
        }
        // Find the existing record
        const businesses = await client.query(`
            SELECT * FROM business 
            WHERE officer_no = $1`, [officer_no]);
        if (businesses.rows.length === 0) {
            res.status(404).send('Businesses not found');
            return;
        }
        // Update the existing record
        const result = await client.query(`
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
            fiscal_year = $31 
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
            fiscal_year
        ]);
        res.status(200).send('Budget record updated successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error updating budget record');
    }
});
// Function to update Officer's budget based on bus payments
async function updateOfficerBudget(officer_no, fiscal_year) {
    const client = await pool.connect();
    try {
        // Step 1: Fetch all payments for the given officer and fiscal year
        const paymentsQuery = `
            SELECT monthpaid, paidAmount 
            FROM BusPayments 
            WHERE officer_no = $1 AND fiscal_year = $2
        `;
        const paymentsResult = await client.query(paymentsQuery, [officer_no, fiscal_year]);
        const payments = paymentsResult.rows;
        if (payments.length === 0) {
            return `No payments found for officer_no: ${officer_no} in fiscal year: ${fiscal_year}.`;
        }
        // Step 2: Fetch the officer's budget
        const budgetQuery = `
            SELECT * 
            FROM OfficerBudget 
            WHERE officer_no = $1 AND fiscal_year = $2
        `;
        const budgetResult = await client.query(budgetQuery, [officer_no, fiscal_year]);
        const budget = budgetResult.rows[0];
        if (!budget) {
            return `No budget found for officer_no: ${officer_no} in fiscal year: ${fiscal_year}.`;
        }
        // Step 3: Update the budget based on payments
        let actualTotal = budget.actual_total;
        for (const payment of payments) {
            const { monthpaid, paidAmount } = payment;
            // Update the actual total
            actualTotal += paidAmount;
            // Update the actual amount for the corresponding month
            const monthColumn = `${monthpaid}_Actual`;
            const updateQuery = `
                UPDATE OfficerBudget 
                SET ${monthColumn} = ${monthColumn} + $1, 
                    actual_total = $2, 
                    outstanding = annual_budget - $2 
                WHERE officer_no = $3 AND fiscal_year = $4
            `;
            await client.query(updateQuery, [paidAmount, actualTotal, officer_no, fiscal_year]);
        }
        return `Successfully updated budget for officer_no: ${officer_no} in fiscal year: ${fiscal_year}.`;
    }
    catch (error) {
        console.error('Error updating officer budget:', error);
        return `Error updating budget for officer_no: ${officer_no} in fiscal year: ${fiscal_year}.`;
    }
    finally {
        client.release();
    }
}
// Example usage
updateOfficerBudget('OFFICER123', 2023)
    .then(message => console.log(message))
    .catch(err => console.error(err));
export default router;
//# sourceMappingURL=officerBudget.js.map