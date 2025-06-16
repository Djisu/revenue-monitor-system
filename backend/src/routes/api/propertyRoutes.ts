// backend/src/routes/api/propertyRoutes.ts
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import type { QueryResult } from 'pg';  // Import QueryResult as a type

import bcrypt from 'bcrypt';
//import { createClient } from '../../db.js';


const router = Router();

// experiment ///
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { describe } from 'node:test';

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
let client= null;

// end of experiment ///
// Property data interface
interface PropertyData {
    house_no: string;
    owner: string;
    tenant: string;
    propertyuse: string;
    propertytype: string;
    propertyclass: string;
    electroral_area: string;
    landmark: string;
    street_name: string;
    code?: string;
    elevation?: string;
    rate: number;
    Assessmentby: string;
    balance?: number;
    PropertyUseRate?: number;
    PropertytypeRate?: number;
    PropertyclassRate?: number;
    gps_address?: string;
    propertyclass_desc: string;
    no_of_rooms?: number;
    property_assessed: string
    house_value?: number;
}



// Create a new property record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    console.log('router.post(/create')
    //const propertyData: PropertyData = req.body;

    const propertyData: PropertyData = req.body;

    client = await pool.connect();
    
    try {
        const { rowCount } = await client.query('SELECT * FROM property WHERE house_no = $1', [propertyData.house_no]);

        if (rowCount as number > 0) {
            res.status(409).json({ message: 'Property record already exists' });
            return;
        }

        // Insert the new property data
        const result: QueryResult = await client.query(
            `INSERT INTO property 
            (house_no, owner, tenant, propertyuse, 
            propertytype, propertyclass,  electroral_area, landmark, 
            street_name, code, elevation, rate, 
            Assessmentby, balance, PropertyUseRate, PropertytypeRate, 
            PropertyclassRate, propertyclass_desc, no_of_rooms, property_assessed, 
            house_value) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
            [
                propertyData.house_no,
                propertyData.owner,
                propertyData.tenant,
                propertyData.propertyuse,
                propertyData.propertytype,
                propertyData.propertyclass,
                propertyData.electroral_area,
                propertyData.landmark,
                propertyData.street_name,
                propertyData.code,
                propertyData.elevation,
                propertyData.rate,
                propertyData.Assessmentby,
                propertyData.balance,
                propertyData.PropertyUseRate,
                propertyData.PropertytypeRate,
                propertyData.PropertyclassRate,
                propertyData.propertyclass_desc,
                propertyData.no_of_rooms,
                propertyData.property_assessed,
                propertyData.house_value
            ]
        );

        res.status(201).json({ message: 'Property record created successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property record', error });
        return;
    } finally {
        client.release();
    }
});

// Read all property records
router.get('/fetchAll', async (req: Request, res: Response) => {
   // client = await pool.connect();
   console.log('in router.get(/fetchAll)')

    client = await pool.connect();

    try {
        const result: QueryResult = await client.query('SELECT * FROM property');

        if (result.rows.length == 0)
            res.status(404).json({ message: 'No property records found', data: [] });
        else
            res.status(200).json({ message: 'Property records fetched successfully', data: result.rows });
        } catch (error) {   
            console.error(error);
            res.status(500).json({ message: 'Error fetching property records', error: error });
        } finally {
            client.release();
        }    
});

// Read a single property record by house_no
router.get('/:house_no', async (req: Request, res: Response) => {
    const { house_no } = req.params;

    client = await pool.connect();

    try {
        const result: QueryResult = await client.query('SELECT * FROM property WHERE house_no = $1', [house_no]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Property record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property record', error });
    } finally {
        client.release();
    }
});



// Update a property record
router.put('/:house_no', async (req: Request, res: Response): Promise<void> => {
    const { house_no } = req.params;
    const propertyData: PropertyData = req.body;

    client = await pool.connect();

    try {
        const { rowCount } = await client.query('SELECT * FROM property WHERE house_no = $1', [propertyData.house_no]);

        if (rowCount == 0) {
            res.status(409).json({ message: 'Property record does not exist' });
            return;
        }

        // Update the property data
        const result: QueryResult = await client.query(
            `UPDATE property 
            SET owner = $1, tenant = $2, propertyuse = $3, propertytype = $4, 
            propertyclass = $5, electroral_area = $6, landmark = $7, 
            street_name = $8,  
            code = $9, elevation = $10, rate = $11, Assessmentby = $12, 
            balance = $13, PropertyUseRate = $14, 
            PropertytypeRate = $15, PropertyclassRate = $16,
            propertyclass_desc = $17, no_of_rooms = $18, property_assessed = $19, house_value = $20
            WHERE house_no = $21`,
            [
                propertyData.owner,
                propertyData.tenant,
                propertyData.propertyuse,
                propertyData.propertytype,
                propertyData.propertyclass,
                propertyData.electroral_area,
                propertyData.landmark,
                propertyData.street_name,
                propertyData.code,
                propertyData.elevation,
                propertyData.rate,
                propertyData.Assessmentby,
                propertyData.balance,
                propertyData.PropertyUseRate,
                propertyData.PropertytypeRate,
                propertyData.PropertyclassRate,
                propertyData.propertyclass_desc,
                propertyData.no_of_rooms,
                propertyData.property_assessed,
                propertyData.house_value,
                house_no
            ]
        );

        res.status(200).json({ message: 'Property record updated successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property record', error });
        return;
    } finally {
        client.release();
    }
});

// Delete a property record
router.delete('/:house_no', async (req: Request, res: Response) => {
    const { house_no } = req.params;

    client = await pool.connect();

    try {
        const { rowCount } = await client.query('SELECT * FROM property WHERE house_no = $1', [house_no]);

        if (rowCount == 0) {
            res.status(409).json({ message: 'Property record does not exist' });
            return;
        }

        // Delete the property record
        const result: QueryResult = await client.query('DELETE FROM property WHERE house_no = $1', [house_no]);

        res.status(200).json({ message: 'Property record deleted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property record', error });
        return;
    } finally {
        client.release();
    }
});

export default router;


