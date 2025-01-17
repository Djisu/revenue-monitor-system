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
// Experimental code to get officer budget data
router.get('/fiscalYears', async (req, res) => {
    try {
        const fiscalYears = await getFiscalYears();
        res.json(fiscalYears);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
router.get('/officers', async (req, res) => {
    try {
        const officers = await getOfficers();
        res.json(officers);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
router.get('/officerbudget', async (req, res) => {
    try {
        const { fiscalYear, officerNo } = req.query;
        const officerBudget = await getOfficerBudget(Number(fiscalYear), officerNo);
        res.json(officerBudget);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
router.delete('/budgetAssess', async (req, res) => {
    try {
        await deleteBudgetAssess();
        res.send('Budget assess deleted');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
router.post('/budgetAssess', async (req, res) => {
    try {
        const data = req.body;
        await insertBudgetAssess(data);
        res.send('Budget assess inserted');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
//end of experimental code
// Create a new OffBudgetAssessment record
router.post('/', async (req, res) => {
    const assessmentData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Insert the new OffBudgetAssessment data
        const [result] = await connection.execute(`INSERT INTO tb_OffBudgetAssessment 
            (officer_name, JanuaryAmount, JanuaryBudget, FebruaryAmount, FebruaryBudget, 
            MarchAmount, MarchBudget, AprilAmount, AprilBudget, MayAmount, MayBudget, 
            JuneAmount, JuneBudget, JulyAmount, JulyBudget, AugustAmount, AugustBudget, 
            SeptemberAmount, SeptemberBudget, OctoberAmount, OctoberBudget, 
            NovemberAmount, NovemberBudget, DecemberAmount, DecemberBudget) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
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
        ]);
        res.status(201).json({ message: 'OffBudgetAssessment record created successfully' });
        return;
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating OffBudgetAssessment record', error });
    }
    finally {
        connection.end();
    }
});
// Read all OffBudgetAssessment records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_OffBudgetAssessment');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching OffBudgetAssessment records', error });
    }
    finally {
        connection.end();
    }
});
// Read a single OffBudgetAssessment record by officer_name
router.get('/:officer_name', async (req, res) => {
    const { officer_name } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_OffBudgetAssessment WHERE officer_name = ?', [officer_name]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'OffBudgetAssessment record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching OffBudgetAssessment record', error });
    }
    finally {
        connection.end();
    }
});
// Update an OffBudgetAssessment record
router.put('/:officer_name', async (req, res) => {
    const { officer_name } = req.params;
    const assessmentData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Update the OffBudgetAssessment data
        const [result] = await connection.execute(`UPDATE tb_OffBudgetAssessment SET 
            JanuaryAmount = ?, JanuaryBudget = ?, FebruaryAmount = ?, FebruaryBudget = ?, 
            MarchAmount = ?, MarchBudget = ?, AprilAmount = ?, AprilBudget = ?, 
            MayAmount = ?, MayBudget = ?, JuneAmount = ?, JuneBudget = ?, 
            JulyAmount = ?, JulyBudget = ?, AugustAmount = ?, AugustBudget = ?, 
            SeptemberAmount = ?, SeptemberBudget = ?, OctoberAmount = ?, OctoberBudget = ?, 
            NovemberAmount = ?, NovemberBudget = ?, DecemberAmount = ?, DecemberBudget = ? 
            WHERE officer_name = ?`, [
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
        ]);
        res.status(200).json({ message: 'OffBudgetAssessment record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating OffBudgetAssessment record', error });
    }
    finally {
        connection.end();
    }
});
// Delete an OffBudgetAssessment record
router.delete('/:officer_name', async (req, res) => {
    const { officer_name } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Delete the OffBudgetAssessment record
        const [result] = await connection.execute('DELETE FROM tb_OffBudgetAssessment WHERE officer_name = ?', [officer_name]);
        res.status(200).json({ message: 'OffBudgetAssessment record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting OffBudgetAssessment record', error });
    }
    finally {
        connection.end();
    }
});
async function getFiscalYears() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [result] = await connection.execute('SELECT DISTINCT fiscal_year FROM tb_officerbudget ORDER BY fiscal_year');
        return result.map(row => row.fiscal_year);
    }
    catch (err) {
        console.error('Error fetching fiscal years:', err);
        throw err;
    }
}
async function getOfficers() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [result] = await connection.execute('SELECT * FROM tb_officer');
        return result;
    }
    catch (err) {
        console.error('Error fetching officers:', err);
        throw err;
    }
}
// Make sure to replace dbConfig with your actual database configuration object.
async function getOfficerBudget(fiscalYear, officerNo) {
    let connection = null;
    try {
        // Ensure you have a connection to the database
        if (!connection) {
            connection = await mysql.createConnection(dbConfig); // replace dbConfig with your actual db config
        }
        if (connection) {
            const [rows, fields] = await connection.execute(`SELECT 
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
          WHERE fiscal_year = ? AND officer_no = ?
          GROUP BY officer_no, fiscal_year`, [fiscalYear, officerNo]);
            return rows;
        }
    }
    catch (err) {
        console.error('Error fetching officer budget:', err);
        throw err;
    }
    finally {
        if (connection) {
            await connection.end(); // Close the connection if it was opened
        }
    }
    return [];
}
async function deleteBudgetAssess() {
    let connection = null;
    try {
        // Ensure you have a connection to the database
        if (!connection) {
            connection = await mysql.createConnection(dbConfig); // replace dbConfig with your actual db config
        }
        return await connection.execute('DELETE FROM tb_BudgetAssess');
    }
    catch (err) {
        console.error('Error deleting budget assess:', err);
        throw err;
    }
}
async function insertBudgetAssess(data) {
    let connection = null;
    try {
        // Create a connection to the database
        connection = await mysql.createConnection(dbConfig); // Replace dbConfig with your actual configuration
        for (let item of data) {
            const [result] = await connection.execute(`INSERT INTO tb_BudgetAssess (month, budget, amount, variance, fiscalyear, assessmentby) 
         VALUES (?, ?, ?, ?, ?, ?)`, [
                item.month,
                item.budget,
                item.amount,
                item.budget - item.amount, // Calculate variance here
                item.fiscalYear,
                item.assessmentby
            ]);
        }
    }
    catch (err) {
        console.error('Error inserting budget assess:', err);
        throw err;
    }
    finally {
        if (connection) {
            await connection.end(); // Close the connection if it was opened
        }
    }
}
// async function insertBudgetAssess(data: AssessmentData[]) {
//   let connection: mysql.Connection | null = null;
//   try {
//     // Create a connection to the database
//     connection = await mysql.createConnection(dbConfig); // Replace dbConfig with your actual configuration
//     for (let item of data) {
//       const [result] = await connection.execute(
//         `INSERT INTO tb_BudgetAssess (month, budget, amount, variance, fiscalyear, assessmentby) 
//          VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           item.month,
//           item.budget,
//           item.amount,
//           item.budget - item.amount, // Calculate variance here
//           item.fiscalYear,
//           item.assessmentby
//         ]
//       );
//     }
//   } catch (err) {
//     console.error('Error inserting budget assess:', err);
//     throw err;
//   } finally {
//     if (connection) {
//       await connection.end(); // Close the connection if it was opened
//     }
//   }
// }
export default router;
//# sourceMappingURL=offBudgetAssessmentRoutes.js.map