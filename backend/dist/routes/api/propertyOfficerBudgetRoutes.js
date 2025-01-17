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
// Create a new property officer budget record
router.post('/', async (req, res) => {
    const propertyOfficerBudgetData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficerbudget WHERE officer_no = ? AND fiscal_year = ?', [propertyOfficerBudgetData.officer_no, propertyOfficerBudgetData.fiscal_year]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Property officer budget record already exists' });
            return;
        }
        // Insert the new property officer budget data
        const [result] = await connection.execute(`INSERT INTO tb_PropertyOfficerbudget 
            (officer_no, officer_name, fiscal_year, annual_budget, monthly_budget, 
            January_budget, January_Actual, February_budget, February_Actual, 
            March_budget, March_Actual, April_budget, April_Actual, May_budget, 
            May_Actual, June_budget, June_Actual, July_budget, July_Actual, 
            August_budget, August_Actual, September_budget, September_Actual, 
            October_budget, October_Actual, November_budget, November_Actual, 
            December_budget, December_Actual, Actual_total, outstanding, electoral_area) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
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
        ]);
        res.status(201).json({ message: 'Property officer budget record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property officer budget record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Read all property officer budget records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficerbudget');
        res.json(rows);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property officer budget records', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Read a single property officer budget record by officer_no
router.get('/:officer_no/:fiscal_year', async (req, res) => {
    const { officer_no, fiscal_year } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficerbudget WHERE officer_no = ? AND fiscal_year = ?', [officer_no, fiscal_year]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
            return;
        }
        else {
            res.status(404).json({ message: 'Property officer budget record not found' });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property officer budget record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Update a property officer budget record
router.put('/:officer_no/:fiscal_year', async (req, res) => {
    const { officer_no, fiscal_year } = req.params;
    const propertyOfficerBudgetData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficerbudget WHERE officer_no = ? AND fiscal_year = ?', [propertyOfficerBudgetData.officer_no, propertyOfficerBudgetData.fiscal_year]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Property officer budget record already exists' });
            return;
        }
        // Update the property officer budget data
        const [result] = await connection.execute(`UPDATE tb_PropertyOfficerbudget 
            SET officer_name = ?, fiscal_year = ?, annual_budget = ?, monthly_budget = ?, 
            January_budget = ?, January_Actual = ?, February_budget = ?, February_Actual = ?, 
            March_budget = ?, March_Actual = ?, April_budget = ?, April_Actual = ?, 
            May_budget = ?, May_Actual = ?, June_budget = ?, June_Actual = ?, 
            July_budget = ?, July_Actual = ?, August_budget = ?, August_Actual = ?, 
            September_budget = ?, September_Actual = ?, October_budget = ?, 
            October_Actual = ?, November_budget = ?, November_Actual = ?, 
            December_budget = ?, December_Actual = ?, Actual_total = ?, 
            outstanding = ?, electoral_area = ? 
            WHERE officer_no = ?`, [
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
        ]);
        res.status(200).json({ message: 'Property officer budget record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property officer budget record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Delete a property officer budget record
router.delete('/:officer_no/:fiscal_year', async (req, res) => {
    const { officer_no, fiscal_year } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficerbudget WHERE officer_no = ? AND fiscal_year = ?', [officer_no, fiscal_year]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Property officer budget record already exists' });
            return;
        }
        // Delete the property officer budget record
        const [result] = await connection.execute('DELETE FROM tb_PropertyOfficerbudget WHERE officer_no = ?', [officer_no]);
        res.status(200).json({ message: 'Property officer budget record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property officer budget record', error });
        return;
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=propertyOfficerBudgetRoutes.js.map