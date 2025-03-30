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
router.get('/create/:firstDate/:lastDate/:zone/:bussType', async (req, res) => {
    try {
        const { firstDate, lastDate, zone, bussType } = req.params;
        console.log('in router.get(/create/:firstDate/:lastDate/:zone/:bussType');
        console.log('firstDate: ', firstDate);
        console.log('lastDate: ', lastDate);
        console.log('zone: ', zone);
        console.log('bussType: ', bussType);
        // Find year from cbolastdate
        const thisYear = lastDate.substring(0, 4);
        const client = await pool.connect();
        try {
            // Delete from bustypesummaryreport table
            await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4', [bussType, firstDate, lastDate, zone]);
            // Calculate current rate and balance for each electoral area
            let result;
            if (zone === 'All electoral areas') {
                result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND buss_type = $2', ['Active', bussType]);
            }
            else {
                result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND buss_type = $2 AND electroral_area = $3', ['Active', bussType, zone]);
            }
            console.log('about to loop through electoral areas');
            for (const row of result.rows) {
                // Calculate current rate
                let recSumm = 0;
                if (zone === 'All electoral areas') {
                    recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_no = $2', [thisYear, row.buss_no]);
                }
                else {
                    recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_no = $2 AND electoralarea = $3', [thisYear, row.buss_no, zone]);
                }
                console.log('about to calculate current rate');
                let varCurrRate = 0;
                if (recSumm.rows.length > 0 && recSumm.rows[0].totsum) {
                    varCurrRate = parseFloat(recSumm.rows[0].totsum);
                }
                // Calculate total payments
                if (zone === 'All electoral areas') {
                    recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2', [thisYear, bussType]);
                }
                else {
                    recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electroral_area = $3', [thisYear, bussType, zone]);
                }
                console.log('about to calculate total payments');
                let varPayment = 0;
                if (recSumm.rows.length > 0 && recSumm.rows[0].totpayments) {
                    varPayment = parseFloat(recSumm.rows[0].totpayments);
                }
                else {
                    varPayment = 0;
                }
                console.log('about to calculate balance');
                // Calculate balance
                const balance = varCurrRate - varPayment;
                let reportCheckResult = 0;
                let reportCheckQuery = '';
                console.log('about to check if report already exists');
                // Check if the report already exists
                if (zone === 'All electoral areas') {
                    reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $3 AND transdate <= $4';
                    reportCheckResult = await client.query(reportCheckQuery, [bussType, row.electoral_area, firstDate, lastDate]);
                }
                else {
                    reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND transdate >= $3 AND transdate <= $4';
                    reportCheckResult = await client.query(reportCheckQuery, [bussType, zone, firstDate, lastDate]);
                }
                console.log('reportCheckResult.rowCount: ', reportCheckResult.rowCount);
                if (reportCheckResult.rowCount === 0) {
                    // Insert new report
                    const insertQuery = `
                        INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate)
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `;
                    await client.query(insertQuery, [
                        bussType,
                        varCurrRate,
                        varPayment,
                        balance,
                        row.electoral_area,
                        lastDate,
                    ]);
                }
            }
            console.log('BusTypeSummaryReport created');
            // Select from bustypesummaryreport table
            let results;
            if (zone === 'All electoral areas') {
                results = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3`, [bussType, firstDate, lastDate]);
            }
            else {
                results = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`, [bussType, firstDate, lastDate, zone]);
            }
            console.log('results.rowCount: ', results.rowCount);
            let businessTypeSummaryReport = results.rows;
            if (businessTypeSummaryReport.length > 0) {
                console.log('BusTypeSummaryReport fetched');
                return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
            }
            else {
                console.log('No data found in bustypesummaryreport');
                return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Update
router.put('/update/:firstDate/:lastDate/:zone/:bussType', async (req, res) => {
    try {
        const { firstDate, lastDate, zone, bussType } = req.params;
        // Find year from cbolastdate
        const thisYear = lastDate.substring(0, 4);
        const client = await pool.connect();
        try {
            // Delete from bustypesummaryreport table
            await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4', [bussType, firstDate, lastDate, zone]);
            // Calculate current rate and balance for each electoral area
            let result;
            if (zone === 'All electoral areas') {
                result = await client.query('SELECT DISTINCT electoral_area FROM business WHERE status = $1 AND buss_type = $2', ['Active', bussType]);
            }
            else {
                result = await client.query('SELECT DISTINCT electoral_area FROM business WHERE status = $1 AND buss_type = $2 AND electoral_area = $3', ['Active', bussType, zone]);
            }
            for (const row of result.rows) {
                // Calculate current rate
                let recSumm = 0;
                if (zone === 'All electoral areas') {
                    recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2', [thisYear, bussType]);
                }
                else {
                    recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoral_area = $3', [thisYear, bussType, zone]);
                }
                let varCurrRate = 0;
                if (recSumm.rows.length > 0 && recSumm.rows[0].totsum) {
                    varCurrRate = parseFloat(recSumm.rows[0].totsum);
                }
                // Calculate total payments
                if (zone === 'All electoral areas') {
                    recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2', [thisYear, bussType]);
                }
                else {
                    recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoral_area = $3', [thisYear, bussType, zone]);
                }
                let varPayment = 0;
                if (recSumm.rows.length > 0 && recSumm.rows[0].totpayments) {
                    varPayment = parseFloat(recSumm.rows[0].totpayments);
                }
                else {
                    varPayment = 0;
                }
                // Calculate balance
                const balance = varCurrRate - varPayment;
                let reportCheckResult = 0;
                let reportCheckQuery = '';
                // Check if the report already exists
                if (zone === 'All electoral areas') {
                    reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $3 AND transdate <= $4';
                    reportCheckResult = await client.query(reportCheckQuery, [bussType, row.electoral_area, firstDate, lastDate]);
                }
                else {
                    reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND transdate >= $3 AND transdate <= $4';
                    reportCheckResult = await client.query(reportCheckQuery, [bussType, zone, firstDate, lastDate]);
                }
                if (reportCheckResult.rowCount === 0) {
                    // Insert new report                    
                    const insertQuery = `                    
                        INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate)
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `;
                    await client.query(insertQuery, [
                        bussType,
                        varCurrRate,
                        varPayment,
                        balance,
                        row.electoral_area,
                        lastDate,
                    ]);
                }
            }
            // Select from bustypesummaryreport table
            let results;
            if (zone === 'All electoral areas') {
                results = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3`, [bussType, firstDate, lastDate]);
            }
            else {
                results = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`, [bussType, firstDate, lastDate, zone]);
            }
            let businessTypeSummaryReport = results.rows;
            if (businessTypeSummaryReport.length > 0) {
                console.log('BusTypeSummaryReport fetched');
                return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
            }
            else {
                console.log('No data found in bustypesummaryreport');
                return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Delete
router.delete('/delete/:firstDate/:lastDate/:zone/:bussType', async (req, res) => {
    try {
        const { firstDate, lastDate, zone, bussType } = req.params;
        const client = await pool.connect();
        try {
            // Delete from bustypesummaryreport table
            await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4', [bussType, firstDate, lastDate, zone]);
            // Select from bustypesummaryreport table
            let result = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`, [bussType, firstDate, lastDate, zone]);
            let businessTypeSummaryReport = result.rows;
            if (businessTypeSummaryReport.length > 0) {
                console.log('BusTypeSummaryReport fetched');
                return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
            }
            else {
                console.log('No data found in bustypesummaryreport');
                return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Read
router.get('/read/:firstDate/:lastDate/:zone/:bussType', async (req, res) => {
    try {
        const { firstDate, lastDate, zone, bussType } = req.params;
        const client = await pool.connect();
        try {
            // Select from bustypesummaryreport table
            let result = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`, [bussType, firstDate, lastDate, zone]);
            let busTypeSummaryReport = result.rows;
            res.status(200).json({ message: "Fetch successful", data: busTypeSummaryReport });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
export default router;
//# sourceMappingURL=busTypeSummaryReportRoute.js.map