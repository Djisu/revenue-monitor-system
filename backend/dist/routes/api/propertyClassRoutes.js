// backend/src/routes/api/propertyClassRoutes.ts
import { Router } from 'express';
import * as dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
//import { createClient } from '../../db.js';
const router = Router();
// Load environment variables from .env file
dotenv.config();
// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: Number(process.env.DB_PORT) || 5432,
});
// Create a new property class record
router.post('/create', async (req, res) => {
    const propertyClassData = req.body;
    console.log('Received propertyClassData:', propertyClassData);
    const { property_class, rate } = propertyClassData;
    if (!property_class || rate == null) {
        res.status(400).json({ success: false, message: 'Property class and rate are required' });
        return;
    }
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM propertyclass WHERE property_class = $1', [property_class]);
        if (result.rows.length > 0) {
            res.status(409).json({ message: 'Property class record already exists' });
            return;
        }
        // Insert the new property class data
        await client.query(`INSERT INTO propertyclass (property_class, rate) 
            VALUES ($1, $2)`, [property_class, rate]);
        res.status(201).json({ success: true, message: 'Property class record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error creating property class record', error: error.message });
    }
    finally {
        client.release();
    }
});
// Read all property class records
router.get('/all', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM propertyclass');
        res.status(200).json({ success: true, data: result.rows });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching property class records', error });
    }
    finally {
        client.release();
    }
});
// Read a single property class record by property_class
router.get('/:property_class', async (req, res) => {
    const { property_class } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM propertyclass WHERE property_class = $1', [property_class]);
        if (result.rows.length > 0) {
            res.status(200).json({ success: true, data: result.rows[0] });
        }
        else {
            res.status(404).json({ success: false, message: 'Property class record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching property class record', error });
    }
    finally {
        client.release();
    }
});
// Update a property class record
router.put('/:property_class', async (req, res) => {
    const { property_class } = req.params;
    const propertyClassData = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM propertyclass WHERE property_class = $1', [property_class]);
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Property class record not found' });
            return;
        }
        // Update the property class data
        await client.query(`UPDATE propertyclass 
            SET rate = $1 
            WHERE property_class = $2`, [propertyClassData.rate, property_class]);
        res.status(200).json({ success: true, message: 'Property class record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating property class record', error });
    }
});
// Delete a property class record
router.delete('/delete/:property_class', async (req, res) => {
    const { property_class } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM propertyclass WHERE property_class = $1', [property_class]);
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Property class record not found' });
            return;
        }
        // Delete the property class record
        await client.query('DELETE FROM propertyclass WHERE property_class = $1', [property_class]);
        res.status(200).json({ success: true, message: 'Property class record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting property class record', error });
    }
});
export default router;
// // backend/src/routes/api/propertyClassRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader, QueryResult  } from 'mysql2/promise';
// import { OkPacket } from 'mysql2'; // Import OkPacket from mysql2
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
// // PropertyClass data interface
// interface PropertyClassData {
//     property_class: string;
//     rate: number;
// }
// // Create a new property class record
// router.post('/create', async (req: Request, res: Response): Promise<void> => {
//     console.log('in create property class route', req.body)
//     const propertyClassData = req.body;
//     const { property_class, rate } = propertyClassData;
//     console.log('Received propertyClassData:', propertyClassData); // Debug log
//     if (!property_class || !rate) {
//         res.status(400).json({ success: false, message: 'Property class and rate are required' });
//         return;
//     }
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_propertyclass WHERE property_class = ?',
//          [property_class]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ message: 'Property class record already exists' });
//             return
//         }
//         // Insert the new property class data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_propertyclass 
//             (property_class, rate) 
//             VALUES (?, ?)`,
//             [
//                 property_class,
//                 rate,
//             ]
//         );
//         if (result.length > 0) {
//             res.status(200).json({ success: true, message: propertyClassData.property_class, rate: propertyClassData.rate });
//         } else {
//             res.status(500).json({ success: false, message: 'Failed to create property class' });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({   success: false, message: 'Error creating property class record', error });
//     } finally {
//         connection.release();
//     }
// });
// // Read all property class records
// router.get('/all', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_propertyclass');
//         res.status(200).json({ success: true, data: rows });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({  success: false, message: 'Error fetching property class records', error });
//     } finally {
//         connection.release();
//     }
// });
// // Read a single property class record by property_class
// router.get('/:property_class', async (req: Request, res: Response) => {
//     const { property_class } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_propertyclass WHERE property_class = ?', [property_class]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(200).json({ success: true, data: rows[0] });
//         } else {
//             res.status(404).json({  success: false, message: 'Electoral area record not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error fetching property class record', error });
//     } finally {
//         connection.release();
//     }
// });
// // Update a property class record
// router.put('/:property_class', async (req: Request, res: Response): Promise<void> => {
//     const { property_class } = req.params;
//     const propertyClassData: PropertyClassData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_propertyclass WHERE property_class = ?', [property_class]);
//         if (Array.isArray(rows) && rows.length === 0) {
//             res.status(404).json({ success: false, message: 'Property class record not found' });
//             return;
//         }
//         // Update the property class data
//         const [result] = await connection.execute(
//             `UPDATE tb_propertyclass 
//             SET rate = ? 
//             WHERE property_class = ?`,
//             [
//                 propertyClassData.rate,
//                 property_class
//             ]
//         );
//         res.status(200).json({  success: true, message: 'Property class record updated successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error updating property class record', error });
//     } finally {
//         connection.release();
//     }
// });
// // Delete a property class record
// router.delete('/delete/:property_class', async (req: Request, res: Response) => {
//     console.log('in property class delete', req.params);
//     const { property_class } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_propertyclass WHERE property_class = ?', [property_class]);
//         if (Array.isArray(rows) && rows.length === 0) {
//             res.status(404).json({ success: false, message: 'Property class record not found' });
//             return;
//         }
//         // Delete the property class record
//         const [result] = await connection.execute('DELETE FROM tb_propertyclass WHERE property_class = ?', [property_class]);
//         res.status(200).json({ success: true, message: 'Property class record deleted successfully' });
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error deleting property class record', error: error.message });
//     } finally {
//         connection.release();
//     }
// });
// export default router;
//# sourceMappingURL=propertyClassRoutes.js.map