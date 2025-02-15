import * as dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2/promise';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const router = Router();
// Load environment variables from .env file
dotenv.config();
const emailPassword = process.env.EMAIL_PASSWORD;
const appPassword = process.env.APP_PASSWORD;
const emailUser = process.env.EMAIL_USER;
const port = process.env.PORT || 3001;
// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
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
        doc.text(`Electoral Area: ${receiptData.electoral_area}`);
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
    }
    catch (emailError) {
        console.error('Error sending email:', emailError);
        throw emailError;
    }
}
router.post('/create', async (req, res) => {
    // console.log('emailPassword:', emailPassword)
    // console.log('appPassword:', appPassword)
    // console.log('emailUser:', emailUser)
    // console.log('port:', port)
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
    const connection = await mysql.createConnection(dbConfig);
    try {
        // const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [busPaymentsData.buss_no]);
        // if (Array.isArray(rows) && rows.length > 0) {
        //     res.status(400).json({ message: 'BusPayments record already exists' });
        //     return;
        // }
        // Insert the new BusPayments data
        const [result] = await connection.execute(`INSERT INTO tb_buspayments (buss_no, officer_no, paidAmount, monthpaid, transdate, 
                fiscal_year, ReceiptNo, email, electroral_area) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            busPaymentsData.buss_no,
            busPaymentsData.officer_no,
            busPaymentsData.paidAmount,
            busPaymentsData.monthpaid,
            busPaymentsData.transdate,
            busPaymentsData.fiscal_year,
            busPaymentsData.ReceiptNo,
            busPaymentsData.email,
            busPaymentsData.electoral_area
        ]);
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
            electoral_area: busPaymentsData.electoral_area
        };
        // Generate the PDF receipt
        const receiptPath = await generatePDF(receiptData, receiptsDir);
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
        connection.end();
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
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email', error });
    }
});
// Read all BusPayments records
router.get('/all', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments records', error });
    }
    finally {
        connection.end();
    }
});
// Read a single BusPayments record by buss_no
router.get('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return;
        }
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
    finally {
        connection.end();
    }
});
// Read a single BusPayments record by buss_no
router.get('/:electoralarea', async (req, res) => {
    const { electoralarea } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE electroral_area = ?', [electoralarea]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return;
        }
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
    finally {
        connection.end();
    }
});
// Read a single BusPayments record by buss_no
router.get('/:date', async (req, res) => {
    const { transdate } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE transdate = ?', [transdate]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return;
        }
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
    finally {
        connection.end();
    }
});
// Read a single BusPayments record by buss_no
router.get('/:firstdate/:lastdate', async (req, res) => {
    const { firstdate, lastdate } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE transdate BETWEEN ? AND ?', [firstdate, lastdate]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return;
        }
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
    finally {
        connection.end();
    }
});
// Update a BusPayments record
router.put('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const busPaymentsData = req.body;
    const isoDate = new Date(busPaymentsData.transdate);
    const mysqlDate = isoDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'BusPayments record exists' });
            return;
        }
        // Update the BusPayments data
        const [result] = await connection.execute(`UPDATE tb_buspayments SET officer_no = ?, amount = ?, monthpaid = ?, transdate = ?, 
             fiscal_year = ?, ReceiptNo = ? 
            WHERE buss_no = ?`, [
            busPaymentsData.officer_no,
            busPaymentsData.paidAmount,
            busPaymentsData.monthpaid,
            mysqlDate,
            busPaymentsData.fiscal_year,
            busPaymentsData.ReceiptNo,
            buss_no
        ]);
        res.status(200).json({ message: 'BusPayments record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BusPayments record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Delete a BusPayments record
router.delete('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [row] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);
        if (Array.isArray(row) && row.length == 0) {
            res.status(404).json({ message: 'BusPayments record does not exist' });
            return;
        }
        // Delete the BusPayments record
        const [result] = await connection.execute('DELETE FROM tb_buspayments WHERE buss_no = ?', [buss_no]);
        res.status(200).json({ message: 'BusPayments record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BusPayments record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=busPaymentsRoutes.js.map