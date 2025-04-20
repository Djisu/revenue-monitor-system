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
router.post('/create/:firstDate/:lastDate/:zone/:bussType', async (req, res) => {
    try {
        const { firstDate, lastDate, zone, bussType } = req.params;
        // Find year from cbolastdate
        const thisYear = lastDate.substring(0, 4);
        const client = await pool.connect();
        try {
            // Delete from bustypesummaryreport table
            await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4', [bussType, firstDate, lastDate, zone]);
            // Select from businesses table
            const result = await client.query(`SELECT DISTINCT electroral_area, buss_type FROM businesses WHERE status = $1  AND electroral_area = $1 GROUP BY electroral_area, buss_type`, ['Active', bussType, zone]);
            // If result is empty, return empty array
            if (result.rows.length === 0) {
                res.status(200).json([]);
                return;
            }
            let varCurrRate = 0;
            let varPayment = 0;
            if (result.rows.length === 1) {
                try {
                    let recSumm = '';
                    if (zone.length > 0) {
                        recSumm = await client.query('SELECT SUM(current_balance) AS totSum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoral_area = $3', [thisYear, bussType, zone]);
                    }
                    if (zone.length === 0) {
                        recSumm = await client.query('SELECT SUM(current_balance) AS totSum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2', [thisYear, bussType]);
                    }
                    if (recSumm.rows.length > 0 && recSumm.rows[0].totsum) {
                        varCurrRate = parseFloat(recSumm.rows[0].totsum);
                    }
                    // Calculate total payments
                    let query = 'SELECT SUM(amount) AS totPayments FROM tb_busPayments WHERE fiscal_year = $1 AND buss_type = $2';
                    const params = [thisYear, bussType];
                    if (zone.length > 0) {
                        recSumm = await client.query('SELECT SUM(amount) AS totPayments FROM tb_busPayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoral_area = $3', [thisYear, bussType, zone]);
                    }
                    if (zone.length === 0) {
                        recSumm = await client.query('SELECT SUM(amount) AS totPayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2', [thisYear, bussType]);
                    }
                    if (recSumm.rows.length > 0 && recSumm.rows[0].totpayments) {
                        varPayment = parseFloat(recSumm.rows[0].totpayments);
                    }
                    else {
                        varPayment = 0;
                    }
                    // Check if the report already exists
                    const reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2';
                    const reportCheckResult = await client.query(reportCheckQuery, [bussType, zone]);
                    if (reportCheckResult.rowCount === 0) {
                        // Insert new report
                        const insertQuery = `
                            INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area)
                            VALUES ($1, $2, $3, $4, $5)
                        `;
                        const balance = varCurrRate - varPayment;
                        await client.query(insertQuery, [
                            bussType,
                            varCurrRate,
                            varPayment,
                            balance,
                            zone,
                        ]);
                    }
                }
                catch (error) {
                    console.error('Error processing bus type summary report:', error);
                }
                finally {
                    // Reset variables
                    varCurrRate = 0;
                    varPayment = 0;
                }
            }
            // > 1
            if (result.rows.length > 1) {
                // for loop of result.rows
                for (const row of result.rows) {
                    // Calculate current rate
                    let recSumm2 = '';
                    if (zone.length > 0) {
                        recSumm2 = await client.query('SELECT SUM(current_balance) AS totSum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, row.electroral_area]);
                    }
                    if (zone.length === 0) {
                        recSumm2 = await client.query('SELECT SUM(current_balance) AS totSum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2', [thisYear, bussType]);
                    }
                    let varPayment = 0;
                    if (recSumm2.rows.length > 0 && recSumm2.rows[0].totsum) {
                        varCurrRate = parseFloat(recSumm2.rows[0].totsum);
                    }
                    if (zone.length > 0) {
                        recSumm2 = await client.query('SELECT SUM(amount) AS totPayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoral_area = $3', [thisYear, bussType, row.electroral_area]);
                    }
                    if (zone.length === 0) {
                        recSumm2 = await client.query('SELECT SUM(amount) AS totPayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2', [thisYear, bussType]);
                    }
                    if (recSumm2.rows.length > 0 && recSumm2.rows[0].totpayments) {
                        varPayment = parseFloat(recSumm2.rows[0].totpayments);
                    }
                    else {
                        varPayment = 0;
                    }
                    // Calculate balance
                    const balance = varCurrRate - varPayment;
                    // Check if the report already exists
                    const reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND fiscal_year = $3';
                    const reportCheckResult = await client.query(reportCheckQuery, [bussType, row.electroral_area]);
                    if (reportCheckResult.rowCount === 0) {
                        // Insert new report
                        const insertQuery = `
                            INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area)
                            VALUES ($1, $2, $3, $4, $5)
                        `;
                        await client.query(insertQuery, [
                            bussType,
                            varCurrRate,
                            varPayment,
                            balance,
                            row.electroral_area,
                        ]);
                    }
                }
            }
            // Select from bustypesummaryreport table
            const busTypeSummaryReport = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`, [bussType, firstDate, lastDate, zone]);
            res.status(200).json({ message: "Fetch successful", data: busTypeSummaryReport.rows });
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
//# sourceMappingURL=busTypeSummaryReport.js.map