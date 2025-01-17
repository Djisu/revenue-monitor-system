import * as dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2/promise';
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
// Create a new officer budget weekly record
router.post('/', async (req, res) => {
    const officerBudgetWeeklyData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerbudgetWeekly WHERE officer_no = ? AND fiscal_year = ?', [officerBudgetWeeklyData.officer_no, officerBudgetWeeklyData.fiscal_year]);
        if (rows.length > 0) {
            res.status(409).json({ message: 'Officer budget weekly record already exists' });
            return;
        }
        // Insert the new officer budget weekly data
        const [result] = await connection.execute(`INSERT INTO tb_officerbudgetWeekly 
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
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
        connection.end();
    }
});
// Read all officer budget weekly records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerbudgetWeekly');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in getting officer budget weekly records', error });
    }
    finally {
        connection.end();
    }
});
// Read officer budget weekly record by id
router.get('/:id/:fiscal_year', async (req, res) => {
    const { id, fiscal_year } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerbudgetWeekly WHERE id = ? AND fiscal_year = ?', [id, fiscal_year]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Officer budget weekly record not found' });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in getting officer budget weekly record', error });
    }
    finally {
        connection.end();
    }
});
// Update officer budget weekly record by id
router.put('/:id/:fiscal_year', async (req, res) => {
    const { id, fiscal_year } = req.params;
    const officerBudgetWeeklyData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerbudgetWeekly WHERE id = ? AND fiscal_year = ?', [id, fiscal_year]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Officer budget weekly record not found' });
            return;
        }
        // Update the officer budget weekly data
        const [result] = await connection.execute(`UPDATE tb_officerbudgetWeekly SET 
            officer_no = ?, officer_name = ?, fiscal_year = ?, annual_budget = ?, weekly_budget = ?, 
            January_budget_WEEK1 = ?, January_budget_WEEK2 = ?, January_budget_WEEK3 = ?, January_budget_WEEK4 = ?, 
            January_Actual_WEEK1 = ?, January_Actual_WEEK2 = ?, January_Actual_WEEK3 = ?, January_Actual_WEEK4 = ?,
            February_budget_WEEK1 = ?, February_budget_WEEK2 = ?, February_budget_WEEK3 = ?, February_budget_WEEK4 = ?,
            February_Actual_WEEK1 = ?, February_Actual_WEEK2 = ?, February_Actual_WEEK3 = ?, February_Actual_WEEK4 = ?,
            March_budget_WEEK1 = ?, March_budget_WEEK2 = ?, March_budget_WEEK3 = ?, March_budget_WEEK4 = ?,
            March_Actual_WEEK1 = ?, March_Actual_WEEK2 = ?, March_Actual_WEEK3 = ?, March_Actual_WEEK4 = ?,
            April_budget_WEEK1 = ?, April_budget_WEEK2 = ?, April_budget_WEEK3 = ?, April_budget_WEEK4 = ?,
            April_Actual_WEEK1 = ?, April_Actual_WEEK2 = ?, April_Actual_WEEK3 = ?, April_Actual_WEEK4 = ?,
            May_budget_WEEK1 = ?, May_budget_WEEK2 = ?, May_budget_WEEK3 = ?, May_budget_WEEK4 = ?,
            May_Actual_WEEK1 = ?, May_Actual_WEEK2 = ?, May_Actual_WEEK3 = ?, May_Actual_WEEK4 = ?,
            June_budget_WEEK1 = ?, June_budget_WEEK2 = ?, June_budget_WEEK3 = ?, June_budget_WEEK4 = ?,
            June_Actual_WEEK1 = ?, June_Actual_WEEK2 = ?, June_Actual_WEEK3 = ?, June_Actual_WEEK4 = ?,
            July_budget_WEEK1 = ?, July_budget_WEEK2 = ?, July_budget_WEEK3 = ?, July_budget_WEEK4 = ?,
            July_Actual_WEEK1 = ?, July_Actual_WEEK2 = ?, July_Actual_WEEK3 = ?, July_Actual_WEEK4 = ?,
            August_budget_WEEK1 = ?, August_budget_WEEK2 = ?, August_budget_WEEK3 = ?, August_budget_WEEK4 = ?,
            August_Actual_WEEK1 = ?, August_Actual_WEEK2 = ?, August_Actual_WEEK3 = ?, August_Actual_WEEK4 = ?,
            September_budget_WEEK1 = ?, September_budget_WEEK2 = ?, September_budget_WEEK3 = ?, September_budget_WEEK4 = ?,
            September_Actual_WEEK1 = ?, September_Actual_WEEK2 = ?, September_Actual_WEEK3 = ?, September_Actual_WEEK4 = ?,
            October_budget_WEEK1 = ?, October_budget_WEEK2 = ?, October_budget_WEEK3 = ?, October_budget_WEEK4 = ?,
            October_Actual_WEEK1 = ?, October_Actual_WEEK2 = ?, October_Actual_WEEK3 = ?, October_Actual_WEEK4 = ?,
            November_budget_WEEK1 = ?, November_budget_WEEK2 = ?, November_budget_WEEK3 = ?, November_budget_WEEK4 = ?,
            November_Actual_WEEK1 = ?, November_Actual_WEEK2 = ?, November_Actual_WEEK3 = ?, November_Actual_WEEK4 = ?,
            December_budget_WEEK1 = ?, December_budget_WEEK2 = ?, December_budget_WEEK3 = ?, December_budget_WEEK4 = ?,
            December_Actual_WEEK1 = ?, December_Actual_WEEK2 = ?, December_Actual_WEEK3 = ?, December_Actual_WEEK4 = ?,
            Actual_total = ?, outstanding = ?, electoral_area = ?
            WHERE id = ?`, [
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
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating officer budget weekly record', error });
    }
    finally {
        connection.end();
    }
});
// Delete officer budget weekly record by id
router.delete('/:id/:fiscal_year', async (req, res) => {
    const { id, fiscal_year } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerbudgetWeekly WHERE id = ? AND fiscal_year = ?', [id, fiscal_year]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Officer budget weekly record not found' });
            return;
        }
        // Delete the officer budget weekly record
        const [result] = await connection.execute('DELETE FROM tb_officerbudgetWeekly WHERE id = ?', [id]);
        res.json({ message: 'Officer budget weekly record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer budget weekly record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=officerBudgetWeeklyRoutes.js.map