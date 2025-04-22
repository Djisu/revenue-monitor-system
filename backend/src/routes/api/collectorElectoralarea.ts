import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pg from 'pg'
const { Pool } = pg
import {PoolClient} from 'pg'
//import { createClient } from '../../db.js';



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

export interface collectorElectoralArea {
    officer_no: string;
    electoralarea: string;
}

const router = express.Router();

// Create a new "collectorElectoralArea"
router.post('/create', async (req: Request<{}, {}, collectorElectoralArea>, res: Response): Promise<void> => {
    console.log('Creating a new collector electoral area...', req.body);

   const client = await pool.connect();

    try {
        const { officer_no, electoralarea } = req.body;

        console.log('officer_no, electoralarea ', officer_no, electoralarea);

        // Validate input
        if (!officer_no || !electoralarea) {
             res.status(400).json({ message: 'Please provide both officer_no and electoralarea.' });
            return
        }

        // Find the name of the collector based on the officer number
        const result1 = await client.query(
            `SELECT officer_name FROM officer WHERE officer_no = $1`,
            [ officer_no]
        );

        // if no collector is found, return an error
        if (result1.rowCount === 0) {
             res.status(201).json({ message: 'Collector not found in businesses.' });
            return
        }
        
        // Execute the database query
        const result = await client.query(
            `INSERT INTO "collectorelectoralarea" (officer_no, electoralarea) VALUES ($1, $2)`,
            [officer_no, electoralarea]
        );

      

        // Update business collector based on the electoral area
        const result2 = await client.query(
            `UPDATE business SET assessmentby = $1 WHERE electroral_area = $2`,
            [ result1.rows[0].officer_name, electoralarea,]
        );

        console.log('result2: ', result2);

        // Respond with success message
        res.status(201).json({ message: 'Collector electoral area created successfully.' });
        return
    } catch (error) {
        console.error('Error creating collector electoral area:', error);
        res.status(500).json({ message: 'An error occurred while creating the collector electoral area.' });
        return
    } finally {
        client.release(); // Ensure the client is end back to the pool
    }
});

// GET endpoint to retrieve all collector electoral areas
router.get('/all', async (req: Request, res: Response): Promise<void> => {
    console.log('Retrieving all collector electoral areas...');

   const client = await pool.connect();

    console.log('I AM HERE, HERE')
    try {
        // Execute the database query
        const result = await client.query(
            `SELECT officer_no, electoralarea FROM "collectorelectoralarea"`
        );

        if (result.rowCount === 0) {
             res.status(200).json([]);
            return
        }
        // Respond with the retrieved data
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving collector electoral areas:', error);
        res.status(500).json({ message: 'An error occurred while retrieving collector electoral areas.' });
    }finally{
        client.release()
    }
});

// Update a "collectorelectoralarea"
router.put('/update/:officer_no', async (req: Request<{ officer_no: string }, {}, { electoralarea: string }>, res: Response): Promise<void> => {
    console.log('Updating a collector electoral area...')

   const client = await pool.connect();

    try {
        const { officer_no } = req.params;
        const { electoralarea } = req.body;

        // Execute the database query
        const result = await client.query(
            `UPDATE "collectorelectoralarea" SET electoralarea = $1 WHERE officer_no = $2`,
            [electoralarea, officer_no]
        );

        // Check if any rows were updated
        if (result.rowCount === 0) {
             res.status(404).json({ message: 'Collector electoral area not found.' });
            return
        }

        // Respond with success message
        res.status(200).json({ message: 'Collector electoral area updated successfully.' });
    } catch (error) {
        console.error('Error updating collector electoral area:', error);
        res.status(500).json({ message: 'An error occurred while updating the collector electoral area.' });
    }finally{
        client.release()
    }
});

// Delete a "collectorElectoralArea"
router.delete('/delete/:officer_no', async (req: Request<{ officer_no: string }>, res: Response): Promise<void> => {
    console.log('Deleting a collector electoral area...')

   const client = await pool.connect();

    try {
        const { officer_no } = req.params;

        // Execute the database query
        const result = await client.query(
            `DELETE FROM "collectorelectoralarea" WHERE officer_no = $1`,
            [officer_no]
        );

        // Check if any rows were deleted
        if (result.rowCount === 0) {
             res.status(404).json({ message: 'Collector electoral area not found.' });
            return
        }

        // Respond with success message
        res.status(200).json({ message: 'Collector electoral area deleted successfully.' });
    } catch (error) {
        console.error('Error deleting collector electoral area:', error);
        res.status(500).json({ message: 'An error occurred while deleting the collector electoral area.' });
    }finally{
        client.release()
    }
});
export default router;