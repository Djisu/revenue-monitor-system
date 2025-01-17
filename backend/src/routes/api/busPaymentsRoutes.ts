// backend/src/routes/api/busPaymentsRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const router = Router();

// Load environment variables from .env file
dotenv.config();

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
    amount: number;
    monthpaid: string;
    transdate: string;
    userid: string;
    fiscal_year: string;
    ReceiptNo: string;
    email: string;
}

// Create a new BusPayments record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const busPaymentsData: BusPaymentsData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try { 
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [busPaymentsData.buss_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'BusPayments record not exists' });
            return
        }

        // Insert the new BusPayments data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_buspayments (buss_no, officer_no, amount, monthpaid, transdate, userid, fiscal_year, ReceiptNo, email) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                busPaymentsData.buss_no,
                busPaymentsData.officer_no,
                busPaymentsData.amount,
                busPaymentsData.monthpaid,
                busPaymentsData.transdate,
                busPaymentsData.userid,
                busPaymentsData.fiscal_year,
                busPaymentsData.ReceiptNo,
                busPaymentsData.email,
            ]
        );

         // Generate the receipt data
         const receiptData = {
            buss_no: busPaymentsData.buss_no,
            officer_no: busPaymentsData.officer_no,
            amount: busPaymentsData.amount,
            monthpaid: busPaymentsData.monthpaid,
            transdate: busPaymentsData.transdate,
            userid: busPaymentsData.userid,
            fiscal_year: busPaymentsData.fiscal_year,
            receipt_no: busPaymentsData.ReceiptNo,
            email: busPaymentsData.email,
        };

        // Optionally format the receipt as a string (or use a library to create PDF)
        const receipt = `
            Receipt No: ${receiptData.receipt_no}
            Bus Number: ${receiptData.buss_no}
            Officer No: ${receiptData.officer_no}
            Amount: $${receiptData.amount}
            Month Paid: ${receiptData.monthpaid}
            Transaction Date: ${receiptData.transdate}
            User ID: ${receiptData.userid}
            Fiscal Year: ${receiptData.fiscal_year}
            email: ${receiptData.email}
        `;

        // Generating Receipt for client payment
        const doc = new PDFDocument();
        const receiptPath = `./receipts/receipt_${busPaymentsData.ReceiptNo}.pdf`;
        
        doc.pipe(fs.createWriteStream(receiptPath)); // Save to file

        // Add content to the PDF
        doc.fontSize(25).text('Receipt', { align: 'center' });
        doc.text(`Receipt No: ${busPaymentsData.ReceiptNo}`);
        doc.text(`Bus Number: ${busPaymentsData.buss_no}`);
        doc.text(`Officer No: ${busPaymentsData.officer_no}`);
        doc.text(`Amount: $${busPaymentsData.amount}`);
        doc.text(`Month Paid: ${busPaymentsData.monthpaid}`);
        doc.text(`Transaction Date: ${busPaymentsData.transdate}`);
        doc.text(`User ID: ${busPaymentsData.userid}`);
        doc.text(`Fiscal Year: ${busPaymentsData.fiscal_year}`);
        doc.text(`email: ${busPaymentsData.email}`);           
        doc.end();

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or any other email service
            auth: {
                user: 'your-email@gmail.com', // your email
                pass: 'your-email-password', // your email password or app password
            },
        });

        // Send email with PDF attachment
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: busPaymentsData.email, // client email from request body
            subject: 'Your Payment Receipt',
            text: 'Please find attached your payment receipt.',
            attachments: [
                {
                    filename: path.basename(receiptPath),
                    path: receiptPath,
                },
            ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ message: 'Error sending receipt email', error });
            } else {
                res.status(201).json({ 
                    message: 'BusPayments record created successfully and email sent.',
                    receiptUrl: receiptPath 
                });
            }
        });

        // Send response with the receipt
        res.status(201).json({ 
            message: 'BusPayments record created successfully',
            receiptUrl: receiptPath // Return the path to the receipt 
        });
        return
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BusPayments record', error });
        return
    } finally {
        connection.end();
    }
});

// Read all BusPayments records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments');
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
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Business Payments record not found' });
            return
        }
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
        const [rows] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'BusPayments record exists' });
            return
        }

        // Update the BusPayments data
        const [result] = await connection.execute(
            `UPDATE tb_buspayments SET officer_no = ?, amount = ?, monthpaid = ?, transdate = ?, 
            userid = ?, fiscal_year = ?, ReceiptNo = ? 
            WHERE buss_no = ?`,
            [
                busPaymentsData.officer_no,
                busPaymentsData.amount,
                busPaymentsData.monthpaid,
                mysqlDate,
                busPaymentsData.userid,
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
        const [row] = await connection.execute('SELECT * FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(row) && row.length == 0) {
            res.status(404).json({ message: 'BusPayments record does not exist' });
            return
        }
        // Delete the BusPayments record
        const [result] = await connection.execute('DELETE FROM tb_buspayments WHERE buss_no = ?', [buss_no]);

        res.status(200).json({ message: 'BusPayments record deleted successfully' });
       return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BusPayments record', error });
    } finally {
        connection.end();
    }
});

export default router;










// const express = require('express');
// const mssql = require('mssql');
// const app = express();
// const port = 3000;

// // Database configuration
// const config = {
//   user: 'sa',
//   password: 'Timbuk2tu',
//   server: 'your_server_name',
//   database: 'your_database_name',
//   options: {
//     encrypt: true, // Use this if you're on Windows Azure
//   },
// };

// // Fetch business types
// app.get('/api/businessTypes', async (req, res) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request().query(`SELECT DISTINCT buss_type FROM tb_business ORDER BY buss_type ASC`);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Fetch electoral areas
// app.get('/api/electoralAreas', async (req, res) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request().query(`SELECT DISTINCT electoral_area FROM tb_ElectoralArea ORDER BY electoral_area ASC`);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Fetch distinct transaction dates
// app.get('/api/dates', async (req, res) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request().query(`SELECT DISTINCT transdate FROM tb_busscurrbalance ORDER BY convert(datetime, transdate)`);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Generate and fetch detailed preview data
// app.get('/api/detailedPreview', async (req, res) => {
//   try {
//     const { business_type, electoral_area, start_date, end_date } = req.query;
//     const pool = await mssql.connect(config);

//     // Delete existing records in tb_variance
//     await pool.request().query(`DELETE FROM tb_variance`);

//     // Fetch properties and process them
//     let query = `SELECT * FROM tb_business ORDER BY buss_type ASC`;
//     if (business_type && electoral_area) {
//       query = `SELECT * FROM tb_business WHERE buss_type = @business_type AND electoral_area = @electoral_area ORDER BY buss_type ASC`;
//     } else if (business_type) {
//       query = `SELECT * FROM tb_business WHERE buss_type = @business_type ORDER BY buss_type ASC`;
//     } else if (electoral_area) {
//       query = `SELECT * FROM tb_business WHERE electoral_area = @electoral_area ORDER BY buss_type ASC`;
//     }

//     const properties = await pool.request()
//       .input('business_type', mssql.NVarChar, business_type)
//       .input('electoral_area', mssql.NVarChar, electoral_area)
//       .query(query);

//     if (properties.recordset.length === 0) {
//       setError('No such business type found');
//       return res.status(404).send(error);
//     }

//     for (const property of properties.recordset) {
//       const varBalanceBF = await findBalanceBF(property.buss_no, start_date);
//       const varCurrentRate = await findCurrentRate(property.buss_no, end_date);
//       const varPaidAmount = await findPaidAmount(property.buss_no, start_date, end_date);
//       const varTotal = varBalanceBF + varCurrentRate - varPaidAmount;

//       await pool.request()
//         .input('buss_no', mssql.NVarChar, property.buss_no)
//         .input('balancebf', mssql.Decimal(13, 2), varBalanceBF)
//         .input('current_rate', mssql.Decimal(13, 2), varCurrentRate)
//         .input('paid_amount', mssql.Decimal(13, 2), varPaidAmount)
//         .input('Total', mssql.Decimal(13, 2), varTotal)
//         .input('electoral_area', mssql.NVarChar, property.electoral_area)
//         .input('buss_type', mssql.NVarChar, property.buss_type)
//         .query(`INSERT INTO tb_variance (buss_no, balancebf, current_rate, paid_amount, Total, electoral_area, buss_type) VALUES (@buss_no, @balancebf, @current_rate, @paid_amount, @Total, @electoral_area, @buss_type)`);
//     }

//     // Fetch processed records
//     const result = await pool.request().query(`SELECT * FROM tb_variance`);
//     if (result.recordset.length > 0) {
//       res.json(result.recordset);
//     } else {
//       setError('No records found');
//       res.status(404).send(error);
//     }
//   } catch (err) {
//     setError('Error generating detailed preview');
//     res.status(500).send(err.message);
//   }
// });

// // Generate and fetch summary preview data
// app.get('/api/summaryPreview', async (req, res) => {
//   try {
//     const { business_type, electoral_area, start_date, end_date } = req.query;
//     const pool = await mssql.connect(config);

//     // Delete existing records in tb_variance
//     await pool.request().query(`DELETE FROM tb_variance`);

//     // Fetch properties and process them
//     let query = `SELECT * FROM tb_business ORDER BY buss_type ASC`;
//     if (business_type) {
//       query = `SELECT * FROM tb_business WHERE buss_type = @business_type ORDER BY buss_type ASC`;
//     }

//     const properties = await pool.request()
//       .input('business_type', mssql.NVarChar, business_type)
//       .query(query);

//     if (properties.recordset.length === 0) {
//       setError('No such business type found');
//       return res.status(404).send(error);
//     }

//     for (const property of properties.recordset) {
//       const varBalanceBF = await findBalanceBF(property.buss_no, start_date);
//       const varCurrentRate = await findCurrentRate(property.buss_no, end_date);
//       const varPaidAmount = await findPaidAmount(property.buss_no, start_date, end_date);
//       const varTotal = varBalanceBF + varCurrentRate - varPaidAmount;

//       await pool.request()
//         .input('buss_no', mssql.NVarChar, property.buss_no)
//         .input('balancebf', mssql.Decimal(13, 2), varBalanceBF)
//         .input('current_rate', mssql.Decimal(13, 2), varCurrentRate)
//         .input('paid_amount', mssql.Decimal(13, 2), varPaidAmount)
//         .input('Total', mssql.Decimal(13, 2), varTotal)
//         .input('electoral_area', mssql.NVarChar, property.electoral_area)
//         .input('buss_type', mssql.NVarChar, property.buss_type)
//         .query(`INSERT INTO tb_variance (buss_no, balancebf, current_rate, paid_amount, Total, electoral_area, buss_type) VALUES (@buss_no, @balancebf, @current_rate, @paid_amount, @Total, @electoral_area, @buss_type)`);
//     }

//     // Fetch processed records
//     const result = await pool.request().query(`SELECT * FROM tb_variance`);
//     if (result.recordset.length > 0) {
//       res.json(result.recordset);
//     } else {
//       setError('No records found');
//       res.status(404).send(error);
//     }
//   } catch (err) {
//     setError('Error generating summary preview');
//     res.status(500).send(err.message);
//   }
// });

// // Helper function to find Balance BF
// const findBalanceBF = async (buss_no, start_date) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request()
//       .input('buss_no', mssql.NVarChar, buss_no)
//       .input('start_date', mssql.DateTime, start_date)
//       .query(`SELECT SUM(amount) AS totsum FROM tb_busPayments WHERE buss_no = @buss_no AND transdate < @start_date`);
//     return result.recordset[0]?.totsum || 0;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// // Helper function to find Current Rate
// const findCurrentRate = async (buss_no, end_date) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request()
//       .input('buss_no', mssql.NVarChar, buss_no)
//       .input('end_date', mssql.DateTime, end_date)
//       .query(`SELECT current_balance FROM tb_bussCurrBalance WHERE buss_no = @buss_no AND YEAR(transdate) = YEAR(@end_date)`);
//     return result.recordset[0]?.current_balance || 0;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// // Helper function to find Paid Amount
// const findPaidAmount = async (buss_no, start_date, end_date) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request()
//       .input('buss_no', mssql.NVarChar, buss_no)
//       .input('start_date', mssql.DateTime, start_date)
//       .input('end_date', mssql.DateTime, end_date)
//       .query(`SELECT SUM(amount) AS totsum FROM tb_busPayments WHERE buss_no = @buss_no AND transdate BETWEEN @start_date AND @end_date`);
//     return result.recordset[0]?.totsum || 0;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });










// import express from 'express';
// import sql from 'mssql';

// const app = express();
// app.use(express.json());

// const config = {
//     user: 'sa',
//     password: 'Timbuk2tu',
//     server: '(local)',
//     database: 'Saltpond',
//     options: {
//         encrypt: false,
//         trustServerCertificate: true,
//     }
// };

// // Fetch officers
// app.get('/api/officers', async (req, res) => {
//     try {
//         await sql.connect(config);
//         const result = await sql.query`SELECT officer_no, officer_name FROM tb_officer`;
//         res.json(result.recordset);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });

// // Fetch properties based on officer number
// app.get('/api/properties', async (req, res) => {
//     const { officer_no } = req.query;

//     try {
//         await sql.connect(config);
//         const result = await sql.query`SELECT * FROM tb_business WHERE assessmentby = ${officer_no}`;
//         res.json(result.recordset);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });

// // Fetch distinct emails
// app.get('/api/fiscal-years', async (req, res) => {
//     try {
//         await sql.connect(config);
//         const result = await sql.query`SELECT DISTINCT fiscalyear FROM tb_busscurrbalance`;
//         res.json(result.recordset);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });

// // Fetch distinct electoral areas
// app.get('/api/electoral-areas', async (req, res) => {
//     try {
//         await sql.connect(config);
//         const result = await sql.query`SELECT DISTINCT electroral_area FROM tb_business`;
//         res.json(result.recordset);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });

// // Fetch balance BF for a specific business
// app.get('/api/balance-bf', async (req, res) => {
//     const { buss_no } = req.query;

//     try {
//         await sql.connect(config);
//         const result = await sql.query`SELECT SUM(amount) AS totsum FROM tb_busPayments WHERE buss_no = ${buss_no}`;
//         const totsum = result.recordset[0]?.totsum || 0;

//         const result2 = await sql.query`SELECT SUM(balancebf) AS totPrevBal FROM tb_bussCurrBalance WHERE buss_no = ${buss_no}`;
//         const totPrevBal = result2.recordset[0]?.totPrevBal || 0;

//         const balanceBF = totPrevBal - totsum;
//         res.json(balanceBF);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });

// // Fetch total payable amount for a specific business
// app.get('/api/total-payable', async (req, res) => {
//     const { buss_no } = req.query;

//     try {
//         await sql.connect(config);
//         const result = await sql.query`SELECT SUM(current_balance) AS totsum FROM tb_busscurrbalance WHERE buss_no = ${buss_no}`;
//         const totsum = result.recordset[0]?.totsum || 0;
//         res.json(totsum);
//     } catch (error) {
//         console.error(error);
//         res.status





// app.post('/api/update-business-zones', async (req, res) => {
//     try {
//         await db.query("set dateformat dmy update var_busPayments set electroral_area=tb_business.electroral_area from tb_business where tb_business.buss_no=var_busPayments.buss_no");
//         await db.query("set dateformat dmy update var_busPayments set buss_type=tb_business.buss_type from tb_business where tb_business.buss_no=var_busPayments.buss_no");
//         await db.query("set dateformat dmy update tb_busPayments set electroral_area=tb_business.electroral_area from tb_business where tb_business.buss_no=tb_busPayments.buss_no");
//         await db.query("set dateformat dmy update tb_busPayments set buss_type=tb_business.buss_type from tb_business where tb_business.buss_no=tb_busPayments.buss_no");
//         res.status(200).send({ success: true });
//     } catch (error) {
//         res.status(500).send({ success: false, message: error.message });
//     }
// });

// app.get('/api/zones', async (req, res) => {
//     try {
//         const result = await db.query("set dateformat dmy select distinct electroral_area from tb_buspayments where amount>0");
//         res.status(200).json(result.recordset.map((row: any) => row.electroral_area));
//     } catch (error) {
//         res.status(500).send({ success: false, message: error.message });
//     }
// });

// app.get('/api/business-types', async (req, res) => {
//     const { zone } = req.query;
//     if (!zone) {
//         return res.status(400).send({ success: false, message: "Select a zone" });
//     }

//     try {
//         const result = await db.query(`set dateformat dmy select distinct buss_type from tb_busPayments where electroral_area=convert(varchar(50),'${zone}')`);
//         res.status(200).json(result.recordset.map((row: any) => row.buss_type));
//     } catch (error) {
//         res.status(500).send({ success: false, message: error.message });
//     }
// });app.get('/api/payment-dates', async (req, res) => {
//     const { zone } = req.query;
//     if (!zone) {
//         return res.status(400).send({ success: false, message: "Select a zone" });
//     }

//     try {
//         const result = await db.query(`set dateformat dmy select transdate from tb_busPayments where electroral_area=convert(varchar(100),'${zone}') order by convert(datetime,transdate)`);
//         res.status(200).json(result.recordset.map((row: any) => row.transdate));
//     } catch (error) {
//         res.status(500).send({ success: false, message: error.message });
//     }
// });


// app.post('/api/produce-report', async (req, res) => {
//     const { firstDate, lastDate, zone, bussType, posted } = req.body;

//     try {
//         // Delete from tmp_busPayments
//         await db.query("set dateformat dmy delete from tmp_busPayments");

//         // Select payments based on the criteria
//         let query;
//         if (zone && bussType) {
//             query = `set dateformat dmy select * from tb_busPayments where transdate between convert(datetime,'${firstDate}') and convert(datetime,'${lastDate}') and electroral_area=convert(varchar(50),'${zone}') and buss_type='${bussType}'`;
//         } else if (zone) {
//             query = `set dateformat dmy select * from tb_busPayments where transdate between convert(datetime,'${firstDate}') and convert(datetime,'${lastDate}') and electroral_area=convert(varchar(50),'${zone}')`;
//         } else if (bussType) {
//             query = `set dateformat dmy select * from tb_busPayments where transdate between convert(datetime,'${firstDate}') and convert(datetime,'${lastDate}') and buss_type='${bussType}'`;
//         } else {
//             query = `set dateformat dmy select * from tb_busPayments where transdate between convert(datetime,'${firstDate}') and convert(datetime,'${lastDate}')`;
//         }

//         const result = await db.query(query);
//         if (result.recordset.length === 0) {
//             return res.status(404).send({ success: false, message: "Record not found" });
//         }

//         // Insert into tmp_busPayments
//         const insertQuery = `set dateformat dmy insert into tmp_busPayments select * from tb_busPayments where transdate between convert(datetime,'${firstDate}') and convert(datetime,'${lastDate}')`;
//         await db.query(insertQuery);

//         // Check tmp_busPayments
//         const tmpResult = await db.query("set dateformat dmy select * from tmp_busPayments");
//         if (tmpResult.recordset.length > 0) {
//             // Logic to display the report (e.g., redirect to a report page)
//             res.status(200).send({ success: true, message: "Processing completed" });
//         } else {
//             res.status(404).send({ success: false, message: "No payments found" });
//         }
//     } catch (error) {
//         res.status(500).send({ success: false, message: error.message });
//     }
// });


