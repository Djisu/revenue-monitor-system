import * as dotenv from 'dotenv';
import { Router } from 'express';
import pg from 'pg';
const { Pool } = pg;
const router = Router();
// experiment ///
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
// Load the environment variables from the .env file
dotenv.config();
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
router.get('/all', async (req, res) => {
    console.log('in router.get(/all');
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM officerbudget`);
        if (result.rows.length === 0) {
            res.status(200).json([]);
            return;
        }
        res.status(200).json(result.rows);
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error fetching record', error });
        }
    }
    finally {
        client.release();
    }
});
router.get('/officerbudget/:officer_no/:fiscal_year/:electoral_area', async (req, res) => {
    const { officer_no, fiscal_year, electoral_area } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2 AND electoral_area = $3`, [officer_no, fiscal_year, electoral_area]);
        // Check if there are any rows returned
        if (result.rows.length > 0) {
            res.status(200).json({ exists: true, data: result.rows });
            return;
        }
        else {
            res.status(200).json({ exists: false });
            return;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error fetching record', error });
        }
    }
    finally {
        client.release();
    }
});
router.get('/:officer_no/:fiscal_year', async (req, res) => {
    const { officer_no, fiscal_year } = req.params;
    //console.clear();
    console.log('in router.get(/:officer_no/:fiscal_year): ', req.params);
    // Get the first character of officer_no 
    const officerNoFirstChar = officer_no.charAt(0);
    // const officerNoNew = parseInt(officer_no.split(' ')[0], 10)
    // console.log('officerNoNew: ', officerNoNew)
    const fiscalYearInt = parseInt(fiscal_year, 10);
    const client = await pool.connect();
    console.log('about to SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2');
    try {
        const result = await client.query(`SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2`, [officerNoFirstChar, fiscalYearInt]);
        console.log('after SELECT * FROM officerbudget WHERE officerNoFirstChar = $1 AND fiscal_year = $2');
        // Check if there are any rows returned
        if (result.rows.length > 0) {
            console.log('Data found!!!!');
            console.log('result.rows.length: ', result.rows.length);
            console.log('result.rows: ', result.rows);
            res.status(200).json({ message: "Data found", data: result.rows });
            return;
        }
        else {
            console.log('No data found');
            res.status(200).json({ message: "No data found", data: [] });
            return;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error fetching record', error });
        }
    }
    finally {
        client.release();
    }
});
// Function to populate electoral areas based on officer number
router.get('/electoralArea/:officerNo', async (req, res) => {
    const { officerNo } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT electoralarea FROM collectorElectoralArea 
            WHERE officer_no = $1
            ORDER BY officer_no`, [officerNo]);
        res.json(result.rows);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error fetching record', error });
        }
    }
    finally {
        client.release();
    }
});
// Function to get the total number of businesses for a given electoral area
router.get('/businessCount/:electoralArea', async (req, res) => {
    const { electoralArea } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT COUNT(buss_no) AS total FROM business 
            WHERE electoral_area = $1`, [electoralArea]);
        res.json(result.rows[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error fetching record', error });
        }
    }
    finally {
        client.release();
    }
});
// Function to add a budget record
router.post('/addBudget', async (req, res) => {
    const { officer_no, fiscal_year } = req.body;
    console.log("in router.post(/addBudget): ", req.body);
    const client = await pool.connect();
    try {
        // Delete existing record if it exists
        await client.query(`
         DELETE FROM officerbudget 
         WHERE officer_no = $1 AND fiscal_year = $2`, [officer_no, fiscal_year]);
        // select to find out if deleted
        const checkResult = await client.query(`
         SELECT * FROM officerbudget 
         WHERE officer_no = $1 AND fiscal_year = $2`, [officer_no, fiscal_year]);
        console.log('checkResult:', checkResult.rows);
        if (checkResult.rows.length > 0) {
            console.log('officerbudget record still exists, deletion not successful');
            res.status(400).json({
                status: 'fail',
                message: 'officerbudget record still exists, deletion not successful',
                data: {}
            });
            return;
        }
        console.log('officer budget found!!!');
        console.log('about to SELECT * FROM office WHERE officer_no = $1, [officer_no]');
        // Find officer name from officer_no
        const officerName = await client.query(`
            SELECT * FROM officer 
            WHERE officer_no = $1`, [officer_no]);
        if (officerName.rows.length === 0) {
            console.log('Officer not found');
            res.status(400).json({
                status: 'fail',
                message: 'Officer not found',
                data: {}
            });
            return;
        }
        console.log('officerName.rows[0].officer_name:', officerName.rows[0].officer_name);
        console.log('about to  SELECT SUM(current_rate) AS totsum FROM business WHERE assessmentby = $1');
        // Find Annual Budget
        const annual_budget = await client.query(`
            SELECT SUM(current_balance) AS totsum FROM busscurrbalance
            WHERE assessmentby = $1 AND fiscalyear = $2`, [officer_no, fiscal_year]);
        console.log('annual_budget.rows[0].totsum:', annual_budget.rows[0].totsum);
        if (annual_budget.rows[0].totsum === null) {
            console.log('Annual budget not found for officer');
            res.status(400).json({
                status: 'fail',
                message: 'Annual budget not found for officer ' + officerName.rows[0].officer_name,
                data: {}
            });
            return;
        }
        console.log('annual_budget.rows[0].totsum:', annual_budget.rows[0].totsum);
        console.log('about to Find monthly budget');
        // Find Monthly Budget
        const monthly_budget = parseFloat(annual_budget.rows[0].totsum) / 12;
        console.log('monthly_budget:', monthly_budget);
        // Convert annual_budget to a number
        const newAnnualBudget = parseFloat(annual_budget.rows[0].totsum);
        console.log('newAnnualBudget:', newAnnualBudget);
        console.log('about to INSERT INTO officerbudget');
        // Insert new record
        await client.query(`
        INSERT INTO officerbudget (
            officer_no, officer_name, fiscal_year, 
            annual_budget, monthly_budget,  January_budget,
            January_Actual, February_budget, February_Actual, 
            March_budget, March_Actual, April_budget, 
            April_Actual,  May_budget, May_Actual, 
            June_budget, June_Actual, July_budget,
            July_Actual, August_budget, August_Actual, 
            September_budget, September_Actual, October_budget, 
            October_Actual, November_budget, November_Actual, 
            December_budget, December_Actual, Actual_total, 
            outstanding
        ) VALUES (
            $1, $2, $3, $4, $5, 
            $6, $7, $8, $9, 
            $10, $11, $12, $13, 
            $14, $15, $16, $17, 
            $18, $19, $20, $21, 
            $22, $23, $24, $25, 
            $26, $27, $28, $29, 
            $30, $31
        )`, [
            officerName.rows[0].officer_no,
            officerName.rows[0].officer_name,
            fiscal_year,
            newAnnualBudget,
            monthly_budget,
            monthly_budget,
            0,
            monthly_budget,
            0,
            monthly_budget,
            0,
            monthly_budget,
            0,
            monthly_budget,
            0,
            monthly_budget,
            0,
            monthly_budget,
            0,
            monthly_budget,
            0,
            monthly_budget,
            0,
            monthly_budget,
            0,
            monthly_budget,
            0,
            monthly_budget,
            0,
            0,
            newAnnualBudget
        ]);
        console.log('about to SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2');
        console.log('Find out if officerbudget record was inserted successfully');
        // Find out if officerbudget record was inserted successfully
        const officerExists = await client.query(`
         SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2`, [officer_no, fiscal_year]);
        console.log('officerExists.rows:', officerExists.rows);
        if (officerExists.rows.length === 0) {
            console.log('Officer budget not found');
            res.status(400).json({
                status: 'fail',
                message: 'Officer budget not found',
                data: {}
            });
            return;
        }
        console.log('INSERT INTO officerbudget successful');
        console.log('about to call updateOfficerBudget');
        ///////////// include the updateOfficerBudget function here////////////
        console.log('Updating officerbudget for officer_no:', officer_no, 'in fiscal year:', fiscal_year);
        console.log('officerName.rows[0].officer_name:', officerName.rows[0].officer_name);
        // Check again if insertion was successful
        const budgetQuery = `
                SELECT * 
                FROM officerbudget 
                WHERE officer_name = $1 AND fiscal_year = $2
            `;
        const budgetResult = await client.query(budgetQuery, [officerName.rows[0].officer_name, fiscal_year]);
        const budget = budgetResult.rows;
        console.log('budget.length === 0:', budget.length === 0);
        if (budget.length === 0) {
            console.log('No budget found for officer_no: ', officerName.rows[0].officer_name, 'in fiscal year: ', fiscal_year);
            res.status(400).json({
                status: 'fail',
                message: 'No budget found for officerName.rows[0].officer_name: ' + officerName.rows[0].officer_name + 'in fiscal year: ' + fiscal_year,
                data: {}
            });
            return;
        }
        console.log('budget.length:', budget.length);
        if (budget.length > 1) {
            console.error('Multiple budget records found for officerName.rows[0].officer_name: ', officerName.rows[0].officer_name, 'in fiscal year: ', fiscal_year);
        }
        const budgetRecord = budget[0]; // Get the first (and expected only) budget record   
        console.log('budget:', budgetRecord);
        // Step 3: Update the budget based on payments
        let actualTotal = parseFloat(budgetRecord.actual_total) || 0;
        // Step 4: Fetch all payments for the given officer and fiscal year
        console.log('about to loop through payments');
        // Find all payments for the given officer and fiscal year
        const paymentsQuery = `
        SELECT monthpaid, paidAmount, officer_no, fiscal_year
        FROM buspayments 
        WHERE officer_no = $1 AND fiscal_year = $2
        `;
        const paymentsResult = await client.query(paymentsQuery, [officer_no, fiscal_year]);
        const payments = paymentsResult.rows;
        if (payments.length === 0) {
            console.log('No payments found for officer_no: ', officer_no, 'in fiscal year: ', fiscal_year);
            res.status(404).json({
                status: 'fail',
                message: 'Payments not found his businesses',
                data: {}
            });
            return;
        }
        console.log('payments found:');
        let totActuals = 0;
        for (let i = 0; i < payments.length; i++) {
            console.log('payment:', payments[i].monthpaid, payments[i].paidamount, payments[i].officer_no);
            const payment = payments[i]; // Get the payment object
            const { monthpaid, paidamount, fiscal_year } = payment;
            // Convert paidAmount to a number
            const paidAmountNum = parseFloat(paidamount);
            console.log('paidAmount: ', paidAmountNum);
            if (isNaN(paidAmountNum)) {
                console.error('Invalid paidAmount:', paidamount);
                continue; // Skip this payment if it's invalid
            }
            totActuals += paidAmountNum;
            console.log('totActuals:', totActuals);
            // Update the actual total
            actualTotal += paidAmountNum;
            // Convert monthpaid to lowercase and construct the monthColumn
            const monthColumn = `${monthpaid.toLowerCase()}_actual`;
            const updateQuery = `
                UPDATE officerbudget 
                SET ${monthColumn} = ${monthColumn} + $1, 
                    actual_total = $2, 
                    outstanding = annual_budget - $2 
                WHERE officer_name = $3 AND fiscal_year = $4
            `;
            // Log the constructed query and parameters for debugging
            console.log('Update Query:', updateQuery);
            console.log('Parameters:', [paidAmountNum, actualTotal, officerName.rows[0].officer_name, fiscal_year]);
            // Execute the update query
            await client.query(updateQuery, [paidAmountNum, actualTotal, officerName.rows[0].officer_name, fiscal_year]);
            // Check if the update query was successful
            console.log('updateQuery.length: ', updateQuery.length);
            if (updateQuery.length === 0) {
                console.error('Error updating officerbudget for month:', monthpaid);
                res.status(404).json({
                    status: 'fail',
                    message: 'Error updating officerbudget for month:', monthpaid,
                    data: {}
                });
            }
        }
        console.log('update officerbudget successful!!!!');
        console.log('final totActuals: ', totActuals);
        //////////////End of the updateOfficerBudget function//////////////////
        // // Send email to officer
        // const officerEmail = await pool.query(`
        //     SELECT email FROM officer 
        //     WHERE officer_no = $1`, [officer_no]);
        // if (officerEmail.rows.length === 0) {
        //     res.status(404).send('Officer email not found');
        //     return;
        // }
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: emailUser,
        //         pass: emailPassword
        //     }
        // });
        // const mailOptions: SendMailOptions = {
        //     from: emailUser,
        //     to: officerEmail.rows[0].email,
        //     subject: 'RevMonitor - Budget Updated',
        //     text: `Your budget for ${fiscal_year} has been updated successfully. Please check your email for more details.`
        // };
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error('Error sending email:', error);
        //     } else {
        //         console.log('Email sent:', info.messageId);
        //     }
        // });
        console.log('Sending email to officer skipped');
        res.status(200).json({
            status: 'success',
            message: 'Budget record added successfully',
            data: { /* your data here */}
        });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error adding record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error adding record', error });
        }
    }
    finally {
        client.release();
    }
});
router.post('/updateBudget', async (req, res) => {
    const { officer_no, fiscal_year, month, paidAmount } = req.body;
    console.log("in router.post(/updateBudget): ", req.body);
    const client = await pool.connect();
    try {
        // Find officer name from officer_no
        const officerName = await client.query(`
            SELECT * FROM officer 
            WHERE officer_no = $1`, [officer_no]);
        if (officerName.rows.length === 0) {
            console.log('Officer not found');
            res.status(400).json({
                status: 'fail',
                message: 'Officer not found',
                data: {}
            });
            return;
        }
        console.log('officerName.rows[0].officer_name:', officerName.rows[0].officer_name);
        // Find the corresponding month column name
        const monthColumn = `${month.toLowerCase()}_actual`;
        // Find the corresponding month budget
        const monthBudgetQuery = `
            SELECT ${monthColumn} AS budget FROM officerbudget 
            WHERE officer_name = $1 AND fiscal_year = $2
        `;
        const monthBudgetResult = await client.query(monthBudgetQuery, [officerName.rows[0].officer_name, fiscal_year]);
        const monthBudget = monthBudgetResult.rows[0].budget;
        console.log('monthBudget:', monthBudget);
        if (monthBudget === null) {
            console.log('No budget found for month:', month);
            res.status(400).json({
                status: 'fail',
                message: 'No budget found for month:', month,
                data: {}
            });
            return;
        }
        // Convert paidAmount to a number
        const paidAmountNum = paidAmount;
        console.log('paidAmount: ', paidAmountNum);
        if (isNaN(paidAmountNum)) {
            console.error('Invalid paidAmount:', paidAmount);
            res.status(400).json({
                status: 'fail',
                message: 'Invalid paidAmount:', paidAmount,
                data: {}
            });
            return;
        }
        // Update the actual total
        const actualTotal = monthBudget + paidAmountNum;
        // Update the corresponding month column
        const updateQuery = `
            UPDATE officerbudget 
            SET ${monthColumn} = $1, 
                actual_total = $2, 
                outstanding = annual_budget - $2 
            WHERE officer_name = $3 AND fiscal_year = $4
        `;
        // Log the constructed query and parameters for debugging
        // console.log('Update Query:', updateQuery);
        // console.log('Parameters:', [paidAmountNum, actualTotal, officerName.rows[0].officer_name, fiscal_year]);
        // Execute the update query
        const updateResult = await client.query(updateQuery, [paidAmountNum, actualTotal, officerName.rows[0].officer_name, fiscal_year]);
        console.log('updateResult:', updateResult);
        if (updateResult.rowCount === 0) {
            console.error('Error updating officerbudget for month:', month);
            res.status(400).json({
                status: 'fail',
                message: 'Error updating officerbudget for month:', month,
                data: {}
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            message: 'Budget record updated successfully',
            data: { /* your data here */}
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error updating budget record');
        return;
    }
    finally {
        client.release();
    }
});
export default router;
//# sourceMappingURL=officerBudgetRoute.js.map