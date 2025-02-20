// backend/src/routes/api/busPaymentsRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import PDFDocument from 'pdfkit';
import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = Router();

// Load environment variables from .env file
dotenv.config();

const emailPassword = process.env.EMAIL_PASSWORD
const appPassword = process.env.APP_PASSWORD
const emailUser = process.env.EMAIL_USER
const port = process.env.PORT || 3001;

// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};

// BusPayments data interface
interface BusPaymentsData {
    buss_no: string;
    officer_no: string;
    paidAmount: number;
    monthpaid: string;
    transdate: string;
    fiscal_year: string;
    ReceiptNo: string;
    email: string;
    electoral_area: string;
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD
    }
});

// Function to generate PDF
async function generatePDF(receiptData: BusPaymentsData, receiptsDir: string): Promise<string> {
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
async function sendEmail(receiptPath: string, busPaymentsData: BusPaymentsData): Promise<void> {
    const mailOptions: SendMailOptions = {
        from: process.env.EMAIL_USER,
        to: busPaymentsData.email, // client email from request body
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
    } catch (emailError) {
        console.error('Error sending email:', emailError);
        throw emailError;
    }
}

router.post('/create', async (req: Request, res: Response): Promise<void> => {

    // console.log('emailPassword:', emailPassword)
    // console.log('appPassword:', appPassword)
    // console.log('emailUser:', emailUser)
    // console.log('port:', port)

    console.log('router.post(/create XXXXXXXXX ');

    const busPaymentsData: BusPaymentsData = req.body;

     // Ensure the receipts directory exists
     const __filename = fileURLToPath(import.meta.url);
     const __dirname = dirname(__filename);
     const receiptsDir = path.join(__dirname, 'receipts');
     if (!fs.existsSync(receiptsDir)) {
         fs.mkdirSync(receiptsDir, { recursive: true });
         console.log('Created receipts directory:', receiptsDir);
     } else {
         console.log('Receipts directory already exists:', receiptsDir);
     }

    const connection = await mysql.createConnection(dbConfig);
    
    try { 

        // Insert the new BusPayments data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO buspayments (buss_no, officer_no, paidAmount, monthpaid, transdate, 
                fiscal_year, ReceiptNo, email, electroral_area) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                busPaymentsData.buss_no,
                busPaymentsData.officer_no,
                busPaymentsData.paidAmount,
                busPaymentsData.monthpaid,
                busPaymentsData.transdate,
                busPaymentsData.fiscal_year,
                busPaymentsData.ReceiptNo,
                busPaymentsData.email,
                busPaymentsData.electoral_area
            ]
        );

        // Going to updateOfficerBudget function to update the officer budget

        const params: Params = {
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
        console.log('updateOfficerBudgetResult:', updateOfficerBudgetResult)

        console.log('about to generate receipt')
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

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BusPayments record or sending email', error });
    } finally {
        connection.end();
    }
});

router.post('/sendEmail', async (req: Request, res: Response): Promise<void> => {
    console.log('router.post(/sendEmail Sending test email: ');

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'pfleischer2002@yahoo.co.uk', // Use the email address provided in the request body
            subject: 'Test Email',
            text: 'This is a test email.'
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email', error });
    }

})

// Read all BusPayments records
router.get('/all', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM buspayments');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments records', error });
    } finally {
        connection.end();
    }
});

// Read a single BusPayments record by buss_no
router.get('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM buspayments WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return
        }
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    } finally {
        connection.end();
    }
});

// Read a single BusPayments record by buss_no
router.get('/billedAmount/:buss_no', async (req: Request, res: Response): Promise<void> => {
    const { buss_no } = req.params;

    console.log('router.get(/billedAmount/:buss_no buss_no:', buss_no)

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM business WHERE buss_no = ?', [buss_no]);
        
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ amount: 0, message: 'Business not found' });
            return
         } 
         const currentRate = rows[0].current_rate;
         console.log('currentRate:', currentRate)

         const propertyRate = rows[0].property_rate;
         console.log('propertyRate:', propertyRate)

        const prevAmount = await findPreviousBalance(Number(buss_no));

        console.log('prevAmount:', prevAmount)
        const billedAmount = Number(prevAmount) + Number(currentRate) + Number(propertyRate)

        console.log('billedAmount:', billedAmount)

        if (prevAmount === undefined || prevAmount === null)  {
            res.status(404).json({ billedAmount: 0, message: 'No Previous balance found' });
            return
        } else {           
            res.status(200).json({billedAmount: billedAmount, message: 'Previous balance found' });
            return
        }       
    } catch (error) {
        console.error(error);
        res.status(500).json({ billedAmount: 0, message: 'Error fetching BusPayments record', error });
    } finally {
        connection.end();
    }
});

// Read a single BusPayments record by buss_no
router.get('/:electoralarea', async (req: Request, res: Response) => {
    const { electoralarea } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM buspayments WHERE electroral_area = ?', [electoralarea]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return
        }
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    } finally {
        connection.end();
    }
});

// Read a single BusPayments record by date
router.get('/:date', async (req: Request, res: Response) => {
    const { transdate } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM buspayments WHERE transdate = ?', [transdate]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return
        }
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    } finally {
        connection.end();
    }
});

// Read a single BusPayments record by buss_no
router.get('/:firstdate/:lastdate', async (req: Request, res: Response) => {
    const { firstdate, lastdate } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM buspayments WHERE transdate BETWEEN ? AND ?', 
        [firstdate, lastdate]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return
        }
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BusPayments record', error });
    } finally {
        connection.end();
    }
});

// Update a BusPayments record
router.put('/:buss_no', async (req: Request, res: Response): Promise<void> => {
    const { buss_no } = req.params;
    const busPaymentsData: BusPaymentsData = req.body;

    const isoDate = new Date(busPaymentsData.transdate);
    const mysqlDate = isoDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD

    const connection = await mysql.createConnection(dbConfig);
   
    try {
        const [rows] = await connection.execute('SELECT * FROM buspayments WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'BusPayments record exists' });
            return
        }

        // Update the BusPayments data
        const [result] = await connection.execute(
            `UPDATE buspayments SET officer_no = ?, amount = ?, monthpaid = ?, transdate = ?, 
             fiscal_year = ?, ReceiptNo = ? 
            WHERE buss_no = ?`,
            [
                busPaymentsData.officer_no,
                busPaymentsData.paidAmount,
                busPaymentsData.monthpaid,
                mysqlDate,
                busPaymentsData.fiscal_year,
                busPaymentsData.ReceiptNo,
                buss_no
            ]
        );

        res.status(200).json({ message: 'BusPayments record updated successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BusPayments record', error });
        return
    } finally {
        connection.end();
    }
});

// Delete a BusPayments record
router.delete('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [row] = await connection.execute('SELECT * FROM buspayments WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(row) && row.length == 0) {
            res.status(404).json({ message: 'BusPayments record does not exist' });
            return
        }
        // Delete the BusPayments record
        const [result] = await connection.execute('DELETE FROM buspayments WHERE buss_no = ?', [buss_no]);

        res.status(200).json({ message: 'BusPayments record deleted successfully' });
       return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BusPayments record', error });
    } finally {
        connection.end();
    }
});

async function findPreviousBalance(bussNo: number): Promise<number> {
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Get current year and previous fiscal year
        const currentYear = new Date().getFullYear()
       // const prevYear = currentYear - 1

        // Find previous payments
        const [prevPaymentsResult] = await connection.execute(
            'SELECT SUM(paidAmount) AS totsum FROM buspayments WHERE buss_no = ? AND fiscal_year < ?',
            [bussNo, currentYear]  
        );

        const prevPayments = prevPaymentsResult[0]?.totsum ?? 0;

        // Find previous billings
        const [prevBalancesResult] = await connection.execute(
            'SELECT current_balance FROM busscurrbalance WHERE buss_no = ? AND fiscalyear < ?',
            [bussNo, currentYear]
        );

        const prevBalances = prevBalancesResult[0]?.current_balance ?? 0;

        // Calculate balance
        return prevBalances - prevPayments;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching previous balance');
    } finally {
        connection.end();
    }
}

interface Params {
    paymentMonth: string;
    amount: number;
    officerNo: string;
    fiscalYear: number;
    busNo: string;
    receiptNo: string;
    transDate: string; // Use appropriate date format
    currentBalance: number;
}


async function updateOfficerBudget(params: Params): Promise<boolean> {
    const connection = await mysql.createConnection(dbConfig);

    console.log('in updateOfficerBudget')

    try {
        // Update officer's collection plan
        let varSQL = `UPDATE officerbudget SET `;

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
        type MonthKeys = keyof typeof monthColumns;

        if (params.paymentMonth in monthColumns && typeof params.paymentMonth === 'string') {
            const monthKey = params.paymentMonth as MonthKeys;
            varSQL += `${monthColumns[monthKey]} = ${monthColumns[monthKey]} + ?`;
        }
        
        varSQL += ', Actual_total = Actual_total + ? ';
        varSQL += `WHERE officer_no = ? AND fiscal_year = ?`;

        console.log('varSQL: ', varSQL)
        
        await connection.execute(varSQL, [
            params.amount,
            params.amount,
            params.officerNo,
            params.fiscalYear
        ]);

        // Update outstanding
        let outstandingSQL = `UPDATE officerbudget SET outstanding = annual_budget - Actual_total WHERE officer_no = ? AND fiscal_year = ?`;
        await connection.execute(outstandingSQL, [
            params.officerNo,
            params.fiscalYear
        ]);

        // Insert into client payment trans table
        let insertSQL = `INSERT INTO receipt(buss_no, receiptno, description, transdate, amount, buss_name) VALUES (?, ?, 'PAYMENT RECEIPT', ?, ?, NULL)`;
        await connection.execute(insertSQL, [
            params.busNo,
            params.receiptNo,
            params.transDate,
            params.amount
        ]);
        
        // Update client's balance
        let updateBalanceSQL = `UPDATE business SET balance = balance + ? WHERE buss_no = ?`;
        await connection.execute(updateBalanceSQL, [
            params.currentBalance,
            params.busNo
        ]);

        // Delete from var_buspayments
        let deleteSQL = `DELETE FROM varbuspayments WHERE buss_no = ? AND officer_no = ? AND fiscal_year = ? AND monthpaid = ? AND receiptno = ?`;
        await connection.execute(deleteSQL, [
            params.busNo,
            params.officerNo,
            params.fiscalYear,
            params.paymentMonth,
            params.receiptNo
        ]);
        return true;
    } catch (error) {
        console.error('Database operation failed:', error);
        return false;
    } finally {
        await connection.end();
    }
}

export default router;














// // backend/src/routes/api/busPaymentsRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader } from 'mysql2/promise';
// import PDFDocument from 'pdfkit';
// import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

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

//     const connection = await mysql.createConnection(dbConfig);
    
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
//         const [rows] = await connection.execute('SELECT * FROM tb_buspayments');
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
//         const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

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
//         const [rows] = await connection.execute('SELECT * FROM tb_business WHERE buss_no = ?', [buss_no]);
        
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
//         const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE electroral_area = ?', [electoralarea]);

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
//         const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE transdate = ?', [transdate]);

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
//         const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE transdate BETWEEN ? AND ?', 
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
//         const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(404).json({ message: 'BusPayments record exists' });
//             return
//         }

//         // Update the BusPayments data
//         const [result] = await connection.execute(
//             `UPDATE tb_buspayments SET officer_no = ?, amount = ?, monthpaid = ?, transdate = ?, 
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
//         const [row] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

//         if (Array.isArray(row) && row.length == 0) {
//             res.status(404).json({ message: 'BusPayments record does not exist' });
//             return
//         }
//         // Delete the BusPayments record
//         const [result] = await connection.execute('DELETE FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

//         res.status(200).json({ message: 'BusPayments record deleted successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting BusPayments record', error });
//     } finally {
//         connection.end();
//     }
// });

// async function findPreviousBalance(bussNo: number): Promise<number> {
//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         // Get current year and previous fiscal year
//         const currentYear = new Date().getFullYear()
//        // const prevYear = currentYear - 1

//         // Find previous payments
//         const [prevPaymentsResult] = await connection.execute(
//             'SELECT SUM(paidAmount) AS totsum FROM tb_buspayments WHERE buss_no = ? AND fiscal_year < ?',
//             [bussNo, currentYear]  
//         );

//         const prevPayments = prevPaymentsResult[0]?.totsum ?? 0;

//         // Find previous billings
//         const [prevBalancesResult] = await connection.execute(
//             'SELECT current_balance FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear < ?',
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
//         let varSQL = `UPDATE tb_officerbudget SET `;

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
//         let outstandingSQL = `UPDATE tb_officerbudget SET outstanding = annual_budget - Actual_total WHERE officer_no = ? AND fiscal_year = ?`;
//         await connection.execute(outstandingSQL, [
//             params.officerNo,
//             params.fiscalYear
//         ]);

//         // Insert into client payment trans table
//         let insertSQL = `INSERT INTO tb_receipt(buss_no, receiptno, description, transdate, amount, buss_name) VALUES (?, ?, 'PAYMENT RECEIPT', ?, ?, NULL)`;
//         await connection.execute(insertSQL, [
//             params.busNo,
//             params.receiptNo,
//             params.transDate,
//             params.amount
//         ]);
        
//         // Update client's balance
//         let updateBalanceSQL = `UPDATE tb_business SET balance = balance + ? WHERE buss_no = ?`;
//         await connection.execute(updateBalanceSQL, [
//             params.currentBalance,
//             params.busNo
//         ]);

//         // Delete from var_buspayments
//         let deleteSQL = `DELETE FROM var_buspayments WHERE buss_no = ? AND officer_no = ? AND fiscal_year = ? AND monthpaid = ? AND receiptno = ?`;
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










