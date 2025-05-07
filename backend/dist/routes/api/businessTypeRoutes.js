// backend/src/routes/api/businessTypeRoutes.ts
import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
const router = Router();
// Load environment variables from .env file
dotenv.config();
// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
const pool = new Pool(dbConfig);
// Function to sanitize input data
function sanitizeBusinessTypeData(data) {
    return {
        Business_Type: data.Business_Type || ''
    };
}
// Create a new BusinessType record
router.post('/create', async (req, res) => {
    console.log('Creating a new businessType record');
    const businessTypeData = sanitizeBusinessTypeData(req.body);
    const client = await pool.connect(); // Create a new client instance
    try {
        // Connect to PostgreSQL
        const result = await client.query('SELECT * FROM businesstype WHERE business_type = $1', [businessTypeData.Business_Type]);
        if (Array.isArray(result.rows) && result.rows.length > 0) {
            res.status(409).json({ message: 'Business Type record already exists.' });
            return;
        }
        // Insert the new BusinessType data
        await client.query('INSERT INTO businesstype (business_type) VALUES ($1)', [businessTypeData.Business_Type]);
        res.status(201).json({ success: true, message: 'BusinessType record created successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error creating BusinessType record', error });
        }
        else {
            res.status(500).json({ message: "Unknown error" });
        }
    }
    finally {
        await client.release(); // Ensure the client is closed
    }
});
// Read all BusinessType records
router.get('/all', async (req, res) => {
    console.log('Fetching all businessType records');
    const client = await pool.connect(); // Create a new client instance
    try {
        // Connect to PostgreSQL
        const result = await client.query('SELECT business_type FROM businesstype');
        console.log('result.rows: ', result.rows);
        res.status(200).json(result.rows);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error creating BusinessType record', error });
        }
        else {
            res.status(500).json({ message: "Unknown error" });
        }
    }
    finally {
        await client.release(); // Ensure the client is closed
    }
});
// Read a single BusinessType record by Business_Type
router.get('/:Business_Type', async (req, res) => {
    const { Business_Type } = req.params;
    const client = await pool.connect(); // Create a new client instance
    try {
        // Connect to PostgreSQL
        const result = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [Business_Type]);
        if (Array.isArray(result.rows) && result.rows.length > 0) {
            res.status(200).json({ success: true, data: result.rows[0] }); // Return the first row
        }
        else {
            res.status(404).json({ success: false, message: 'BusinessType record not found' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error creating BusinessType record', error });
        }
        else {
            res.status(500).json({ message: "Unknown error" });
        }
    }
    finally {
        await client.release(); // Ensure the client is closed
    }
});
// Update a BusinessType record
router.put('/:Business_Type', async (req, res) => {
    const { Business_Type } = req.params;
    const businessTypeData = sanitizeBusinessTypeData(req.body);
    const client = await pool.connect(); // Create a new client instance
    try {
        // Connect to PostgreSQL
        const result = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [businessTypeData.Business_Type]);
        if (Array.isArray(result.rows) && result.rows.length > 0) {
            res.status(409).json({ success: false, message: 'Business Type record already exists.' });
            return;
        }
        // Update the BusinessType data
        await client.query('UPDATE businesstype SET Business_Type = $1 WHERE Business_Type = $2', [businessTypeData.Business_Type, Business_Type]);
        res.status(200).json({ success: true, message: 'BusinessType record updated successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error creating BusinessType record', error });
        }
        else {
            res.status(500).json({ message: "Unknown error" });
        }
    }
    finally {
        await client.release(); // Ensure the client is closed
    }
});
// Delete a BusinessType record
router.delete('/:Business_Type', async (req, res) => {
    const { Business_Type } = req.params;
    console.log('Deleting BusinessType record:', Business_Type);
    const client = await pool.connect(); // Create a new client instance
    try {
        // Connect to PostgreSQL
        const result = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [Business_Type]);
        if (Array.isArray(result.rows) && result.rows.length === 0) {
            res.status(409).json({ success: true, message: 'Business Type record does not exist.' });
            return;
        }
        // Delete the BusinessType record
        await client.query('DELETE FROM businesstype WHERE Business_Type = $1', [Business_Type]);
        res.status(200).json({ success: true, message: 'BusinessType record deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error creating BusinessType record', error });
        }
        else {
            res.status(500).json({ message: "Unknown error" });
        }
    }
    finally {
        await client.release(); // Ensure the client is closed
    }
});
// Other routes remain unchanged...
export default router;
//# sourceMappingURL=businessTypeRoutes.js.map