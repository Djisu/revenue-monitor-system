import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import { Pool } from 'pg'; // Import PostgreSQL's Pool

const router = Router();

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432', 10),
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

    try {
        const result = await pool.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2', 
         [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]
        );

        if (result.rows.length > 0) {
            res.status(404).json({ message: 'BussCurrBalance record exists' });
            return;
        }

        // Insert the new BussCurrBalance data
        await pool.query(
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
        return;
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BussCurrBalance record', error });
    }
});

// Read all BussCurrBalance records
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM busscurrbalance');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BussCurrBalance records', error });
    }
});

// Read a single BussCurrBalance record by buss_no
router.get('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;

    try {
        const result = await pool.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'BussCurrBalance record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BussCurrBalance record', error });
    }
});

// Update a BussCurrBalance record
router.put('/:buss_no/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
    const { buss_no } = req.params;
    const bussCurrBalanceData: BussCurrBalanceData = req.body;

    try {
        const result = await pool.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2',
         [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'BussCurrBalance record does not exist' });
            return;
        }

        // Update the BussCurrBalance data
        await pool.query(
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
                bussCurrBalanceData.fiscalyear,
            ]
        );

        res.status(200).json({ message: 'BussCurrBalance record updated successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BussCurrBalance record', error });
    }
});

// Delete a BussCurrBalance record
router.delete('/:buss_no/:fiscalyear', async (req: Request, res: Response) => {
    const { buss_no, fiscalyear } = req.params;

    try {
        const result = await pool.query('SELECT * FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = ?', [buss_no, fiscalyear]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'BussCurrBalance record does not exist' });
            return;
        }

        // Delete the BussCurrBalance record
        await pool.query('DELETE FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2', [buss_no, fiscalyear]);

        res.status(200).json({ message: 'BussCurrBalance record deleted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BussCurrBalance record', error });
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
//         const [rows] = await connection.execute('SELECT * FROM tb_electoralarea WHERE electoral_area = ?', [electoralAreaData.electoral_area]);

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
//         connection.end();
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