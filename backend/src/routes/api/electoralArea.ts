// backend/src/routes/api/electoralAreaRoutes.ts

import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import { QueryResult } from 'pg';
import pkg from 'pg'

const { Pool } = pkg

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

// Electoral area data interface
interface ElectoralAreaData {
    electoral_area: string;
}

// Create a new electoral area record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    console.log('in electoral area create', req.body);

    const electoralAreaData: ElectoralAreaData = req.body;

    
    const client = await pool.connect()

    try {
        // Check for existing electoral area record
        const result: QueryResult = await client.query(
            'SELECT * FROM electoralarea WHERE electoral_area = $1',
            [electoralAreaData.electoral_area]
        );

        if (result.rows.length > 0) {
            res.status(409).json({ message: 'Electoral area record already exists' });
            return;
        }

        // Insert the new electoral area data
        await client.query(
            'INSERT INTO electoralarea (electoral_area) VALUES ($1)',
            [electoralAreaData.electoral_area]
        );

        res.status(201).json({ success: true, message: electoralAreaData.electoral_area });
        return
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }
        
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read all electoral area records
router.get('/all', async (req: Request, res: Response): Promise<void> => {
    
     const client = await pool.connect()

    try {
        const result: QueryResult = await client.query('SELECT DISTINCT electroral_area FROM business');

        // Map the rows to an array of electoral areas
        const electoralAreas = result.rows.map(row => ({ electroral_area: row.electroral_area }));

        console.log('Electoral Areas:', electoralAreas);
        res.status(200).json(electoralAreas); // Return the array directly
        return
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }  
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read a single electoral area record by electoral_area
router.get('/:electoral_area', async (req: Request, res: Response) => {
    const { electoral_area } = req.params;

    const client = await pool.connect()

    try {
        const result: QueryResult = await client.query(
            'SELECT * FROM electoralarea WHERE electoral_area = $1',
            [electoral_area]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, data: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Electoral area record not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }
        
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Update an electoral area record
router.put('/:electoral_area', async (req: Request, res: Response): Promise<void> => {
    const { electoral_area } = req.params;
    const electoralAreaData: ElectoralAreaData = req.body;

    const client = await pool.connect()

    try {
        // Check for existing electoral area record
        const result: QueryResult = await client.query(
            'SELECT * FROM electoralarea WHERE electoral_area = $1',
            [electoral_area]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Electoral area record not found' });
            return;
        }

        // Update the electoral area data
        await client.query(
            'UPDATE electoralarea SET electoral_area = $1 WHERE electoral_area = $2',
            [
                electoralAreaData.electoral_area,
                electoral_area
            ]
        );

        res.status(200).json({ success: true, message: 'Electoral area record updated successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }
        
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Delete an electoral area record
router.delete('/delete/:electoral_area', async (req: Request, res: Response) => {
    console.log('in electoral area delete', req.params);

    const { electoral_area } = req.params;

    const client = await pool.connect()

    try {
      

        // Check for existing electoral area record
        const result: QueryResult = await client.query(
            'SELECT * FROM electoralarea WHERE electoral_area = $1',
            [electoral_area]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Electoral area record not found' });
            return;
        }

        // Delete the electoral area record
        await client.query(
            'DELETE FROM electoralarea WHERE electoral_area = $1',
            [electoral_area]
        );

        res.status(200).json({ success: true, message: 'Electoral area record deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error deleting electoral area record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error creating electoral area record', error });
        }
        
    } finally {
        if (client) {
            client.release();
        }
    }
});

export default router;






// // backend/src/routes/api/electoralAreaRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader } from 'mysql2/promise';

// const router = Router();

// // Load environment variables from .env file
// dotenv.config();

// // MySQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
// };

// // Electoral area data interface
// interface ElectoralAreaData {
//     electoral_area: string;
// }


// // Create a new electoral area record
// router.post('/create', async (req: Request, res: Response): Promise<void> => {
//     console.log('in electoral area create', req.body)

//     const electoralAreaData: ElectoralAreaData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         // Check for existing electoral area record
//         const [rows] = await connection.execute('SELECT * FROM electoralarea WHERE electoral_area = ?', [electoralAreaData.electoral_area]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ message: 'Electoral area record already exists' });
//             return;
//         }

//         // Insert the new electoral area data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_electoralarea (electoral_area) VALUES (?)`,
//             [electoralAreaData.electoral_area]
//         );

//         //res.status(201).json({  success: true, message: 'Electoral area record created successfully' });
//         res.status(201).json({ success: true, message: electoralAreaData.electoral_area });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({  success: false, message: 'Error creating electoral area record', error });
//     } finally {
//         connection.release();
//     }
// });

// // Read all electoral area records
// router.get('/all', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_electoralarea');

//          // Map the rows to an array of strings
//          // Convert rows to an array of objects
//          const electoralAreas = (rows as { electoral_area: string }[]).map(row => ({ electoral_area: row.electoral_area }));


//         console.log('electoralAreas', electoralAreas)
//         res.status(200).json(rows);
//         //res.status(200).json({ data: electoralAreas }); // Ensure the response is an object with a data property
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({  success: false, message: 'Error fetching electoral area records', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read a single electoral area record by electoral_area
// router.get('/:electoral_area', async (req: Request, res: Response) => {
//     const { electoral_area } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_electoralarea WHERE electoral_area = ?', [electoral_area]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(200).json({ success: true, data: rows[0] });
//         } else {
//             res.status(404).json({  success: false, message: 'Electoral area record not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({  success: false, message: 'Error fetching electoral area record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Update an electoral area record
// router.put('/:electoral_area', async (req: Request, res: Response): Promise<void> => {
//     const { electoral_area } = req.params;
//     const electoralAreaData: ElectoralAreaData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//          // Check for existing electoral area record
//          const [rows] = await connection.execute('SELECT * FROM tb_electoralarea WHERE electoral_area = ?', [electoral_area]);

//          if (Array.isArray(rows) && rows.length > 0) {
//              res.status(409).json({  success: false, message: 'Electoral area record does not exist' });
//              return;
//          }

//         // Update the electoral area data
//         const [result] = await connection.execute(
//             `UPDATE tb_electoralarea SET electoral_area = ? WHERE electoral_area = ?`,
//             [
//                 electoralAreaData.electoral_area,
//                 electoral_area
//             ]
//         );

//         res.status(200).json({  success: true, message: 'Electoral area record updated successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({  success: false, message: 'Error updating electoral area record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Delete an electoral area record
// router.delete('/delete/:electoral_area', async (req: Request, res: Response) => {
//     console.log('in electoral area delete', req.params)

//     const { electoral_area } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//          // Check for existing electoral area record
//          const [rows] = await connection.execute('SELECT * FROM tb_electoralarea WHERE electoral_area = ?', [electoral_area]);

//          if (Array.isArray(rows) && rows.length == 0) {
//              res.status(409).json({ success: true, message: 'Electoral area record does not exist' });
//              return;
//          }
//         // Delete the electoral area record
//         const [result] = await connection.execute('DELETE FROM tb_electoralarea WHERE electoral_area = ?', [electoral_area]);

//         res.status(200).json({ success: true, message: 'Electoral area record deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false,  message: 'Error deleting electoral area record', error });
//     } finally {
//         connection.end();
//     }
// });

// export default router;