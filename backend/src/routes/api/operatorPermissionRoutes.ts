// backend/src/routes/api/operatorRoutes.ts

import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
//import type { QueryResult } from 'pg';  // Import QueryResult as a type

import bcrypt from 'bcrypt';
//import { createClient } from '../../db.js';


const router = Router();

// experiment ///
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Load the environment variables from the .env file
dotenv.config();

// Determine the environment (development or production)
const env = process.env.NODE_ENV || 'development';  // Defaults to 'development'
console.log('[BACKEND] Initial NODE_ENV:', process.env.NODE_ENV); // Debugging log

// Construct the path to the appropriate .env file from the root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const permitDir = path.join(__dirname, 'permits');

//const rootDir = path.resolve(__dirname, '..');
const envPath = path.resolve(__dirname, `../.env.${env}`);

console.log('[BACKEND] envPath:', envPath); // Debugging log

// Check if the .env file exists
if (!fs.existsSync(envPath)) {
  console.error(`[BACKEND] .env file not found at ${envPath}. Please ensure the file exists.`);
  process.exit(1); // Exit the process if the file is not found
}

// Load the environment variables from the .env file
dotenv.config({ path: envPath });

console.log('[BACKEND] environment:', env);
console.log('[BACKEND] NODE_ENV after dotenv.config:', process.env.NODE_ENV); // Debugging log

// Example usage of environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('Initial NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', DB_HOST);
console.log('DB_USER:', DB_USER);
console.log('DB_NAME:', DB_NAME);
console.log('DB_PORT:', DB_PORT);
console.log('DB_PASSWORD:', DB_PASSWORD);
console.log('JWT_SECRET:', JWT_SECRET);

// SSL configuration
let sslConfig: false | { rejectUnauthorized: boolean };

if (process.env.NODE_ENV === 'production') { 
  sslConfig = { rejectUnauthorized: true }; // Important for Render.com
} else {
  sslConfig = false;
}

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    ssl: sslConfig,
};

const pool = new Pool(dbConfig);
// end of experiment ///

// OperatorPermission data interface
interface OperatorPermissionData {
    operatorid: string;
    menus: string;
    password: string;
}
  

// Create a new operator permission record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    const operatorPermissionData: OperatorPermissionData = req.body;
    console.log('in router.post(/create) permission:', operatorPermissionData.operatorid);    
   
    const client = await pool.connect()

    try {
        // Check if an operator permission with the same operatorid already exists
        const existingPermissionResult = await client.query(
            'SELECT * FROM operatorpermission WHERE operatorid = $1', 
            [operatorPermissionData.operatorid]
        );

        if (existingPermissionResult.rowCount !== null && existingPermissionResult.rowCount > 0) {
            res.status(409).json({ message: 'Operator permission with this operatorid already exists.' });
            return;
        }
        
        // Find operator definitions password
        const operatorResult = await client.query(
            'SELECT password FROM operatordefinition WHERE operatorid = $1', 
            [operatorPermissionData.operatorid]
        );

        if (operatorResult.rowCount === 0 || operatorResult === null) {
            res.status(404).json({ message: 'Operator definition with this operatorid does not exist.' });
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(operatorPermissionData.password, salt);
        operatorPermissionData.password = hashedPassword;

        // Insert the new operator permission data
        await client.query(
            `INSERT INTO operatorpermission (operatorid, menus, password) 
            VALUES ($1, $2, $3)`,
            [
                operatorPermissionData.operatorid,
                operatorPermissionData.menus,
                hashedPassword,
            ]
        );

        res.status(201).json({ message: 'Operator permission created successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error creating record', error });
        }
        
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read all operator permissions
router.get('/all', async (req: Request, res: Response) => {
    
const client = await pool.connect()

    try {
       

        const result = await client.query('SELECT * FROM operatorpermission');

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No records found', data: [] });
            return; // Add return to prevent fall-through
        }

        res.status(200).json({ message: 'Records found', data: result.rows });
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error getting record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
        
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read a single operator permission by OperatorID
router.get('/:OperatorID', async (req: Request, res: Response) => {
    const { operatorid } = req.params;

    const client = await pool.connect()


    try {
       

        const result = await client.query('SELECT * FROM operatorpermission WHERE operatorid = $1', [operatorid]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Record not found' });
            return; // Add return to prevent fall-through
        }

        res.status(200).json({ message: 'Successfully retrieved', data: result.rows[0] });
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error getting record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
        
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Update an operator permission record
router.put('/:OperatorID', async (req: Request, res: Response): Promise<void> => {
    const { OperatorID } = req.params;
    const operatorPermissionData: OperatorPermissionData = req.body;

    const client = await pool.connect()


    try {
       


        // Check if an operator permission with the same OperatorID exists
        const existingPermissionResult = await client.query(
            'SELECT * FROM operatorpermission WHERE operatorid = $1', 
            [OperatorID]
        );

        if (existingPermissionResult.rowCount === 0) {
            res.status(404).json({ message: 'Operator permission with this operator ID does not exist.' });
            return;
        }

        // Hash the password if it's being updated
        if (operatorPermissionData.password) {
            const salt = await bcrypt.genSalt(10);
            operatorPermissionData.password = await bcrypt.hash(operatorPermissionData.password, salt);
        }

        await client.query(
            `UPDATE operatorpermission SET menus = $1, password = $2 
            WHERE operatorid = $3`,
            [
                operatorPermissionData.menus,
                operatorPermissionData.password,
                OperatorID
            ]
        );

        res.status(200).json({ message: 'Operator permission updated successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error updating record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error updating record', error });
        }
        
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Delete an operator permission record
router.delete('/:operatorID', async (req: Request, res: Response) => {
    const { operatorID } = req.params;
 const client = await pool.connect()

    try {
 
        // Check if an operator permission with the same OperatorID exists
        const existingPermissionResult = await client.query(
            'SELECT * FROM operatorpermission WHERE operatorid = $1', 
            [operatorID]
        );

        if (existingPermissionResult.rowCount === 0) {
            res.status(404).json({ message: 'Operator permission with this OperatorID does not exist.' });
            return;
        }

        await client.query('DELETE FROM operatorpermission WHERE operatorid = $1', [operatorID]);
        res.status(200).json({ message: 'Operator permission deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error delting record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error delting record', error });
        }
        
    } finally {
        if (client) {
            client.release();
        }
    }
});

export default router;

