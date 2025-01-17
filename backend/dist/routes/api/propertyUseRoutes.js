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
// Create a new property use record
router.post('/', async (req, res) => {
    const propertyUseData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyUse WHERE PropertyUse = ?', [propertyUseData.PropertyUse]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property use record not found' });
            return;
        }
        // Insert the new property use data
        const [result] = await connection.execute(`INSERT INTO tb_PropertyUse 
            (PropertyUse, Propertyrate) 
            VALUES (?, ?)`, [
            propertyUseData.PropertyUse,
            propertyUseData.Propertyrate,
        ]);
        res.status(201).json({ message: 'Property use record created successfully' });
        return;
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property use record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Read all property use records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyUse');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property use records', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Read a single property use record by PropertyUse
router.get('/:PropertyUse', async (req, res) => {
    const { PropertyUse } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyUse WHERE PropertyUse = ?', [PropertyUse]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property use record not found' });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property use record', error });
    }
    finally {
        connection.end();
    }
});
// Update a property use record
router.put('/:PropertyUse', async (req, res) => {
    const { PropertyUse } = req.params;
    const propertyUseData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyUse WHERE PropertyUse = ?', [PropertyUse]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property use record not found' });
            return;
        }
        // Update the property use data
        const [result] = await connection.execute(`UPDATE tb_PropertyUse 
            SET Propertyrate = ? 
            WHERE PropertyUse = ?`, [
            propertyUseData.Propertyrate,
            PropertyUse
        ]);
        res.status(200).json({ message: 'Property use record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property use record', error });
    }
    finally {
        connection.end();
    }
});
// Delete a property use record
router.delete('/:PropertyUse', async (req, res) => {
    const { PropertyUse } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_PropertyUse WHERE PropertyUse = ?', [PropertyUse]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property use record not found' });
            return;
        }
        // Delete the property use record
        const [result] = await connection.execute('DELETE FROM tb_PropertyUse WHERE PropertyUse = ?', [PropertyUse]);
        res.status(200).json({ message: 'Property use record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property use record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=propertyUseRoutes.js.map