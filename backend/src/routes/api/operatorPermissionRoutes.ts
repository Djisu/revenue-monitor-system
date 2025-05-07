// backend/src/routes/api/operatorRoutes.ts

import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
//import type { QueryResult } from 'pg';  // Import QueryResult as a type

import bcrypt from 'bcrypt';
//import { createClient } from '../../db.js';


const router = Router();

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432'),
});


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






// // backend/src/routes/api/operatorPermissionRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader } from 'mysql2/promise';
// import bcrypt from 'bcrypt';

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

// // OperatorPermission data interface
// interface OperatorPermissionData {
//     OperatorID: string;
//     Menus: string;
//     password: string;
// }

// // Create a new operator permission record
// router.post('/', async (req: Request, res: Response): Promise<void> => {

    
//     const operatorPermissionData: OperatorPermissionData = req.body;

//     console.log('router.post Creating new operator permission', operatorPermissionData)

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {

//         // Check if an operator permission with the same OperatorID already exists
//         let [existingPermission] = await connection.execute(
//             'SELECT * FROM operator_permission WHERE OperatorID = ?', 
//             [operatorPermissionData.OperatorID]
//         );

//         if ((existingPermission as any).length > 0) {
//             res.status(409).json({ message: 'Operator permission with this OperatorID already exists.' });
//             return;
//         }

//         // Find operator definitions password
//         const [operator] = await connection.execute(
//             'SELECT password FROM operatorpermission WHERE OperatorID = ?', 
//             [operatorPermissionData.OperatorID]
//         );

//         if ((operator as any).length == 0) {
//             res.status(404).json({ message: 'Operator definition with this OperatorID does not exist.' });
//             return;
//         }

//         const hashedPassword = (operator as any)[0].password;

//         // Insert the new operator permission data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO operator_permission (OperatorID, Menus, password) 
//             VALUES (?, ?, ?)`,
//             [
//                 operatorPermissionData.OperatorID,
//                 operatorPermissionData.Menus,
//                 hashedPassword,
//             ]
//         );

//         res.status(201).json({ message: 'Operator permission created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating operator permission', error });
//     } finally {
//         connection.release();
//     }
// });

// // Read all operator permissions
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM operator_permission');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching operator permissions', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read a single operator permission by OperatorID
// router.get('/:OperatorID', async (req: Request, res: Response) => {
//     const { OperatorID } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM operator_permission WHERE OperatorID = ?', [OperatorID]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.json(rows[0]); // Return the first row
//         } else {
//             res.status(404).json({ message: 'Operator permission not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching operator permission', error });
//     } finally {
//         connection.end();
//     }
// });

// // Update an operator permission record
// router.put('/:OperatorID', async (req: Request, res: Response): Promise<void> => {
//     const { OperatorID } = req.params;
//     const operatorPermissionData: OperatorPermissionData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Check if an operator permission with the same OperatorID exists
//         let [existingPermission] = await connection.execute(
//             'SELECT * FROM operator_permission WHERE OperatorID = ?', 
//             [OperatorID]
//         );

//         if ((existingPermission as any).length == 0) {
//             res.status(404).json({ message: 'Operator permission with this OperatorID does not exist.' });
//             return;
//         }

//         const [result] = await connection.execute(
//             `UPDATE operator_permission SET Menus = ?, Reports = ?, databasesx = ?, password = ? 
//             WHERE OperatorID = ?`,
//             [
//                 operatorPermissionData.Menus,
//                 operatorPermissionData.password,
//                 OperatorID
//             ]
//         );

//         res.status(200).json({ message: 'Operator permission updated successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating operator permission', error });
//     } finally {
//         connection.end();
//     }
// });

// // Delete an operator permission record
// router.delete('/:OperatorID', async (req: Request, res: Response) => {
//     const { OperatorID } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         // Check if an operator permission with the same OperatorID exists
//         let [existingPermission] = await connection.execute(
//             'SELECT * FROM operator_permission WHERE OperatorID = ?', 
//             [OperatorID]
//         );

//         if ((existingPermission as any).length == 0) {
//             res.status(404).json({ message: 'Operator permission with this OperatorID does not exist.' });
//             return;
//         }
        
//         await connection.execute('DELETE FROM operator_permission WHERE OperatorID = ?', [OperatorID]);
       
//         res.status(200).json({ message: 'Operator permission deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting operator permission', error });
//     } finally {
//         connection.end();
//     }
// });

// export default router;