// backend/src/routes/api/propertyUseRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import { Client, QueryResult } from 'pg';

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

// PropertyUse data interface
interface PropertyUseData {
    PropertyUse: string;
    Propertyrate: number;
}

// Create a new property use record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const propertyUseData: PropertyUseData = req.body;

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const { rows } = await client.query<QueryResult>('SELECT * FROM propertyuse WHERE PropertyUse = $1', [propertyUseData.PropertyUse]);

        if (rows.length > 0) {
            res.status(409).json({ message: 'Property use record already exists' });
            return;
        }

        // Insert the new property use data
        const result = await client.query<QueryResult>('INSERT INTO propertyuse (PropertyUse, Propertyrate) VALUES ($1, $2) RETURNING *', [
            propertyUseData.PropertyUse,
            propertyUseData.Propertyrate,
        ]);

        res.status(201).json({ message: 'Property use record created successfully', data: result.rows[0] });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property use record', error: error.message });
    } finally {
        await client.end();
    }
});

// Read all property use records
router.get('/', async (req: Request, res: Response) => {
    const client = new Client(dbConfig);
    await client.connect();

    try {
        const { rows } = await client.query<QueryResult>('SELECT * FROM propertyuse');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property use records', error });
    } finally {
        await client.end();
    }
});

// Read a single property use record by PropertyUse
router.get('/:PropertyUse', async (req: Request, res: Response) => {
    const { PropertyUse } = req.params;

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const { rows } = await client.query<QueryResult>('SELECT * FROM propertyuse WHERE PropertyUse = $1', [PropertyUse]);

        if (rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Property use record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property use record', error });
    } finally {
        await client.end();
    }
});

// Update a property use record
router.put('/:PropertyUse', async (req: Request, res: Response): Promise<void> => {
    const { PropertyUse } = req.params;
    const propertyUseData: PropertyUseData = req.body;

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const { rows } = await client.query<QueryResult>('SELECT * FROM propertyuse WHERE PropertyUse = $1', [PropertyUse]);

        if (rows.length == 0) {
            res.status(404).json({ message: 'Property use record not found' });
            return;
        }

        // Update the property use data
        const result = await client.query<QueryResult>('UPDATE propertyuse SET Propertyrate = $1 WHERE PropertyUse = $2 RETURNING *', [
            propertyUseData.Propertyrate,
            PropertyUse
        ]);

        res.status(200).json({ message: 'Property use record updated successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property use record', error });
    } finally {
        await client.end();
    }
});

// Delete a property use record
router.delete('/:PropertyUse', async (req: Request, res: Response) => {
    const { PropertyUse } = req.params;

    const client = new Client(dbConfig);
    await client.connect();

    try {
        const { rows } = await client.query<QueryResult>('SELECT * FROM propertyuse WHERE PropertyUse = $1', [PropertyUse]);

        if (rows.length == 0) {
            res.status(404).json({ message: 'Property use record not found' });
            return;
        }

        // Delete the property use record
        await client.query<QueryResult>('DELETE FROM propertyuse WHERE PropertyUse = $1', [PropertyUse]);

        res.status(200).json({ message: 'Property use record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property use record', error });
    } finally {
        await client.end();
    }
});

export default router;







// // backend/src/routes/api/propertyUseRoutes.ts
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

// // PropertyUse data interface
// interface PropertyUseData {
//     PropertyUse: string;
//     Propertyrate: number;
// }

// // Create a new property use record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const propertyUseData: PropertyUseData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_PropertyUse WHERE PropertyUse = ?', [propertyUseData.PropertyUse]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Property use record not found' });
//             return
//         }

//         // Insert the new property use data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_PropertyUse 
//             (PropertyUse, Propertyrate) 
//             VALUES (?, ?)`,
//             [
//                 propertyUseData.PropertyUse,
//                 propertyUseData.Propertyrate,
//             ]
//         );

//         res.status(201).json({ message: 'Property use record created successfully' });
//         return
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating property use record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Read all property use records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_PropertyUse');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching property use records', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Read a single property use record by PropertyUse
// router.get('/:PropertyUse', async (req: Request, res: Response) => {
//     const { PropertyUse } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_PropertyUse WHERE PropertyUse = ?', [PropertyUse]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Property use record not found' });
//             return
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching property use record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Update a property use record
// router.put('/:PropertyUse', async (req: Request, res: Response): Promise<void> => {
//     const { PropertyUse } = req.params;
//     const propertyUseData: PropertyUseData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_PropertyUse WHERE PropertyUse = ?', [PropertyUse]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Property use record not found' });
//             return
//         }

//         // Update the property use data
//         const [result] = await connection.execute(
//             `UPDATE tb_PropertyUse 
//             SET Propertyrate = ? 
//             WHERE PropertyUse = ?`,
//             [
//                 propertyUseData.Propertyrate,
//                 PropertyUse
//             ]
//         );
     
//         res.status(200).json({ message: 'Property use record updated successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating property use record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Delete a property use record
// router.delete('/:PropertyUse', async (req: Request, res: Response) => {
//     const { PropertyUse } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_PropertyUse WHERE PropertyUse = ?', [PropertyUse]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Property use record not found' });
//             return
//         }
        
//         // Delete the property use record
//         const [result] = await connection.execute('DELETE FROM tb_PropertyUse WHERE PropertyUse = ?', [PropertyUse]);
       
//         res.status(200).json({ message: 'Property use record deleted successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting property use record', error });
//     } finally {
//         connection.end();
//     }
// });

// export default router;