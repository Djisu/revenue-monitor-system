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
async function getFiscalYears() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT DISTINCT fiscal_year FROM tb_busPayments ORDER BY fiscal_year');
        return rows.map(row => row.fiscal_year);
    }
    catch (err) {
        console.error('Error fetching fiscal years:', err);
        throw err;
    }
}
async function getOfficers() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        // Fetch the officers directly from the tb_officer table
        const [rows] = await connection.execute('SELECT officer_no, officer_name FROM tb_officer');
        return rows; // Type assertion to match the Officer interface
    }
    catch (err) {
        console.error('Error fetching officers:', err);
        throw err;
    }
}
async function getAmountByOfficerAndMonth(officerNo, fiscalYear, monthPaid) {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT 
                SUM(amount) AS totsum 
            FROM tb_buspayments 
            WHERE officer_no = ? 
              AND fiscal_year = ? 
              AND (monthpaid = ? OR monthpaid = CAST(? AS UNSIGNED))
        `, [officerNo, fiscalYear, monthPaid, monthPaid]);
        return rows[0]?.totsum ?? null; // Use optional chaining and nullish coalescing
    }
    catch (err) {
        console.error('Error fetching amount by officer and month:', err);
        throw err;
    }
}
async function deleteOfficerMonthAssess() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Execute the DELETE statement
        await connection.execute(`DELETE FROM tb_officerMonthAssess`);
    }
    catch (err) {
        console.error('Error deleting officer month assess:', err);
        throw err;
    }
    finally {
        // Ensure the connection is closed after the operation
        if (connection) {
            await connection.end();
        }
    }
}
async function insertOfficerMonthAssess(data) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Prepare an insert statement
        const insertQuery = `
          INSERT INTO tb_officerMonthAssess (officer_name, month, amount, fiscalyear) 
          VALUES (?, ?, ?, ?)
      `;
        for (let item of data) {
            await connection.execute(insertQuery, [item.officer_name, item.month, item.amount, item.fiscalyear]);
        }
    }
    catch (err) {
        console.error('Error inserting officer month assess:', err);
    }
    finally {
        connection.end(); // Always release the connection back to the pool
    }
}
router.get('/api/fiscalYears', async (req, res) => {
    try {
        const fiscalYears = await getFiscalYears();
        res.json(fiscalYears);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
router.get('/api/officers', async (req, res) => {
    try {
        const officers = await getOfficers();
        res.json(officers);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
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
router.delete('/api/officerMonthAssess', async (req, res) => {
    try {
        await deleteOfficerMonthAssess();
        res.send('Officer month assess deleted');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
router.post('/api/officerMonthAssess', async (req, res) => {
    try {
        const data = req.body;
        await insertOfficerMonthAssess(data);
        res.send('Officer month assess inserted');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
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
// Create a new officer assessment record
router.post('/', async (req, res) => {
    const officerAssessmentData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', [officerAssessmentData.officer_no, officerAssessmentData.bus_year]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Officer assessment record already exists' });
            return;
        }
        // Insert the new officer assessment data
        const [result] = await connection.execute(`INSERT INTO tb_officerAssessment 
            (officer_no, officer_name, Noofclientsserved, valueofbillsdistributed, bus_year, 
            JanuaryAmount, FebruaryAmount, MarchAmount, AprilAmount, MayAmount, 
            JuneAmount, JulyAmount, AugustAmount, SeptemberAmount, OctoberAmount, 
            NovemberAmount, DecemberAmount, totalReceiptTodate, balance, remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
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
        ]);
        res.status(201).json({ message: 'Officer assessment record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating officer assessment record', error });
    }
    finally {
        connection.end();
    }
});
// Read all officer assessment records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment records', error });
    }
    finally {
        connection.end();
    }
});
// Read a single officer assessment record by officer_no
router.get('/:officer_no/:bus_year', async (req, res) => {
    const { officer_no, bus_year } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', [officer_no, bus_year]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Officer assessment record not found' });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment record', error });
    }
    finally {
        connection.end();
    }
});
// Update an officer assessment record
router.put('/:officer_no/:bus_year', async (req, res) => {
    const { officer_no, bus_year } = req.params;
    const officerAssessmentData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', [officer_no, bus_year]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Officer assessment record not found' });
            return;
        }
        // Update the officer assessment data
        const [result] = await connection.execute(`UPDATE tb_officerAssessment SET 
            officer_name = ?, Noofclientsserved = ?, valueofbillsdistributed = ?, bus_year = ?, 
            JanuaryAmount = ?, FebruaryAmount = ?, MarchAmount = ?, AprilAmount = ?, 
            MayAmount = ?, JuneAmount = ?, JulyAmount = ?, AugustAmount = ?, 
            SeptemberAmount = ?, OctoberAmount = ?, NovemberAmount = ?, 
            DecemberAmount = ?, totalReceiptTodate = ?, balance = ?, remarks = ? 
            WHERE officer_no = ?`, [
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
        ]);
        res.status(200).json({ message: 'Officer assessment record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating officer assessment record', error });
    }
    finally {
        connection.end();
    }
});
// Delete an officer assessment record
router.delete('/:officer_no/:bus_year', async (req, res) => {
    const { officer_no, bus_year } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', [officer_no, bus_year]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Officer assessment record does not exists' });
            return;
        }
        // Delete the officer assessment record
        const [result] = await connection.execute('DELETE FROM tb_officerAssessment WHERE officer_no = ?', [officer_no]);
        res.status(200).json({ message: 'Officer assessment record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer assessment record', error });
        return;
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=officerAssessmentRoutes.js.map