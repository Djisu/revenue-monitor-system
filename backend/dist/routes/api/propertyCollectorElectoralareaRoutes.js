import * as dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2/promise';
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
// Create a new property collector electoral area record
router.post('/', async (req, res) => {
    const propertyCollectorData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Insert the new property collector electoral area data
        const [result] = await connection.execute(`INSERT INTO tb_PropertyCollectorElectoralarea 
            (officer_no, electoralarea) 
            VALUES (?, ?)`, [
            propertyCollectorData.officer_no,
            propertyCollectorData.electoralarea,
        ]);
        res.status(201).json({ message: 'Property collector electoral area record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property collector electoral area record', error });
    }
    finally {
        connection.end();
    }
});
// Read all property collector electoral area records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyCollectorElectoralarea');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property collector electoral area records', error });
    }
    finally {
        connection.end();
    }
});
// Read a single property collector electoral area record by officer_no
router.get('/:officer_no/:electoralarea', async (req, res) => {
    const { officer_no, electoralarea } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyCollectorElectoralarea WHERE officer_no = ? AND electoralarea = ?', [officer_no, electoralarea]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'Property collector electoral area record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property collector electoral area record', error });
    }
    finally {
        connection.end();
    }
});
// Update a property collector electoral area record
router.put('/:officer_no/:electoralarea', async (req, res) => {
    const { officer_no, electoralarea } = req.params;
    const propertyCollectorData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyCollectorElectoralarea WHERE officer_no = ? AND electoralarea = ?', [officer_no, electoralarea]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property collector electoral area record not found' });
            return;
        }
        // Update the property collector electoral area data
        const [result] = await connection.execute(`UPDATE tb_PropertyCollectorElectoralarea 
            SET electoralarea = ? 
            WHERE officer_no = ?`, [
            electoralarea,
            officer_no
        ]);
        res.status(200).json({ message: 'Property collector electoral area record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property collector electoral area record', error });
    }
    finally {
        connection.end();
    }
});
// Delete a property collector electoral area record
router.delete('/:officer_no/:electoralarea', async (req, res) => {
    const { officer_no, electoralarea } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyCollectorElectoralarea WHERE officer_no = ? AND electoralarea = ?', [officer_no, electoralarea]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property collector electoral area record not found' });
            return;
        }
        // Delete the property collector electoral area record
        const [result] = await connection.execute('DELETE FROM tb_PropertyCollectorElectoralarea WHERE officer_no = ?', [officer_no]);
        res.status(200).json({ message: 'Property collector electoral area record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property collector electoral area record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=propertyCollectorElectoralareaRoutes.js.map