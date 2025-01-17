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
// Create a new property type record
router.post('/', async (req, res) => {
    const propertyTypeData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_Propertytype WHERE property_type = ?', [propertyTypeData.property_type]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
            return;
        }
        else {
            res.status(404).json({ message: 'Property type record not found' });
            return;
        }
        // Insert the new property type data
        const [result] = await connection.execute(`INSERT INTO tb_Propertytype 
            (property_type, rate) 
            VALUES (?, ?)`, [
            propertyTypeData.property_type,
            propertyTypeData.rate,
        ]);
        res.status(201).json({ message: 'Property type record created successfully' });
        return;
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property type record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Read all property type records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_Propertytype');
        res.json(rows);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property type records', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Read a single property type record by property_type
router.get('/:property_type', async (req, res) => {
    const { property_type } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_Propertytype WHERE property_type = ?', [property_type]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
            return;
        }
        else {
            res.status(404).json({ message: 'Property type record not found' });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property type record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Update a property type record
router.put('/:property_type', async (req, res) => {
    const { property_type } = req.params;
    const propertyTypeData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_Propertytype WHERE property_type = ?', [propertyTypeData.property_type]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property type record not found' });
            return;
        }
        // Update the property type data
        const [result] = await connection.execute(`UPDATE tb_Propertytype 
            SET rate = ? 
            WHERE property_type = ?`, [
            propertyTypeData.rate,
            property_type
        ]);
        res.status(200).json({ message: 'Property type record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property type record', error });
    }
    finally {
        connection.end();
    }
});
// Delete a property type record
router.delete('/:property_type', async (req, res) => {
    const { property_type } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_Propertytype WHERE property_type = ?', [property_type]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'Property type record not found' });
            return;
        }
        // Delete the property type record
        const [result] = await connection.execute('DELETE FROM tb_Propertytype WHERE property_type = ?', [property_type]);
        res.status(200).json({ message: 'Property type record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property type record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=propertyTypeRoutes.js.map