// backend/src/routes/api/gradeRateRoutes.ts

import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import pkg from 'pg';

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



// GradeRate data interface
interface GradeRateData {
    grade: string;
    minValue: number;
    maxValue: number;
    rate: number;
}

// Create a new GradeRate record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    const gradeRateData: GradeRateData = req.body;
    const client = await pool.connect()


    console.log('in router.post /create GradeRate data:', gradeRateData);

    // Validate request values
    if (!gradeRateData.grade || !gradeRateData.minValue || !gradeRateData.maxValue || !gradeRateData.rate) {
        res.status(400).json({ message: 'GradeRate data is missing' });
        return;
    }

    try {
        const { rows } = await client.query(
            'SELECT * FROM graderate WHERE grade = $1 AND minValuex = $2 AND maxValuex = $3', 
            [gradeRateData.grade, gradeRateData.minValue, gradeRateData.maxValue]
        );

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ success: true, message: 'GradeRate record already exists', rate: 0 });
            return;
        }

        // Insert the new GradeRate data
        await client.query(
            `INSERT INTO graderate (grade, minValuex, maxValuex, rate) 
            VALUES ($1, $2, $3, $4)`,
            [
                gradeRateData.grade,
                gradeRateData.minValue,
                gradeRateData.maxValue,
                gradeRateData.rate,
            ]
        );

        res.status(200).json({ success: true, message: 'GradeRate record created successfully', rate: gradeRateData.rate });
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating grade rate record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error creating grade rate record', error });
        }       
    }finally{
        client.release()
    }
});

// Read all GradeRate records
router.get('/all', async (req: Request, res: Response) => {
    const client = await pool.connect()

    try {
        const { rows } = await client.query('SELECT * FROM graderate');
        res.status(200).json({ success: true, data: rows });
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error fetching grade rate record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error fetching grade rate record', error });
        }
        
    }finally{
        client.release()
    }
});

// Read a single GradeRate record by grade
router.get('/:grade/:minValuex/:maxValuex', async (req: Request, res: Response) => {
    const { grade, minValuex, maxValuex } = req.params;
    const client = await pool.connect()


    try {
        const { rows } = await client.query('SELECT * FROM graderate WHERE grade = $1 AND minValuex = $2 AND maxValuex = $3', 
        [grade, minValuex, maxValuex]);

        if (Array.isArray(rows) && rows.length === 0) {
            res.status(404).json({ success: false, message: 'GradeRate record not found' });
        } else {
            res.status(200).json({ success: true, data: rows[0] });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error fetching grade rate record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error fetching grade rate record', error });
        }
        
    }finally{
        client.release()
    }
});

// Update a GradeRate record
router.put('/:grade/:minValuex/:maxValuex', async (req: Request, res: Response): Promise<void> => {
    const { grade, minValuex, maxValuex } = req.params;
    const gradeRateData: GradeRateData = req.body;
    const client = await pool.connect()

    try {
        const { rows } = await client.query('SELECT * FROM graderate WHERE grade = $1 AND minValuex = $2 AND maxValuex = $3', 
        [grade, minValuex, maxValuex]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(400).json({ message: 'GradeRate record does not exist' });
            return;
        }
        
        // Update the GradeRate data
        await client.query(
            `UPDATE graderate SET rate = $1 
            WHERE grade = $2 AND minValuex = $3 AND maxValuex = $4`,
            [
                gradeRateData.rate,
                grade,
                minValuex,
                maxValuex
            ]
        );

        res.status(200).json({ message: 'GradeRate record updated successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error updating grade rate record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error updating grade rate record', error });
        }
        
    }finally{
        client.release()
    }
});

// Delete a GradeRate record
router.delete('/delete/:grade/:minValuex/:maxValuex', async (req: Request, res: Response) => {
    const { grade, minValuex, maxValuex } = req.params;
    const client = await pool.connect()

    try {
        const { rows } = await client.query('SELECT * FROM graderate WHERE grade = $1 AND minValuex = $2 AND maxValuex = $3', 
        [grade, minValuex, maxValuex]);

        if (Array.isArray(rows) && rows.length === 0) {
            res.status(400).json({ message: 'GradeRate record does not exist' });
            return;
        }
        
        // Delete the GradeRate record
        await pool.query('DELETE FROM graderate WHERE grade = $1 AND minValuex = $2 AND maxValuex = $3', [grade, minValuex, maxValuex]);
       
        res.status(200).json({ message: 'GradeRate record deleted successfully' });
      
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error deleting record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error deleting record', error });
        }
        
    }finally{
        client.release()
    }
});

export default router;






// // backend/src/routes/api/gradeRateRoutes.ts
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

// // GradeRate data interface
// interface GradeRateData {
//     grade: string;
//     minValue: number;
//     maxValue: number;
//     rate: number;
// }

// // Create a new GradeRate record
// router.post('/create', async (req: Request, res: Response): Promise<void> => {
//     const gradeRateData: GradeRateData = req.body;

//     console.log('in router.post /create GradeRate data:', gradeRateData);
//     console.log('gradeRateData.grade: ', gradeRateData.grade);
//     console.log('gradeRateData.minValue: ', gradeRateData.minValue);
//     console.log('gradeRateData.maxValue: ', gradeRateData.maxValue);
//     console.log('gradeRateData.rate: ', gradeRateData.rate);

//     // Validate request values
//     if (!gradeRateData.grade || !gradeRateData.minValue || !gradeRateData.maxValue || !gradeRateData.rate) {
//         res.status(400).json({ message: 'GradeRate data is missing' });
//         return;
//     }

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         const [rows] = await connection.execute(
//             'SELECT * FROM graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', 
//             [gradeRateData.grade, gradeRateData.minValue, gradeRateData.maxValue]
//         );

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ success: true,  message: 'GradeRate record already exists', rate: 0 });
//             return;
//         }

//         // Insert the new GradeRate data <ResultSetHeader>
//         const [result] = await connection.execute(
//             `INSERT INTO graderate (grade, minValuex, maxValuex, rate) 
//             VALUES (?, ?, ?, ?)`,
//             [
//                 gradeRateData.grade,
//                 gradeRateData.minValue,
//                 gradeRateData.maxValue,
//                 gradeRateData.rate,
//             ]
//         );

//         console.log('after INSERT result:', result);
        
//         res.status(200).json({ success: true, message: 'GradeRate record created successfully', rate: gradeRateData.rate });
//     } catch (error: any) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating GradeRate record', error: error.message });
//     } finally {
//         await connection.end(); // Ensure the connection is ended properly
//     }
// });


// // Read all GradeRate records
// router.get('/all', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM graderate');
//         res.status(200).json({ success: true, data: rows });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching GradeRate records', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read a single GradeRate record by grade
// router.get('/:grade/:minValuex/:maxValuex', async (req: Request, res: Response) => {
//     const { grade, minValuex, maxValuex } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', 
//         [grade, minValuex, maxValuex]);

//         if (Array.isArray(rows) && rows.length === 0) {
//             res.status(404).json({  success: false, message: 'GradeRate record not found' });
//         } else {
//             res.status(200).json({ success: true, data: rows[0] });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching GradeRate record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Update a GradeRate record
// router.put('/:grade/:minValuex/:maxValuex', async (req: Request, res: Response): Promise<void> => {
//     const { grade, minValuex, maxValuex, rate } = req.params;
//     const gradeRateData: GradeRateData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [row] = await connection.execute('SELECT * FROM graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', 
//         [grade, minValuex, maxValuex]);

//         if (Array.isArray(row) && row.length == 0) {
//             res.status(400).json({ message: 'GradeRate record does not exist' });
//             return;
//         }
//         // Update the GradeRate data
//         const [result] = await connection.execute(
//             `UPDATE graderate SET rate = ? 
//             WHERE grade = ? AND minValuex = ? AND maxValuex = ?`,
//             [
//                 gradeRateData.rate,
//                 gradeRateData.grade,
//                 gradeRateData.minValue,
//                 gradeRateData.maxValue
//             ]
//         );

//         res.status(200).json({ message: 'GradeRate record updated successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating GradeRate record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Delete a GradeRate record
// router.delete('/delete/:grade/:minValuex/:maxValuex', async (req: Request, res: Response) => {
//     const { grade, minValuex, maxValuex } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [row] = await connection.execute('SELECT * FROM graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', 
//         [grade, minValuex, maxValuex]);

//         if (Array.isArray(row) && row.length === 0) {
//             res.status(400).json({ message: 'GradeRate record does not exist' });
//             return;
//         }
//         // Delete the GradeRate record
//         const [result] = await connection.execute('DELETE FROM graderate WHERE grade = ?', [grade]);
       
//         res.status(200).json({ message: 'GradeRate record deleted successfully' });
      
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting GradeRate record', error });
//     } finally {
//         connection.end();
//     }
// });

// export default router;










// // // backend/src/routes/api/gradeRateRoutes.ts
// // import express from 'express';
// // import * as dotenv from 'dotenv';
// // import { Router, Request, Response } from 'express';
// // import mysql, { ResultSetHeader } from 'mysql2/promise';

// // const router = Router();

// // // Load environment variables from .env file
// // dotenv.config();

// // // MySQL connection configuration
// // const dbConfig = {
// //     host: process.env.DB_HOST || 'localhost',
// //     user: process.env.DB_USER || 'root',
// //     password: process.env.DB_PASSWORD || '',
// //     database: process.env.DB_NAME || 'revmonitor',
// // };

// // // GradeRate data interface
// // interface GradeRateData {
// //     grade: string;
// //     minValue: number;
// //     maxValue: number;
// //     rate: number;
// // }

// // // Create a new GradeRate record
// // router.post('/create', async (req: Request, res: Response): Promise<void> => {
// //     const gradeRateData: GradeRateData = req.body;

// //     console.log('in router.post /create GradeRate data:', gradeRateData);
// //     console.log('gradeRateData.grade: ', gradeRateData.grade);
// //     console.log('gradeRateData.minValue: ', gradeRateData.minValue);
// //     console.log('gradeRateData.maxValue: ', gradeRateData.maxValue);
// //     console.log('gradeRateData.rate: ', gradeRateData.rate);

// //     // Validate request values
// //     if (!gradeRateData.grade || !gradeRateData.minValue || !gradeRateData.maxValue || !gradeRateData.rate) {
// //         res.status(400).json({ message: 'GradeRate data is missing' });
// //         return;
// //     }

// //     const connection = await mysql.createConnection(dbConfig);
    
// //     try {
// //         const [rows] = await connection.execute(
// //             'SELECT * FROM tb_graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', 
// //             [gradeRateData.grade, gradeRateData.minValue, gradeRateData.maxValue]
// //         );

// //         if (Array.isArray(rows) && rows.length > 0) {
// //             res.status(409).json({ success: true,  message: 'GradeRate record already exists', rate: 0 });
// //             return;
// //         }

// //         // Insert the new GradeRate data <ResultSetHeader>
// //         const [result] = await connection.execute(
// //             `INSERT INTO tb_graderate (grade, minValuex, maxValuex, rate) 
// //             VALUES (?, ?, ?, ?)`,
// //             [
// //                 gradeRateData.grade,
// //                 gradeRateData.minValue,
// //                 gradeRateData.maxValue,
// //                 gradeRateData.rate,
// //             ]
// //         );

// //         console.log('after INSERT result:', result);
        
// //         res.status(200).json({ success: true, message: 'GradeRate record created successfully', rate: gradeRateData.rate });
// //     } catch (error: any) {
// //         console.error('Error:', error);
// //         res.status(500).json({ message: 'Error creating GradeRate record', error: error.message });
// //     } finally {
// //         await connection.end(); // Ensure the connection is ended properly
// //     }
// // });


// // // Read all GradeRate records
// // router.get('/all', async (req: Request, res: Response) => {
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_graderate');
// //         res.status(200).json({ success: true, data: rows });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error fetching GradeRate records', error });
// //     } finally {
// //         connection.end();
// //     }
// // });

// // // Read a single GradeRate record by grade
// // router.get('/:grade/:minValuex/:maxValuex', async (req: Request, res: Response) => {
// //     const { grade, minValuex, maxValuex } = req.params;

// //     const connection = await mysql.createConnection(dbConfig);

// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', 
// //         [grade, minValuex, maxValuex]);

// //         if (Array.isArray(rows) && rows.length === 0) {
// //             res.status(404).json({  success: false, message: 'GradeRate record not found' });
// //         } else {
// //             res.status(200).json({ success: true, data: rows[0] });
// //         }
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error fetching GradeRate record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });

// // // Update a GradeRate record
// // router.put('/:grade/:minValuex/:maxValuex', async (req: Request, res: Response): Promise<void> => {
// //     const { grade, minValuex, maxValuex, rate } = req.params;
// //     const gradeRateData: GradeRateData = req.body;

// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [row] = await connection.execute('SELECT * FROM tb_graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', 
// //         [grade, minValuex, maxValuex]);

// //         if (Array.isArray(row) && row.length == 0) {
// //             res.status(400).json({ message: 'GradeRate record does not exist' });
// //             return;
// //         }
// //         // Update the GradeRate data
// //         const [result] = await connection.execute(
// //             `UPDATE tb_graderate SET rate = ? 
// //             WHERE grade = ? AND minValuex = ? AND maxValuex = ?`,
// //             [
// //                 gradeRateData.rate,
// //                 gradeRateData.grade,
// //                 gradeRateData.minValue,
// //                 gradeRateData.maxValue
// //             ]
// //         );

// //         res.status(200).json({ message: 'GradeRate record updated successfully' });
// //        return
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error updating GradeRate record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });

// // // Delete a GradeRate record
// // router.delete('/delete/:grade/:minValuex/:maxValuex', async (req: Request, res: Response) => {
// //     const { grade, minValuex, maxValuex } = req.params;

// //     const connection = await mysql.createConnection(dbConfig);

// //     try {
// //         const [row] = await connection.execute('SELECT * FROM tb_graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', 
// //         [grade, minValuex, maxValuex]);

// //         if (Array.isArray(row) && row.length === 0) {
// //             res.status(400).json({ message: 'GradeRate record does not exist' });
// //             return;
// //         }
// //         // Delete the GradeRate record
// //         const [result] = await connection.execute('DELETE FROM tb_graderate WHERE grade = ?', [grade]);
       
// //         res.status(200).json({ message: 'GradeRate record deleted successfully' });
      
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error deleting GradeRate record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });

// // export default router;