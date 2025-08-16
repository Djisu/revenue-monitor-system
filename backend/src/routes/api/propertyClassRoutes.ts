// backend/src/routes/api/propertyClassRoutes.ts
import { Router, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import pkg, { QueryResult } from 'pg';
const { Pool } = pkg;

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

// Connection using database url
const connectionString: string | undefined = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

import { parse } from 'pg-connection-string';
import { PoolConfig } from 'pg';

const parsedConfig = parse(connectionString) as Partial<PoolConfig>;
const configDB: PoolConfig = {
  ...parsedConfig,
  ssl: {
    rejectUnauthorized: false
  }
};

// Create the pool
const pool = new Pool(configDB);
// end of connection ///

// PropertyClass data interface
interface PropertyClassData {
    property_class: string;
    description: string;
    frequency: string;
    rate: number;
    assessed: string;
}

// Create a new property class record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    const propertyClassData: PropertyClassData = req.body;

    console.log('Received propertyClassData:', propertyClassData);

    const { property_class, description, frequency, rate, assessed } = propertyClassData;

    if (!property_class || rate == null) {
        res.status(400).json({ success: false, message: 'Property class and rate are required' });
        return;
    }

    const client = await pool.connect()

    try {
        const result = await client.query('SELECT * FROM propertyclass WHERE property_class = $1 AND description = $2', [property_class, description]);

        if (result.rows.length > 0) {
            res.status(409).json({ message: 'Property class record already exists' });
            return;
        }

        // Insert the new property class data
        await client.query(
            `INSERT INTO propertyclass (property_class,  description, frequency, rate, assessed) 
            VALUES ($1, $2, $3, $4, $5)`,
            [property_class, description, frequency, rate, assessed]
        );

        res.status(201).json({ success: true, message: 'Property class record created successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error:', error);
            if (error.message.includes('duplicate key value violates unique constraint "unique_property_class_description"')) {
                res.status(409).json({ success: false, message: 'Property class record already exists' });
            } else {
                res.status(500).json({ success: false, message: 'Error creating property class record', error: error.message });
            }
        } else {
            res.status(500).json({ success: false, message: 'Error creating property class record', error: error });
        }
    } finally {
        client.release();
    }
});

// 
// Read all property class records
router.get('/descriptions/all', async (req: Request, res: Response) => {
    console.log('Received request to read all property class records');

    const client = await pool.connect()

    try {
        const result = await client.query('SELECT DISTINCT description FROM propertyclass');
        res.status(200).json({ success: true, data: result.rows });
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching property class descriptionrecords', error });
    }finally{
        client.release()
    }
});

// Read all property class records
router.get('/all', async (req: Request, res: Response) => {
    console.log('Received request to read all property class records');

    const client = await pool.connect()

    try {
        const result = await client.query('SELECT * FROM propertyclass');
        res.status(200).json({ success: true, data: result.rows });
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching property class records', error });
    }finally{
        client.release()
    }
});

// Read all property class records
router.get('/distinct', async (req: Request, res: Response) => {
    console.log('Received request to read all distinct property class records');

    const client = await pool.connect()

    try {
        const result = await client.query('SELECT DISTINCT property_class FROM propertyclass');
        res.status(200).json({ success: true, data: result.rows });
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching property class records', error });
    }finally{
        client.release()
    }
});

// Read a single property class record by property_class
router.get('/:property_class', async (req: Request, res: Response) => {
    const { property_class } = req.params;

    console.log('Received request to read property class record with property_class:', property_class);

    const client = await pool.connect()

    try {
        const result = await client.query('SELECT * FROM propertyclass WHERE property_class = $1', [property_class]);

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, data: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Property class record not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error){
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching property class record', error: error.message });
        }else{
            res.status(500).json({success: false, message: 'Error fetching property class record', error});
        }
    }finally{
        client.release()
    }
});

// Find rate
router.get('/findrate/:propertyAssessed/:propertyClassDesc', async (req: Request, res: Response) => {
    const { propertyAssessed, propertyClassDesc } = req.params;

    console.log('router.get(/findrate/:propertyAssessed/:propertyClassDesc):', propertyAssessed, 'and description:', propertyClassDesc);

    const client = await pool.connect()

    console.log('before QueryResult<any> = await client.query(SELECT rate FROM propertyclass WHERE description = $1 AND assessed = $2, [propertyClassDesc, propertyAssessed ]);')

    try {
        const result: QueryResult = await client.query('SELECT rate FROM propertyclass WHERE description = $1 AND assessed = $2', [propertyClassDesc, propertyAssessed ]);

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Property class found', data: result.rows[0] }); // Return the first row
        } else {
            res.status(404).json({ success: false, message: 'Property class not found', data: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching property class record', data: error });
    } finally {
        client.release();
    }
});

// Read a single property record by house_no
router.get('/findpropertyclasses/:desc', async (req: Request, res: Response) => {
    const { desc } = req.params;

    const client = await pool.connect();

    try {
        const result: QueryResult = await client.query('SELECT * FROM propertyclass WHERE description = $1', [desc]);

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Property class found', data: result.rows[0] }); // Return the first row
        } else {
            res.status(404).json({ message: 'Property record not found', data: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property record', data: error });
    } finally {
        client.release();
    }
});

// Read a single property class record by assessed
router.get('/finddescription/:assessed', async (req: Request, res: Response) => {
    const { assessed } = req.params;

    console.log('Received request to find description with assessed:', assessed);

    const client = await pool.connect()

    try {
        const result = await client.query('SELECT description FROM propertyclass WHERE assessed = $1', [assessed]);

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, data: result.rows.map(row => row.description) });
        } else {
            res.status(404).json({ success: false, message: 'Property class record not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error){
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching property class record', error: error.message });
        }else{
            res.status(500).json({success: false, message: 'Error fetching property class record', error});
        }
    }finally{
        client.release()
    }
});

// Read a single property class record by assessed
router.get('/:assessed', async (req: Request, res: Response) => {
    const { assessed } = req.params;

    console.log('Received request to read property class record with property_class:', assessed);

    const client = await pool.connect()

    try {
        const result = await client.query('SELECT * FROM propertyclass WHERE assessed = $1', [assessed]);

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, data: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Property class record not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error){
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching property class record', error: error.message });
        }else{
            res.status(500).json({success: false, message: 'Error fetching property class record', error});
        }
    }finally{
        client.release()
    }
});

// Update a property class record
router.put('/:property_class', async (req: Request, res: Response): Promise<void> => {
    const { property_class } = req.params;
    const propertyClassData: PropertyClassData = req.body;

    const client = await pool.connect()

    try {
        const result = await client.query('SELECT * FROM propertyclass WHERE property_class = $1', [property_class]);

        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Property class record not found' });
            return;
        }

        // Update the property class data
        await client.query(
            `UPDATE propertyclass 
            SET description = $1, frequency = $2, rate = $1, assessed = $3
            WHERE property_class = $2`,
            [propertyClassData.description, propertyClassData.frequency, propertyClassData.assessed, property_class]
        );

        res.status(200).json({ success: true, message: 'Property class record updated successfully' });
    } catch (error: unknown) {
        if (error instanceof Error){
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error updating property class record', error: error.message });
        }else{
            res.status(500).json({success: false, message: 'Error updating property class record', error});
        }
    }
});

// Delete a property class record
router.delete('/delete/:property_class', async (req: Request, res: Response) => {
    const { property_class } = req.params;

    const client = await pool.connect()

    try {
        const result = await client.query('SELECT * FROM propertyclass WHERE property_class = $1', [property_class]);

        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Property class record not found' });
            return;
        }

        // Delete the property class record
        await client.query('DELETE FROM propertyclass WHERE property_class = $1', [property_class]);

        res.status(200).json({ success: true, message: 'Property class record deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error){
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error deleting property class record', error: error.message });
        }else{
            res.status(500).json({success: false, message: 'Error deleting property class record', error});
        }
    }
});

export default router;




