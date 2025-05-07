import * as dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';
const { Pool } = pg;
// Load environment variables from .env file
dotenv.config();
// PostgreSQL connection pool configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432'), // PostgreSQL default port is 5432
});
const router = express.Router();
// Create a new "collectorElectoralArea"
router.post('/create', async (req, res) => {
    console.log('Creating a new collector electoral area...', req.body);
    const client = await pool.connect();
    try {
        const { officer_no, electoralarea } = req.body;
        console.log('officer_no, electoralarea ', officer_no, electoralarea);
        // Validate input
        if (!officer_no || !electoralarea) {
            res.status(400).json({ message: 'Please provide both officer_no and electoralarea.' });
            return;
        }
        // Find the name of the collector based on the officer number
        const result1 = await client.query(`SELECT officer_name FROM officer WHERE officer_no = $1`, [officer_no]);
        // if no collector is found, return an error
        if (result1.rowCount === 0) {
            res.status(201).json({ message: 'Collector not found in businesses.' });
            return;
        }
        // Execute the database query
        await client.query(`INSERT INTO "collectorelectoralarea" (officer_no, electoralarea) VALUES ($1, $2)`, [officer_no, electoralarea]);
        // Update business collector based on the electoral area
        const result2 = await client.query(`UPDATE business SET assessmentby = $1 WHERE electroral_area = $2`, [result1.rows[0].officer_name, electoralarea,]);
        console.log('result2: ', result2);
        // Respond with success message
        res.status(201).json({ message: 'Collector electoral area created successfully.' });
        return;
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
        client.release(); // Ensure the client is end back to the pool
    }
});
// GET endpoint to retrieve all collector electoral areas
router.get('/all', async (req, res) => {
    console.log('Retrieving all collector electoral areas...');
    const client = await pool.connect();
    console.log('I AM HERE, HERE');
    try {
        // Execute the database query
        const result = await client.query(`SELECT officer_no, electoralarea FROM "collectorelectoralarea"`);
        if (result.rowCount === 0) {
            res.status(200).json([]);
            return;
        }
        // Respond with the retrieved data
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
        client.release();
    }
});
// Update a "collectorelectoralarea"
router.put('/update/:officer_no', async (req, res) => {
    console.log('Updating a collector electoral area...');
    const client = await pool.connect();
    try {
        const { officer_no } = req.params;
        const { electoralarea } = req.body;
        // Execute the database query
        const result = await client.query(`UPDATE "collectorelectoralarea" SET electoralarea = $1 WHERE officer_no = $2`, [electoralarea, officer_no]);
        // Check if any rows were updated
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Collector electoral area not found.' });
            return;
        }
        // Respond with success message
        res.status(200).json({ message: 'Collector electoral area updated successfully.' });
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
        client.release();
    }
});
// Delete a "collectorElectoralArea"
router.delete('/delete/:officer_no', async (req, res) => {
    console.log('Deleting a collector electoral area...');
    const client = await pool.connect();
    try {
        const { officer_no } = req.params;
        // Execute the database query
        const result = await client.query(`DELETE FROM "collectorelectoralarea" WHERE officer_no = $1`, [officer_no]);
        // Check if any rows were deleted
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Collector electoral area not found.' });
            return;
        }
        // Respond with success message
        res.status(200).json({ message: 'Collector electoral area deleted successfully.' });
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
        client.release();
    }
});
export default router;
//# sourceMappingURL=collectorElectoralarea.js.map