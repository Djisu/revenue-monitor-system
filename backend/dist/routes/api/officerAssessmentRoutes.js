// backend/src/routes/officerAssessmentRoutes.ts
import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
// import { createClient } from '../../db.js';
const router = Router();
// Load environment variables from .env file
dotenv.config();
// experiment ///
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
// Determine the environment (development or production)
const env = process.env.NODE_ENV || 'development'; // Defaults to 'development'
console.log('[BACKEND] Initial NODE_ENV:', process.env.NODE_ENV); // Debugging log
// Construct the path to the appropriate .env file from the root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const permitDir = path.join(__dirname, 'permits');
//const rootDir = path.resolve(__dirname, '..');
const envPath = path.resolve(__dirname, `../.env.${env}`);
console.log('[BACKEND] envPath:', envPath); // Debugging log
// Check if the .env file exists
if (!fs.existsSync(envPath)) {
    console.error(`[BACKEND] .env file not found at ${envPath}. Please ensure the file exists.`);
    process.exit(1); // Exit the process if the file is not found
}
// Load the environment variables from the .env file
dotenv.config({ path: envPath });
console.log('[BACKEND] environment:', env);
console.log('[BACKEND] NODE_ENV after dotenv.config:', process.env.NODE_ENV); // Debugging log
// Example usage of environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
console.log('Initial NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', DB_HOST);
console.log('DB_USER:', DB_USER);
console.log('DB_NAME:', DB_NAME);
console.log('DB_PORT:', DB_PORT);
console.log('DB_PASSWORD:', DB_PASSWORD);
console.log('JWT_SECRET:', JWT_SECRET);
// SSL configuration
let sslConfig;
if (process.env.NODE_ENV === 'production') {
    sslConfig = { rejectUnauthorized: true }; // Important for Render.com
}
else {
    sslConfig = false;
}
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    ssl: sslConfig,
};
const pool = new Pool(dbConfig);
// end of experiment ///
async function getOfficerAssessments() {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM officerbudget ORDER BY officer_no ASC');
        return rows.map(row => row.officer_no);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            return [];
            //res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }
        else {
            return [];
            //res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }
    }
    finally {
        client.release();
    }
}
async function getOfficers() {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT officer_no, officer_name FROM officer');
        return rows;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            return [];
            //res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }
        else {
            return [];
            //res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }
    }
}
// async function getMonthName (month: number): Promise<string> {
//     switch (month) {
//         case 1:
//             return 'January';
//             case 2:
//             return 'February';
//         case 3:
//             return 'March';
//             case 4:
//             return 'April';
//             case 5:
//             return 'May';
//             case 6:
//             return 'June';
//             case 7:
//             return 'July';
//             case 8:
//             return 'August';
//             case 9:
//             return 'September';
//             case 10:
//             return 'October';
//             case 11:
//             return 'November';
//             case 12:
//             return 'December';
//             default:
//             return 'Unknown';
//     }
// }
// async function getAmountByOfficerAndMonth(monthPaid: string, officerNo: string, fiscalYear: number): Promise<number> {
//     console.log('in getAmountByOfficerAndMonth helper function', officerNo);
//     const officerName = await GetOfficerName(officerNo);
//     const month = await getMonthName(Number(monthPaid));    
//     const client = await pool.connect()
//     try {
//         // Define the SQL query
//         const query = `
//             SELECT 
//                 paidamount
//             FROM buspayments 
//             WHERE officer_no = $1 
//               AND fiscal_year = $2 
//               AND monthpaid = $3
//         `;
//         // Log the query for debugging
//         console.log('Executing query:', query, 'with parameters:', [officerName, fiscalYear, month]);
//         // Execute the query
//         const { rows } = await client.query(query, [officerNo, fiscalYear, month]);
//         console.log('THIS IS THE paidamount: ', rows[0].paidamount);
//         // Return the total sum or 0 if no rows were found
//         return rows.length > 0 && rows[0].paidamount !== null ? rows[0].paidamount : 0; 
//     } catch (err: any) {
//         console.error('Error fetching paidamount by officer and month:', err);
//         throw err; // Rethrow the error for handling by the caller
//     }finally{
//         client.release()
//     }
// }
async function deleteOfficerMonthAssess() {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM officermonthassess');
    }
    catch (err) {
        console.error('Error deleting officer month assess:', err);
        throw err;
    }
    finally {
        client.release();
    }
}
async function insertOfficerMonthAssess(data) {
    const client = await pool.connect();
    try {
        const insertQuery = `
            INSERT INTO officermonthassess (officer_name, month, amount, fiscalyear) 
            VALUES ($1, $2, $3, $4)
        `;
        for (const item of data) {
            await client.query(insertQuery, [item.officer_name, item.month, item.amount, item.fiscalyear]);
        }
    }
    catch (err) {
        console.error('Error inserting officer month assess:', err);
    }
    finally {
        client.release();
    }
}
// Helper function to insert officer assessment
async function GetOfficerName(officerNo) {
    const client = await pool.connect();
    console.log('in getOfficerName helper function', officerNo);
    const result = await client.query('SELECT officer_name FROM officer WHERE officer_no = $1', [officerNo]);
    if (result.rows.length === 0) {
        return 'Officer name NOT FOUND!!';
    }
    console.log('THIS IS THE officer_name: ', result.rows[0].officer_name);
    return result.rows[0].officer_name;
}
// Get bills distributed
router.get('/billsDistributed/:officer_no/:fiscal_year', async (req, res) => {
    console.log('in router.get(/billsDistributed/:officer_no/:fiscal_year');
    const client = await pool.connect();
    const { officer_no, fiscal_year } = req.params;
    try {
        const result = await client.query('SELECT SUM(current_balance) as totsum FROM busscurrbalance WHERE assessmentby = $1 AND fiscalyear = $2', [officer_no, fiscal_year]);
        if (result.rows.length == 0) {
            res.status(404).json(0);
            return;
        }
        res.status(200).json(result.rows[0].totsum); // Send the totsum directly
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment record', error });
    }
    finally {
        client.release();
    }
});
router.get('/fiscalYears', async (req, res) => {
    console.log('in router.get(/officerAssessment/fiscalYears)');
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT DISTINCT fiscal_year FROM buspayments ORDER BY fiscal_year');
        const fiscalYears = rows.map(row => ({ fiscal_year: row.fiscal_year })); // Map to objects
        res.status(200).json(fiscalYears);
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        else {
            res.status(500).json({ error: 'Unknown Error' });
            return;
        }
    }
    finally {
        client.release();
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const params = req.body;
        console.log('in router.post(/create: ', params);
        const busYear = parseInt(params.fiscalYear, 10);
        // Delete existing record
        // const deleteResult = await client.query('DELETE FROM officerassessment');
        // console.log('Delete result:', deleteResult.rowCount);
        const officerName = await GetOfficerName(params.officerNo);
        // Validate incoming data
        if (!params.officerNo || !params.fiscalYear) {
            console.log('MISSING PARAMS!!!');
            res.status(400).send('Missing required fields');
            return;
        }
        console.log('about to SELECT');
        const selectQuery = `SELECT * FROM officerassessment WHERE officer_no = $1 AND bus_year = $2`;
        const selectResult = await client.query(selectQuery, [params.officerNo, busYear]);
        if (selectResult.rows.length > 0) {
            const deleteQuery = `DELETE FROM officerassessment WHERE officer_no = $1 AND bus_year = $2`;
            const deleteResult = await client.query(deleteQuery, [params.officerNo, busYear]);
            console.log('Delete result:', deleteResult.rowCount); // Should log how many rows were deleted
        }
        console.log('after SELECT');
        console.log('about to INSERT');
        // Insert new record
        const insertQuery = `
            INSERT INTO officerassessment (
                officer_no, officer_name, noofclientsserved, valueofbillsdistributed, 
                bus_year, januaryamount, februaryamount, marchamount, aprilamount, 
                mayamount, juneamount, julyamount, augustamount, septemberamount, 
                octoberamount, novemberamount, decemberamount, totalreceipttodate, 
                balance, remarks
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, 
                $10, $11, $12, $13, $14, $15, $16, $17, $18, 
                $19, $20
            )
        `;
        const values = [
            params.officerNo,
            officerName,
            params.noOfClientsServed,
            params.valueOfBillsDistributed,
            busYear,
            params.JanuaryAmount,
            params.FebruaryAmount,
            params.MarchAmount,
            params.AprilAmount,
            params.MayAmount,
            params.JuneAmount,
            params.JulyAmount,
            params.AugustAmount,
            params.SeptemberAmount,
            params.OctoberAmount,
            params.NovemberAmount,
            params.DecemberAmount,
            params.totalReceiptToDate,
            params.balance,
            params.remarks,
        ];
        const insertResult = await client.query(insertQuery, values);
        console.log('Insert result:', insertResult.rowCount);
        await client.query('COMMIT');
        res.status(201).send('Officer assessment inserted successfully');
        return;
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating officer assessment:', err);
        res.status(500).send(err.message);
        return;
    }
    finally {
        client.release();
    }
});
// Months routes
// January route
router.get('/January/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/January/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'January'; // Hard-coded for this endpoint
    //const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is end back to the pool
    }
});
// February route
router.get('/February/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/February/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'February'; // Hard-coded for this endpoint
    // const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
        return;
    }
    finally {
        client.release(); // Ensure the client is end back to the pool end
    }
});
// March route
router.get('/March/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/March/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'March'; // Hard-coded for this endpoint
    //const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
        return;
    }
    finally {
        client.release(); // Ensure the client is end back to the pool
    }
});
// April route
router.get('/April/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/April/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'April'; // Hard-coded for this endpoint
    // const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
        return;
    }
    finally {
        client.release(); // Ensure the client is endd back to the pool
    }
});
// May route
router.get('/May/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/May/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'May'; // Hard-coded for this endpoint
    // const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
        return;
    }
    finally {
        client.release(); // Ensure the client is endd back to the pool
    }
});
// June route
router.get('/June/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/June/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'June'; // Hard-coded for this endpoint
    //const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
        return;
    }
    finally {
        client.release(); // Ensure the client is endd back to the pool
    }
});
// July route
router.get('/July/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/July/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'July'; // Hard-coded for this endpoint
    //const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is endd back to the pool
    }
});
// August route
router.get('/August/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/August/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'August'; // Hard-coded for this endpoint
    //const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
        return;
    }
    finally {
        client.release(); // Ensure the client is end back to the pool
    }
});
// September route
router.get('/September/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/September/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'September'; // Hard-coded for this endpoint
    //const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
        return;
    }
    finally {
        client.release(); // Ensure the client is endd back to the pool
    }
});
// October route
router.get('/October/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/October/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'October'; // Hard-coded for this endpoint
    //const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
    }
    finally {
        client.release(); // Ensure the client is endd back to the pool
    }
});
// November route
router.get('/November/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/November/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'November'; // Hard-coded for this endpoint
    //const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows[0]); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
        return;
    }
    finally {
        client.release(); // Ensure the client is endd back to the pool
    }
});
// December route
router.get('/December/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/December/:officerNo/:fiscalYear)');
    const client = await pool.connect();
    const { officerNo, fiscalYear } = req.params; // Use req.params
    const monthPaidx = 'December'; // Hard-coded for this endpoint
    //const officerName = await GetOfficerName(officerNo)
    try {
        const newFiscalYear = Number(fiscalYear);
        const query = `SELECT SUM(paidamount) AS totsum FROM "buspayments" WHERE "officer_no" = $1 AND "fiscal_year" = $2 AND monthpaid = $3 `;
        const result = await client.query(query, [officerNo, newFiscalYear, monthPaidx]);
        console.log('Query executed. Rows returned:', result.rows); // Log all rows
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
            return;
        }
        else {
            res.status(404).json({ message: 'No records found for the given parameters.' });
            return;
        }
    }
    catch (err) {
        console.error('Error fetching monthly amount:', err);
        res.status(500).json({ message: 'Error fetching monthly amount', error: err.message });
        return;
    }
    finally {
        client.release(); // Ensure the client is endd back to the pool
    }
});
router.get('/fetchClientsServed/:officerNo/:fiscalYear', async (req, res) => {
    console.log('in router.get(/fetchClientsServed/:officerNo/:fiscalYear', req.params);
    const { officerNo, fiscalYear } = req.params;
    if (!officerNo || !fiscalYear) {
        res.status(400).json({ error: 'Missing parameters' });
        return;
    }
    const client = await pool.connect();
    const newFiscalYear = Number(fiscalYear);
    // const officerName = await GetOfficerName(officerNo.toString());
    // console.log('officerName: ', officerName)
    try {
        const result = await client.query(`SELECT COUNT(buss_no) AS totcount FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2`, [officerNo, newFiscalYear]);
        // Check if the query returned any results
        if (result.rows.length === 0) {
            res.status(404).json(0); // Return 0 if no records found
            return;
        }
        console.log('result.rows[0].totcount: ', result.rows[0].totcount);
        // Return just the totsum value
        res.status(200).json(result.rows[0].totcount); // Send the totsum directly
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
    finally {
        client.release();
    }
});
router.get('/all', async (req, res) => {
    const client = await pool.connect();
    try {
        //const { officerNo, fiscalYear, monthPaid } = req.query as { officerNo: string; fiscalYear: string; monthPaid: string };
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
    finally {
        client.release();
    }
});
// Read all officer assessment records
router.get('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM officerassessment');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment records', error });
    }
    finally {
        client.release();
    }
});
// Read a single officer assessment record by officer_no
router.get('/:officer_no/:fiscal_year', async (req, res) => {
    const { officer_no, fiscal_year } = req.params;
    const client = await pool.connect();
    try {
        console.log('XXXXXXXVVVVVVVTTTTTTT');
        console.log('in router.get(/:officer_no/:fiscal_year): ', req.params);
        console.log('====================================');
        console.log('officer_no: ', officer_no);
        console.log('====================================');
        console.log('fiscal_year: ', fiscal_year);
        console.log('====================================');
        if (!officer_no || !fiscal_year) {
            console.log('invalid officer_no or fiscal_year');
            res.status(404).json({ message: 'Invalid officer_no or fiscal_year', data: [] });
            return;
        }
        console.log('Valid officer_no AND fiscal_year');
        const { rows } = await client.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND bus_year = $2', [officer_no, parseInt(fiscal_year, 10)]);
        if (rows.length == 0) {
            console.log('officer not found in officerassessment');
            res.status(404).json([]);
            return;
        }
        console.log('officerassessment fetched rows[0]: ', rows[0]);
        res.status(200).send({ message: 'Data found', data: rows[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment record', error });
    }
    finally {
        client.release();
    }
});
// Update an officer assessment record
router.put('/:officer_no/:fiscal_year', async (req, res) => {
    const { officer_no, fiscal_year } = req.params;
    const officerAssessmentData = req.body;
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND fiscal_year = $2', [officer_no, fiscal_year]);
        if (rows.length == 0) {
            res.status(404).json({ message: 'Officer assessment record not found' });
            return;
        }
        await client.query(`UPDATE officerassessment SET 
            officer_name = $1, Noofclientsserved = $2, valueofbillsdistributed = $3, bus_year = $4, 
            JanuaryAmount = $5, FebruaryAmount = $6, MarchAmount = $7, AprilAmount = $8, 
            MayAmount = $9, JuneAmount = $10, JulyAmount = $11, AugustAmount = $12, 
            SeptemberAmount = $13, OctoberAmount = $14, NovemberAmount = $15, 
            DecemberAmount = $16, totalReceiptTodate = $17, balance = $18, remarks = $19 
            WHERE officer_no = $20`, [
            officerAssessmentData.officer_name,
            officerAssessmentData.noofclientsserved,
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
        client.release();
    }
});
// Delete an officer assessment record
router.delete('/:officer_no/:fiscal_year', async (req, res) => {
    const { officer_no, fiscal_year } = req.params;
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND fiscal_year = $2', [officer_no, fiscal_year]);
        if (rows.length == 0) {
            res.status(409).json({ message: 'Officer assessment record does not exists' });
            return;
        }
        await client.query('DELETE FROM officerassessment WHERE officer_no = $1', [officer_no]);
        res.status(200).json({ message: 'Officer assessment record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer assessment record', error });
        return;
    }
    finally {
        client.release();
    }
});
// Endpoint to find the number of clients served
router.get('/clients-served/:officerNo/:fiscalYear', async (req, res) => {
    const { officerNo } = req.params;
    const fiscalYear = parseInt(req.params.fiscalYear, 10);
    const client = await pool.connect();
    // Validate fiscal year
    if (isNaN(fiscalYear)) {
        res.status(400).json({ error: 'Invalid fiscal year format' });
        return;
    }
    const query = `
        SELECT COUNT(buss_no) AS totsum 
        FROM buspayments 
        WHERE officer_no = $1 AND fiscal_year = $2
    `;
    const values = [officerNo, fiscalYear];
    try {
        const result = await client.query(query, values);
        if (result.rows.length > 0) {
            const totalClientsServed = parseInt(result.rows[0].totsum, 10);
            res.json({ totalClientsServed });
            return;
        }
        else {
            res.json({ totalClientsServed: 0 });
            return;
        }
    }
    catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    finally {
        client.release();
    }
});
// Endpoint to find the value of bills distributed
router.get('/bills-distributed/:officerNo/:fiscalYear', async (req, res) => {
    const { officerNo } = req.params;
    const fiscalYear = parseInt(req.params.fiscalYear, 10);
    const client = await pool.connect();
    // Validate fiscal year
    if (isNaN(fiscalYear)) {
        res.status(400).json({ error: 'Invalid fiscal year format' });
        return;
    }
    const query = `
        SELECT SUM(current_balance) AS totsum 
        FROM busscurrbalance 
        WHERE assessmentby = $1 AND fiscalyear = $2
    `;
    const values = [officerNo, fiscalYear];
    try {
        const result = await client.query(query, values);
        if (result.rows.length > 0) {
            const totalValueOfBillsDistributed = result.rows[0].totsum !== null ? parseFloat(result.rows[0].totsum) : 0;
            res.json({ totalValueOfBillsDistributed });
            return;
        }
        else {
            res.json({ totalValueOfBillsDistributed: 0 });
            return;
        }
    }
    catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    finally {
        client.release();
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
        res.status(400).json({ error: 'Invalid month or fiscal year format' });
        return;
    }
    const client = await pool.connect();
    try {
        const totalAmount = await findMonthlyAmount(officerNo, fiscalYear, monthMap[month]);
        res.json({ totalAmount });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }
    finally {
        client.release();
    }
});
// Helper function to find monthly amounts
const findMonthlyAmount = async (officerNo, fiscalYear, month) => {
    const client = await pool.connect();
    const query = `
        SELECT SUM(amount) AS totsum 
        FROM buspayments 
        WHERE officer_no = $1 
        AND fiscal_year = $2 
        AND (monthpaid = $3 OR monthpaid = $4)
    `;
    const values = [officerNo, fiscalYear, month, month.charAt(0)]; // month name and number
    try {
        const result = await client.query(query, values);
        return result.rows.length > 0 && result.rows[0].totsum !== null
            ? parseFloat(result.rows[0].totsum)
            : 0;
    }
    catch (error) {
        console.error('Error querying database:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
export default router;
//# sourceMappingURL=officerAssessmentRoutes.js.map