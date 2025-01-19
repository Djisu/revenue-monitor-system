import * as dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2/promise';
//import winston from 'winston';
const router = Router();
// Create a logger instance
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: 'combined.log' })
//     ]
// });
// Log messages
// logger.info('Informational message');
// logger.error('Error message');
// Load environment variables from .env file
dotenv.config();
// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
// Create a new electoral area record
router.post('/create', async (req, res) => {
    console.log('in electoral area create', req.body);
    const electoralAreaData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check for existing electoral area record
        const [rows] = await connection.execute('SELECT * FROM tb_electoralarea WHERE electoral_area = ?', [electoralAreaData.electoral_area]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Electoral area record already exists' });
            return;
        }
        // Insert the new electoral area data
        const [result] = await connection.execute(`INSERT INTO tb_electoralarea (electoral_area) VALUES (?)`, [electoralAreaData.electoral_area]);
        //res.status(201).json({  success: true, message: 'Electoral area record created successfully' });
        res.status(201).json({ success: true, message: electoralAreaData.electoral_area });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
    }
    finally {
        connection.end();
    }
});
// Read all electoral area records
router.get('/all', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_electoralarea');
        res.status(200).json({ success: true, data: rows });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching electoral area records', error });
    }
    finally {
        connection.end();
    }
});
// Read a single electoral area record by electoral_area
router.get('/:electoral_area', async (req, res) => {
    const { electoral_area } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_electoralarea WHERE electoral_area = ?', [electoral_area]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(200).json({ success: true, data: rows[0] });
        }
        else {
            res.status(404).json({ success: false, message: 'Electoral area record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching electoral area record', error });
    }
    finally {
        connection.end();
    }
});
// Update an electoral area record
router.put('/:electoral_area', async (req, res) => {
    const { electoral_area } = req.params;
    const electoralAreaData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check for existing electoral area record
        const [rows] = await connection.execute('SELECT * FROM tb_electoralarea WHERE electoral_area = ?', [electoral_area]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ success: false, message: 'Electoral area record does not exist' });
            return;
        }
        // Update the electoral area data
        const [result] = await connection.execute(`UPDATE tb_electoralarea SET electoral_area = ? WHERE electoral_area = ?`, [
            electoralAreaData.electoral_area,
            electoral_area
        ]);
        res.status(200).json({ success: true, message: 'Electoral area record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating electoral area record', error });
    }
    finally {
        connection.end();
    }
});
// Delete an electoral area record
router.delete('/delete/:electoral_area', async (req, res) => {
    console.log('in electoral area delete', req.params);
    const { electoral_area } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check for existing electoral area record
        const [rows] = await connection.execute('SELECT * FROM tb_electoralarea WHERE electoral_area = ?', [electoral_area]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ success: true, message: 'Electoral area record does not exist' });
            return;
        }
        // Delete the electoral area record
        const [result] = await connection.execute('DELETE FROM tb_electoralarea WHERE electoral_area = ?', [electoral_area]);
        res.status(200).json({ success: true, message: 'Electoral area record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting electoral area record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=electoralArea.js.map