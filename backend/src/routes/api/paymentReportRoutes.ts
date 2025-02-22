// backend/src/routes/api/paymentReportRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import type { QueryResult } from 'pg';  // Import QueryResult as a type

const router = Router();

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
});

// PaymentReport data interface
interface PaymentReportData {
    transdate: string; // Adjust the type based on your actual date format
    buss_name: string;
    amount: number;
    receiptno: string;
    fiscalyear: number;
    officer_no: string;
    buss_no: string;
}

// Create a new payment report record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const paymentReportData: PaymentReportData = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM paymentreport WHERE buss_no = $1 AND fiscalyear = $2',
            [paymentReportData.buss_no, paymentReportData.fiscalyear]
        );

        if (result.rows.length > 0) {
            res.status(409).json({ message: 'Payment report record already exists' });
            return;
        }

        await pool.query(
            `INSERT INTO paymentreport 
            (transdate, buss_name, amount, receiptno, fiscalyear, officer_no, buss_no) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                paymentReportData.transdate,
                paymentReportData.buss_name,
                paymentReportData.amount,
                paymentReportData.receiptno,
                paymentReportData.fiscalyear,
                paymentReportData.officer_no,
                paymentReportData.buss_no,
            ]
        );

        res.status(201).json({ message: 'Payment report record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating payment report record', error });
    }
});

// Read all payment report records
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM paymentreport');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching payment report records', error });
    }
});

// Read a single payment report record by buss_no
router.get('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM paymentreport WHERE buss_no = $1 AND fiscalyear = $2',
            [buss_no, fiscalyear]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Payment report record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching payment report record', error });
    }
});

// Update a payment report record
router.put('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;
    const paymentReportData: PaymentReportData = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM paymentreport WHERE buss_no = $1 AND fiscalyear = $2',
            [buss_no, fiscalyear]
        );

        if (result.rows.length === 0) {
            res.status(409).json({ message: 'Payment report record does not exist' });
            return;
        }

        await pool.query(
            `UPDATE paymentreport 
            SET transdate = $1, buss_name = $2, amount = $3, receiptno = $4, fiscalyear = $5, officer_no = $6 
            WHERE buss_no = $7`,
            [
                paymentReportData.transdate,
                paymentReportData.buss_name,
                paymentReportData.amount,
                paymentReportData.receiptno,
                paymentReportData.fiscalyear,
                paymentReportData.officer_no,
                buss_no
            ]
        );

        res.status(200).json({ message: 'Payment report record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating payment report record', error });
    }
});

// Delete a payment report record
router.delete('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM paymentreport WHERE buss_no = $1 AND fiscalyear = $2',
            [buss_no, fiscalyear]
        );

        if (result.rows.length === 0) {
            res.status(409).json({ message: 'Payment report record does not exist' });
            return;
        }

        await pool.query('DELETE FROM paymentreport WHERE buss_no = $1 AND fiscalyear = $2', 
            [buss_no, fiscalyear]
        );

        res.status(200).json({ message: 'Payment report record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting payment report record', error });
    }
});

export default router;







// // backend/src/routes/api/paymentReportRoutes.ts
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

// // PaymentReport data interface
// interface PaymentReportData {
//     transdate: string; // Adjust the type based on your actual date format
//     buss_name: string;
//     amount: number;
//     receiptno: string;
//     fiscalyear: number;
//     officer_no: string;
//     buss_no: string;
// }

// // Create a new payment report record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const paymentReportData: PaymentReportData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         // Insert the new payment report data
//         const paymentReportData: PaymentReportData = req.body;

//         const [rows] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ? AND fiscalyear = ?', 
//             [paymentReportData.buss_no, paymentReportData.fiscalyear]
//         );
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ message: 'Payment report record already exists' });
//             return;
//         }

//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_PaymentReport 
//             (transdate, buss_name, amount, receiptno, fiscalyear, officer_no, buss_no) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 paymentReportData.transdate,
//                 paymentReportData.buss_name,
//                 paymentReportData.amount,
//                 paymentReportData.receiptno,
//                 paymentReportData.fiscalyear,
//                 paymentReportData.officer_no,
//                 paymentReportData.buss_no,
//             ]
//         );

//         res.status(201).json({ message: 'Payment report record created successfully' });
//         return
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating payment report record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Read all payment report records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_PaymentReport');
//         res.json(rows);
//         return;
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching payment report records', error });
//         return;
//     } finally {
//         connection.end();
//     }
// });

// // Read a single payment report record by buss_no
// router.get('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
//     const { buss_no, fiscalyear } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [result] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ? AND fiscalyear = ?', 
//             [buss_no, fiscalyear]
//         );
//         if (Array.isArray(result) && result.length > 0) {
//             res.status(409).json({ message: 'Payment report record already exists' });
//             return;
//         }
//         const [rows] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ?', [buss_no]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.json(rows[0]); // Return the first row
//             return;
//         } else {
//             res.status(404).json({ message: 'Payment report record not found' });
//             return;
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching payment report record', error });
//         return;
//     } finally {
//         connection.end();
//     }
// });

// // Update a payment report record
// router.put('/:buss_no/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
//     const { buss_no, fiscalyear } = req.params;
//     const paymentReportData: PaymentReportData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [row] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ? AND fiscalyear = ?', 
//             [buss_no, fiscalyear]
//         );
//         if (Array.isArray(row) && row.length == 0) {
//             res.status(409).json({ message: 'Payment report record does not exist' });
//             return;
//         }
//         // Update the payment report data
//         const [result] = await connection.execute(
//             `UPDATE tb_PaymentReport 
//             SET transdate = ?, buss_name = ?, amount = ?, receiptno = ?, fiscalyear = ?, officer_no = ? 
//             WHERE buss_no = ?`,
//             [
//                 paymentReportData.transdate,
//                 paymentReportData.buss_name,
//                 paymentReportData.amount,
//                 paymentReportData.receiptno,
//                 paymentReportData.fiscalyear,
//                 paymentReportData.officer_no,
//                 buss_no
//             ]
//         );

//         res.status(200).json({ message: 'Payment report record updated successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating payment report record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Delete a payment report record
// router.delete('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
//     const { buss_no, fiscalyear } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [row] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ? AND fiscalyear = ?', 
//             [buss_no, fiscalyear]
//         );
//         if (Array.isArray(row) && row.length == 0) {
//             res.status(409).json({ message: 'Payment report record does not exist' });
//             return;
//         }
//         // Delete the payment report record
//         const [result] = await connection.execute('SELECT * FROM tb_PaymentReport WHERE buss_no = ? AND fiscalyear = ?', 
//              [buss_no, fiscalyear]
//         );

//         res.status(200).json({ message: 'Payment report record deleted successfully'});
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting payment report record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// export default router;









// // app.post('/api/update-business-zones', async (req, res) => {
// //     try {
// //         await db.query("set dateformat dmy update var_busPayments set electroral_area=tb_business.electroral_area from tb_business where tb_business.buss_no=var_busPayments.buss_no");
// //         await db.query("set dateformat dmy update var_busPayments set buss_type=tb_business.buss_type from tb_business where tb_business.buss_no=var_busPayments.buss_no");
// //         await db.query("set dateformat dmy update tb_busPayments set electroral_area=tb_business.electroral_area from tb_business where tb_business.buss_no=tb_busPayments.buss_no");
// //         await db.query("set dateformat dmy update tb_busPayments set buss_type=tb_business.buss_type from tb_business where tb_business.buss_no=tb_busPayments.buss_no");
// //         res.status(200).send({ success: true });
// //     } catch (error) {
// //         res.status(500).send({ success: false, message: error.message });
// //     }
// // });

// // app.get('/api/zones', async (req, res) => {
// //     try {
// //         const result = await db.query("set dateformat dmy select distinct electroral_area from tb_buspayments where amount>0");
// //         res.status(200).json(result.recordset.map((row: any) => row.electroral_area));
// //     } catch (error) {
// //         res.status(500).send({ success: false, message: error.message });
// //     }
// // });

// // app.get('/api/business-types', async (req, res) => {
// //     const { zone } = req.query;
// //     if (!zone) {
// //         return res.status(400).send({ success: false, message: "Select a zone" });
// //     }

// //     try {
// //         const result = await db.query(`set dateformat dmy select distinct buss_type from tb_busPayments where electroral_area=convert(varchar(50),'${zone}')`);
// //         res.status(200).json(result.recordset.map((row: any) => row.buss_type));
// //     } catch (error) {
// //         res.status(500).send({ success: false, message: error.message });
// //     }
// // });

// // app.get('/api/payment-dates', async (req, res) => {
// //     const { zone } = req.query;
// //     if (!zone) {
// //         return res.status(400).send({ success: false, message: "Select a zone" });
// //     }

// //     try {
// //         const result = await db.query(`set dateformat dmy select transdate from tb_busPayments where electroral_area=convert(varchar(100),'${zone}') order by convert(datetime,transdate)`);
// //         res.status(200).json(result.recordset.map((row: any) => row.transdate));
// //     } catch (error) {
// //         res.status(500).send({ success: false, message: error.message });
// //     }
// // });

// // app.post('/api/produce-report', async (req, res) => {
// //     const { firstDate, lastDate, zone, bussType, posted } = req.body;

// //     try {
// //         // Delete from tmp_busPayments
// //         await db.query("set dateformat dmy delete from tmp_busPayments");

// //         // Update the business zones in payments (if needed, can be moved to a separate endpoint if called frequently)
// //         await db.query("set dateformat dmy update var_busPayments set electroral_area=tb_business.electroral_area from tb_business where tb_business.buss_no=var_busPayments.buss_no");
// //         await db.query("set dateformat dmy update var_busPayments set buss_type=tb_business.buss_type from tb_business where tb_business.buss_no=var_busPayments.buss_no");
// //         await db.query("set dateformat dmy update tb_busPayments set electroral_area=tb_business.electroral_area from tb_business where tb_business.buss_no=tb_busPayments.buss_no");
// //         await db.query("set dateformat dmy update tb_busPayments set buss_type=tb_business.buss_type from tb_business where tb_business.buss_no=tb_busPayments.buss_no");

// //         let query;
// //         if (zone && bussType) {
// //             query = `set dateformat dmy select * from tb_busPayments where transdate between convert(datetime,'${firstDate}') and convert(datetime,'${lastDate}') and electroral_area=convert(varchar(50),'${zone}') and buss_type='${bussType}'`;
// //         } else if (zone) {
// //             query = `set dateformat dmy select * from tb_busPayments where transdate between convert(datetime,'${firstDate}') and convert(datetime,'${lastDate}') and electroral_area=convert(varchar(50),'${zone}')`;
// //         } else if (bussType) {
// //             query = `set dateformat dmy select * from tb_busPayments where transdate between convert(datetime,'${firstDate}') and convert(datetime,'${lastDate}') and buss_type='${bussType}'`;
// //         } else {
// //             query = `set dateformat dmy select * from tb_busPayments where transdate between convert(datetime,'${firstDate}') and convert(datetime,'${lastDate}')`;
// //         }

// //         const result = await db.query(query);
// //         if (result.recordset.length === 0) {
// //             return res.status(404).send({ success: false, message: "Record not found" });
// //         }

// //         // Insert into tmp_busPayments
// //         const insertQuery = `set dateformat dmy insert into tmp_busPayments select * from tb_busPayments where transdate between convert(datetime,'${firstDate}') and convert(datetime,'${lastDate}')`;
// //         await db.query(insertQuery);

// //         // Check tmp_busPayments
// //         const tmpResult = await db.query("set dateformat dmy select * from tmp_busPayments");
// //         if (tmpResult.recordset.length > 0) {
// //             // Logic to display the report (e.g., redirect to a report page)
// //             res.status(200).send({ success: true, message: "Processing completed" });
// //         } else {
// //             res.status(404).send({ success: false, message: "No payments found" });
// //         }
// //     } catch (error) {
// //         res.status(500).send({ success: false, message: error.message });
// //     }
// // });

