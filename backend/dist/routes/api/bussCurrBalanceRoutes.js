import * as dotenv from 'dotenv';
import { Router } from 'express';
import { Pool } from 'pg'; // Import PostgreSQL client
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const router = Router();
// Load environment variables from .env file
dotenv.config();
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.APP_PASSWORD;
const port = process.env.PORT || 3001;
// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || "5432"), // Default PostgreSQL port
});
// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPassword
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
        from: emailUser,
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
    try {
        // Insert the new BusPayments data
        const result = await pool.query(`INSERT INTO tb_buspayments (buss_no, officer_no, paidAmount, monthpaid, transdate, 
                fiscal_year, ReceiptNo, email, electoral_area) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
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
        // Generate the PDF receipt
        const receiptPath = await generatePDF(busPaymentsData, receiptsDir);
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
});
// Read all BusPayments records
router.get('/all', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM tb_buspayments');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments records', error });
    }
});
// Read a single BusPayments record by buss_no
router.get('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM tb_buspayments WHERE buss_no = $1', [buss_no]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return;
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    }
});
// Additional route implementations with similar structure...
export default router;
// // backend/src/routes/api/bussCurrBalanceRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader } from 'mysql2/promise';
// const router = Router();
// // Load environment variables from .env file
// dotenv.config();
// // MySQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
// };
// // BussCurrBalance data interface
// interface BussCurrBalanceData {
//     buss_no: string;
//     fiscalyear: string;
//     balancebf: number;
//     current_balance: number;
//     totalAmountDue: number;
//     transdate: string;
//     electoralarea: string;
// }
// // Create a new BussCurrBalance record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const bussCurrBalanceData: BussCurrBalanceData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?',
//          [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]
//         );
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(404).json({ message: 'BussCurrBalance record exists' });
//             return
//         }
//         // Insert the new BussCurrBalance data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_BussCurrBalance (buss_no, fiscalyear, balancebf, current_balance, totalAmountDue, transdate, electoralarea) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 bussCurrBalanceData.buss_no,
//                 bussCurrBalanceData.fiscalyear,
//                 bussCurrBalanceData.balancebf,
//                 bussCurrBalanceData.current_balance,
//                 bussCurrBalanceData.totalAmountDue,
//                 bussCurrBalanceData.transdate,
//                 bussCurrBalanceData.electoralarea,
//             ]
//         );
//         res.status(201).json({ message: 'BussCurrBalance record created successfully' });
//         return
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating BussCurrBalance record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read all BussCurrBalance records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BussCurrBalance records', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single BussCurrBalance record by buss_no
// router.get('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
//     const { buss_no, fiscalyear } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?', [buss_no, fiscalyear]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.json(rows[0]); // Return the first row
//         } else {
//             res.status(404).json({ message: 'BussCurrBalance record not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching BussCurrBalance record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Update a BussCurrBalance record
// router.put('/:buss_no/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
//     const { buss_no } = req.params;
//     const bussCurrBalanceData: BussCurrBalanceData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?',
//          [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]
//         );
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'BussCurrBalance record not exist' });
//             return
//         }
//         // Update the BussCurrBalance data
//         const [result] = await connection.execute(
//             `UPDATE tb_BussCurrBalance SET fiscalyear = ?, balancebf = ?, current_balance = ?, totalAmountDue = ?, 
//             transdate = ?, electoralarea = ? 
//             WHERE buss_no = ? AND fiscalyear = ?`,
//             [
//                 bussCurrBalanceData.fiscalyear,
//                 bussCurrBalanceData.balancebf,
//                 bussCurrBalanceData.current_balance,
//                 bussCurrBalanceData.totalAmountDue,
//                 bussCurrBalanceData.transdate,
//                 bussCurrBalanceData.electoralarea,
//                 buss_no
//             ]
//         );
//    res.status(200).json({ message: 'BussCurrBalance record updated successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating BussCurrBalance record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Delete a BussCurrBalance record
// router.delete('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
//     const { buss_no, fiscalyear } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?',
//          [buss_no, fiscalyear]
//         );
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'BussCurrBalance record not exist' });
//             return
//         }
//         // Delete the BussCurrBalance record
//         const [result] = await connection.execute('DELETE FROM tb_BussCurrBalance WHERE buss_no = ?', [buss_no]);
//         res.status(200).json({ message: 'BussCurrBalance record deleted successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting BussCurrBalance record', error });
//     } finally {
//         connection.end();
//     }
// });
// export default router;
//# sourceMappingURL=bussCurrBalanceRoutes.js.map