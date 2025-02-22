import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
const router = Router();
// Load environment variables from .env file
dotenv.config();
// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});
// Create a new officer budget weekly record
router.post('/', async (req, res) => {
    const officerBudgetWeeklyData = req.body;
    let client = null;
    try {
        client = await pool.connect();
        const existingRecord = await client.query(`SELECT * FROM officerbudgetweekly WHERE officer_no = $1 AND fiscal_year = $2`, [officerBudgetWeeklyData.officer_no, officerBudgetWeeklyData.fiscal_year]);
        if (existingRecord.rows.length > 0) {
            res.status(409).json({ message: 'Officer budget weekly record already exists' });
            return;
        }
        // Insert the new officer budget weekly data
        await client.query(`INSERT INTO officerbudgetweekly 
            (officer_no, officer_name, fiscal_year, annual_budget, weekly_budget, 
            January_budget_WEEK1, January_budget_WEEK2, January_budget_WEEK3, January_budget_WEEK4, 
            January_Actual_WEEK1, January_Actual_WEEK2, January_Actual_WEEK3, January_Actual_WEEK4,
            February_budget_WEEK1, February_budget_WEEK2, February_budget_WEEK3, February_budget_WEEK4,
            February_Actual_WEEK1, February_Actual_WEEK2, February_Actual_WEEK3, February_Actual_WEEK4,
            March_budget_WEEK1, March_budget_WEEK2, March_budget_WEEK3, March_budget_WEEK4,
            March_Actual_WEEK1, March_Actual_WEEK2, March_Actual_WEEK3, March_Actual_WEEK4,
            April_budget_WEEK1, April_budget_WEEK2, April_budget_WEEK3, April_budget_WEEK4,
            April_Actual_WEEK1, April_Actual_WEEK2, April_Actual_WEEK3, April_Actual_WEEK4,
            May_budget_WEEK1, May_budget_WEEK2, May_budget_WEEK3, May_budget_WEEK4,
            May_Actual_WEEK1, May_Actual_WEEK2, May_Actual_WEEK3, May_Actual_WEEK4,
            June_budget_WEEK1, June_budget_WEEK2, June_budget_WEEK3, June_budget_WEEK4,
            June_Actual_WEEK1, June_Actual_WEEK2, June_Actual_WEEK3, June_Actual_WEEK4,
            July_budget_WEEK1, July_budget_WEEK2, July_budget_WEEK3, July_budget_WEEK4,
            July_Actual_WEEK1, July_Actual_WEEK2, July_Actual_WEEK3, July_Actual_WEEK4,
            August_budget_WEEK1, August_budget_WEEK2, August_budget_WEEK3, August_budget_WEEK4,
            August_Actual_WEEK1, August_Actual_WEEK2, August_Actual_WEEK3, August_Actual_WEEK4,
            September_budget_WEEK1, September_budget_WEEK2, September_budget_WEEK3, September_budget_WEEK4,
            September_Actual_WEEK1, September_Actual_WEEK2, September_Actual_WEEK3, September_Actual_WEEK4,
            October_budget_WEEK1, October_budget_WEEK2, October_budget_WEEK3, October_budget_WEEK4,
            October_Actual_WEEK1, October_Actual_WEEK2, October_Actual_WEEK3, October_Actual_WEEK4,
            November_budget_WEEK1, November_budget_WEEK2, November_budget_WEEK3, November_budget_WEEK4,
            November_Actual_WEEK1, November_Actual_WEEK2, November_Actual_WEEK3, November_Actual_WEEK4,
            December_budget_WEEK1, December_budget_WEEK2, December_budget_WEEK3, December_budget_WEEK4,
            December_Actual_WEEK1, December_Actual_WEEK2, December_Actual_WEEK3, December_Actual_WEEK4,
            Actual_total, outstanding, electoral_area) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77)`, [
            officerBudgetWeeklyData.officer_no,
            officerBudgetWeeklyData.officer_name,
            officerBudgetWeeklyData.fiscal_year,
            officerBudgetWeeklyData.annual_budget,
            officerBudgetWeeklyData.weekly_budget,
            officerBudgetWeeklyData.January_budget_WEEK1,
            officerBudgetWeeklyData.January_budget_WEEK2,
            officerBudgetWeeklyData.January_budget_WEEK3,
            officerBudgetWeeklyData.January_budget_WEEK4,
            officerBudgetWeeklyData.January_Actual_WEEK1,
            officerBudgetWeeklyData.January_Actual_WEEK2,
            officerBudgetWeeklyData.January_Actual_WEEK3,
            officerBudgetWeeklyData.January_Actual_WEEK4,
            officerBudgetWeeklyData.February_budget_WEEK1,
            officerBudgetWeeklyData.February_budget_WEEK2,
            officerBudgetWeeklyData.February_budget_WEEK3,
            officerBudgetWeeklyData.February_budget_WEEK4,
            officerBudgetWeeklyData.February_Actual_WEEK1,
            officerBudgetWeeklyData.February_Actual_WEEK2,
            officerBudgetWeeklyData.February_Actual_WEEK3,
            officerBudgetWeeklyData.February_Actual_WEEK4,
            officerBudgetWeeklyData.March_budget_WEEK1,
            officerBudgetWeeklyData.March_budget_WEEK2,
            officerBudgetWeeklyData.March_budget_WEEK3,
            officerBudgetWeeklyData.March_budget_WEEK4,
            officerBudgetWeeklyData.March_Actual_WEEK1,
            officerBudgetWeeklyData.March_Actual_WEEK2,
            officerBudgetWeeklyData.March_Actual_WEEK3,
            officerBudgetWeeklyData.March_Actual_WEEK4,
            officerBudgetWeeklyData.April_budget_WEEK1,
            officerBudgetWeeklyData.April_budget_WEEK2,
            officerBudgetWeeklyData.April_budget_WEEK3,
            officerBudgetWeeklyData.April_budget_WEEK4,
            officerBudgetWeeklyData.April_Actual_WEEK1,
            officerBudgetWeeklyData.April_Actual_WEEK2,
            officerBudgetWeeklyData.April_Actual_WEEK3,
            officerBudgetWeeklyData.April_Actual_WEEK4,
            officerBudgetWeeklyData.May_budget_WEEK1,
            officerBudgetWeeklyData.May_budget_WEEK2,
            officerBudgetWeeklyData.May_budget_WEEK3,
            officerBudgetWeeklyData.May_budget_WEEK4,
            officerBudgetWeeklyData.May_Actual_WEEK1,
            officerBudgetWeeklyData.May_Actual_WEEK2,
            officerBudgetWeeklyData.May_Actual_WEEK3,
            officerBudgetWeeklyData.May_Actual_WEEK4,
            officerBudgetWeeklyData.June_budget_WEEK1,
            officerBudgetWeeklyData.June_budget_WEEK2,
            officerBudgetWeeklyData.June_budget_WEEK3,
            officerBudgetWeeklyData.June_budget_WEEK4,
            officerBudgetWeeklyData.June_Actual_WEEK1,
            officerBudgetWeeklyData.June_Actual_WEEK2,
            officerBudgetWeeklyData.June_Actual_WEEK3,
            officerBudgetWeeklyData.June_Actual_WEEK4,
            officerBudgetWeeklyData.July_budget_WEEK1,
            officerBudgetWeeklyData.July_budget_WEEK2,
            officerBudgetWeeklyData.July_budget_WEEK3,
            officerBudgetWeeklyData.July_budget_WEEK4,
            officerBudgetWeeklyData.July_Actual_WEEK1,
            officerBudgetWeeklyData.July_Actual_WEEK2,
            officerBudgetWeeklyData.July_Actual_WEEK3,
            officerBudgetWeeklyData.July_Actual_WEEK4,
            officerBudgetWeeklyData.August_budget_WEEK1,
            officerBudgetWeeklyData.August_budget_WEEK2,
            officerBudgetWeeklyData.August_budget_WEEK3,
            officerBudgetWeeklyData.August_budget_WEEK4,
            officerBudgetWeeklyData.August_Actual_WEEK1,
            officerBudgetWeeklyData.August_Actual_WEEK2,
            officerBudgetWeeklyData.August_Actual_WEEK3,
            officerBudgetWeeklyData.August_Actual_WEEK4,
            officerBudgetWeeklyData.September_budget_WEEK1,
            officerBudgetWeeklyData.September_budget_WEEK2,
            officerBudgetWeeklyData.September_budget_WEEK3,
            officerBudgetWeeklyData.September_budget_WEEK4,
            officerBudgetWeeklyData.September_Actual_WEEK1,
            officerBudgetWeeklyData.September_Actual_WEEK2,
            officerBudgetWeeklyData.September_Actual_WEEK3,
            officerBudgetWeeklyData.September_Actual_WEEK4,
            officerBudgetWeeklyData.October_budget_WEEK1,
            officerBudgetWeeklyData.October_budget_WEEK2,
            officerBudgetWeeklyData.October_budget_WEEK3,
            officerBudgetWeeklyData.October_budget_WEEK4,
            officerBudgetWeeklyData.October_Actual_WEEK1,
            officerBudgetWeeklyData.October_Actual_WEEK2,
            officerBudgetWeeklyData.October_Actual_WEEK3,
            officerBudgetWeeklyData.October_Actual_WEEK4,
            officerBudgetWeeklyData.November_budget_WEEK1,
            officerBudgetWeeklyData.November_budget_WEEK2,
            officerBudgetWeeklyData.November_budget_WEEK3,
            officerBudgetWeeklyData.November_budget_WEEK4,
            officerBudgetWeeklyData.November_Actual_WEEK1,
            officerBudgetWeeklyData.November_Actual_WEEK2,
            officerBudgetWeeklyData.November_Actual_WEEK3,
            officerBudgetWeeklyData.November_Actual_WEEK4,
            officerBudgetWeeklyData.December_budget_WEEK1,
            officerBudgetWeeklyData.December_budget_WEEK2,
            officerBudgetWeeklyData.December_budget_WEEK3,
            officerBudgetWeeklyData.December_budget_WEEK4,
            officerBudgetWeeklyData.December_Actual_WEEK1,
            officerBudgetWeeklyData.December_Actual_WEEK2,
            officerBudgetWeeklyData.December_Actual_WEEK3,
            officerBudgetWeeklyData.December_Actual_WEEK4,
            officerBudgetWeeklyData.Actual_total,
            officerBudgetWeeklyData.outstanding,
            officerBudgetWeeklyData.electoral_area,
        ]);
        res.status(201).json({ message: 'Officer budget weekly record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating officer budget weekly record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Read all officer budget weekly records
router.get('/', async (req, res) => {
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM officerbudgetweekly');
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in getting officer budget weekly records', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Read officer budget weekly record by id
router.get('/:id/:fiscal_year', async (req, res) => {
    const { id, fiscal_year } = req.params;
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM officerbudgetweekly WHERE id = $1 AND fiscal_year = $2', [id, fiscal_year]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Officer budget weekly record not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in getting officer budget weekly record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Update officer budget weekly record by id
router.put('/:id/:fiscal_year', async (req, res) => {
    const { id, fiscal_year } = req.params;
    const officerBudgetWeeklyData = req.body;
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM officerbudgetweekly WHERE id = $1 AND fiscal_year = $2', [id, fiscal_year]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Officer budget weekly record not found' });
            return;
        }
        // Update the officer budget weekly data
        await client.query(`UPDATE officerbudgetweekly SET 
            officer_no = $1, officer_name = $2, fiscal_year = $3, annual_budget = $4, weekly_budget = $5, 
            January_budget_WEEK1 = $6, January_budget_WEEK2 = $7, January_budget_WEEK3 = $8, January_budget_WEEK4 = $9, 
            January_Actual_WEEK1 = $10, January_Actual_WEEK2 = $11, January_Actual_WEEK3 = $12, January_Actual_WEEK4 = $13,
            February_budget_WEEK1 = $14, February_budget_WEEK2 = $15, February_budget_WEEK3 = $16, February_budget_WEEK4 = $17,
            February_Actual_WEEK1 = $18, February_Actual_WEEK2 = $19, February_Actual_WEEK3 = $20, February_Actual_WEEK4 = $21,
            March_budget_WEEK1 = $22, March_budget_WEEK2 = $23, March_budget_WEEK3 = $24, March_budget_WEEK4 = $25,
            March_Actual_WEEK1 = $26, March_Actual_WEEK2 = $27, March_Actual_WEEK3 = $28, March_Actual_WEEK4 = $29,
            April_budget_WEEK1 = $30, April_budget_WEEK2 = $31, April_budget_WEEK3 = $32, April_budget_WEEK4 = $33,
            April_Actual_WEEK1 = $34, April_Actual_WEEK2 = $35, April_Actual_WEEK3 = $36, April_Actual_WEEK4 = $37,
            May_budget_WEEK1 = $38, May_budget_WEEK2 = $39, May_budget_WEEK3 = $40, May_budget_WEEK4 = $41,
            May_Actual_WEEK1 = $42, May_Actual_WEEK2 = $43, May_Actual_WEEK3 = $44, May_Actual_WEEK4 = $45,
            June_budget_WEEK1 = $46, June_budget_WEEK2 = $47, June_budget_WEEK3 = $48, June_budget_WEEK4 = $49,
            June_Actual_WEEK1 = $50, June_Actual_WEEK2 = $51, June_Actual_WEEK3 = $52, June_Actual_WEEK4 = $53,
            July_budget_WEEK1 = $54, July_budget_WEEK2 = $55, July_budget_WEEK3 = $56, July_budget_WEEK4 = $57,
            July_Actual_WEEK1 = $58, July_Actual_WEEK2 = $59, July_Actual_WEEK3 = $60, July_Actual_WEEK4 = $61,
            August_budget_WEEK1 = $62, August_budget_WEEK2 = $63, August_budget_WEEK3 = $64, August_budget_WEEK4 = $65,
            August_Actual_WEEK1 = $66, August_Actual_WEEK2 = $67, August_Actual_WEEK3 = $68, August_Actual_WEEK4 = $69,
            September_budget_WEEK1 = $70, September_budget_WEEK2 = $71, September_budget_WEEK3 = $72, September_budget_WEEK4 = $73,
            September_Actual_WEEK1 = $74, September_Actual_WEEK2 = $75, September_Actual_WEEK3 = $76, September_Actual_WEEK4 = $77,
            October_budget_WEEK1 = $78, October_budget_WEEK2 = $79, October_budget_WEEK3 = $80, October_budget_WEEK4 = $81,
            October_Actual_WEEK1 = $82, October_Actual_WEEK2 = $83, October_Actual_WEEK3 = $84, October_Actual_WEEK4 = $85,
            November_budget_WEEK1 = $86, November_budget_WEEK2 = $87, November_budget_WEEK3 = $88, November_budget_WEEK4 = $89,
            November_Actual_WEEK1 = $90, November_Actual_WEEK2 = $91, November_Actual_WEEK3 = $92, November_Actual_WEEK4 = $93,
            December_budget_WEEK1 = $94, December_budget_WEEK2 = $95, December_budget_WEEK3 = $96, December_budget_WEEK4 = $97,
            December_Actual_WEEK1 = $98, December_Actual_WEEK2 = $99, December_Actual_WEEK3 = $100, December_Actual_WEEK4 = $101,
            Actual_total = $102, outstanding = $103, electoral_area = $104
            WHERE id = $105`, [
            officerBudgetWeeklyData.officer_no,
            officerBudgetWeeklyData.officer_name,
            officerBudgetWeeklyData.fiscal_year,
            officerBudgetWeeklyData.annual_budget,
            officerBudgetWeeklyData.weekly_budget,
            officerBudgetWeeklyData.January_budget_WEEK1,
            officerBudgetWeeklyData.January_budget_WEEK2,
            officerBudgetWeeklyData.January_budget_WEEK3,
            officerBudgetWeeklyData.January_budget_WEEK4,
            officerBudgetWeeklyData.January_Actual_WEEK1,
            officerBudgetWeeklyData.January_Actual_WEEK2,
            officerBudgetWeeklyData.January_Actual_WEEK3,
            officerBudgetWeeklyData.January_Actual_WEEK4,
            officerBudgetWeeklyData.February_budget_WEEK1,
            officerBudgetWeeklyData.February_budget_WEEK2,
            officerBudgetWeeklyData.February_budget_WEEK3,
            officerBudgetWeeklyData.February_budget_WEEK4,
            officerBudgetWeeklyData.February_Actual_WEEK1,
            officerBudgetWeeklyData.February_Actual_WEEK2,
            officerBudgetWeeklyData.February_Actual_WEEK3,
            officerBudgetWeeklyData.February_Actual_WEEK4,
            officerBudgetWeeklyData.March_budget_WEEK1,
            officerBudgetWeeklyData.March_budget_WEEK2,
            officerBudgetWeeklyData.March_budget_WEEK3,
            officerBudgetWeeklyData.March_budget_WEEK4,
            officerBudgetWeeklyData.March_Actual_WEEK1,
            officerBudgetWeeklyData.March_Actual_WEEK2,
            officerBudgetWeeklyData.March_Actual_WEEK3,
            officerBudgetWeeklyData.March_Actual_WEEK4,
            officerBudgetWeeklyData.April_budget_WEEK1,
            officerBudgetWeeklyData.April_budget_WEEK2,
            officerBudgetWeeklyData.April_budget_WEEK3,
            officerBudgetWeeklyData.April_budget_WEEK4,
            officerBudgetWeeklyData.April_Actual_WEEK1,
            officerBudgetWeeklyData.April_Actual_WEEK2,
            officerBudgetWeeklyData.April_Actual_WEEK3,
            officerBudgetWeeklyData.April_Actual_WEEK4,
            officerBudgetWeeklyData.May_budget_WEEK1,
            officerBudgetWeeklyData.May_budget_WEEK2,
            officerBudgetWeeklyData.May_budget_WEEK3,
            officerBudgetWeeklyData.May_budget_WEEK4,
            officerBudgetWeeklyData.May_Actual_WEEK1,
            officerBudgetWeeklyData.May_Actual_WEEK2,
            officerBudgetWeeklyData.May_Actual_WEEK3,
            officerBudgetWeeklyData.May_Actual_WEEK4,
            officerBudgetWeeklyData.June_budget_WEEK1,
            officerBudgetWeeklyData.June_budget_WEEK2,
            officerBudgetWeeklyData.June_budget_WEEK3,
            officerBudgetWeeklyData.June_budget_WEEK4,
            officerBudgetWeeklyData.June_Actual_WEEK1,
            officerBudgetWeeklyData.June_Actual_WEEK2,
            officerBudgetWeeklyData.June_Actual_WEEK3,
            officerBudgetWeeklyData.June_Actual_WEEK4,
            officerBudgetWeeklyData.July_budget_WEEK1,
            officerBudgetWeeklyData.July_budget_WEEK2,
            officerBudgetWeeklyData.July_budget_WEEK3,
            officerBudgetWeeklyData.July_budget_WEEK4,
            officerBudgetWeeklyData.July_Actual_WEEK1,
            officerBudgetWeeklyData.July_Actual_WEEK2,
            officerBudgetWeeklyData.July_Actual_WEEK3,
            officerBudgetWeeklyData.July_Actual_WEEK4,
            officerBudgetWeeklyData.August_budget_WEEK1,
            officerBudgetWeeklyData.August_budget_WEEK2,
            officerBudgetWeeklyData.August_budget_WEEK3,
            officerBudgetWeeklyData.August_budget_WEEK4,
            officerBudgetWeeklyData.August_Actual_WEEK1,
            officerBudgetWeeklyData.August_Actual_WEEK2,
            officerBudgetWeeklyData.August_Actual_WEEK3,
            officerBudgetWeeklyData.August_Actual_WEEK4,
            officerBudgetWeeklyData.September_budget_WEEK1,
            officerBudgetWeeklyData.September_budget_WEEK2,
            officerBudgetWeeklyData.September_budget_WEEK3,
            officerBudgetWeeklyData.September_budget_WEEK4,
            officerBudgetWeeklyData.September_Actual_WEEK1,
            officerBudgetWeeklyData.September_Actual_WEEK2,
            officerBudgetWeeklyData.September_Actual_WEEK3,
            officerBudgetWeeklyData.September_Actual_WEEK4,
            officerBudgetWeeklyData.October_budget_WEEK1,
            officerBudgetWeeklyData.October_budget_WEEK2,
            officerBudgetWeeklyData.October_budget_WEEK3,
            officerBudgetWeeklyData.October_budget_WEEK4,
            officerBudgetWeeklyData.October_Actual_WEEK1,
            officerBudgetWeeklyData.October_Actual_WEEK2,
            officerBudgetWeeklyData.October_Actual_WEEK3,
            officerBudgetWeeklyData.October_Actual_WEEK4,
            officerBudgetWeeklyData.November_budget_WEEK1,
            officerBudgetWeeklyData.November_budget_WEEK2,
            officerBudgetWeeklyData.November_budget_WEEK3,
            officerBudgetWeeklyData.November_budget_WEEK4,
            officerBudgetWeeklyData.November_Actual_WEEK1,
            officerBudgetWeeklyData.November_Actual_WEEK2,
            officerBudgetWeeklyData.November_Actual_WEEK3,
            officerBudgetWeeklyData.November_Actual_WEEK4,
            officerBudgetWeeklyData.December_budget_WEEK1,
            officerBudgetWeeklyData.December_budget_WEEK2,
            officerBudgetWeeklyData.December_budget_WEEK3,
            officerBudgetWeeklyData.December_budget_WEEK4,
            officerBudgetWeeklyData.December_Actual_WEEK1,
            officerBudgetWeeklyData.December_Actual_WEEK2,
            officerBudgetWeeklyData.December_Actual_WEEK3,
            officerBudgetWeeklyData.December_Actual_WEEK4,
            officerBudgetWeeklyData.Actual_total,
            officerBudgetWeeklyData.outstanding,
            officerBudgetWeeklyData.electoral_area,
            id,
        ]);
        res.json({ message: 'Officer budget weekly record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating officer budget weekly record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Delete officer budget weekly record by id
router.delete('/:id/:fiscal_year', async (req, res) => {
    const { id, fiscal_year } = req.params;
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM officerbudgetweekly WHERE id = $1 AND fiscal_year = $2', [id, fiscal_year]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Officer budget weekly record not found' });
            return;
        }
        // Delete the officer budget weekly record
        await client.query('DELETE FROM officerbudgetweekly WHERE id = $1', [id]);
        res.json({ message: 'Officer budget weekly record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer budget weekly record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Helper function to get fiscal years
async function getFiscalYears() {
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT DISTINCT fiscal_year FROM buspayments ORDER BY fiscal_year');
        return result.rows.map(row => row.fiscal_year);
    }
    catch (err) {
        console.error('Error fetching fiscal years:', err);
        throw err;
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
// Helper function to get officers
async function getOfficers() {
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT officer_no, officer_name FROM officer');
        return result.rows;
    }
    catch (err) {
        console.error('Error fetching officers:', err);
        throw err;
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
// Helper function to get amount by officer and month
async function getAmountByOfficerAndMonth(officerNo, fiscalYear, monthPaid) {
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT 
                SUM(amount) AS totsum 
            FROM buspayments 
            WHERE officer_no = $1 
              AND fiscal_year = $2 
              AND (monthpaid = $3 OR monthpaid = $4::INTEGER)`, [officerNo, fiscalYear, monthPaid, monthPaid]);
        return result.rows[0]?.totsum ?? null;
    }
    catch (err) {
        console.error('Error fetching amount by officer and month:', err);
        throw err;
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
// Helper function to delete officer month assess
async function deleteOfficerMonthAssess() {
    let client = null;
    try {
        client = await pool.connect();
        await client.query('DELETE FROM officermonthassess');
    }
    catch (err) {
        console.error('Error deleting officer month assess:', err);
        throw err;
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
// Helper function to insert officer month assess
async function insertOfficerMonthAssess(data) {
    let client = null;
    try {
        client = await pool.connect();
        const insertQuery = `
            INSERT INTO officermonthassess (officer_name, month, amount, fiscalyear) 
            VALUES ($1, $2, $3, $4)
        `;
        for (let item of data) {
            await client.query(insertQuery, [item.officer_name, item.month, item.amount, item.fiscalyear]);
        }
    }
    catch (err) {
        console.error('Error inserting officer month assess:', err);
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
// Get fiscal years
router.get('/api/fiscalYears', async (req, res) => {
    try {
        const fiscalYears = await getFiscalYears();
        res.json(fiscalYears);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
// Get officers
router.get('/api/officers', async (req, res) => {
    try {
        const officers = await getOfficers();
        res.json(officers);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
// Get amount by officer and month
router.get('/api/amountByOfficerAndMonth', async (req, res) => {
    try {
        const { officerNo, fiscalYear, monthPaid } = req.query;
        const amount = await getAmountByOfficerAndMonth(officerNo, Number(fiscalYear), monthPaid);
        res.json({ totsum: amount });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
// Post officer month assess
router.post('/api/officerMonthAssess', async (req, res) => {
    try {
        const data = req.body;
        await deleteOfficerMonthAssess();
        await insertOfficerMonthAssess(data);
        res.send('Officer month assess records created successfully');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
// Delete officer month assess
router.delete('/api/officerMonthAssess', async (req, res) => {
    try {
        await deleteOfficerMonthAssess();
        res.send('Officer month assess deleted');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
export default router;
// // backend/src/routes/api/officerBudgetWeeklyRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader } from 'mysql2/promise';
// const router = Router();
// // Load environment variables from .env file
// dotenv.config();
// // MySQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
// };
// // OfficerBudgetWeekly data interface
// interface OfficerBudgetWeeklyData {
//     officer_no: string;
//     officer_name: string;
//     fiscal_year: number;
//     annual_budget: number;
//     weekly_budget: number;
//     January_budget_WEEK1: number;
//     January_budget_WEEK2: number;
//     January_budget_WEEK3: number;
//     January_budget_WEEK4: number;
//     January_Actual_WEEK1: number;
//     January_Actual_WEEK2: number;
//     January_Actual_WEEK3: number;
//     January_Actual_WEEK4: number;
//     February_budget_WEEK1: number;
//     February_budget_WEEK2: number;
//     February_budget_WEEK3: number;
//     February_budget_WEEK4: number;
//     February_Actual_WEEK1: number;
//     February_Actual_WEEK2: number;
//     February_Actual_WEEK3: number;
//     February_Actual_WEEK4: number;
//     March_budget_WEEK1: number;
//     March_budget_WEEK2: number;
//     March_budget_WEEK3: number;
//     March_budget_WEEK4: number;
//     March_Actual_WEEK1: number;
//     March_Actual_WEEK2: number;
//     March_Actual_WEEK3: number;
//     March_Actual_WEEK4: number;
//     April_budget_WEEK1: number;
//     April_budget_WEEK2: number;
//     April_budget_WEEK3: number;
//     April_budget_WEEK4: number;
//     April_Actual_WEEK1: number;
//     April_Actual_WEEK2: number;
//     April_Actual_WEEK3: number;
//     April_Actual_WEEK4: number;
//     May_budget_WEEK1: number;
//     May_budget_WEEK2: number;
//     May_budget_WEEK3: number;
//     May_budget_WEEK4: number;
//     May_Actual_WEEK1: number;
//     May_Actual_WEEK2: number;
//     May_Actual_WEEK3: number;
//     May_Actual_WEEK4: number;
//     June_budget_WEEK1: number;
//     June_budget_WEEK2: number;
//     June_budget_WEEK3: number;
//     June_budget_WEEK4: number;
//     June_Actual_WEEK1: number;
//     June_Actual_WEEK2: number;
//     June_Actual_WEEK3: number;
//     June_Actual_WEEK4: number;
//     July_budget_WEEK1: number;
//     July_budget_WEEK2: number;
//     July_budget_WEEK3: number;
//     July_budget_WEEK4: number;
//     July_Actual_WEEK1: number;
//     July_Actual_WEEK2: number;
//     July_Actual_WEEK3: number;
//     July_Actual_WEEK4: number;
//     August_budget_WEEK1: number;
//     August_budget_WEEK2: number;
//     August_budget_WEEK3: number;
//     August_budget_WEEK4: number;
//     August_Actual_WEEK1: number;
//     August_Actual_WEEK2: number;
//     August_Actual_WEEK3: number;
//     August_Actual_WEEK4: number;
//     September_budget_WEEK1: number;
//     September_budget_WEEK2: number;
//     September_budget_WEEK3: number;
//     September_budget_WEEK4: number;
//     September_Actual_WEEK1: number;
//     September_Actual_WEEK2: number;
//     September_Actual_WEEK3: number;
//     September_Actual_WEEK4: number;
//     October_budget_WEEK1: number;
//     October_budget_WEEK2: number;
//     October_budget_WEEK3: number;
//     October_budget_WEEK4: number;
//     October_Actual_WEEK1: number;
//     October_Actual_WEEK2: number;
//     October_Actual_WEEK3: number;
//     October_Actual_WEEK4: number;
//     November_budget_WEEK1: number;
//     November_budget_WEEK2: number;
//     November_budget_WEEK3: number;
//     November_budget_WEEK4: number;
//     November_Actual_WEEK1: number;
//     November_Actual_WEEK2: number;
//     November_Actual_WEEK3: number;
//     November_Actual_WEEK4: number;
//     December_budget_WEEK1: number;
//     December_budget_WEEK2: number;
//     December_budget_WEEK3: number;
//     December_budget_WEEK4: number;
//     December_Actual_WEEK1: number;
//     December_Actual_WEEK2: number;
//     December_Actual_WEEK3: number;
//     December_Actual_WEEK4: number;
//     Actual_total: number;
//     outstanding: number;
//     electoral_area: string;
// }
// // Create a new officer budget weekly record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const officerBudgetWeeklyData: OfficerBudgetWeeklyData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.query('SELECT * FROM officerbudgetWeekly WHERE officer_no = ? AND fiscal_year = ?',
//            [officerBudgetWeeklyData.officer_no, officerBudgetWeeklyData.fiscal_year]
//         );
//         if (rows.length > 0) {
//             res.status(409).json({ message: 'Officer budget weekly record already exists' });
//             return;
//         }
//         // Insert the new officer budget weekly data
//         const [result] = await connection.query<ResultSetHeader>(
//             `INSERT INTO tb_officerbudgetWeekly 
//             (officer_no, officer_name, fiscal_year, annual_budget, weekly_budget, 
//             January_budget_WEEK1, January_budget_WEEK2, January_budget_WEEK3, January_budget_WEEK4, 
//             January_Actual_WEEK1, January_Actual_WEEK2, January_Actual_WEEK3, January_Actual_WEEK4,
//             February_budget_WEEK1, February_budget_WEEK2, February_budget_WEEK3, February_budget_WEEK4,
//             February_Actual_WEEK1, February_Actual_WEEK2, February_Actual_WEEK3, February_Actual_WEEK4,
//             March_budget_WEEK1, March_budget_WEEK2, March_budget_WEEK3, March_budget_WEEK4,
//             March_Actual_WEEK1, March_Actual_WEEK2, March_Actual_WEEK3, March_Actual_WEEK4,
//             April_budget_WEEK1, April_budget_WEEK2, April_budget_WEEK3, April_budget_WEEK4,
//             April_Actual_WEEK1, April_Actual_WEEK2, April_Actual_WEEK3, April_Actual_WEEK4,
//             May_budget_WEEK1, May_budget_WEEK2, May_budget_WEEK3, May_budget_WEEK4,
//             May_Actual_WEEK1, May_Actual_WEEK2, May_Actual_WEEK3, May_Actual_WEEK4,
//             June_budget_WEEK1, June_budget_WEEK2, June_budget_WEEK3, June_budget_WEEK4,
//             June_Actual_WEEK1, June_Actual_WEEK2, June_Actual_WEEK3, June_Actual_WEEK4,
//             July_budget_WEEK1, July_budget_WEEK2, July_budget_WEEK3, July_budget_WEEK4,
//             July_Actual_WEEK1, July_Actual_WEEK2, July_Actual_WEEK3, July_Actual_WEEK4,
//             August_budget_WEEK1, August_budget_WEEK2, August_budget_WEEK3, August_budget_WEEK4,
//             August_Actual_WEEK1, August_Actual_WEEK2, August_Actual_WEEK3, August_Actual_WEEK4,
//             September_budget_WEEK1, September_budget_WEEK2, September_budget_WEEK3, September_budget_WEEK4,
//             September_Actual_WEEK1, September_Actual_WEEK2, September_Actual_WEEK3, September_Actual_WEEK4,
//             October_budget_WEEK1, October_budget_WEEK2, October_budget_WEEK3, October_budget_WEEK4,
//             October_Actual_WEEK1, October_Actual_WEEK2, October_Actual_WEEK3, October_Actual_WEEK4,
//             November_budget_WEEK1, November_budget_WEEK2, November_budget_WEEK3, November_budget_WEEK4,
//             November_Actual_WEEK1, November_Actual_WEEK2, November_Actual_WEEK3, November_Actual_WEEK4,
//             December_budget_WEEK1, December_budget_WEEK2, December_budget_WEEK3, December_budget_WEEK4,
//             December_Actual_WEEK1, December_Actual_WEEK2, December_Actual_WEEK3, December_Actual_WEEK4,
//             Actual_total, outstanding, electoral_area) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 officerBudgetWeeklyData.officer_no,
//                 officerBudgetWeeklyData.officer_name,
//                 officerBudgetWeeklyData.fiscal_year,
//                 officerBudgetWeeklyData.annual_budget,
//                 officerBudgetWeeklyData.weekly_budget,
//                 officerBudgetWeeklyData.January_budget_WEEK1,
//                 officerBudgetWeeklyData.January_budget_WEEK2,
//                 officerBudgetWeeklyData.January_budget_WEEK3,
//                 officerBudgetWeeklyData.January_budget_WEEK4,
//                 officerBudgetWeeklyData.January_Actual_WEEK1,
//                 officerBudgetWeeklyData.January_Actual_WEEK2,
//                 officerBudgetWeeklyData.January_Actual_WEEK3,
//                 officerBudgetWeeklyData.January_Actual_WEEK4,
//                 officerBudgetWeeklyData.February_budget_WEEK1,
//                 officerBudgetWeeklyData.February_budget_WEEK2,
//                 officerBudgetWeeklyData.February_budget_WEEK3,
//                 officerBudgetWeeklyData.February_budget_WEEK4,
//                 officerBudgetWeeklyData.February_Actual_WEEK1,
//                 officerBudgetWeeklyData.February_Actual_WEEK2,
//                 officerBudgetWeeklyData.February_Actual_WEEK3,
//                 officerBudgetWeeklyData.February_Actual_WEEK4,
//                 officerBudgetWeeklyData.March_budget_WEEK1,
//                 officerBudgetWeeklyData.March_budget_WEEK2,
//                 officerBudgetWeeklyData.March_budget_WEEK3,
//                 officerBudgetWeeklyData.March_budget_WEEK4,
//                 officerBudgetWeeklyData.March_Actual_WEEK1,
//                 officerBudgetWeeklyData.March_Actual_WEEK2,
//                 officerBudgetWeeklyData.March_Actual_WEEK3,
//                 officerBudgetWeeklyData.March_Actual_WEEK4,
//                 officerBudgetWeeklyData.April_budget_WEEK1,
//                 officerBudgetWeeklyData.April_budget_WEEK2,
//                 officerBudgetWeeklyData.April_budget_WEEK3,
//                 officerBudgetWeeklyData.April_budget_WEEK4,
//                 officerBudgetWeeklyData.April_Actual_WEEK1,
//                 officerBudgetWeeklyData.April_Actual_WEEK2,
//                 officerBudgetWeeklyData.April_Actual_WEEK3,
//                 officerBudgetWeeklyData.April_Actual_WEEK4,
//                 officerBudgetWeeklyData.May_budget_WEEK1,
//                 officerBudgetWeeklyData.May_budget_WEEK2,
//                 officerBudgetWeeklyData.May_budget_WEEK3,
//                 officerBudgetWeeklyData.May_budget_WEEK4,
//                 officerBudgetWeeklyData.May_Actual_WEEK1,
//                 officerBudgetWeeklyData.May_Actual_WEEK2,
//                 officerBudgetWeeklyData.May_Actual_WEEK3,
//                 officerBudgetWeeklyData.May_Actual_WEEK4,
//                 officerBudgetWeeklyData.June_budget_WEEK1,
//                 officerBudgetWeeklyData.June_budget_WEEK2,
//                 officerBudgetWeeklyData.June_budget_WEEK3,
//                 officerBudgetWeeklyData.June_budget_WEEK4,
//                 officerBudgetWeeklyData.June_Actual_WEEK1,
//                 officerBudgetWeeklyData.June_Actual_WEEK2,
//                 officerBudgetWeeklyData.June_Actual_WEEK3,
//                 officerBudgetWeeklyData.June_Actual_WEEK4,
//                 officerBudgetWeeklyData.July_budget_WEEK1,
//                 officerBudgetWeeklyData.July_budget_WEEK2,
//                 officerBudgetWeeklyData.July_budget_WEEK3,
//                 officerBudgetWeeklyData.July_budget_WEEK4,
//                 officerBudgetWeeklyData.July_Actual_WEEK1,
//                 officerBudgetWeeklyData.July_Actual_WEEK2,
//                 officerBudgetWeeklyData.July_Actual_WEEK3,
//                 officerBudgetWeeklyData.July_Actual_WEEK4,
//                 officerBudgetWeeklyData.August_budget_WEEK1,
//                 officerBudgetWeeklyData.August_budget_WEEK2,
//                 officerBudgetWeeklyData.August_budget_WEEK3,
//                 officerBudgetWeeklyData.August_budget_WEEK4,
//                 officerBudgetWeeklyData.August_Actual_WEEK1,
//                 officerBudgetWeeklyData.August_Actual_WEEK2,
//                 officerBudgetWeeklyData.August_Actual_WEEK3,
//                 officerBudgetWeeklyData.August_Actual_WEEK4,
//                 officerBudgetWeeklyData.September_budget_WEEK1,
//                 officerBudgetWeeklyData.September_budget_WEEK2,
//                 officerBudgetWeeklyData.September_budget_WEEK3,
//                 officerBudgetWeeklyData.September_budget_WEEK4,
//                 officerBudgetWeeklyData.September_Actual_WEEK1,
//                 officerBudgetWeeklyData.September_Actual_WEEK2,
//                 officerBudgetWeeklyData.September_Actual_WEEK3,
//                 officerBudgetWeeklyData.September_Actual_WEEK4,
//                 officerBudgetWeeklyData.October_budget_WEEK1,
//                 officerBudgetWeeklyData.October_budget_WEEK2,
//                 officerBudgetWeeklyData.October_budget_WEEK3,
//                 officerBudgetWeeklyData.October_budget_WEEK4,
//                 officerBudgetWeeklyData.October_Actual_WEEK1,
//                 officerBudgetWeeklyData.October_Actual_WEEK2,
//                 officerBudgetWeeklyData.October_Actual_WEEK3,
//                 officerBudgetWeeklyData.October_Actual_WEEK4,
//                 officerBudgetWeeklyData.November_budget_WEEK1,
//                 officerBudgetWeeklyData.November_budget_WEEK2,
//                 officerBudgetWeeklyData.November_budget_WEEK3,
//                 officerBudgetWeeklyData.November_budget_WEEK4,
//                 officerBudgetWeeklyData.November_Actual_WEEK1,
//                 officerBudgetWeeklyData.November_Actual_WEEK2,
//                 officerBudgetWeeklyData.November_Actual_WEEK3,
//                 officerBudgetWeeklyData.November_Actual_WEEK4,
//                 officerBudgetWeeklyData.December_budget_WEEK1,
//                 officerBudgetWeeklyData.December_budget_WEEK2,
//                 officerBudgetWeeklyData.December_budget_WEEK3,
//                 officerBudgetWeeklyData.December_budget_WEEK4,
//                 officerBudgetWeeklyData.December_Actual_WEEK1,
//                 officerBudgetWeeklyData.December_Actual_WEEK2,
//                 officerBudgetWeeklyData.December_Actual_WEEK3,
//                 officerBudgetWeeklyData.December_Actual_WEEK4,
//                 officerBudgetWeeklyData.Actual_total,
//                 officerBudgetWeeklyData.outstanding,
//                 officerBudgetWeeklyData.electoral_area,
//             ]
//         );
//         res.status(201).json({ message: 'Officer budget weekly record created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating officer budget weekly record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read all officer budget weekly records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.query('SELECT * FROM tb_officerbudgetWeekly');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error in getting officer budget weekly records', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read officer budget weekly record by id
// router.get('/:id/:fiscal_year', async (req: Request, res: Response) => {
//     const { id, fiscal_year } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.query('SELECT * FROM tb_officerbudgetWeekly WHERE id = ? AND fiscal_year = ?', [id, fiscal_year]);
//         if (Array.isArray(rows) && rows.length == 0) {          
//             res.status(404).json({ message: 'Officer budget weekly record not found' });
//             return
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error in getting officer budget weekly record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Update officer budget weekly record by id
// router.put('/:id/:fiscal_year', async (req: Request, res: Response): Promise<void> => {
//     const { id, fiscal_year } = req.params;
//     const officerBudgetWeeklyData: OfficerBudgetWeeklyData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.query('SELECT * FROM tb_officerbudgetWeekly WHERE id = ? AND fiscal_year = ?', [id, fiscal_year]);
//         if (Array.isArray(rows) && rows.length == 0) {          
//             res.status(404).json({ message: 'Officer budget weekly record not found' });
//             return
//         }
//         // Update the officer budget weekly data
//         const [result] = await connection.query(
//             `UPDATE tb_officerbudgetWeekly SET 
//             officer_no = ?, officer_name = ?, fiscal_year = ?, annual_budget = ?, weekly_budget = ?, 
//             January_budget_WEEK1 = ?, January_budget_WEEK2 = ?, January_budget_WEEK3 = ?, January_budget_WEEK4 = ?, 
//             January_Actual_WEEK1 = ?, January_Actual_WEEK2 = ?, January_Actual_WEEK3 = ?, January_Actual_WEEK4 = ?,
//             February_budget_WEEK1 = ?, February_budget_WEEK2 = ?, February_budget_WEEK3 = ?, February_budget_WEEK4 = ?,
//             February_Actual_WEEK1 = ?, February_Actual_WEEK2 = ?, February_Actual_WEEK3 = ?, February_Actual_WEEK4 = ?,
//             March_budget_WEEK1 = ?, March_budget_WEEK2 = ?, March_budget_WEEK3 = ?, March_budget_WEEK4 = ?,
//             March_Actual_WEEK1 = ?, March_Actual_WEEK2 = ?, March_Actual_WEEK3 = ?, March_Actual_WEEK4 = ?,
//             April_budget_WEEK1 = ?, April_budget_WEEK2 = ?, April_budget_WEEK3 = ?, April_budget_WEEK4 = ?,
//             April_Actual_WEEK1 = ?, April_Actual_WEEK2 = ?, April_Actual_WEEK3 = ?, April_Actual_WEEK4 = ?,
//             May_budget_WEEK1 = ?, May_budget_WEEK2 = ?, May_budget_WEEK3 = ?, May_budget_WEEK4 = ?,
//             May_Actual_WEEK1 = ?, May_Actual_WEEK2 = ?, May_Actual_WEEK3 = ?, May_Actual_WEEK4 = ?,
//             June_budget_WEEK1 = ?, June_budget_WEEK2 = ?, June_budget_WEEK3 = ?, June_budget_WEEK4 = ?,
//             June_Actual_WEEK1 = ?, June_Actual_WEEK2 = ?, June_Actual_WEEK3 = ?, June_Actual_WEEK4 = ?,
//             July_budget_WEEK1 = ?, July_budget_WEEK2 = ?, July_budget_WEEK3 = ?, July_budget_WEEK4 = ?,
//             July_Actual_WEEK1 = ?, July_Actual_WEEK2 = ?, July_Actual_WEEK3 = ?, July_Actual_WEEK4 = ?,
//             August_budget_WEEK1 = ?, August_budget_WEEK2 = ?, August_budget_WEEK3 = ?, August_budget_WEEK4 = ?,
//             August_Actual_WEEK1 = ?, August_Actual_WEEK2 = ?, August_Actual_WEEK3 = ?, August_Actual_WEEK4 = ?,
//             September_budget_WEEK1 = ?, September_budget_WEEK2 = ?, September_budget_WEEK3 = ?, September_budget_WEEK4 = ?,
//             September_Actual_WEEK1 = ?, September_Actual_WEEK2 = ?, September_Actual_WEEK3 = ?, September_Actual_WEEK4 = ?,
//             October_budget_WEEK1 = ?, October_budget_WEEK2 = ?, October_budget_WEEK3 = ?, October_budget_WEEK4 = ?,
//             October_Actual_WEEK1 = ?, October_Actual_WEEK2 = ?, October_Actual_WEEK3 = ?, October_Actual_WEEK4 = ?,
//             November_budget_WEEK1 = ?, November_budget_WEEK2 = ?, November_budget_WEEK3 = ?, November_budget_WEEK4 = ?,
//             November_Actual_WEEK1 = ?, November_Actual_WEEK2 = ?, November_Actual_WEEK3 = ?, November_Actual_WEEK4 = ?,
//             December_budget_WEEK1 = ?, December_budget_WEEK2 = ?, December_budget_WEEK3 = ?, December_budget_WEEK4 = ?,
//             December_Actual_WEEK1 = ?, December_Actual_WEEK2 = ?, December_Actual_WEEK3 = ?, December_Actual_WEEK4 = ?,
//             Actual_total = ?, outstanding = ?, electoral_area = ?
//             WHERE id = ?`,
//             [
//                 officerBudgetWeeklyData.officer_no,
//                 officerBudgetWeeklyData.officer_name,
//                 officerBudgetWeeklyData.fiscal_year,
//                 officerBudgetWeeklyData.annual_budget,
//                 officerBudgetWeeklyData.weekly_budget,
//                 officerBudgetWeeklyData.January_budget_WEEK1,
//                 officerBudgetWeeklyData.January_budget_WEEK2,
//                 officerBudgetWeeklyData.January_budget_WEEK3,
//                 officerBudgetWeeklyData.January_budget_WEEK4,
//                 officerBudgetWeeklyData.January_Actual_WEEK1,
//                 officerBudgetWeeklyData.January_Actual_WEEK2,
//                 officerBudgetWeeklyData.January_Actual_WEEK3,
//                 officerBudgetWeeklyData.January_Actual_WEEK4,
//                 officerBudgetWeeklyData.February_budget_WEEK1,
//                 officerBudgetWeeklyData.February_budget_WEEK2,
//                 officerBudgetWeeklyData.February_budget_WEEK3,
//                 officerBudgetWeeklyData.February_budget_WEEK4,
//                 officerBudgetWeeklyData.February_Actual_WEEK1,
//                 officerBudgetWeeklyData.February_Actual_WEEK2,
//                 officerBudgetWeeklyData.February_Actual_WEEK3,
//                 officerBudgetWeeklyData.February_Actual_WEEK4,
//                 officerBudgetWeeklyData.March_budget_WEEK1,
//                 officerBudgetWeeklyData.March_budget_WEEK2,
//                 officerBudgetWeeklyData.March_budget_WEEK3,
//                 officerBudgetWeeklyData.March_budget_WEEK4,
//                 officerBudgetWeeklyData.March_Actual_WEEK1,
//                 officerBudgetWeeklyData.March_Actual_WEEK2,
//                 officerBudgetWeeklyData.March_Actual_WEEK3,
//                 officerBudgetWeeklyData.March_Actual_WEEK4,
//                 officerBudgetWeeklyData.April_budget_WEEK1,
//                 officerBudgetWeeklyData.April_budget_WEEK2,
//                 officerBudgetWeeklyData.April_budget_WEEK3,
//                 officerBudgetWeeklyData.April_budget_WEEK4,
//                 officerBudgetWeeklyData.April_Actual_WEEK1,
//                 officerBudgetWeeklyData.April_Actual_WEEK2,
//                 officerBudgetWeeklyData.April_Actual_WEEK3,
//                 officerBudgetWeeklyData.April_Actual_WEEK4,
//                 officerBudgetWeeklyData.May_budget_WEEK1,
//                 officerBudgetWeeklyData.May_budget_WEEK2,
//                 officerBudgetWeeklyData.May_budget_WEEK3,
//                 officerBudgetWeeklyData.May_budget_WEEK4,
//                 officerBudgetWeeklyData.May_Actual_WEEK1,
//                 officerBudgetWeeklyData.May_Actual_WEEK2,
//                 officerBudgetWeeklyData.May_Actual_WEEK3,
//                 officerBudgetWeeklyData.May_Actual_WEEK4,
//                 officerBudgetWeeklyData.June_budget_WEEK1,
//                 officerBudgetWeeklyData.June_budget_WEEK2,
//                 officerBudgetWeeklyData.June_budget_WEEK3,
//                 officerBudgetWeeklyData.June_budget_WEEK4,
//                 officerBudgetWeeklyData.June_Actual_WEEK1,
//                 officerBudgetWeeklyData.June_Actual_WEEK2,
//                 officerBudgetWeeklyData.June_Actual_WEEK3,
//                 officerBudgetWeeklyData.June_Actual_WEEK4,
//                 officerBudgetWeeklyData.July_budget_WEEK1,
//                 officerBudgetWeeklyData.July_budget_WEEK2,
//                 officerBudgetWeeklyData.July_budget_WEEK3,
//                 officerBudgetWeeklyData.July_budget_WEEK4,
//                 officerBudgetWeeklyData.July_Actual_WEEK1,
//                 officerBudgetWeeklyData.July_Actual_WEEK2,
//                 officerBudgetWeeklyData.July_Actual_WEEK3,
//                 officerBudgetWeeklyData.July_Actual_WEEK4,
//                 officerBudgetWeeklyData.August_budget_WEEK1,
//                 officerBudgetWeeklyData.August_budget_WEEK2,
//                 officerBudgetWeeklyData.August_budget_WEEK3,
//                 officerBudgetWeeklyData.August_budget_WEEK4,
//                 officerBudgetWeeklyData.August_Actual_WEEK1,
//                 officerBudgetWeeklyData.August_Actual_WEEK2,
//                 officerBudgetWeeklyData.August_Actual_WEEK3,
//                 officerBudgetWeeklyData.August_Actual_WEEK4,
//                 officerBudgetWeeklyData.September_budget_WEEK1,
//                 officerBudgetWeeklyData.September_budget_WEEK2,
//                 officerBudgetWeeklyData.September_budget_WEEK3,
//                 officerBudgetWeeklyData.September_budget_WEEK4,
//                 officerBudgetWeeklyData.September_Actual_WEEK1,
//                 officerBudgetWeeklyData.September_Actual_WEEK2,
//                 officerBudgetWeeklyData.September_Actual_WEEK3,
//                 officerBudgetWeeklyData.September_Actual_WEEK4,
//                 officerBudgetWeeklyData.October_budget_WEEK1,
//                 officerBudgetWeeklyData.October_budget_WEEK2,
//                 officerBudgetWeeklyData.October_budget_WEEK3,
//                 officerBudgetWeeklyData.October_budget_WEEK4,
//                 officerBudgetWeeklyData.October_Actual_WEEK1,
//                 officerBudgetWeeklyData.October_Actual_WEEK2,
//                 officerBudgetWeeklyData.October_Actual_WEEK3,
//                 officerBudgetWeeklyData.October_Actual_WEEK4,
//                 officerBudgetWeeklyData.November_budget_WEEK1,
//                 officerBudgetWeeklyData.November_budget_WEEK2,
//                 officerBudgetWeeklyData.November_budget_WEEK3,
//                 officerBudgetWeeklyData.November_budget_WEEK4,
//                 officerBudgetWeeklyData.November_Actual_WEEK1,
//                 officerBudgetWeeklyData.November_Actual_WEEK2,
//                 officerBudgetWeeklyData.November_Actual_WEEK3,
//                 officerBudgetWeeklyData.November_Actual_WEEK4,
//                 officerBudgetWeeklyData.December_budget_WEEK1,
//                 officerBudgetWeeklyData.December_budget_WEEK2,
//                 officerBudgetWeeklyData.December_budget_WEEK3,
//                 officerBudgetWeeklyData.December_budget_WEEK4,
//                 officerBudgetWeeklyData.December_Actual_WEEK1,
//                 officerBudgetWeeklyData.December_Actual_WEEK2,
//                 officerBudgetWeeklyData.December_Actual_WEEK3,
//                 officerBudgetWeeklyData.December_Actual_WEEK4,
//                 officerBudgetWeeklyData.Actual_total,
//                 officerBudgetWeeklyData.outstanding,
//                 officerBudgetWeeklyData.electoral_area,
//                 id,
//             ],
//         );
//         res.json({ message: 'Officer budget weekly record updated successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating officer budget weekly record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Delete officer budget weekly record by id
// router.delete('/:id/:fiscal_year', async (req: Request, res: Response): Promise<void> => {
//     const { id, fiscal_year } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.query('SELECT * FROM tb_officerbudgetWeekly WHERE id = ? AND fiscal_year = ?', [id, fiscal_year]);
//         if (Array.isArray(rows) && rows.length == 0) {          
//             res.status(404).json({ message: 'Officer budget weekly record not found' });
//             return
//         }
//         // Delete the officer budget weekly record
//         const [result] = await connection.query('DELETE FROM tb_officerbudgetWeekly WHERE id = ?', [id]);
//         res.json({ message: 'Officer budget weekly record deleted successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting officer budget weekly record', error });
//     } finally {
//         connection.end();
//     }
// });
// export default router;
//# sourceMappingURL=officerBudgetWeeklyRoutes.js.map