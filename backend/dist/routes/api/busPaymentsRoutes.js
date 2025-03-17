import * as dotenv from 'dotenv';
import { Router } from 'express';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'pg';
import ensurePermitDirIsEmpty from '../../utils/ensurePermitDirIsEmpty.js'; //'../../utils/ensurePermitDirIsEmpty';
import { generatePdf } from '../../generatePdf.js';
const { Pool } = pkg;
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
// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD
    }
});
// Function to generate PDF
async function generatePDF(receiptData, receiptsDir) {
    console.log('in generatePDF function');
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const receiptPath = path.join(receiptsDir, `receipt_${receiptData.ReceiptNo}.pdf`);
        const writeStream = fs.createWriteStream(receiptPath); // Save to file
        writeStream.on('finish', () => {
            console.log('Receipt saved to file:', receiptPath);
            resolve(receiptPath);
        });
        writeStream.on('error', (err) => {
            console.error('Error writing receipt file:', err);
            reject(err);
        });
        doc.pipe(writeStream);
        // Add content to the PDF
        doc.fontSize(25).text('Receipt', { align: 'center' });
        doc.text(`Receipt No: ${receiptData.ReceiptNo}`);
        doc.text(`Bus Number: ${receiptData.buss_no}`);
        doc.text(`Officer No: ${receiptData.officer_no}`);
        doc.text(`Amount: $${receiptData.paidAmount}`);
        doc.text(`Month Paid: ${receiptData.monthpaid}`);
        doc.text(`Transaction Date: ${receiptData.transdate}`);
        doc.text(`Fiscal Year: ${receiptData.fiscal_year}`);
        doc.text(`Email: ${receiptData.email}`);
        doc.text(`Electoral Area: ${receiptData.electroral_area}`);
        doc.end();
    });
}
// Function to send email
async function sendEmail(receiptPath, busPaymentsData) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: busPaymentsData.email,
        subject: 'Your Payment Receipt',
        text: 'Please find attached your payment receipt.',
        attachments: [
            {
                contentType: 'application/pdf',
                filename: path.basename(receiptPath),
                path: receiptPath,
            },
        ],
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Receipt email sent successfully');
        return;
    }
    catch (emailError) {
        console.error('Error sending email:', emailError);
        throw emailError;
        return;
    }
}
router.post('/create', async (req, res) => {
    console.log('router.post(/create XXXXXXXXX ');
    const busPaymentsData = req.body;
    // Ensure the receipts directory exists
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const receiptsDir = path.join(__dirname, 'receipts');
    if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
        console.log('Created receipts directory:', receiptsDir);
    }
    else {
        console.log('Receipts directory already exists:', receiptsDir);
    }
    console.log('about to enter payment into buspayments table');
    const client = await pool.connect();
    try {
        // Insert the new BusPayments data
        const result = await client.query(`INSERT INTO buspayments (buss_no, officer_no, paidAmount, monthpaid, transdate, 
                fiscal_year, ReceiptNo, email, electroral_area) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [
            busPaymentsData.buss_no,
            busPaymentsData.officer_no,
            busPaymentsData.paidAmount,
            busPaymentsData.monthpaid,
            busPaymentsData.transdate,
            busPaymentsData.fiscal_year,
            busPaymentsData.ReceiptNo,
            busPaymentsData.email,
            busPaymentsData.electroral_area
        ]);
        console.log('Payment entered into buspayment table');
        // Going to updateOfficerBudget function to update the officer budget
        const params = {
            paymentMonth: busPaymentsData.monthpaid,
            amount: busPaymentsData.paidAmount,
            officerNo: busPaymentsData.officer_no,
            fiscalYear: Number(busPaymentsData.fiscal_year),
            busNo: busPaymentsData.buss_no,
            receiptNo: busPaymentsData.ReceiptNo,
            transDate: busPaymentsData.transdate,
            currentBalance: 0
        };
        const updateOfficerBudgetResult = await updateOfficerBudget(params);
        console.log('back to router.create parent endpoint:', updateOfficerBudgetResult);
        console.log('about to generate receipt');
        // Generate the receipt data
        const receiptData = {
            buss_no: busPaymentsData.buss_no,
            officer_no: busPaymentsData.officer_no,
            paidAmount: busPaymentsData.paidAmount,
            monthpaid: busPaymentsData.monthpaid,
            transdate: busPaymentsData.transdate,
            fiscal_year: busPaymentsData.fiscal_year,
            ReceiptNo: busPaymentsData.ReceiptNo,
            email: busPaymentsData.email,
            electroral_area: busPaymentsData.electroral_area
        };
        // Generate the PDF receipt
        const receiptPath = await generatePDF(receiptData, receiptsDir);
        console.log('from generatePDF back to the parent endpoint');
        console.log('about to send email');
        // Send the email with the PDF attachment
        await sendEmail(receiptPath, busPaymentsData);
        res.status(200).json({
            message: 'BusPayments record created successfully and email sent.',
            receiptUrl: receiptPath,
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BusPayments record or sending email', error });
    }
    finally {
        client.release();
    }
});
router.post('/sendEmail', async (req, res) => {
    console.log('router.post(/sendEmail Sending test email: ');
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'pfleischer2002@yahoo.co.uk',
            subject: 'Test Email',
            text: 'This is a test email.'
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    }
    catch (emailError) {
        console.error('Error sending email:', emailError);
        res.status(500).json({ message: 'Error sending email', emailError });
    }
});
router.get('/billedAmount/:bussNo', async (req, res) => {
    const { bussNo } = req.params;
    console.log('router.get(/billedAmount/:buss_no buss_no:', bussNo);
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM business WHERE buss_no = $1', [bussNo]);
        if (result.rows.length === 0) {
            res.status(404).json({ amount: 0, message: 'Business not found' });
            return;
        }
        const currentRate = result.rows[0].current_rate;
        console.log('currentRate:', currentRate);
        const propertyRate = result.rows[0].property_rate;
        console.log('propertyRate:', propertyRate);
        const prevAmount = await findPreviousBalance(Number(bussNo));
        console.log('prevAmount:', prevAmount);
        const billedAmount = Number(prevAmount) + Number(currentRate) + Number(propertyRate);
        console.log('billedAmount:', billedAmount);
        if (prevAmount === undefined || prevAmount === null) {
            res.status(404).json({ billedAmount: 0, message: 'No Previous balance found' });
            return;
        }
        else {
            res.status(200).json({ billedAmount: billedAmount, message: 'Previous balance found' });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ billedAmount: 0, message: 'Error fetching BusPayments record', error });
    }
    finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
});
// Read all BusPayments records
router.get('/all', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM buspayments');
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments records', error });
    }
    finally {
        client.release();
    }
});
// Read a single BusPayments record by buss_no
router.get('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM buspayments WHERE buss_no = $1', [buss_no]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return;
        }
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
    finally {
        client.release();
    }
});
// Read a single BusPayments record by electoral_area
router.get('/:electoralarea', async (req, res) => {
    const { electoralarea } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM buspayments WHERE electoral_area = $1', [electoralarea]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return;
        }
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
    finally {
        client.release();
    }
});
// Read a single BusPayments record by date
router.get('/:date', async (req, res) => {
    const { date } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM buspayments WHERE transdate = $1', [date]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return;
        }
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
    finally {
        client.release();
    }
});
// Read a single BusPayments record by date range
router.get('/:firstdate/:lastdate', async (req, res) => {
    const { firstdate, lastdate } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM buspayments WHERE transdate BETWEEN $1 AND $2', [firstdate, lastdate]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return;
        }
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
    finally {
        client.release();
    }
});
// Update a BusPayments record
router.put('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const busPaymentsData = req.body;
    const isoDate = new Date(busPaymentsData.transdate);
    const pgDate = isoDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM buspayments WHERE buss_no = $1', [buss_no]);
        if (result.rows.length > 0) {
            res.status(409).json({ message: 'BusPayments record exists' });
            return;
        }
        // Update the BusPayments data
        await client.query(`UPDATE buspayments SET officer_no = $1, paidAmount = $2, monthpaid = $3, transdate = $4, 
             fiscal_year = $5, ReceiptNo = $6 
            WHERE buss_no = $7`, [
            busPaymentsData.officer_no,
            busPaymentsData.paidAmount,
            busPaymentsData.monthpaid,
            pgDate,
            busPaymentsData.fiscal_year,
            busPaymentsData.ReceiptNo,
            buss_no
        ]);
        res.status(200).json({ message: 'BusPayments record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BusPayments record', error });
    }
    finally {
        client.release();
    }
});
// Delete a BusPayments record
router.delete('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM buspayments WHERE buss_no = $1', [buss_no]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'BusPayments record does not exist' });
            return;
        }
        // Delete the BusPayments record
        await client.query('DELETE FROM buspayments WHERE buss_no = $1', [buss_no]);
        res.status(200).json({ message: 'BusPayments record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BusPayments record', error });
    }
    finally {
        client.release();
    }
});
router.post('/billallbusinesses', async (req, res) => {
    console.log('in router.post(/billallbusinesses');
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM busscurrbalance WHERE fiscalyear = $1', [new Date().getFullYear()]);
        const result = await client.query('SELECT * FROM gradefees ORDER BY buss_type ASC, grade ASC');
        if (result.rows.length === 0) {
            res.status(409).json({ success: true, message: 'No records found' });
            return;
        }
        console.log('after SELECT * FROM gradefees ORDER BY buss_type');
        // Loop through all businesses and bill each business type and grade
        for (const feeRow of result.rows) {
            await client.query('UPDATE business SET current_rate = $1 WHERE buss_type = $2 AND tot_grade = $3', [feeRow.fees, feeRow.buss_type, feeRow.grade]);
        }
        console.log('All businesses updated with current_balance.');
        // Select all businesses
        const businessesResult = await client.query('SELECT * FROM business');
        console.log('ABOUT TO BILL ALL BUSINESSES');
        // Insert into busscurrbalance
        for (const businessRow of businessesResult.rows) {
            await client.query('INSERT INTO busscurrbalance (buss_no, fiscalyear, balancebf, current_balance, totalamountdue, transdate, electoralarea, assessmentby) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [
                businessRow.buss_no,
                new Date().getFullYear(),
                0,
                businessRow.current_rate,
                0,
                new Date().toISOString().split('T')[0],
                businessRow.electroral_area,
                businessRow.assessmentby // Add the appropriate value for `assessmentby`
            ]);
        }
        res.status(200).json({ success: true, message: 'All businesses billed successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error billing all businesses', error });
    }
    finally {
        // Ensure client is released
        if (client) {
            client.release();
        }
    }
});
router.post('/billonebusiness/:bussNo', async (req, res) => {
    console.log('in router.post(/billonebusiness');
    // Ensure the receipts directory exists
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const receiptsDir = path.join(__dirname, 'receipts');
    if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
        console.log('Created receipts directory:', receiptsDir);
    }
    else {
        console.log('Receipts directory already exists:', receiptsDir);
    }
    const { bussNo } = req.params;
    const client = await pool.connect();
    const thisYear = new Date().getFullYear();
    console.log('thisYear:', thisYear);
    try {
        await client.query('DELETE FROM busscurrbalance WHERE fiscalyear = $1 AND buss_no = $2', [thisYear, bussNo]);
        // Select one business
        const businessesResult = await client.query('SELECT * FROM business WHERE buss_no = $1', [bussNo]);
        console.log('businessesResult.rows.length: ', businessesResult.rows.length);
        console.log('ABOUT TO BILL ONE BUSINESS');
        // Insert into busscurrbalance
        for (const businessRow of businessesResult.rows) {
            await client.query('INSERT INTO busscurrbalance (buss_no, fiscalyear, balancebf, current_balance, totalamountdue, transdate, electoralarea, assessmentby) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [
                businessRow.buss_no,
                new Date().getFullYear(),
                0,
                businessRow.current_rate,
                0,
                new Date().toISOString().split('T')[0],
                businessRow.electroral_area,
                businessRow.assessmentby // Add the appropriate value for `assessmentby`
            ]);
        }
        /////////Produce permits/////////////////////
        // Ensure the permits directory is empty
        await ensurePermitDirIsEmpty();
        console.log('after ensurePermitDirIsEmpty()');
        // Select all businesses in the electoral area
        let businessRows = await client.query('SELECT * FROM business WHERE buss_no = $1', [bussNo]);
        if (businessRows.rows.length === 0) {
            console.log('No business found for', bussNo);
            res.status(404).json({ message: `No business found for ${bussNo}` });
            return;
        }
        console.log('about to loop through businessesResult to find balances');
        // Update balancebf in busscurrbalance table for all businesses
        for (let i = 0; i < businessRows.rows.length; i++) {
            const { buss_no } = businessRows.rows[i];
            console.log('in the update busscurrbalance table loop');
            ``;
            //let varCurrentRate = 0;
            let varBalance = await findBusinessBalance(buss_no);
            console.log('varBalance is: ', varBalance);
            console.log('about to update busscurrbalance table');
            // Update busscurrbalance table with current balance and fiscal year
            await client.query('UPDATE busscurrbalance SET balancebf = $1 WHERE buss_no = $2 AND fiscalyear = $3', [varBalance, buss_no, thisYear]);
            console.log('after updating busscurrbalance table');
        }
        console.log('Finish  loop through businessesResult');
        console.log('about to DELETE FROM tmpbusiness');
        // Delete from tmp_business
        await client.query('DELETE FROM tmpbusiness');
        console.log('about to DELETE FROM tmpbusscurrbalance');
        // Delete from tmp_BussCurrBalance
        await client.query('DELETE FROM tmpbusscurrbalance');
        // Insert into tmp_business
        let tmpBusinessRows = await client.query(`
                INSERT INTO tmpbusiness 
                SELECT * FROM business 
                WHERE buss_no = $1 
                  AND current_rate > 0 
                ORDER BY buss_name ASC 
                RETURNING *;
            `, [bussNo]);
        console.log('after insert into tmpbusiness and tmpBusinessRows.rows.length: ', tmpBusinessRows.rows.length);
        const recReport = await client.query('SELECT DISTINCT * FROM busscurrbalance WHERE fiscalyear = $1 AND buss_no = $2', [thisYear, bussNo]);
        console.log('after SELECT DISTINCT * FROM busscurrbalance WHERE fiscalyear = $1 AND buss_no = $2');
        console.log('recReport.rows.length:', recReport.rows.length);
        if (recReport.rows.length === 0) {
            res.status(404).json({ message: 'No paid bills found for the electoral area' });
            return;
        }
        await client.query('INSERT INTO tmpbusscurrbalance SELECT * FROM busscurrbalance WHERE fiscalyear = $1 AND buss_no = $2', [thisYear, bussNo]);
        console.log('after INSERT INTO tmpbusscurrbalance SELECT * FROM busscurrbalance');
        // Add serial numbers
        let recBusiness = await client.query('SELECT * FROM tmpbusiness ORDER BY buss_no');
        let permitNo = 1;
        for (let i = 0; i < recBusiness.rows.length; i++) {
            const varSerialNo = permitNo.toString().padStart(10, '0');
            console.log(`Updating buss_no: ${recBusiness.rows[i].buss_no}, Serial No: ${varSerialNo}`);
            await client.query('UPDATE tmpbusiness SET serialno = $1 WHERE buss_no = $2', [varSerialNo, recBusiness.rows[i].buss_no]);
            permitNo++;
        }
        console.log('after serial number generation');
        // Check if there are any bills in tmp_business
        let recBills = await client.query('SELECT * FROM tmpbusiness ORDER BY buss_name ASC');
        if (recBills.rows.length === 0) {
            res.status(404).json({ message: 'No bills found for the electoral area' });
            return;
        }
        console.log('ABOUT TO GENERATE PDFs');
        // Produce Bills now
        for (const bill of recBills.rows) {
            console.log('Generating PDF for bill:', bill.buss_no);
            try {
                const pdfBuffer = await generatePdf(bill);
                // Save the PDF to a file or handle it as needed
                fs.writeFileSync(path.join(__dirname, 'permits', `permit_${bill.buss_no}.pdf`), pdfBuffer);
                console.log('BILL written to permitDir');
            }
            catch (error) {
                console.error('Error generating PDF for bill:', bill, error);
                res.status(500).json({ message: `Error generating PDF for bill ${bill.buss_no}: ${error.message}` });
                return;
            }
        }
        console.log('Bills generated successfully');
        ////////End of permits production///////////
        res.status(200).json({ success: true, message: 'One business billed successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error billing one business', error });
    }
    finally {
        // Ensure client is released
        if (client) {
            client.release();
        }
    }
});
// async function findPreviousBalance(bussNo: number): Promise<number> {
//     const client: PoolClient = await pool.connect();
async function GetOfficerName(officerNo) {
    const client = await pool.connect();
    const result = await client.query('SELECT officer_name FROM officer WHERE officer_no = $1', [officerNo]);
    if (result.rows.length === 0) {
        return 'Unknown';
    }
    return result.rows[0].officer_name;
}
router.get('/fetchClientsServed/:officer_no/:fiscal_year', async (req, res) => {
    console.log('in buspayments router.get(/fetchClientsServed/:officer_no/:fiscal_year', req.params);
    const { officer_no, fiscal_year } = req.params;
    const client = await pool.connect();
    const officerName = await GetOfficerName(Number(officer_no));
    console.log('officerName: ', officerName);
    try {
        const result = await client.query(`SELECT COUNT(buss_no) AS totcount FROM buspayments WHERE officer_no = $1 AND fiscal_year = $2`, [officerName, fiscal_year]);
        // Check if the query returned any results
        if (result.rows.length === 0) {
            return res.status(404).json(0); // Return 0 if no records found
        }
        console.log('result.rows[0].totcount: ', result.rows[0].totcount);
        // Return just the totsum value
        return res.status(200).json(result.rows[0].totcount); // Send the totsum directly
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
    finally {
        client.release();
    }
});
function getMonth() {
    const date = new Date();
    const options = { month: 'long' }; // Explicitly type the options
    return date.toLocaleString('default', options); // Returns the month name
}
function getTodaysDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
}
function getFiscalYear() {
    const date = new Date();
    return date.getFullYear(); // Returns the current year
}
function generateRandomGRC() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const saltLength = 5; // Length of the random salt
    let randomString = '';
    let salt = '';
    // Generate 10 random characters
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    // Generate random salt
    for (let i = 0; i < saltLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        salt += characters[randomIndex];
    }
    // Return the random string combined with the salt
    return `${randomString}${salt}`;
}
router.post('/createPaymentsForAllBusinesses', async (req, res) => {
    console.log('in router.post(/createPaymentsForAllBusinesses)');
    const busPaymentsData = req.body;
    // Ensure the receipts directory exists
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const receiptsDir = path.join(__dirname, 'receipts');
    if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
        console.log('Created receipts directory:', receiptsDir);
    }
    else {
        console.log('Receipts directory already exists:', receiptsDir);
    }
    const client = await pool.connect();
    try {
        // Fetch all buss_no from the business table
        const businessesResult = await client.query('SELECT * FROM business');
        if (businessesResult.rows.length === 0) {
            console.log('No businesses found.');
            res.status(409).json({ message: 'No businesses found to process payments.' });
            return;
        }
        // Loop through each buss_no and insert records into buspayments
        for (const business of businessesResult.rows) {
            const bussNo = business.buss_no;
            // Insert the new BusPayments data
            const result = await client.query(`INSERT INTO buspayments (buss_no, officer_no, paidamount, monthpaid, transdate, 
                    fiscal_year, receiptno, electroral_area, buss_type, email) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [
                bussNo,
                business.assessmentby,
                business.current_rate,
                getMonth(),
                getTodaysDate(),
                getFiscalYear(),
                generateRandomGRC(),
                business.electroral_area,
                business.buss_type,
                business.emailaddress
            ]);
            // Prepare params for updating officer budget
            const params = {
                paymentMonth: getMonth(),
                amount: business.current_rate,
                officerNo: business.assessmentby,
                fiscalYear: getFiscalYear(),
                busNo: bussNo,
                receiptNo: generateRandomGRC(),
                transDate: getTodaysDate(),
                currentBalance: 0
            };
            // Update officer budget
            const updateOfficerBudgetResult = await updateOfficerBudget(params);
            console.log('updateOfficerBudgetResult for buss_no:', bussNo, updateOfficerBudgetResult);
            // Generate the receipt data
            const receiptData = {
                buss_no: bussNo,
                officer_no: busPaymentsData.officer_no,
                paidAmount: busPaymentsData.paidAmount,
                monthpaid: busPaymentsData.monthpaid,
                transdate: busPaymentsData.transdate,
                fiscal_year: busPaymentsData.fiscal_year,
                ReceiptNo: busPaymentsData.ReceiptNo,
                email: busPaymentsData.email,
                electroral_area: busPaymentsData.electroral_area
            };
            // Generate the PDF receipt
            // const receiptPath = await generatePDF(receiptData, receiptsDir);
            // console.log('Receipt generated for buss_no:', bussNo);
            // // Send the email with the PDF attachment
            // await sendEmail(receiptPath, busPaymentsData);
            // console.log('Email sent for buss_no:', bussNo);
        }
        res.status(200).json({
            message: 'Payments for all businesses created successfully.',
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating payments for all businesses', error });
    }
    finally {
        client.release();
    }
});
async function findPreviousBalance(bussNo) {
    const client = await pool.connect();
    try {
        const currentYear = new Date().getFullYear();
        // Find previous payments
        const prevPaymentsResult = await client.query('SELECT SUM(paidAmount) AS totsum FROM buspayments WHERE buss_no = $1 AND fiscal_year < $2', [bussNo, currentYear]);
        const prevPayments = prevPaymentsResult.rows[0]?.totsum ?? 0;
        // Find previous billings
        const prevBalancesResult = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear < $2', [bussNo, currentYear]);
        const prevBalances = prevBalancesResult.rows[0]?.current_balance ?? 0;
        // Calculate balance
        return prevBalances - prevPayments;
    }
    catch (error) {
        console.error(error);
        throw new Error('Error fetching previous balance');
    }
    finally {
        client.release();
    }
}
async function findBusinessBalance(bussNo) {
    let client = null;
    try {
        client = await pool.connect();
        // Get current year and previous fiscal year
        const currentYear = new Date().getFullYear();
        // Find all payments
        const prevPaymentsResult = await client.query('SELECT SUM(paidAmount) AS totsum FROM buspayments WHERE buss_no = $1 AND fiscal_year < $2', [bussNo, currentYear]);
        const prevPayments = prevPaymentsResult.rows[0]?.totsum ?? 0;
        // Find all billings
        const prevBalancesResult = await client.query('SELECT SUM(current_balance) AS totPrevBal FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear < $2', [bussNo, currentYear]);
        const prevBalances = prevBalancesResult.rows[0]?.totPrevBal ?? 0;
        // Calculate balance
        return prevBalances - prevPayments;
    }
    catch (error) {
        console.error(error);
        throw new Error('Error fetching business balance');
    }
    finally {
        if (client) {
            client.release(); // Release the client instance
        }
    }
}
async function updateOfficerBudget(params) {
    const client = await pool.connect();
    console.log('in updateOfficerBudget');
    try {
        // Update officer's collection plan
        let varSQL = 'UPDATE officerbudget SET ';
        const monthColumns = {
            January: 'January_Actual',
            February: 'February_Actual',
            March: 'March_Actual',
            April: 'April_Actual',
            May: 'May_Actual',
            June: 'June_Actual',
            July: 'July_Actual',
            August: 'August_Actual',
            September: 'September_Actual',
            October: 'October_Actual',
            November: 'November_Actual',
            December: 'December_Actual'
        };
        if (params.paymentMonth in monthColumns) {
            const monthKey = params.paymentMonth;
            varSQL += `${monthColumns[monthKey]} = ${monthColumns[monthKey]} + $1`;
        }
        varSQL += ', Actual_total = Actual_total + $1 ';
        varSQL += 'WHERE officer_no = $2 AND fiscal_year = $3';
        console.log('varSQL: ', varSQL);
        await client.query(varSQL, [
            params.amount,
            params.officerNo,
            params.fiscalYear
        ]);
        console.log('officerbudget actuals updated');
        // Update outstanding
        const outstandingSQL = 'UPDATE officerbudget SET outstanding = annual_budget - Actual_total WHERE officer_no = $1 AND fiscal_year = $2';
        await client.query(outstandingSQL, [
            params.officerNo,
            params.fiscalYear
        ]);
        console.log('officerbudget outstanding updated');
        console.log('about to insert payment into receipt table');
        // Insert into client payment trans table
        const insertSQL = 'INSERT INTO receipt(buss_no, receiptno, description, transdate, amount) VALUES ($1, $2, $3, $4, $5)';
        await client.query(insertSQL, [
            params.busNo,
            params.receiptNo,
            'PAYMENT RECEIPT',
            params.transDate,
            params.amount
        ]);
        console.log('payment entered into receipt table');
        console.log('about to update business balance');
        // Update client's balance
        const updateBalanceSQL = 'UPDATE business SET balance = balance + $1 WHERE buss_no = $2';
        await client.query(updateBalanceSQL, [
            params.currentBalance,
            params.busNo
        ]);
        console.log('business balance updated');
        // // Delete from var_buspayments
        // const deleteSQL = 'DELETE FROM varbuspayments WHERE buss_no = $1 AND officer_no = $2 AND fiscal_year = $3 AND monthpaid = $4 AND receiptno = $5';
        // await client.query(deleteSQL, [
        //     params.busNo,
        //     params.officerNo,
        //     params.fiscalYear,
        //     params.paymentMonth,
        //     params.receiptNo
        // ]);
        console.log('going to return true from updateOfficerBudget endpoint');
        return true;
    }
    catch (error) {
        console.error('Database operation failed:', error);
        return false;
    }
    finally {
        client.release();
    }
}
export default router;
// // backend/src/routes/api/busPaymentsRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// // import mysql, { ResultSetHeader } from 'mysql2/promise';
// import PDFDocument from 'pdfkit';
// import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import { QueryResult, PoolClient } from 'pg';
// import pkg from 'pg';
// const { Pool } = pkg;
// const router = Router();
// // Load environment variables from .env file
// dotenv.config();
// const emailPassword = process.env.EMAIL_PASSWORD
// const appPassword = process.env.APP_PASSWORD
// const emailUser = process.env.EMAIL_USER
// const port = process.env.PORT || 3001;
// // MySQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
// };
// // BusPayments data interface
// interface BusPaymentsData {
//     buss_no: string;
//     officer_no: string;
//     paidAmount: number;
//     monthpaid: string;
//     transdate: string;
//     fiscal_year: string;
//     ReceiptNo: string;
//     email: string;
//     electoral_area: string;
// }
// // Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.APP_PASSWORD
//     }
// });
// // Function to generate PDF
// async function generatePDF(receiptData: BusPaymentsData, receiptsDir: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//         const doc = new PDFDocument();
//         const receiptPath = path.join(receiptsDir, `receipt_${receiptData.ReceiptNo}.pdf`);
//         const writeStream = fs.createWriteStream(receiptPath); // Save to file
//         writeStream.on('finish', () => {
//             console.log('Receipt saved to file:', receiptPath);
//             resolve(receiptPath);
//         });
//         writeStream.on('error', (err) => {
//             console.error('Error writing receipt file:', err);
//             reject(err);
//         });
//         doc.pipe(writeStream);
//         // Add content to the PDF
//         doc.fontSize(25).text('Receipt', { align: 'center' });
//         doc.text(`Receipt No: ${receiptData.ReceiptNo}`);
//         doc.text(`Bus Number: ${receiptData.buss_no}`);
//         doc.text(`Officer No: ${receiptData.officer_no}`);
//         doc.text(`Amount: $${receiptData.paidAmount}`);
//         doc.text(`Month Paid: ${receiptData.monthpaid}`);
//         doc.text(`Transaction Date: ${receiptData.transdate}`);
//         doc.text(`Fiscal Year: ${receiptData.fiscal_year}`);
//         doc.text(`Email: ${receiptData.email}`);
//         doc.text(`Electoral Area: ${receiptData.electoral_area}`);
//         doc.end();
//     });
// }
// // Function to send email
// async function sendEmail(receiptPath: string, busPaymentsData: BusPaymentsData): Promise<void> {
//     const mailOptions: SendMailOptions = {
//         from: process.env.EMAIL_USER,
//         to: busPaymentsData.email, // client email from request body
//         subject: 'Your Payment Receipt',
//         text: 'Please find attached your payment receipt.',
//         attachments: [
//             {
//                 contentType: 'application/pdf',
//                 filename: path.basename(receiptPath),
//                 path: receiptPath,
//             },
//         ],
//     };
//     try {
//         await transporter.sendMail(mailOptions);
//         console.log('Receipt email sent successfully');
//     } catch (emailError) {
//         console.error('Error sending email:', emailError);
//         throw emailError;
//     }
// }
// router.post('/create', async (req: Request, res: Response): Promise<void> => {
//     // console.log('emailPassword:', emailPassword)
//     // console.log('appPassword:', appPassword)
//     // console.log('emailUser:', emailUser)
//     // console.log('port:', port)
//     console.log('router.post(/create XXXXXXXXX ');
//     const busPaymentsData: BusPaymentsData = req.body;
//      // Ensure the receipts directory exists
//      const __filename = fileURLToPath(import.meta.url);
//      const __dirname = dirname(__filename);
//      const receiptsDir = path.join(__dirname, 'receipts');
//      if (!fs.existsSync(receiptsDir)) {
//          fs.mkdirSync(receiptsDir, { recursive: true });
//          console.log('Created receipts directory:', receiptsDir);
//      } else {
//          console.log('Receipts directory already exists:', receiptsDir);
//      }
//      const client: PoolClient = await pool.connect();
//     try { 
//         // Insert the new BusPayments data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO buspayments (buss_no, officer_no, paidAmount, monthpaid, transdate, 
//                 fiscal_year, ReceiptNo, email, electroral_area) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 busPaymentsData.buss_no,
//                 busPaymentsData.officer_no,
//                 busPaymentsData.paidAmount,
//                 busPaymentsData.monthpaid,
//                 busPaymentsData.transdate,
//                 busPaymentsData.fiscal_year,
//                 busPaymentsData.ReceiptNo,
//                 busPaymentsData.email,
//                 busPaymentsData.electoral_area
//             ]
//         );
//         // Going to updateOfficerBudget function to update the officer budget
//         const params: Params = {
//             paymentMonth: busPaymentsData.monthpaid,
//             amount: busPaymentsData.paidAmount,
//             officerNo: busPaymentsData.officer_no,
//             fiscalYear: Number(busPaymentsData.fiscal_year),
//             busNo: busPaymentsData.buss_no,
//             receiptNo: busPaymentsData.ReceiptNo,
//             transDate: busPaymentsData.transdate,
//             currentBalance: 0
//         };
//         const updateOfficerBudgetResult = await updateOfficerBudget(params);
//         console.log('updateOfficerBudgetResult:', updateOfficerBudgetResult)
//         console.log('about to generate receipt')
//         // Generate the receipt data
//         const receiptData = {
//             buss_no: busPaymentsData.buss_no,
//             officer_no: busPaymentsData.officer_no,
//             paidAmount: busPaymentsData.paidAmount,
//             monthpaid: busPaymentsData.monthpaid,
//             transdate: busPaymentsData.transdate,
//             fiscal_year: busPaymentsData.fiscal_year,
//             ReceiptNo: busPaymentsData.ReceiptNo,
//             email: busPaymentsData.email,
//             electoral_area: busPaymentsData.electoral_area
//         };
//         // Generate the PDF receipt
//         const receiptPath = await generatePDF(receiptData, receiptsDir);
//         console.log('about to send email');
//         // Send the email with the PDF attachment
//         await sendEmail(receiptPath, busPaymentsData);
//         res.status(200).json({
//             message: 'BusPayments record created successfully and email sent.',
//             receiptUrl: receiptPath,
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating BusPayments record or sending email', error });
//     } finally {
//         connection.end();
//     }
// });
// router.post('/sendEmail', async (req: Request, res: Response): Promise<void> => {
//     console.log('router.post(/sendEmail Sending test email: ');
//     try {
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: 'pfleischer2002@yahoo.co.uk', // Use the email address provided in the request body
//             subject: 'Test Email',
//             text: 'This is a test email.'
//         };
//         await transporter.sendMail(mailOptions);
//         res.status(200).json({ message: 'Email sent successfully' });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ message: 'Error sending email', error });
//     }
// })
// // Read all BusPayments records
// router.get('/all', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM buspayments');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BusPayments records', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single BusPayments record by buss_no
// router.get('/:buss_no', async (req: Request, res: Response) => {
//     const { buss_no } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM buspayments WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Business Payments record not found' });
//             return
//         }
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BusPayments record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single BusPayments record by buss_no
// router.get('/billedAmount/:buss_no', async (req: Request, res: Response): Promise<void> => {
//     const { buss_no } = req.params;
//     console.log('router.get(/billedAmount/:buss_no buss_no:', buss_no)
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM business WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ amount: 0, message: 'Business not found' });
//             return
//          } 
//          const currentRate = rows[0].current_rate;
//          console.log('currentRate:', currentRate)
//          const propertyRate = rows[0].property_rate;
//          console.log('propertyRate:', propertyRate)
//         const prevAmount = await findPreviousBalance(Number(buss_no));
//         console.log('prevAmount:', prevAmount)
//         const billedAmount = Number(prevAmount) + Number(currentRate) + Number(propertyRate)
//         console.log('billedAmount:', billedAmount)
//         if (prevAmount === undefined || prevAmount === null)  {
//             res.status(404).json({ billedAmount: 0, message: 'No Previous balance found' });
//             return
//         } else {           
//             res.status(200).json({billedAmount: billedAmount, message: 'Previous balance found' });
//             return
//         }       
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ billedAmount: 0, message: 'Error fetching BusPayments record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single BusPayments record by buss_no
// router.get('/:electoralarea', async (req: Request, res: Response) => {
//     const { electoralarea } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM buspayments WHERE electroral_area = ?', [electoralarea]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Business Payments record not found' });
//             return
//         }
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BusPayments record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single BusPayments record by date
// router.get('/:date', async (req: Request, res: Response) => {
//     const { transdate } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM buspayments WHERE transdate = ?', [transdate]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Business Payments record not found' });
//             return
//         }
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BusPayments record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single BusPayments record by buss_no
// router.get('/:firstdate/:lastdate', async (req: Request, res: Response) => {
//     const { firstdate, lastdate } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM buspayments WHERE transdate BETWEEN ? AND ?', 
//         [firstdate, lastdate]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Business Payments record not found' });
//             return
//         }
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BusPayments record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Update a BusPayments record
// router.put('/:buss_no', async (req: Request, res: Response): Promise<void> => {
//     const { buss_no } = req.params;
//     const busPaymentsData: BusPaymentsData = req.body;
//     const isoDate = new Date(busPaymentsData.transdate);
//     const mysqlDate = isoDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM buspayments WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(404).json({ message: 'BusPayments record exists' });
//             return
//         }
//         // Update the BusPayments data
//         const [result] = await connection.execute(
//             `UPDATE buspayments SET officer_no = ?, amount = ?, monthpaid = ?, transdate = ?, 
//              fiscal_year = ?, ReceiptNo = ? 
//             WHERE buss_no = ?`,
//             [
//                 busPaymentsData.officer_no,
//                 busPaymentsData.paidAmount,
//                 busPaymentsData.monthpaid,
//                 mysqlDate,
//                 busPaymentsData.fiscal_year,
//                 busPaymentsData.ReceiptNo,
//                 buss_no
//             ]
//         );
//         res.status(200).json({ message: 'BusPayments record updated successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating BusPayments record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });
// // Delete a BusPayments record
// router.delete('/:buss_no', async (req: Request, res: Response) => {
//     const { buss_no } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [row] = await connection.execute('SELECT * FROM buspayments WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(row) && row.length == 0) {
//             res.status(404).json({ message: 'BusPayments record does not exist' });
//             return
//         }
//         // Delete the BusPayments record
//         const [result] = await connection.execute('DELETE FROM buspayments WHERE buss_no = ?', [buss_no]);
//         res.status(200).json({ message: 'BusPayments record deleted successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting BusPayments record', error });
//     } finally {
//         connection.end();
//     }
// });
// router.post('/billallbusinesses', async (req: Request, res: Response) => {
//     const client: PoolClient = await pool.connect();
//     try {
//         const result: QueryResult = await client.query('SELECT * FROM gradefees ORDER BY buss_type ASC, grade ASC');
//         if (Array.isArray(result.rows) && result.rows.length === 0) {          
//             res.status(409).json({ success: true, message: 'No records found' });
//             return;
//         }
//         // Loop through all businesses and bill each business type and grade
//         for (let i = 0; i < result.rows.length; i++) {
//             let ansRow =  await client.query('UPDATE business SET current_balance = $1 WHERE buss_type = $2 AND tot_grade = $3', 
//             [result.rows[i].fees, result.rows[i].buss_type, result.rows[i].grade]);
//         }
//         // Select all businesses
//         const businessesResult: QueryResult = await client.query('SELECT * FROM business');
//         // Insert into busscurrbalance
//         for (let i = 0; i < businessesResult.rows.length; i++) {
//             await client.query(
//                 'INSERT INTO busscurrbalance (buss_no, fiscalyear, balancebf, current_balance, totalamountdue, transdate, electoralarea) SELECT $1, $2, $3, $4, $5, $6, $7 FROM business WHERE buss_no = $1',
//                 [
//                     businessesResult.rows[i].buss_no, 
//                     new Date().getFullYear(), 
//                     0, 
//                     businessesResult.rows[i].current_balance, 
//                     0, 
//                     new Date(), 
//                     businessesResult.rows[i].electoralarea
//                 ]
//             );
//         }
//         return res.status(200).json({ success: true, message: 'All businesses billed successfully' });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: 'Error billing all businesses', error });
//     }
// })
// async function findPreviousBalance(bussNo: number): Promise<number> {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Get current year and previous fiscal year
//         const currentYear = new Date().getFullYear()
//        // const prevYear = currentYear - 1
//         // Find previous payments
//         const [prevPaymentsResult] = await connection.execute(
//             'SELECT SUM(paidAmount) AS totsum FROM buspayments WHERE buss_no = ? AND fiscal_year < ?',
//             [bussNo, currentYear]  
//         );
//         const prevPayments = prevPaymentsResult[0]?.totsum ?? 0;
//         // Find previous billings
//         const [prevBalancesResult] = await connection.execute(
//             'SELECT current_balance FROM busscurrbalance WHERE buss_no = ? AND fiscalyear < ?',
//             [bussNo, currentYear]
//         );
//         const prevBalances = prevBalancesResult[0]?.current_balance ?? 0;
//         // Calculate balance
//         return prevBalances - prevPayments;
//     } catch (error) {
//         console.error(error);
//         throw new Error('Error fetching previous balance');
//     } finally {
//         connection.end();
//     }
// }
// interface Params {
//     paymentMonth: string;
//     amount: number;
//     officerNo: string;
//     fiscalYear: number;
//     busNo: string;
//     receiptNo: string;
//     transDate: string; // Use appropriate date format
//     currentBalance: number;
// }
// async function updateOfficerBudget(params: Params): Promise<boolean> {
//     const connection = await mysql.createConnection(dbConfig);
//     console.log('in updateOfficerBudget')
//     try {
//         // Update officer's collection plan
//         let varSQL = `UPDATE officerbudget SET `;
//         const monthColumns = {
//             January: 'January_Actual',
//             February: 'February_Actual',
//             March: 'March_Actual',
//             April: 'April_Actual',
//             May: 'May_Actual',
//             June: 'June_Actual',
//             July: 'July_Actual',
//             August: 'August_Actual',
//             September: 'September_Actual',
//             October: 'October_Actual',
//             November: 'November_Actual',
//             December: 'December_Actual'
//         };
//         type MonthKeys = keyof typeof monthColumns;
//         if (params.paymentMonth in monthColumns && typeof params.paymentMonth === 'string') {
//             const monthKey = params.paymentMonth as MonthKeys;
//             varSQL += `${monthColumns[monthKey]} = ${monthColumns[monthKey]} + ?`;
//         }
//         varSQL += ', Actual_total = Actual_total + ? ';
//         varSQL += `WHERE officer_no = ? AND fiscal_year = ?`;
//         console.log('varSQL: ', varSQL)
//         await connection.execute(varSQL, [
//             params.amount,
//             params.amount,
//             params.officerNo,
//             params.fiscalYear
//         ]);
//         // Update outstanding
//         let outstandingSQL = `UPDATE officerbudget SET outstanding = annual_budget - Actual_total WHERE officer_no = ? AND fiscal_year = ?`;
//         await connection.execute(outstandingSQL, [
//             params.officerNo,
//             params.fiscalYear
//         ]);
//         // Insert into client payment trans table
//         let insertSQL = `INSERT INTO receipt(buss_no, receiptno, description, transdate, amount, buss_name) VALUES (?, ?, 'PAYMENT RECEIPT', ?, ?, NULL)`;
//         await connection.execute(insertSQL, [
//             params.busNo,
//             params.receiptNo,
//             params.transDate,
//             params.amount
//         ]);
//         // Update client's balance
//         let updateBalanceSQL = `UPDATE business SET balance = balance + ? WHERE buss_no = ?`;
//         await connection.execute(updateBalanceSQL, [
//             params.currentBalance,
//             params.busNo
//         ]);
//         // Delete from var_buspayments
//         let deleteSQL = `DELETE FROM varbuspayments WHERE buss_no = ? AND officer_no = ? AND fiscal_year = ? AND monthpaid = ? AND receiptno = ?`;
//         await connection.execute(deleteSQL, [
//             params.busNo,
//             params.officerNo,
//             params.fiscalYear,
//             params.paymentMonth,
//             params.receiptNo
//         ]);
//         return true;
//     } catch (error) {
//         console.error('Database operation failed:', error);
//         return false;
//     } finally {
//         await connection.end();
//     }
// }
// export default router;
// // // backend/src/routes/api/busPaymentsRoutes.ts
// // import express from 'express';
// // import * as dotenv from 'dotenv';
// // import { Router, Request, Response } from 'express';
// // import mysql, { ResultSetHeader } from 'mysql2/promise';
// // import PDFDocument from 'pdfkit';
// // import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
// // import fs from 'fs';
// // import path from 'path';
// // import { fileURLToPath } from 'url';
// // import { dirname } from 'path';
// // const router = Router();
// // // Load environment variables from .env file
// // dotenv.config();
// // const emailPassword = process.env.EMAIL_PASSWORD
// // const appPassword = process.env.APP_PASSWORD
// // const emailUser = process.env.EMAIL_USER
// // const port = process.env.PORT || 3001;
// // // MySQL connection configuration
// // const dbConfig = {
// //     host: process.env.DB_HOST || 'localhost',
// //     user: process.env.DB_USER || 'root',
// //     password: process.env.DB_PASSWORD || '',
// //     database: process.env.DB_NAME || 'revmonitor',
// // };
// // // BusPayments data interface
// // interface BusPaymentsData {
// //     buss_no: string;
// //     officer_no: string;
// //     paidAmount: number;
// //     monthpaid: string;
// //     transdate: string;
// //     fiscal_year: string;
// //     ReceiptNo: string;
// //     email: string;
// //     electoral_area: string;
// // }
// // // Nodemailer transporter setup
// // const transporter = nodemailer.createTransport({
// //     service: 'gmail',
// //     auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.APP_PASSWORD
// //     }
// // });
// // // Function to generate PDF
// // async function generatePDF(receiptData: BusPaymentsData, receiptsDir: string): Promise<string> {
// //     return new Promise((resolve, reject) => {
// //         const doc = new PDFDocument();
// //         const receiptPath = path.join(receiptsDir, `receipt_${receiptData.ReceiptNo}.pdf`);
// //         const writeStream = fs.createWriteStream(receiptPath); // Save to file
// //         writeStream.on('finish', () => {
// //             console.log('Receipt saved to file:', receiptPath);
// //             resolve(receiptPath);
// //         });
// //         writeStream.on('error', (err) => {
// //             console.error('Error writing receipt file:', err);
// //             reject(err);
// //         });
// //         doc.pipe(writeStream);
// //         // Add content to the PDF
// //         doc.fontSize(25).text('Receipt', { align: 'center' });
// //         doc.text(`Receipt No: ${receiptData.ReceiptNo}`);
// //         doc.text(`Bus Number: ${receiptData.buss_no}`);
// //         doc.text(`Officer No: ${receiptData.officer_no}`);
// //         doc.text(`Amount: $${receiptData.paidAmount}`);
// //         doc.text(`Month Paid: ${receiptData.monthpaid}`);
// //         doc.text(`Transaction Date: ${receiptData.transdate}`);
// //         doc.text(`Fiscal Year: ${receiptData.fiscal_year}`);
// //         doc.text(`Email: ${receiptData.email}`);
// //         doc.text(`Electoral Area: ${receiptData.electoral_area}`);
// //         doc.end();
// //     });
// // }
// // // Function to send email
// // async function sendEmail(receiptPath: string, busPaymentsData: BusPaymentsData): Promise<void> {
// //     const mailOptions: SendMailOptions = {
// //         from: process.env.EMAIL_USER,
// //         to: busPaymentsData.email, // client email from request body
// //         subject: 'Your Payment Receipt',
// //         text: 'Please find attached your payment receipt.',
// //         attachments: [
// //             {
// //                 contentType: 'application/pdf',
// //                 filename: path.basename(receiptPath),
// //                 path: receiptPath,
// //             },
// //         ],
// //     };
// //     try {
// //         await transporter.sendMail(mailOptions);
// //         console.log('Receipt email sent successfully');
// //     } catch (emailError) {
// //         console.error('Error sending email:', emailError);
// //         throw emailError;
// //     }
// // }
// // router.post('/create', async (req: Request, res: Response): Promise<void> => {
// //     // console.log('emailPassword:', emailPassword)
// //     // console.log('appPassword:', appPassword)
// //     // console.log('emailUser:', emailUser)
// //     // console.log('port:', port)
// //     console.log('router.post(/create XXXXXXXXX ');
// //     const busPaymentsData: BusPaymentsData = req.body;
// //      // Ensure the receipts directory exists
// //      const __filename = fileURLToPath(import.meta.url);
// //      const __dirname = dirname(__filename);
// //      const receiptsDir = path.join(__dirname, 'receipts');
// //      if (!fs.existsSync(receiptsDir)) {
// //          fs.mkdirSync(receiptsDir, { recursive: true });
// //          console.log('Created receipts directory:', receiptsDir);
// //      } else {
// //          console.log('Receipts directory already exists:', receiptsDir);
// //      }
// //     const connection = await mysql.createConnection(dbConfig);
// //     try { 
// //         // Insert the new BusPayments data
// //         const [result] = await connection.execute<ResultSetHeader>(
// //             `INSERT INTO buspayments (buss_no, officer_no, paidAmount, monthpaid, transdate, 
// //                 fiscal_year, ReceiptNo, email, electroral_area) 
// //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// //             [
// //                 busPaymentsData.buss_no,
// //                 busPaymentsData.officer_no,
// //                 busPaymentsData.paidAmount,
// //                 busPaymentsData.monthpaid,
// //                 busPaymentsData.transdate,
// //                 busPaymentsData.fiscal_year,
// //                 busPaymentsData.ReceiptNo,
// //                 busPaymentsData.email,
// //                 busPaymentsData.electoral_area
// //             ]
// //         );
// //         // Going to updateOfficerBudget function to update the officer budget
// //         const params: Params = {
// //             paymentMonth: busPaymentsData.monthpaid,
// //             amount: busPaymentsData.paidAmount,
// //             officerNo: busPaymentsData.officer_no,
// //             fiscalYear: Number(busPaymentsData.fiscal_year),
// //             busNo: busPaymentsData.buss_no,
// //             receiptNo: busPaymentsData.ReceiptNo,
// //             transDate: busPaymentsData.transdate,
// //             currentBalance: 0
// //         };
// //         const updateOfficerBudgetResult = await updateOfficerBudget(params);
// //         console.log('updateOfficerBudgetResult:', updateOfficerBudgetResult)
// //         console.log('about to generate receipt')
// //         // Generate the receipt data
// //         const receiptData = {
// //             buss_no: busPaymentsData.buss_no,
// //             officer_no: busPaymentsData.officer_no,
// //             paidAmount: busPaymentsData.paidAmount,
// //             monthpaid: busPaymentsData.monthpaid,
// //             transdate: busPaymentsData.transdate,
// //             fiscal_year: busPaymentsData.fiscal_year,
// //             ReceiptNo: busPaymentsData.ReceiptNo,
// //             email: busPaymentsData.email,
// //             electoral_area: busPaymentsData.electoral_area
// //         };
// //         // Generate the PDF receipt
// //         const receiptPath = await generatePDF(receiptData, receiptsDir);
// //         console.log('about to send email');
// //         // Send the email with the PDF attachment
// //         await sendEmail(receiptPath, busPaymentsData);
// //         res.status(200).json({
// //             message: 'BusPayments record created successfully and email sent.',
// //             receiptUrl: receiptPath,
// //         });
// //     } catch (error) {
// //         console.error('Error:', error);
// //         res.status(500).json({ message: 'Error creating BusPayments record or sending email', error });
// //     } finally {
// //         connection.end();
// //     }
// // });
// // router.post('/sendEmail', async (req: Request, res: Response): Promise<void> => {
// //     console.log('router.post(/sendEmail Sending test email: ');
// //     try {
// //         const mailOptions = {
// //             from: process.env.EMAIL_USER,
// //             to: 'pfleischer2002@yahoo.co.uk', // Use the email address provided in the request body
// //             subject: 'Test Email',
// //             text: 'This is a test email.'
// //         };
// //         await transporter.sendMail(mailOptions);
// //         res.status(200).json({ message: 'Email sent successfully' });
// //     } catch (error) {
// //         console.error('Error sending email:', error);
// //         res.status(500).json({ message: 'Error sending email', error });
// //     }
// // })
// // // Read all BusPayments records
// // router.get('/all', async (req: Request, res: Response) => {
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_buspayments');
// //         res.json(rows);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error fetching BusPayments records', error });
// //     } finally {
// //         connection.end();
// //     }
// // });
// // // Read a single BusPayments record by buss_no
// // router.get('/:buss_no', async (req: Request, res: Response) => {
// //     const { buss_no } = req.params;
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);
// //         if (Array.isArray(rows) && rows.length == 0) {
// //             res.status(404).json({ message: 'Business Payments record not found' });
// //             return
// //         }
// //         res.json(rows);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error fetching BusPayments record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });
// // // Read a single BusPayments record by buss_no
// // router.get('/billedAmount/:buss_no', async (req: Request, res: Response): Promise<void> => {
// //     const { buss_no } = req.params;
// //     console.log('router.get(/billedAmount/:buss_no buss_no:', buss_no)
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_business WHERE buss_no = ?', [buss_no]);
// //         if (Array.isArray(rows) && rows.length == 0) {
// //             res.status(404).json({ amount: 0, message: 'Business not found' });
// //             return
// //          } 
// //          const currentRate = rows[0].current_rate;
// //          console.log('currentRate:', currentRate)
// //          const propertyRate = rows[0].property_rate;
// //          console.log('propertyRate:', propertyRate)
// //         const prevAmount = await findPreviousBalance(Number(buss_no));
// //         console.log('prevAmount:', prevAmount)
// //         const billedAmount = Number(prevAmount) + Number(currentRate) + Number(propertyRate)
// //         console.log('billedAmount:', billedAmount)
// //         if (prevAmount === undefined || prevAmount === null)  {
// //             res.status(404).json({ billedAmount: 0, message: 'No Previous balance found' });
// //             return
// //         } else {           
// //             res.status(200).json({billedAmount: billedAmount, message: 'Previous balance found' });
// //             return
// //         }       
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ billedAmount: 0, message: 'Error fetching BusPayments record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });
// // // Read a single BusPayments record by buss_no
// // router.get('/:electoralarea', async (req: Request, res: Response) => {
// //     const { electoralarea } = req.params;
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE electroral_area = ?', [electoralarea]);
// //         if (Array.isArray(rows) && rows.length == 0) {
// //             res.status(404).json({ message: 'Business Payments record not found' });
// //             return
// //         }
// //         res.json(rows);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error fetching BusPayments record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });
// // // Read a single BusPayments record by date
// // router.get('/:date', async (req: Request, res: Response) => {
// //     const { transdate } = req.params;
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE transdate = ?', [transdate]);
// //         if (Array.isArray(rows) && rows.length == 0) {
// //             res.status(404).json({ message: 'Business Payments record not found' });
// //             return
// //         }
// //         res.json(rows);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error fetching BusPayments record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });
// // // Read a single BusPayments record by buss_no
// // router.get('/:firstdate/:lastdate', async (req: Request, res: Response) => {
// //     const { firstdate, lastdate } = req.params;
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE transdate BETWEEN ? AND ?', 
// //         [firstdate, lastdate]);
// //         if (Array.isArray(rows) && rows.length == 0) {
// //             res.status(404).json({ message: 'Business Payments record not found' });
// //             return
// //         }
// //         res.json(rows);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error fetching BusPayments record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });
// // // Update a BusPayments record
// // router.put('/:buss_no', async (req: Request, res: Response): Promise<void> => {
// //     const { buss_no } = req.params;
// //     const busPaymentsData: BusPaymentsData = req.body;
// //     const isoDate = new Date(busPaymentsData.transdate);
// //     const mysqlDate = isoDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);
// //         if (Array.isArray(rows) && rows.length > 0) {
// //             res.status(404).json({ message: 'BusPayments record exists' });
// //             return
// //         }
// //         // Update the BusPayments data
// //         const [result] = await connection.execute(
// //             `UPDATE tb_buspayments SET officer_no = ?, amount = ?, monthpaid = ?, transdate = ?, 
// //              fiscal_year = ?, ReceiptNo = ? 
// //             WHERE buss_no = ?`,
// //             [
// //                 busPaymentsData.officer_no,
// //                 busPaymentsData.paidAmount,
// //                 busPaymentsData.monthpaid,
// //                 mysqlDate,
// //                 busPaymentsData.fiscal_year,
// //                 busPaymentsData.ReceiptNo,
// //                 buss_no
// //             ]
// //         );
// //         res.status(200).json({ message: 'BusPayments record updated successfully' });
// //         return
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error updating BusPayments record', error });
// //         return
// //     } finally {
// //         connection.end();
// //     }
// // });
// // // Delete a BusPayments record
// // router.delete('/:buss_no', async (req: Request, res: Response) => {
// //     const { buss_no } = req.params;
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [row] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);
// //         if (Array.isArray(row) && row.length == 0) {
// //             res.status(404).json({ message: 'BusPayments record does not exist' });
// //             return
// //         }
// //         // Delete the BusPayments record
// //         const [result] = await connection.execute('DELETE FROM tb_buspayments WHERE buss_no = ?', [buss_no]);
// //         res.status(200).json({ message: 'BusPayments record deleted successfully' });
// //        return
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error deleting BusPayments record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });
// // async function findPreviousBalance(bussNo: number): Promise<number> {
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         // Get current year and previous fiscal year
// //         const currentYear = new Date().getFullYear()
// //        // const prevYear = currentYear - 1
// //         // Find previous payments
// //         const [prevPaymentsResult] = await connection.execute(
// //             'SELECT SUM(paidAmount) AS totsum FROM tb_buspayments WHERE buss_no = ? AND fiscal_year < ?',
// //             [bussNo, currentYear]  
// //         );
// //         const prevPayments = prevPaymentsResult[0]?.totsum ?? 0;
// //         // Find previous billings
// //         const [prevBalancesResult] = await connection.execute(
// //             'SELECT current_balance FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear < ?',
// //             [bussNo, currentYear]
// //         );
// //         const prevBalances = prevBalancesResult[0]?.current_balance ?? 0;
// //         // Calculate balance
// //         return prevBalances - prevPayments;
// //     } catch (error) {
// //         console.error(error);
// //         throw new Error('Error fetching previous balance');
// //     } finally {
// //         connection.end();
// //     }
// // }
// // interface Params {
// //     paymentMonth: string;
// //     amount: number;
// //     officerNo: string;
// //     fiscalYear: number;
// //     busNo: string;
// //     receiptNo: string;
// //     transDate: string; // Use appropriate date format
// //     currentBalance: number;
// // }
// // async function updateOfficerBudget(params: Params): Promise<boolean> {
// //     const connection = await mysql.createConnection(dbConfig);
// //     console.log('in updateOfficerBudget')
// //     try {
// //         // Update officer's collection plan
// //         let varSQL = `UPDATE tb_officerbudget SET `;
// //         const monthColumns = {
// //             January: 'January_Actual',
// //             February: 'February_Actual',
// //             March: 'March_Actual',
// //             April: 'April_Actual',
// //             May: 'May_Actual',
// //             June: 'June_Actual',
// //             July: 'July_Actual',
// //             August: 'August_Actual',
// //             September: 'September_Actual',
// //             October: 'October_Actual',
// //             November: 'November_Actual',
// //             December: 'December_Actual'
// //         };
// //         type MonthKeys = keyof typeof monthColumns;
// //         if (params.paymentMonth in monthColumns && typeof params.paymentMonth === 'string') {
// //             const monthKey = params.paymentMonth as MonthKeys;
// //             varSQL += `${monthColumns[monthKey]} = ${monthColumns[monthKey]} + ?`;
// //         }
// //         varSQL += ', Actual_total = Actual_total + ? ';
// //         varSQL += `WHERE officer_no = ? AND fiscal_year = ?`;
// //         console.log('varSQL: ', varSQL)
// //         await connection.execute(varSQL, [
// //             params.amount,
// //             params.amount,
// //             params.officerNo,
// //             params.fiscalYear
// //         ]);
// //         // Update outstanding
// //         let outstandingSQL = `UPDATE tb_officerbudget SET outstanding = annual_budget - Actual_total WHERE officer_no = ? AND fiscal_year = ?`;
// //         await connection.execute(outstandingSQL, [
// //             params.officerNo,
// //             params.fiscalYear
// //         ]);
// //         // Insert into client payment trans table
// //         let insertSQL = `INSERT INTO tb_receipt(buss_no, receiptno, description, transdate, amount, buss_name) VALUES (?, ?, 'PAYMENT RECEIPT', ?, ?, NULL)`;
// //         await connection.execute(insertSQL, [
// //             params.busNo,
// //             params.receiptNo,
// //             params.transDate,
// //             params.amount
// //         ]);
// //         // Update client's balance
// //         let updateBalanceSQL = `UPDATE tb_business SET balance = balance + ? WHERE buss_no = ?`;
// //         await connection.execute(updateBalanceSQL, [
// //             params.currentBalance,
// //             params.busNo
// //         ]);
// //         // Delete from var_buspayments
// //         let deleteSQL = `DELETE FROM var_buspayments WHERE buss_no = ? AND officer_no = ? AND fiscal_year = ? AND monthpaid = ? AND receiptno = ?`;
// //         await connection.execute(deleteSQL, [
// //             params.busNo,
// //             params.officerNo,
// //             params.fiscalYear,
// //             params.paymentMonth,
// //             params.receiptNo
// //         ]);
// //         return true;
// //     } catch (error) {
// //         console.error('Database operation failed:', error);
// //         return false;
// //     } finally {
// //         await connection.end();
// //     }
// // }
// // export default router;
//# sourceMappingURL=busPaymentsRoutes.js.map