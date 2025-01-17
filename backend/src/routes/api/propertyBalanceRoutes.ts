// backend/src/routes/api/propertyBalanceRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import mysql, { ResultSetHeader } from 'mysql2/promise';

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

// PropertyBalance data interface
interface PropertyBalanceData {
    house_no: string;
    billamount: number;
    paidamount: number;
    balance: number;
}

// Create a new property balance record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const propertyBalanceData: PropertyBalanceData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyBalance WHERE house_no = ?', [propertyBalanceData.house_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Property balance record already exists' });
            return
        }

        // Insert the new property balance data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_PropertyBalance 
            (house_no, billamount, paidamount, balance) 
            VALUES (?, ?, ?, ?)`,
            [
                propertyBalanceData.house_no,
                propertyBalanceData.billamount,
                propertyBalanceData.paidamount,
                propertyBalanceData.balance,
            ]
        );

        res.status(201).json({ message: 'Property balance record created successfully' });
        return
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property balance record', error });
        return
    } finally {
        connection.end();
    }
});

// Read all property balance records
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyBalance');
        res.json(rows);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property balance records', error });
        return
    } finally {
        connection.end();
    }
});

// Read a single property balance record by house_no
router.get('/:house_no', async (req: Request, res: Response) => {
    const { house_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyBalance WHERE house_no = ?', [house_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Property balance record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property balance record', error });
    } finally {
        connection.end();
    }
});

// Update a property balance record
router.put('/:house_no', async (req: Request, res: Response): Promise<void> => {
    const { house_no } = req.params;
    const propertyBalanceData: PropertyBalanceData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyBalance WHERE house_no = ?', [house_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property balance record not found' });
        }

        // Update the property balance data
        const [result] = await connection.execute(
            `UPDATE tb_PropertyBalance 
            SET billamount = ?, paidamount = ?, balance = ? 
            WHERE house_no = ?`,
            [
                propertyBalanceData.billamount,
                propertyBalanceData.paidamount,
                propertyBalanceData.balance,
                house_no
            ]
        );

        res.status(200).json({ message: 'Property balance record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property balance record', error });
    } finally {
        connection.end();
    }
});

// Delete a property balance record
router.delete('/:house_no', async (req: Request, res: Response) => {
    const { house_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyBalance WHERE house_no = ?', [house_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property balance record not found' });
            return
        }
        // Delete the property balance record
        const [result] = await connection.execute('DELETE FROM tb_PropertyBalance WHERE house_no = ?', [house_no]);

        res.status(200).json({ message: 'Property balance record deleted successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property balance record', error });
        return
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

// // Fetch business types (electoral areas)
// app.get('/api/businessTypes', async (req, res) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request().query(`SELECT DISTINCT electroral_area FROM tb_Property ORDER BY electroral_area ASC`);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Fetch electoral areas
// app.get('/api/electoralAreas', async (req, res) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request().query(`SELECT DISTINCT electroral_area FROM tb_Property ORDER BY electroral_area ASC`);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Fetch distinct transaction dates based on the selected electoral area
// app.get('/api/dates', async (req, res) => {
//   try {
//     const { electoral_area } = req.query;
//     const pool = await mssql.connect(config);
//     const result = await pool.request()
//       .input('electoral_area', mssql.NVarChar, electoral_area)
//       .query(`SELECT DISTINCT transdate FROM tb_PropertyBilling WHERE electoralarea = @electoral_area ORDER BY transdate`);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Generate and fetch detailed preview data
// app.get('/api/detailedPreview', async (req, res) => {
//   try {
//     const { electoral_area, start_date, end_date } = req.query;
//     const pool = await mssql.connect(config);

//     // Delete existing records in tb_PropertyVariance
//     await pool.request().query(`DELETE FROM tb_PropertyVariance`);

//     // Fetch properties and process them
//     const properties = await pool.request()
//       .input('electoral_area', mssql.NVarChar, electoral_area)
//       .query(electoral_area
//         ? `SELECT * FROM tb_Property WHERE electroral_area = @electoral_area ORDER BY electroral_area ASC`
//         : `SELECT * FROM tb_Property ORDER BY electroral_area ASC`);

//     for (const property of properties.recordset) {
//       const varBalanceBF = await findBalanceBF(property.house_no, start_date);
//       const varCurrentRate = await findCurrentRate(property.house_no, end_date);
//       const varPaidAmount = await findPaidAmount(property.house_no, start_date, end_date);
//       const varTotal = varBalanceBF + varCurrentRate - varPaidAmount;

//       await pool.request()
//         .input('house_no', mssql.NVarChar, property.house_no)
//         .input('balancebf', mssql.Decimal(13, 2), varBalanceBF)
//         .input('current_rate', mssql.Decimal(13, 2), varCurrentRate)
//         .input('paid_amount', mssql.Decimal(13, 2), varPaidAmount)
//         .input('Total', mssql.Decimal(13, 2), varTotal)
//         .input('electroral_area', mssql.NVarChar, property.electroral_area)
//         .query(`INSERT INTO tb_PropertyVariance (house_no, balancebf, current_rate, paid_amount, Total, electroral_area) VALUES (@house_no, @balancebf, @current_rate, @paid_amount, @Total, @electroral_area)`);
//     }

//     // Fetch processed records
//     const result = await pool.request().query(`SELECT * FROM tb_PropertyVariance`);
//     if (result.recordset.length > 0) {
//       res.json(result.recordset);
//     } else {
//       res.status(404).send('No records found');
//     }
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Generate and fetch summary preview data
// app.get('/api/summaryPreview', async (req, res) => {
//   try {
//     const { electoral_area, start_date, end_date } = req.query;
//     const pool = await mssql.connect(config);

//     // Delete existing records in tb_PropertyVariance
//     await pool.request().query(`DELETE FROM tb_PropertyVariance`);

//     // Fetch properties and process them
//     const properties = await pool.request()
//       .input('electoral_area', mssql.NVarChar, electoral_area)
//       .query(electoral_area
//         ? `SELECT * FROM tb_Property WHERE electroral_area = @electoral_area ORDER BY electroral_area ASC`
//         : `SELECT * FROM tb_Property ORDER BY electroral_area ASC`);

//     for (const property of properties.recordset) {
//       const varBalanceBF = await findBalanceBF(property.house_no, start_date);
//       const varCurrentRate = await findCurrentRate(property.house_no, end_date);
//       const varPaidAmount = await findPaidAmount(property.house_no, start_date, end_date);
//       const varTotal = varBalanceBF + varCurrentRate - varPaidAmount;

//       await pool.request()
//         .input('house_no', mssql.NVarChar, property.house_no)
//         .input('balancebf', mssql.Decimal(13, 2), varBalanceBF)
//         .input('current_rate', mssql.Decimal(13, 2), varCurrentRate)
//         .input('paid_amount', mssql.Decimal(13, 2), varPaidAmount)
//         .input('Total', mssql.Decimal(13, 2), varTotal)
//         .input('electroral_area', mssql.NVarChar, property.electroral_area)
//         .query(`INSERT INTO tb_PropertyVariance (house_no, balancebf, current_rate, paid_amount, Total, electroral_area) VALUES (@house_no, @balancebf, @current_rate, @paid_amount, @Total, @electroral_area)`);
//     }

//     // Fetch processed records
//     const result = await pool.request().query(`SELECT * FROM tb_PropertyVariance`);
//     if (result.recordset.length > 0) {
//       res.json(result.recordset);
//     } else {
//       res.status(404).send('No records found');
//     }
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Helper function to find Balance BF
// const findBalanceBF = async (house_no, start_date) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request()
//       .input('house_no', mssql.NVarChar, house_no)
//       .input('start_date', mssql.DateTime, start_date)
//       .query(`SELECT SUM(amount) AS totsum FROM tb_PropertyPayments WHERE house_no = @house_no AND transdate < @start_date`);
//     return result.recordset[0]?.totsum || 0;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// // Helper function to find Current Rate
// const findCurrentRate = async (house_no, end_date) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request()
//       .input('house_no', mssql.NVarChar, house_no)
//       .input('end_date', mssql.DateTime, end_date)
//       .query(`SELECT current_rate FROM tb_PropertyBilling WHERE house_no = @house_no AND YEAR(transdate) = YEAR(@end_date)`);
//     return result.recordset[0]?.current_rate || 0;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// // Helper function to find Paid Amount
// const findPaidAmount = async (house_no, start_date, end_date) => {
//   try {
//     const pool = await mssql.connect(config);
//     const result = await pool.request()
//       .input('house_no', mssql.NVarChar, house_no)
//       .input('start_date', mssql.DateTime, start_date)
//       .input('end_date', mssql.DateTime, end_date)
//       .query(`SELECT SUM(amount) AS totsum FROM tb_PropertyPayments WHERE house_no = @house_no AND transdate BETWEEN @start_date AND @end_date`);
//     return result.recordset[0]?.totsum || 0;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
