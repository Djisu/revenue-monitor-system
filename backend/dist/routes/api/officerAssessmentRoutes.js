import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
const router = Router();
// Load environment variables from .env file
dotenv.config();
// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432'),
};
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});
async function getOfficerAssessments() {
    try {
        const { rows } = await pool.query('SELECT * FROM officerbudget ORDER BY officer_no ASC');
        return rows.map(row => row.officer_no);
    }
    catch (err) {
        console.error('Error fetching fiscal years:', err);
        throw err;
    }
}
async function getFiscalYears() {
    console.log('in getFiscalYears');
    try {
        const { rows } = await pool.query('SELECT DISTINCT fiscal_year FROM buspayments ORDER BY fiscal_year');
        console.log('rows: ', rows);
        return rows.map(row => row.fiscal_year);
    }
    catch (err) {
        console.error('Error fetching fiscal years:', err);
        throw err;
    }
}
async function getOfficers() {
    try {
        const { rows } = await pool.query('SELECT officer_no, officer_name FROM officer');
        return rows;
    }
    catch (err) {
        console.error('Error fetching officers:', err);
        throw err;
    }
}
async function getMonthName(month) {
    switch (month) {
        case 1:
            return 'January';
        case 2:
            return 'February';
        case 3:
            return 'March';
        case 4:
            return 'April';
        case 5:
            return 'May';
        case 6:
            return 'June';
        case 7:
            return 'July';
        case 8:
            return 'August';
        case 9:
            return 'September';
        case 10:
            return 'October';
        case 11:
            return 'November';
        case 12:
            return 'December';
        default:
            return 'Unknown';
    }
}
async function getAmountByOfficerAndMonth(monthPaid, officerNo, fiscalYear) {
    console.log('in getAmountByOfficerAndMonth helper function', officerNo);
    const officerName = await GetOfficerName(Number(officerNo));
    const month = await getMonthName(Number(monthPaid));
    try {
        // Define the SQL query
        const query = `
            SELECT 
                paidamount
            FROM buspayments 
            WHERE officer_no = $1 
              AND fiscal_year = $2 
              AND monthpaid = $3
        `;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerName, fiscalYear, month]);
        // Execute the query
        const { rows } = await pool.query(query, [officerNo, fiscalYear, month]);
        console.log('THIS IS THE paidamount: ', rows[0].paidamount);
        // Return the total sum or 0 if no rows were found
        return rows.length > 0 && rows[0].paidamount !== null ? rows[0].paidamount : 0;
    }
    catch (err) {
        console.error('Error fetching paidamount by officer and month:', err);
        throw err; // Rethrow the error for handling by the caller
    }
}
async function deleteOfficerMonthAssess() {
    try {
        await pool.query('DELETE FROM officermonthassess');
    }
    catch (err) {
        console.error('Error deleting officer month assess:', err);
        throw err;
    }
}
async function insertOfficerMonthAssess(data) {
    try {
        const insertQuery = `
            INSERT INTO officermonthassess (officer_name, month, amount, fiscalyear) 
            VALUES ($1, $2, $3, $4)
        `;
        for (let item of data) {
            await pool.query(insertQuery, [item.officer_name, item.month, item.amount, item.fiscalyear]);
        }
    }
    catch (err) {
        console.error('Error inserting officer month assess:', err);
    }
}
// Helper function to insert officer assessment
async function insertOfficerAssessment(data) {
    console.log('in insertOfficerAssessment: ', data);
    const insertQuery = `
        INSERT INTO officer_assessment (
            officer_no, officer_name, Noofclientsserved, valueofbillsdistributed, 
            bus_year, JanuaryAmount, FebruaryAmount, MarchAmount, AprilAmount, 
            MayAmount, JuneAmount, JulyAmount, AugustAmount, SeptemberAmount, 
            OctoberAmount, NovemberAmount, DecemberAmount, totalReceiptTodate, 
            balance, remarks
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, 
            $10, $11, $12, $13, $14, $15, $16, $17, $18, 
            $19, $20
        )
    `;
    const values = [
        data.officer_no,
        data.officer_name,
        data.Noofclientsserved,
        data.valueofbillsdistributed,
        data.bus_year,
        data.JanuaryAmount,
        data.FebruaryAmount,
        data.MarchAmount,
        data.AprilAmount,
        data.MayAmount,
        data.JuneAmount,
        data.JulyAmount,
        data.AugustAmount,
        data.SeptemberAmount,
        data.OctoberAmount,
        data.NovemberAmount,
        data.DecemberAmount,
        data.totalReceiptTodate,
        data.balance,
        data.remarks,
    ];
    try {
        const rows = await pool.query(insertQuery, values);
        if (rows.rowCount === 0) {
            throw new Error('Officer assessment record not inserted');
        }
        return 'Officer assessment record inserted successfully';
    }
    catch (err) {
        console.error('Error inserting officer assessment:', err);
        throw err; // Re-throw the error to be caught by the calling function
    }
}
async function GetOfficerName(officerNo) {
    // const client: PoolClient =await pool.connect();
    const result = await pool.query('SELECT officer_name FROM officer WHERE officer_no = $1', [officerNo]);
    if (result.rows.length === 0) {
        return 'Unknown';
    }
    return result.rows[0].officer_name;
}
// Get bills distributed
router.get('/billsDistributed/:officer_no/:fiscal_year', async (req, res) => {
    console.log('in router.get(/:officer_no/:fiscal_year');
    const { officer_no, fiscal_year } = req.params;
    const officerName = await GetOfficerName(Number(officer_no));
    try {
        const result = await pool.query('SELECT SUM(current_balance) as totsum FROM busscurrbalance WHERE assessmentby = $1 AND fiscalyear = $2', [officerName, fiscal_year]);
        if (result.rows.length == 0) {
            return res.status(404).json(0);
        }
        return res.status(200).json(result.rows[0].totsum); // Send the totsum directly
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment record', error });
    }
});
router.get('/fiscalYears', async (req, res) => {
    console.log('in router.get(/officerAssessment/fiscalYears)');
    try {
        const { rows } = await pool.query('SELECT DISTINCT fiscal_year FROM buspayments ORDER BY fiscal_year');
        const fiscalYears = rows.map(row => ({ fiscal_year: row.fiscal_year })); // Map to objects
        return res.status(200).json(fiscalYears);
    }
    catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
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
router.post('/officerMonthAssess', async (req, res) => {
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
router.delete('/officerMonthAssess', async (req, res) => {
    try {
        await deleteOfficerMonthAssess();
        res.send('Officer month assess deleted');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
router.post('/create', async (req, res) => {
    try {
        const params = req.body;
        console.log('in router.post(/create: ', params);
        // Validate incoming data if needed
        if (!params.officer_no || !params.bus_year) {
            return res.status(400).send('Missing required fields');
        }
        // Insert the officer assessment into the database
        await insertOfficerAssessment(params);
        res.status(201).send('Officer assessment inserted successfully');
    }
    catch (err) {
        console.error('Error creating officer assessment:', err);
        res.status(500).send(err.message);
    }
});
// Months routes
// January route
router.get('/January/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/January/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'January'; // Hard-coded for this endpoint
    const officerName = await GetOfficerName(parseInt(officerNo));
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        console.log('officerName:', officerName);
        console.log('newFiscalYear:', newFiscalYear);
        console.log('monthPaid:', monthPaidx);
        // Define the SQL query   WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 . . , [officerNo, newFiscalYear, monthPaidx]
        const query = `SELECT paidamount FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        // Log the query for debugging
        /// console.log('Executing query:', query, 'with parameters:', [officerName, newFiscalYear, monthPaidx]);
        // Execute the query
        const result = await client.query(query, [officerName, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// February route
router.get('/February/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'February'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// March route
router.get('/March/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'March'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// April route
router.get('/April/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'April'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// May route
router.get('/May/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'May'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// June route
router.get('/June/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'June'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// July route
router.get('/July/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'July'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// August route
router.get('/August/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'August'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// September route
router.get('/September/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'September'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// October route
router.get('/October/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'October'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// November route
router.get('/November/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'November'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// December route
router.get('/December/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/monthlyAmount/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaid = 'December'; // Hard-coded for this endpoint
    try {
        // Convert fiscalYear to a number
        const newFiscalYear = Number(fiscalYear);
        // Define the SQL query
        const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
        // Log the query for debugging
        console.log('Executing query:', query, 'with parameters:', [officerNo, newFiscalYear, monthPaid]);
        // Execute the query
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaid]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        else {
            return res.status(404).json({ message: 'No records found for the given parameters.' });
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is released back to the pool
    }
});
// router.get('/monthlyAmount/:monthPaid/:officerNo/:fiscalYear', async (req: Request, res: Response) => {
//     console.log('in router.get(/monthlyAmount/:monthPaid/:officerNo/:fiscalYear)');
//     const client: PoolClient = await pool.connect()
//         const { monthPaid, officerNo, fiscalYear } = req.params; // Use req.params
//         let officerName = await GetOfficerName(Number(officerNo));
//         let month = await getMonthName(Number(monthPaid));
//         let newFiscalYear = Number(fiscalYear) 
//         try {
//             // Define the SQL query
//             const query = `SELECT * FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2 AND monthpaid = $3`;
//             officerName = officerName.trim();
//             month = month.trim();
//             // console.log('officerName:', officerName, 'Type:', typeof officerName);
//             // console.log('newFiscalYear:', newFiscalYear, 'Type:', typeof newFiscalYear);
//             // console.log('month:', month, 'Type:', typeof month);
//             // Log the query for debugging
//             console.log('Executing query:', query, 'with parameters:', [officerName, newFiscalYear, month]);
//             // Execute the query
//             const result  = await client.query(query, [officerNo, newFiscalYear, month]);
//             console.log('Query executed. Rows returned:', result.rows[0]); // Log rows
//             if (result.rows.length > 0) {
//                 console.log('GGGGGGGGGGGG result.rows[0]: ', result.rows[0])
//                 return res.status(200).json(result.rows[0]);             
//             }
//             if (result.rows.length == 0) {
//                 console.log('XXXXXXXXXXXXXX rows[0] ', result.rows[0])
//                 return res.status(404).json(0);             
//             }
//             //console.log('rows[0].paidamount: ', result.rows[0].paidamount)
//             return res.status(200).json(result.rows[0].paidamount); // Send the paidamount directly
//     } catch (err) {
//         res.status(500).send((err as Error).message);
//         console.error('Error fetching monthly amount:', err);
//     }
// });
router.get('/all', async (req, res) => {
    try {
        const { officerNo, fiscalYear, monthPaid } = req.query;
        const rows = await getOfficerAssessments();
        if (rows.length == 0) {
            res.status(404).json([]);
            return;
        }
        res.status(200).json(rows);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
// // Create a new officer assessment record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const officerAssessmentData: OfficerAssessmentData = req.body;
//     try {
//         const { rows } = await pool.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND bus_year = $2', 
//         [officerAssessmentData.officer_no, officerAssessmentData.bus_year]);
//         if (rows.length > 0) {
//             res.status(409).json({ message: 'Officer assessment record already exists' });
//             return;
//         }
//         const { rows: result } = await pool.query(
//             `INSERT INTO officerassessment 
//             (officer_no, officer_name, Noofclientsserved, valueofbillsdistributed, bus_year, 
//             JanuaryAmount, FebruaryAmount, MarchAmount, AprilAmount, MayAmount, 
//             JuneAmount, JulyAmount, AugustAmount, SeptemberAmount, OctoberAmount, 
//             NovemberAmount, DecemberAmount, totalReceiptTodate, balance, remarks) 
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
//             [
//                 officerAssessmentData.officer_no,
//                 officerAssessmentData.officer_name,
//                 officerAssessmentData.Noofclientsserved,
//                 officerAssessmentData.valueofbillsdistributed,
//                 officerAssessmentData.bus_year,
//                 officerAssessmentData.JanuaryAmount,
//                 officerAssessmentData.FebruaryAmount,
//                 officerAssessmentData.MarchAmount,
//                 officerAssessmentData.AprilAmount,
//                 officerAssessmentData.MayAmount,
//                 officerAssessmentData.JuneAmount,
//                 officerAssessmentData.JulyAmount,
//                 officerAssessmentData.AugustAmount,
//                 officerAssessmentData.SeptemberAmount,
//                 officerAssessmentData.OctoberAmount,
//                 officerAssessmentData.NovemberAmount,
//                 officerAssessmentData.DecemberAmount,
//                 officerAssessmentData.totalReceiptTodate,
//                 officerAssessmentData.balance,
//                 officerAssessmentData.remarks,
//             ]
//         );
//         res.status(201).json({ message: 'Officer assessment record created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating officer assessment record', error });
//     }
// });
// Read all officer assessment records
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM officerassessment');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment records', error });
    }
});
// Read a single officer assessment record by officer_no
router.get('/:officer_no/:fiscal_year', async (req, res) => {
    const { officer_no, fiscal_year } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND fiscal_year = $2', [officer_no, fiscal_year]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'Officer assessment record not found' });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment record', error });
    }
});
// Update an officer assessment record
router.put('/:officer_no/:fiscal_year', async (req, res) => {
    const { officer_no, fiscal_year } = req.params;
    const officerAssessmentData = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND fiscal_year = $2', [officer_no, fiscal_year]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'Officer assessment record not found' });
            return;
        }
        const { rows: result } = await pool.query(`UPDATE officerassessment SET 
            officer_name = $1, Noofclientsserved = $2, valueofbillsdistributed = $3, bus_year = $4, 
            JanuaryAmount = $5, FebruaryAmount = $6, MarchAmount = $7, AprilAmount = $8, 
            MayAmount = $9, JuneAmount = $10, JulyAmount = $11, AugustAmount = $12, 
            SeptemberAmount = $13, OctoberAmount = $14, NovemberAmount = $15, 
            DecemberAmount = $16, totalReceiptTodate = $17, balance = $18, remarks = $19 
            WHERE officer_no = $20`, [
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
});
// Delete an officer assessment record
router.delete('/:officer_no/:fiscal_year', async (req, res) => {
    const { officer_no, fiscal_year } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND fiscal_year = $2', [officer_no, fiscal_year]);
        if (rows.length == 0) {
            res.status(409).json({ message: 'Officer assessment record does not exists' });
            return;
        }
        await pool.query('DELETE FROM officerassessment WHERE officer_no = $1', [officer_no]);
        res.status(200).json({ message: 'Officer assessment record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer assessment record', error });
        return;
    }
});
// Endpoint to find the number of clients served
router.get('/clients-served/:officerNo/:fiscalYear', async (req, res) => {
    const { officerNo } = req.params;
    const fiscalYear = parseInt(req.params.fiscalYear, 10);
    // Validate fiscal year
    if (isNaN(fiscalYear)) {
        return res.status(400).json({ error: 'Invalid fiscal year format' });
    }
    const query = `
        SELECT COUNT(buss_no) AS totsum 
        FROM tb_buspayments 
        WHERE officer_no = $1 AND fiscal_year = $2
    `;
    const values = [officerNo, fiscalYear];
    try {
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            const totalClientsServed = parseInt(result.rows[0].totsum, 10);
            return res.json({ totalClientsServed });
        }
        else {
            return res.json({ totalClientsServed: 0 });
        }
    }
    catch (error) {
        console.error('Error querying database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Endpoint to find the value of bills distributed
router.get('/bills-distributed/:officerNo/:fiscalYear', async (req, res) => {
    const { officerNo } = req.params;
    const fiscalYear = parseInt(req.params.fiscalYear, 10);
    // Validate fiscal year
    if (isNaN(fiscalYear)) {
        return res.status(400).json({ error: 'Invalid fiscal year format' });
    }
    const query = `
        SELECT SUM(current_balance) AS totsum 
        FROM tb_busscurrbalance 
        WHERE assessmentby = $1 AND fiscalyear = $2
    `;
    const values = [officerNo, fiscalYear];
    try {
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            const totalValueOfBillsDistributed = result.rows[0].totsum !== null ? parseFloat(result.rows[0].totsum) : 0;
            return res.json({ totalValueOfBillsDistributed });
        }
        else {
            return res.json({ totalValueOfBillsDistributed: 0 });
        }
    }
    catch (error) {
        console.error('Error querying database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Endpoint to get amounts for each month
router.get('/amount/:month/:officerNo/:fiscalYear', async (req, res) => {
    const monthMap = {
        january: '1',
        february: '2',
        march: '3',
        april: '4',
        may: '5',
        june: '6',
        july: '7',
        august: '8',
        september: '9',
        october: '10',
        november: '11',
        december: '12',
    };
    const month = req.params.month.toLowerCase();
    const { officerNo } = req.params;
    const fiscalYear = parseInt(req.params.fiscalYear, 10);
    // Validate fiscal year and month
    if (isNaN(fiscalYear) || !monthMap[month]) {
        return res.status(400).json({ error: 'Invalid month or fiscal year format' });
    }
    try {
        const totalAmount = await findMonthlyAmount(officerNo, fiscalYear, monthMap[month]);
        return res.json({ totalAmount });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Helper function to find monthly amounts
const findMonthlyAmount = async (officerNo, fiscalYear, month) => {
    const query = `
        SELECT SUM(amount) AS totsum 
        FROM tb_buspayments 
        WHERE officer_no = $1 
        AND fiscal_year = $2 
        AND (monthpaid = $3 OR monthpaid = $4)
    `;
    const values = [officerNo, fiscalYear, month, month.charAt(0)]; // month name and number
    try {
        const result = await pool.query(query, values);
        return result.rows.length > 0 && result.rows[0].totsum !== null
            ? parseFloat(result.rows[0].totsum)
            : 0;
    }
    catch (error) {
        console.error('Error querying database:', error);
        throw error;
    }
};
export default router;
//# sourceMappingURL=officerAssessmentRoutes.js.map