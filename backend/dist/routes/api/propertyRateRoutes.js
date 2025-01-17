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
// Create a new property rate record
router.post('/', async (req, res) => {
    const propertyRateData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_propertyrate WHERE property_Class = ? AND fiscalyear = ?', [propertyRateData.property_Class, propertyRateData.fiscalyear]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Property rate record already exists' });
            return;
        }
        // Insert the new property rate data
        const [result] = await connection.execute(`INSERT INTO tb_propertyrate 
            (property_Class, fiscalyear, rate, registrationrate) 
            VALUES (?, ?, ?, ?)`, [
            propertyRateData.property_Class,
            propertyRateData.fiscalyear,
            propertyRateData.rate,
            propertyRateData.registrationrate,
        ]);
        res.status(201).json({ message: 'Property rate record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property rate record', error });
    }
    finally {
        connection.end();
    }
});
// Read all property rate records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_propertyrate');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property rate records', error });
    }
    finally {
        connection.end();
    }
});
// Read a single property rate record by property_Class and fiscalyear
router.get('/:property_Class/:fiscalyear', async (req, res) => {
    const { property_Class, fiscalyear } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_propertyrate WHERE property_Class = ? AND fiscalyear = ?', [property_Class, fiscalyear]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'Property rate record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property rate record', error });
    }
    finally {
        connection.end();
    }
});
// Update a property rate record
router.put('/:property_Class/:fiscalyear', async (req, res) => {
    const { property_Class, fiscalyear } = req.params;
    const propertyRateData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_propertyrate WHERE property_Class = ? AND fiscalyear = ?', [propertyRateData.property_Class, propertyRateData.fiscalyear]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Property rate record does not exist' });
            return;
        }
        // Update the property rate data
        const [result] = await connection.execute(`UPDATE tb_propertyrate 
            SET rate = ?, registrationrate = ? 
            WHERE property_Class = ? AND fiscalyear = ?`, [
            propertyRateData.rate,
            propertyRateData.registrationrate,
            property_Class,
            fiscalyear
        ]);
        res.status(200).json({ message: 'Property rate record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property rate record', error });
    }
    finally {
        connection.end();
    }
});
// Delete a property rate record
router.delete('/:property_Class/:fiscalyear', async (req, res) => {
    const { property_Class, fiscalyear } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_propertyrate WHERE property_Class = ? AND fiscalyear = ?', [property_Class, fiscalyear]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Property rate record does not exist' });
            return;
        }
        // Delete the property rate record
        const [result] = await connection.execute('DELETE FROM tb_propertyrate WHERE property_Class = ? AND fiscalyear = ?', [property_Class, fiscalyear]);
        res.status(200).json({ message: 'Property rate record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property rate record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=propertyRateRoutes.js.map