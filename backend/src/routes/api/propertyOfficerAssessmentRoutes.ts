// // backend/src/routes/api/propertyCollectorElectoralareaRoutes.ts
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import pkg from 'pg';
// const { Pool } = pkg;
// //import type { QueryResult } from 'pg';  // Import QueryResult as a type
// //import bcrypt from 'bcrypt';

// //import { createClient } from '../../db.js';


// const router = Router();

// // experiment ///
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import fs from 'fs';

// // Load the environment variables from the .env file
// dotenv.config();

// // Determine the environment (development or production)
// const env = process.env.NODE_ENV || 'development';  // Defaults to 'development'
// console.log('[BACKEND] Initial NODE_ENV:', process.env.NODE_ENV); // Debugging log

// // Construct the path to the appropriate .env file from the root directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// //const permitDir = path.join(__dirname, 'permits');

// //const rootDir = path.resolve(__dirname, '..');
// const envPath = path.resolve(__dirname, `../.env.${env}`);

// console.log('[BACKEND] envPath:', envPath); // Debugging log

// // Check if the .env file exists
// if (!fs.existsSync(envPath)) {
//   console.error(`[BACKEND] .env file not found at ${envPath}. Please ensure the file exists.`);
//   process.exit(1); // Exit the process if the file is not found
// }

// // Load the environment variables from the .env file
// dotenv.config({ path: envPath });

// console.log('[BACKEND] environment:', env);
// console.log('[BACKEND] NODE_ENV after dotenv.config:', process.env.NODE_ENV); // Debugging log

// // Example usage of environment variables
// const DB_HOST = process.env.DB_HOST;
// const DB_USER = process.env.DB_USER;
// const DB_NAME = process.env.DB_NAME;
// const DB_PORT = process.env.DB_PORT;
// const DB_PASSWORD = process.env.DB_PASSWORD;
// const JWT_SECRET = process.env.JWT_SECRET;

// console.log('Initial NODE_ENV:', process.env.NODE_ENV);
// console.log('DB_HOST:', DB_HOST);
// console.log('DB_USER:', DB_USER);
// console.log('DB_NAME:', DB_NAME);
// console.log('DB_PORT:', DB_PORT);
// console.log('DB_PASSWORD:', DB_PASSWORD);
// console.log('JWT_SECRET:', JWT_SECRET);

// // SSL configuration
// let sslConfig: false | { rejectUnauthorized: boolean };

// if (process.env.NODE_ENV === 'production') { 
//   sslConfig = { rejectUnauthorized: true }; // Important for Render.com
// } else {
//   sslConfig = false;
// }

// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
//     ssl: sslConfig,
// };

// const pool = new Pool(dbConfig);
// // end of experiment ///

// // PropertyCollectorElectoralarea data interface
// interface PropertyCollectorElectoralareaData {
//     officer_no: string;
//     electoralarea: string;
// }

// // Create a new property collector electoral area record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const propertyCollectorData: PropertyCollectorElectoralareaData = req.body;

//     try {
//         // Insert the new property collector electoral area data
//         const result = await pool.query(
//             `INSERT INTO propertycollectorelectoralarea 
//             (officer_no, electoralarea) 
//             VALUES ($1, $2)`,
//             [
//                 propertyCollectorData.officer_no,
//                 propertyCollectorData.electoralarea,
//             ]
//         );

//         res.status(201).json({ message: 'Property collector electoral area record created successfully', data: result });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating property collector electoral area record', error });
//     }
// });

// // Read all property collector electoral area records
// router.get('/', async (req: Request, res: Response) => {
//     try {
//         const result = await pool.query('SELECT * FROM propertycollectorelectoralarea');
//         res.json(result.rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching property collector electoral area records', error });
//     }
// });

// // Read a single property collector electoral area record by officer_no
// router.get('/:officer_no/:electoralarea', async (req: Request, res: Response) => {
//     const { officer_no, electoralarea } = req.params;

//     try {
//         const result = await pool.query('SELECT * FROM propertycollectorelectoralarea WHERE officer_no = $1 AND electoralarea = $2',
//             [officer_no, electoralarea]
//         );

//         if (result.rowCount as number > 0) {
//             res.json(result.rows[0]); // Return the first row
//         } else {
//             res.status(404).json({ message: 'Property collector electoral area record not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching property collector electoral area record', error });
//     }
// });

// // Update a property collector electoral area record
// router.put('/:officer_no/:electoralarea', async (req: Request, res: Response): Promise<void> => {
//     const { officer_no, electoralarea } = req.params;
//     const propertyCollectorData: PropertyCollectorElectoralareaData = req.body;

//     try {
//         const result = await pool.query('SELECT * FROM propertycollectorelectoralarea WHERE officer_no = $1 AND electoralarea = $2',
//             [officer_no, electoralarea]
//         );

//         if (result.rowCount === 0) {
//             res.status(404).json({ message: 'Property collector electoral area record not found' });
//             return;
//         }

//         // Update the property collector electoral area data
//         await pool.query(
//             `UPDATE propertycollectorelectoralarea 
//             SET electoralarea = $1 
//             WHERE officer_no = $2`,
//             [
//                 propertyCollectorData.electoralarea,
//                 officer_no
//             ]
//         );

//         res.status(200).json({ message: 'Property collector electoral area record updated successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating property collector electoral area record', error });
//     }
// });

// // Delete a property collector electoral area record
// router.delete('/:officer_no/:electoralarea', async (req: Request, res: Response) => {
//     const { officer_no, electoralarea } = req.params;

//     try {
//         const result = await pool.query('SELECT * FROM propertycollectorelectoralarea WHERE officer_no = $1 AND electoralarea = $2',
//             [officer_no, electoralarea]
//         );

//         if (result.rowCount === 0) {
//             res.status(404).json({ message: 'Property collector electoral area record not found' });
//             return;
//         }

//         // Delete the property collector electoral area record
//         await pool.query('DELETE FROM propertycollectorelectoralarea WHERE officer_no = $1 AND electoralarea = $2',
//             [officer_no, electoralarea]
//         );

//         res.status(200).json({ message: 'Property collector electoral area record deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting property collector electoral area record', error });
//     }
// });

// export default router;







// // // // backend/src/routes/api/propertyOfficerAssessmentRoutes.ts
// // // import express from 'express';
// // // import * as dotenv from 'dotenv';
// // // import { Router, Request, Response } from 'express';
// // // import mysql, { ResultSetHeader } from 'mysql2/promise';

// // // const router = Router();

// // // // Load environment variables from .env file
// // // dotenv.config();

// // // // MySQL connection configuration
// // // const dbConfig = {
// // //     host: process.env.DB_HOST || 'localhost',
// // //     user: process.env.DB_USER || 'root',
// // //     password: process.env.DB_PASSWORD || '',
// // //     database: process.env.DB_NAME || 'revmonitor',
// // // };

// // // // PropertyOfficerAssessment data interface
// // // interface PropertyOfficerAssessmentData {
// // //     officer_no: string;
// // //     officer_name: string;
// // //     Noofclientsserved: number;
// // //     valueofbillsdistributed: number;
// // //     bus_year: number;
// // //     JanuaryAmount: number;
// // //     FebruaryAmount: number;
// // //     MarchAmount: number;
// // //     AprilAmount: number;
// // //     MayAmount: number;
// // //     JuneAmount: number;
// // //     JulyAmount: number;
// // //     AugustAmount: number;
// // //     SeptemberAmount: number;
// // //     OctoberAmount: number;
// // //     NovemberAmount: number;
// // //     DecemberAmount: number;
// // //     totalReceiptTodate: number;
// // //     balance: number;
// // //     remarks: string;
// // // }

// // // // Create a new property officer assessment record
// // // router.post('/', async (req: Request, res: Response): Promise<void> => {
// // //     const propertyOfficerAssessmentData: PropertyOfficerAssessmentData = req.body;

// // //     const connection = await mysql.createConnection(dbConfig);
    
// // //     try {
// // //         // Insert the new property officer assessment data
// // //         const [result] = await connection.execute<ResultSetHeader>(
// // //             `INSERT INTO tb_PropertyOfficerAssessment 
// // //             (officer_no, officer_name, Noofclientsserved, valueofbillsdistributed, bus_year, 
// // //             JanuaryAmount, FebruaryAmount, MarchAmount, AprilAmount, MayAmount, 
// // //             JuneAmount, JulyAmount, AugustAmount, SeptemberAmount, OctoberAmount, 
// // //             NovemberAmount, DecemberAmount, totalReceiptTodate, balance, remarks) 
// // //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// // //             [
// // //                 propertyOfficerAssessmentData.officer_no,
// // //                 propertyOfficerAssessmentData.officer_name,
// // //                 propertyOfficerAssessmentData.Noofclientsserved,
// // //                 propertyOfficerAssessmentData.valueofbillsdistributed,
// // //                 propertyOfficerAssessmentData.bus_year,
// // //                 propertyOfficerAssessmentData.JanuaryAmount,
// // //                 propertyOfficerAssessmentData.FebruaryAmount,
// // //                 propertyOfficerAssessmentData.MarchAmount,
// // //                 propertyOfficerAssessmentData.AprilAmount,
// // //                 propertyOfficerAssessmentData.MayAmount,
// // //                 propertyOfficerAssessmentData.JuneAmount,
// // //                 propertyOfficerAssessmentData.JulyAmount,
// // //                 propertyOfficerAssessmentData.AugustAmount,
// // //                 propertyOfficerAssessmentData.SeptemberAmount,
// // //                 propertyOfficerAssessmentData.OctoberAmount,
// // //                 propertyOfficerAssessmentData.NovemberAmount,
// // //                 propertyOfficerAssessmentData.DecemberAmount,
// // //                 propertyOfficerAssessmentData.totalReceiptTodate,
// // //                 propertyOfficerAssessmentData.balance,
// // //                 propertyOfficerAssessmentData.remarks,
// // //             ]
// // //         );

// // //         res.status(201).json({ message: 'Property officer assessment record created successfully'});
// // //     } catch (error) {
// // //         console.error('Error:', error);
// // //         res.status(500).json({ message: 'Error creating property officer assessment record', error });
// // //     } finally {
// // //         connection.end();
// // //     }
// // // });

// // // // Read all property officer assessment records
// // // router.get('/', async (req: Request, res: Response) => {
// // //     const connection = await mysql.createConnection(dbConfig);
// // //     try {
// // //         const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficerAssessment');
// // //         res.json(rows);
// // //     } catch (error) {
// // //         console.error(error);
// // //         res.status(500).json({ message: 'Error fetching property officer assessment records', error });
// // //     } finally {
// // //         connection.end();
// // //     }
// // // });

// // // // Read a single property officer assessment record by officer_no
// // // router.get('/:officer_no/:bus_year', async (req: Request, res: Response) => {
// // //     const { officer_no, bus_year } = req.params;

// // //     const connection = await mysql.createConnection(dbConfig);

// // //     try {
// // //         const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficerAssessment WHERE officer_no = ? AND bus_year = ?',
// // //             [officer_no, bus_year]);

// // //         if (Array.isArray(rows) && rows.length > 0) {
// // //             res.json(rows[0]); // Return the first row
// // //         } else {
// // //             res.status(404).json({ message: 'Property officer assessment record not found' });
// // //         }
// // //     } catch (error) {
// // //         console.error(error);
// // //         res.status(500).json({ message: 'Error fetching property officer assessment record', error });
// // //     } finally {
// // //         connection.end();
// // //     }
// // // });

// // // // Update a property officer assessment record
// // // router.put('/:officer_no/:bus_year', async (req: Request, res: Response): Promise<void> => {
// // //     const { officer_no, bus_year } = req.params;
// // //     const propertyOfficerAssessmentData: PropertyOfficerAssessmentData = req.body;

// // //     const connection = await mysql.createConnection(dbConfig);
// // //     try {
// // //         const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficerAssessment WHERE officer_no = ? AND bus_year = ?',
// // //             [officer_no, bus_year]
// // //         );

// // //         if (Array.isArray(rows) && rows.length > 0) {
// // //             res.json(rows[0]); // Return the first row
// // //         } else {
// // //             res.status(404).json({ message: 'Property officer assessment record not found' });
// // //         }

// // //         // Update the property officer assessment data
// // //         const [result] = await connection.execute(
// // //             `UPDATE tb_PropertyOfficerAssessment 
// // //             SET officer_name = ?, Noofclientsserved = ?, valueofbillsdistributed = ?, bus_year = ?, 
// // //             JanuaryAmount = ?, FebruaryAmount = ?, MarchAmount = ?, AprilAmount = ?, 
// // //             MayAmount = ?, JuneAmount = ?, JulyAmount = ?, AugustAmount = ?, 
// // //             SeptemberAmount = ?, OctoberAmount = ?, NovemberAmount = ?, 
// // //             DecemberAmount = ?, totalReceiptTodate = ?, balance = ?, remarks = ? 
// // //             WHERE officer_no = ?`,
// // //             [
// // //                 propertyOfficerAssessmentData.officer_name,
// // //                 propertyOfficerAssessmentData.Noofclientsserved,
// // //                 propertyOfficerAssessmentData.valueofbillsdistributed,
// // //                 propertyOfficerAssessmentData.bus_year,
// // //                 propertyOfficerAssessmentData.JanuaryAmount,
// // //                 propertyOfficerAssessmentData.FebruaryAmount,
// // //                 propertyOfficerAssessmentData.MarchAmount,
// // //                 propertyOfficerAssessmentData.AprilAmount,
// // //                 propertyOfficerAssessmentData.MayAmount,
// // //                 propertyOfficerAssessmentData.JuneAmount,
// // //                 propertyOfficerAssessmentData.JulyAmount,
// // //                 propertyOfficerAssessmentData.AugustAmount,
// // //                 propertyOfficerAssessmentData.SeptemberAmount,
// // //                 propertyOfficerAssessmentData.OctoberAmount,
// // //                 propertyOfficerAssessmentData.NovemberAmount,
// // //                 propertyOfficerAssessmentData.DecemberAmount,
// // //                 propertyOfficerAssessmentData.totalReceiptTodate,
// // //                 propertyOfficerAssessmentData.balance,
// // //                 propertyOfficerAssessmentData.remarks,
// // //                 officer_no
// // //             ]
// // //         );

// // //         res.status(200).json({ message: 'Property officer assessment record updated successfully' });
// // //     } catch (error) {
// // //         console.error(error);
// // //         res.status(500).json({ message: 'Error updating property officer assessment record', error });
// // //     } finally {
// // //         connection.end();
// // //     }
// // // });

// // // // Delete a property officer assessment record
// // // router.delete('/:officer_no/:bus_year', async (req: Request, res: Response) => {
// // //     const { officer_no, bus_year } = req.params;

// // //     const connection = await mysql.createConnection(dbConfig);

// // //     try {
// // //         const [rows] = await connection.execute('SELECT * FROM tb_PropertyOfficerAssessment WHERE officer_no = ? AND bus_year = ?',
// // //         [officer_no, bus_year]);

// // //         if (Array.isArray(rows) && rows.length > 0) {
// // //             res.json(rows[0]); // Return the first row
// // //         } else {
// // //             res.status(404).json({ message: 'Property officer assessment record not found' });
// // //         }

// // //         // Delete the property officer assessment record
// // //         const [result] = await connection.execute('DELETE FROM tb_PropertyOfficerAssessment WHERE officer_no = ?', [officer_no]);

// // //         res.status(200).json({ message: 'Property officer assessment record deleted successfully' });
// // //     } catch (error) {
// // //         console.error(error);
// // //         res.status(500).json({ message: 'Error deleting property officer assessment record', error });
// // //     } finally {
// // //         connection.end();
// // //     }
// // // });

// // // export default router;
