// backend/src/routes/api/bussCurrBalanceRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pg from 'pg'
const { Pool } = pg
import {PoolClient} from 'pg'
import { createClient } from '../../db.js';


const router = Router();

// Load environment variables from .env file
dotenv.config();

const nodeEnv = process.env.NODE_ENV;

let frontendUrl = "" // Set frontend URL based on node environment

if (nodeEnv === 'development'){
    frontendUrl = "http://localhost:5173";
} else if (nodeEnv === 'production'){
    frontendUrl = "https://revenue-monitor-system.onrender.com";
} else if (nodeEnv === 'test'){
    console.log('Just testing')
} else {
    console.log('Invalid node environment variable') //.slice()
}

// PostgreSQL connection pool configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432'), // PostgreSQL default port is 5432
});

// BussCurrBalance data interface
interface BussCurrBalanceData {
    buss_no: string;
    fiscalyear: string;
    balancebf: number;
    current_balance: number;
    totalAmountDue: number;
    transdate: string;
    electoralarea: string;
}

// Create a new BussCurrBalance record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const bussCurrBalanceData: BussCurrBalanceData = req.body;

    const client = createClient();
    
    try {
        const { rows } = await client.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2',
         [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]
        );

        if (rows.length > 0) {
            res.status(404).json({ message: 'BussCurrBalance record exists' });
            return;
        }

        // Insert the new BussCurrBalance data
        const result = await client.query(
            `INSERT INTO busscurrbalance (buss_no, fiscalyear, balancebf, current_balance, totalAmountDue, transdate, electoralarea) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                bussCurrBalanceData.buss_no,
                bussCurrBalanceData.fiscalyear,
                bussCurrBalanceData.balancebf,
                bussCurrBalanceData.current_balance,
                bussCurrBalanceData.totalAmountDue,
                bussCurrBalanceData.transdate,
                bussCurrBalanceData.electoralarea,
            ]
        );

        res.status(201).json({ message: 'BussCurrBalance record created successfully' });
        return
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BussCurrBalance record', error });
        return
    } finally {
        client.end();
    }
});

// Read all BussCurrBalance records
router.get('/', async (req: Request, res: Response) => {
    const client = createClient();

    try {
        const { rows } = await client.query('SELECT * FROM busscurrbalance');
        res.json(rows);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching busscurrbalance records', error });
        return
    } finally {
        client.end();
    }
});

// Read a single BussCurrBalance record by buss_no and fiscalyear
router.get('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;

   const client = createClient();

    try {
        const { rows } = await client.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);

        if (rows.length > 0) {
            res.json(rows[0]); // Return the first row
            return
        } else {
            res.status(404).json({ message: 'busscurrbalance record not found' });
            return
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching busscurrbalance record', error });
        return
    } finally {
        client.end();
    }
});

// Update a BussCurrBalance record
router.put('/:buss_no/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
    const { buss_no } = req.params;
    const bussCurrBalanceData: BussCurrBalanceData = req.body;

    const client = createClient();

    try {
        const { rows } = await client.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2',
         [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]
        );

        if (rows.length == 0) {
            res.status(404).json({ message: 'BussCurrBalance record not exist' });
            return;
        }

        // Update the BussCurrBalance data
        const result = await client.query(
            `UPDATE busscurrbalance SET fiscalyear = $1, balancebf = $2, current_balance = $3, totalAmountDue = $4, 
            transdate = $5, electoralarea = $6 
            WHERE buss_no = $7 AND fiscalyear = $8`,
            [
                bussCurrBalanceData.fiscalyear,
                bussCurrBalanceData.balancebf,
                bussCurrBalanceData.current_balance,
                bussCurrBalanceData.totalAmountDue,
                bussCurrBalanceData.transdate,
                bussCurrBalanceData.electoralarea,
                buss_no,
                bussCurrBalanceData.fiscalyear
            ]
        );

        res.status(200).json({ message: 'BussCurrBalance record updated successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BussCurrBalance record', error });
        return
    } finally {
        client.end();
    }
});

// Delete a BussCurrBalance record
router.delete('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;

    const client = createClient();

    try {
        const { rows } = await client.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2',
         [buss_no, fiscalyear]
        );

        if (rows.length == 0) {
            res.status(404).json({ message: 'BussCurrBalance record not exist' });
            return;
        }

        // Delete the BussCurrBalance record
        const result = await client.query('DELETE FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);

        res.status(200).json({ message: 'BussCurrBalance record deleted successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BussCurrBalance record', error });
        return
    } finally {
        client.end();
    }
});

export default router;












