// backend/src/routes/api/gradeFeesRoutes.ts
import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
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
// Create a new GradeFees record
router.post('/create', async (req, res) => {
    const gradeFeesData = req.body;
    console.log('in router.post(/create gradeFeesData: ', gradeFeesData);
    const client = await pool.connect();
    // Validate request values
    if (!gradeFeesData.buss_type || !gradeFeesData.grade || !gradeFeesData.description || !gradeFeesData.fees) {
        res.status(400).json({ message: 'Grade Fees data is missing' });
        return;
    }
    try {
        const result = await pool.query('SELECT * FROM gradefees WHERE buss_type = $1 AND grade = $2', [gradeFeesData.buss_type, gradeFeesData.grade]);
        if (result.rows.length > 0) {
            res.status(409).json({ success: true, message: 'GradeFees record already exists', fees: 0 });
            return;
        }
        // Insert the new GradeFees data
        await pool.query(`INSERT INTO gradefees (buss_type, grade, description, fees) 
            VALUES ($1, $2, $3, $4) RETURNING *`, [
            gradeFeesData.buss_type,
            gradeFeesData.grade,
            gradeFeesData.description,
            gradeFeesData.fees,
        ]);
        res.status(200).json({ success: true, message: 'Grade Fees record created successfully', fees: gradeFeesData.fees });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error creating grade fees  record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error creating brade feesrecord', error });
        }
    }
    finally {
        client.release();
    }
});
// Read all GradeFees records
router.get('/all', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await pool.query('SELECT * FROM gradefees');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        console.log('result.rows): ', result.rows);
        res.status(200).json(result.rows);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching grade fees record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error fetching grade fees record', error });
        }
    }
    finally {
        client.release();
    }
});
// Read a single GradeFees record by buss_type and grade
router.get('/:buss_type/:grade', async (req, res) => {
    const { buss_type, grade } = req.params;
    const client = await pool.connect();
    try {
        const result = await pool.query('SELECT * FROM gradefees WHERE buss_type = $1 AND grade = $2', [buss_type, grade]);
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Grade Fees record not found' });
        }
        else {
            res.status(200).json({ success: true, data: result.rows[0] });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching grade fees record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error fetching grade fees record', error });
        }
    }
    finally {
        client.release();
    }
});
// Update a GradeFees record
router.put('/:buss_type/:grade', async (req, res) => {
    const { buss_type, grade } = req.params;
    const gradeFeesData = req.body;
    const client = await pool.connect();
    try {
        const result = await pool.query('SELECT * FROM gradefees WHERE buss_type = $1 AND grade = $2', [buss_type, grade]);
        if (result.rows.length > 0) {
            res.status(409).json({ message: 'GradeFees record already exists' });
            return;
        }
        // Update the GradeFees data
        await pool.query(`UPDATE gradefees SET description = $1, fees = $2 
            WHERE buss_type = $3 AND grade = $4`, [
            gradeFeesData.description,
            gradeFeesData.fees,
            buss_type,
            grade
        ]);
        res.status(200).json({ message: 'Grade Fees record updated successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error updating grade fees record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error updating grade fees record', error });
        }
    }
    finally {
        client.release();
    }
});
// Delete a GradeFees record
router.delete('/:buss_type/:grade', async (req, res) => {
    const { buss_type, grade } = req.params;
    const client = await pool.connect();
    try {
        const result = await pool.query('SELECT * FROM gradefees WHERE buss_type = $1 AND grade = $2', [buss_type, grade]);
        if (result.rows.length === 0) {
            res.status(409).json({ message: 'GradeFees record does not exist' });
            return;
        }
        // Delete the GradeFees record
        await pool.query('DELETE FROM gradefees WHERE buss_type = $1 AND grade = $2', [buss_type, grade]);
        res.status(200).json({ message: 'GradeFees record deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error deleting grade fees record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error deleting grade fees record', error });
        }
    }
    finally {
        client.release();
    }
});
export default router;
// // backend/src/routes/api/gradeFeesRoutes.ts
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
// // GradeFees data interface
// interface GradeFeesData {
//     buss_type: string;
//     grade: string;
//     description: string;
//     fees: number;
// }
// // Create a new GradeFees record
// router.post('/create', async (req: Request, res: Response): Promise<void> => {
//     const gradeFeesData: GradeFeesData = req.body;
//      // Validate request values
//      if (!gradeFeesData.buss_type || !gradeFeesData.grade || !gradeFeesData.description || !gradeFeesData.fees) {
//         res.status(400).json({ message: 'Grade Fees data is missing' });
//         return;
//     }
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM gradefees WHERE buss_type = ? AND grade = ?', 
//         [gradeFeesData.buss_type, gradeFeesData.grade]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ success: true, message: 'GradeFees record already exists', fees: 0});
//             return;
//         }
//         // Insert the new GradeFees data  'GradeRate record created successfully'
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_gradefees (buss_type, grade, description, fees) 
//             VALUES (?, ?, ?, ?)`,
//             [
//                 gradeFeesData.buss_type,
//                 gradeFeesData.grade,
//                 gradeFeesData.description,
//                 gradeFeesData.fees,
//             ]
//         );
//         res.status(200).json({ success: true, message: 'Grade Fees record created successfully', fees: gradeFeesData.fees });
//         // res.status(200).json({ success: true, message: {
//         //     buss_type: gradeFeesData.buss_type,
//         //     grade: gradeFeesData.grade,
//         //     description: gradeFeesData.description
//         //     }, data: {
//         //         id: Math.floor(Math.random() * 10) + 1,
//         //         description: gradeFeesData.description,
//         //         fees: gradeFeesData.fees
//         //     } 
//         // });      
//     } catch (error: any) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating GradeFees record', error: error.message });
//     } finally {
//         connection.end();
//     }
// });
// // Read all GradeFees records
// router.get('/all', async (req: Request, res: Response) => {
//     console.log('router.get(/all Fetching all GradeFees records')
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_gradefees');
//         res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//         res.setHeader('Pragma', 'no-cache');
//         res.setHeader('Expires', '0');
//         console.log('rows:::', rows)
//         res.status(200).json(rows);
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching GradeFees records', error: error.message });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single GradeFees record by buss_type and grade
// router.get('/:buss_type/:grade', async (req: Request, res: Response) => {
//     const { buss_type, grade } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {        
//         const [result] = await connection.execute('SELECT * FROM tb_gradefees WHERE buss_type = ? AND grade = ?', [buss_type, grade]);
//         if (Array.isArray(result) && result.length === 0) {
//             res.status(404).json({  success: false, message: 'Grade Fees record not found' });
//         } else {
//             res.status(200).json({ success: true, data: result[0] });
//         }
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching Grade Fees record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Update a GradeFees record
// router.put('/:buss_type/:grade', async (req: Request, res: Response): Promise<void> => {
//     const { buss_type, grade } = req.params;
//     const gradeFeesData: GradeFeesData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_gradefees WHERE buss_type = ? AND grade = ?', [buss_type, grade]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ message: 'GradeFees record already exists' });
//             return;
//         }
//         // Update the GradeFees data
//         const [result] = await connection.execute(
//             `UPDATE tb_gradefees SET description = ?, fees = ? 
//             WHERE buss_type = ? AND grade = ?`,
//             [
//                 gradeFeesData.description,
//                 gradeFeesData.fees,
//                 buss_type,
//                 grade
//             ]
//         );
//         res.status(200).json({ message: 'Grade Fees record updated successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating GradeFees record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Delete a GradeFees record
// router.delete('/:buss_type/:grade', async (req: Request, res: Response) => {
//     const { buss_type, grade } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_gradefees WHERE buss_type = ? AND grade = ?', [buss_type, grade]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(409).json({ message: 'GradeFees record does not exist' });
//             return;
//         }
//         // Delete the GradeFees record
//         const [result] = await connection.execute('DELETE FROM tb_gradefees WHERE buss_type = ? AND grade = ?', [buss_type, grade]);
//         res.status(200).json({ message: 'GradeFees record deleted successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting GradeFees record', error });
//     } finally {
//         connection.end();
//     }
// });
// export default router;
//# sourceMappingURL=gradeFeesRoutes.js.map