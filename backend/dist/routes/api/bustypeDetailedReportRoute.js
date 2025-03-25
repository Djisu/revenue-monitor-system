import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
dotenv.config(); // Load .env file from the default location
// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
const router = Router();
// Load environment variables from .env file
dotenv.config();
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
// CRUD Operations
// Create
router.post('/', async (req, res) => {
    const report = req.body;
    const query = `
        INSERT INTO bustypedetailedreport (electoral_area, buss_no, buss_name, buss_type, amountdue, amountpaid, balance, tot_grade) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [report.electoral_area, report.buss_no, report.buss_name, report.buss_type, report.amountdue, report.amountpaid, report.balance, report.tot_grade];
    try {
        const client = await pool.connect();
        await client.query(query, values);
        res.status(201).send('Report created');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error creating report');
    }
});
// Read All
router.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM bustypedetailedreport');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving reports');
    }
});
// Read One
router.get('/:buss_no', async (req, res) => {
    const buss_no = parseInt(req.params.buss_no);
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM bustypedetailedreport WHERE buss_no = $1', [buss_no]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        }
        else {
            res.status(404).send('Report not found');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving report');
    }
});
// Update
router.put('/:buss_no', async (req, res) => {
    const buss_no = parseInt(req.params.buss_no);
    const report = req.body;
    const query = `
        UPDATE bustypedetailedreport 
        SET electoral_area = $1, buss_name = $2, buss_type = $3, amountdue = $4, amountpaid = $5, balance = $6, tot_grade = $7 
        WHERE buss_no = $8
    `;
    const values = [report.electoral_area, report.buss_name, report.buss_type, report.amountdue, report.amountpaid, report.balance, report.tot_grade, buss_no];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        if (result.rowCount === 0) {
            res.status(404).send('Report not found');
        }
        else {
            res.status(200).send({ message: 'Report updated', data: result });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating report', data: 0 });
    }
});
// Delete
router.delete('/:buss_no', async (req, res) => {
    const buss_no = parseInt(req.params.buss_no);
    try {
        const client = await pool.connect();
        const result = await client.query('DELETE FROM bustypedetailedreport WHERE buss_no = $1', [buss_no]);
        if (result.rowCount === 0) {
            res.status(404).send({ message: 'Report not found', data: 0 });
        }
        else {
            res.status(200).send({ message: 'Report updated', data: result });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error deleting report', data: 0 });
    }
});
router.get('/all', async (req, res) => {
    console.log('in router.get(all');
    const client = await pool.connect();
    const bussResult = await client.query('SELECT * FROM bustypedetailedreport');
    console.log('after execution');
    console.log('bussResult.rowCount: ', bussResult.rowCount);
    if (bussResult.rowCount === 0) {
        return res.status(202).send({ message: 'Records not found', data: [] });
    }
    console.log('Records found');
    return res.status(200).send({ message: 'Records found', data: bussResult.rows });
});
router.get('/:zone/:businessType/:fiscalyear', async (req, res) => {
    console.log('in router.get(/:zone/:businessType/:fiscalyear');
    const { zone, businessType, fiscalyear } = req.params;
    console.log('zone', 'businessType', 'fiscalyear', zone, businessType, fiscalyear);
    try {
        const client = await pool.connect();
        console.log('about to delete');
        await client.query('DELETE FROM bustypedetailedreport');
        const businessesResult = await client.query('SELECT * FROM business WHERE  status = $1 AND buss_type = $2 AND electroral_area = $3 ORDER BY electroral_area ASC', ['Active', businessType, zone]);
        console.log('after delete');
        // Access the rows array
        const businesses = businessesResult.rows; // Assuming Business is your interface for the business records
        if (businessesResult.rowCount === 0) {
            console.log('Report not found');
            res.status(404).send({ message: 'Report not found', data: [] });
        }
        let varCurrRate = 0;
        let varTotPaid = 0;
        console.log('about to loop');
        // give me a for loop of businessesResult
        for (let i = 0; i < businesses.length; i++) {
            //const buss_no = businesses[i].buss_no;
            console.log('i: ');
            // Getting billing values for the current business
            const query = await client.query(`SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2`, [businesses[i].buss_no, fiscalyear]);
            if (query.rowCount === 0) {
                varCurrRate = 0;
            }
            else {
                varCurrRate = query.rows[0].totsum;
            }
            console.log('varCurrRate: ', varCurrRate);
            // Get payments for the current business
            const paymentsResult = await client.query(`SELECT SUM(paidamount) AS totsum FROM buspayments WHERE buss_no = $1 AND fiscal_year = $2`, [businesses[i].buss_no, fiscalyear]);
            if (paymentsResult.rowCount === 0) {
                varTotPaid = 0;
            }
            else {
                varTotPaid = paymentsResult.rows[0].totsum;
                console.log('varTotPaid: ', varTotPaid);
            }
            // insert into bustypedetailedreport
            const query2 = `    
                INSERT INTO bustypedetailedreport (electoral_area, buss_no, buss_name, buss_type, amountdue, amountpaid, balance, tot_grade) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            const values2 = [businesses[i].electroral_area,
                businesses[i].buss_no,
                businesses[i].buss_name,
                businesses[i].buss_type,
                varCurrRate,
                varTotPaid,
                varCurrRate - varTotPaid,
                businesses[i].tot_grade];
            await client.query(query2, values2);
            console.log('inserted into bustypedetailedreport');
        }
        const result = await client.query('SELECT * FROM bustypedetailedreport');
        console.log('Records found result.rows: ', result.rows);
        res.status(200).json({ message: 'Records found', data: result.rows });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving reports');
    }
});
export default router;
//# sourceMappingURL=bustypeDetailedReportRoute.js.map