import * as dotenv from 'dotenv';
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import multer from 'multer';
const router = express.Router();
// Load environment variables from .env file
dotenv.config();
// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432'), // Default PostgreSQL port
});
// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Middleware
router.use(express.json());
// Create a new officer record
router.post('/create', upload.single('photo'), async (req, res) => {
    const officerData = req.body;
    let client = null;
    try {
        client = await pool.connect();
        const existingOfficer = (await client.query('SELECT * FROM officer WHERE officer_no = $1', [officerData.officer_no])).rows;
        if (existingOfficer.length > 0) {
            res.status(409).json({ message: 'Officer record already exists' });
            return;
        }
        // Insert the new officer data
        await client.query(`INSERT INTO officer (officer_no, officer_name, photo) 
            VALUES ($1, $2, $3)`, [
            officerData.officer_no,
            officerData.officer_name,
            officerData.photo,
        ]);
        // Insert the photo data if it exists
        // if (req.file) {
        //     await client.query('INSERT INTO photos (officer_no, photo_name, photo_type, photo_buffer) VALUES ($1, $2, $3, $4)',
        //     [
        //         officerData.officer_no,
        //         req.file.originalname,
        //         req.file.mimetype,
        //         req.file.buffer
        //     ]);
        // }
        res.status(201).json({ message: 'Officer record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating officer record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Update an officer record
router.put('/update/:officer_no', upload.single('photo'), async (req, res) => {
    const { officer_no } = req.params;
    const officerData = req.body;
    let client = null;
    try {
        client = await pool.connect();
        const existingOfficer = (await client.query('SELECT * FROM officer WHERE officer_no = $1', [officer_no])).rows;
        if (existingOfficer.length == 0) {
            res.status(409).json({ message: 'Officer record does not exist' });
            return;
        }
        // Update the officer data
        await client.query(`UPDATE officer SET officer_name = $1, photo = $2 
            WHERE officer_no = $3`, [
            officerData.officer_name,
            officerData.photo,
            officer_no
        ]);
        res.status(200).json({ message: 'Officer record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating officer record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Delete an officer record
router.delete('/delete/:officer_no', async (req, res) => {
    const { officer_no } = req.params;
    let client = null;
    try {
        client = await pool.connect();
        const existingOfficer = (await client.query('SELECT * FROM officer WHERE officer_no = $1', [officer_no])).rows;
        if (existingOfficer.length == 0) {
            res.status(409).json({ message: 'Officer record does not exist' });
            return;
        }
        // Delete the officer record
        await client.query('DELETE FROM officer WHERE officer_no = $1', [officer_no]);
        console.log('About to delete photo as well');
        // Delete photo also
        await client.query('DELETE FROM photos WHERE officer_no = $1', [officer_no]);
        res.status(200).json({ message: 'Officer record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Read all officer records
router.get('/all', async (req, res) => {
    console.log('router.get(/all XXXXXXXXX');
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query(`
            SELECT o.*, p.photo_buffer, p.photo_name, p.photo_type 
            FROM officer o
            LEFT JOIN photos p ON o.officer_no = p.officer_no::int
        `);
        const officers = result.rows.map(row => {
            const photoBuffer = row.photo_buffer ? Buffer.from(row.photo_buffer) : null;
            const photoBlob = photoBuffer ? new Blob([photoBuffer], { type: row.photo_type }) : null; // Convert Buffer to Blob
            return {
                ...row,
                photo: photoBlob, // Blob object
                photoUrl: photoBlob ? URL.createObjectURL(photoBlob) : null // Create Blob URL
            };
        });
        console.log('Fetched officers:');
        res.status(200).json(officers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting officer records', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Read a single officer record by officer_no
router.get('/retrieve/:officer_no', async (req, res) => {
    const { officer_no } = req.params;
    console.log('in router.get(/retrieve/:officer_no: ', officer_no);
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM officer WHERE officer_no = $1', [officer_no]);
        if (result.rows.length == 0) {
            res.status(404).json({ message: 'Officer record not found' });
            return;
        }
        const photo = result.rows[0];
        const photoBuffer = photo.photo_buffer;
        // Set the appropriate content type
        res.setHeader('Content-Type', photo.photo_type);
        res.setHeader('Content-Disposition', `attachment; filename=${photo.photo_name}`);
        // Send the binary photo data
        res.send(photoBuffer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting officer record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Read a single officer record by officer_name
router.get('/retrieveByName/:officer_name', async (req, res) => {
    const { officer_name } = req.params;
    let client = null;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT * FROM officer WHERE officer_name = $1', [officer_name]);
        if (result.rows.length == 0) {
            res.status(404).json({ message: 'Officer record not found' });
            return;
        }
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting officer record', error });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
export default router;
// // backend/src/routes/api/officerRoutes.ts
// import * as dotenv from 'dotenv';
// import express, { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader } from 'mysql2/promise';
// import multer, { diskStorage, StorageEngine } from 'multer';
// import bodyParser from 'body-parser';
// const router: Router = express.Router();
// // Load environment variables from .env file
// dotenv.config();
// // MySQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
// };
// // Set up multer storage
// const storage: StorageEngine = diskStorage({
//     destination: (req: Request, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req: Request, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
//         cb(null, file.originalname);
//     },
// });
// // Officer data interface
// interface OfficerData {
//     officer_no: string;
//     officer_name: string;
//     photo: string; // Assuming photo is a URL or base64 string
// }
// // Extend the Request interface to include the file property
// interface CustomRequest extends Request {
//     file?: Express.Multer.File; // Adding the file property
// }
// // Middleware
// router.use(bodyParser.json());
// const upload = multer({ storage: multer.memoryStorage() });
// // Custom Request type to include photo buffer if needed
// // interface CustomRequest extends Request {
// //     body: {
// //         officer_no: string;
// //         photo: Buffer;  // Assuming photo is sent as a Buffer
// //     };
// // }
// // Create a new officer record
// router.post('/create', async (req: Request, res: Response): Promise<void> => {
//     const officerData: OfficerData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM officer WHERE officer_no = ?', [officerData.officer_no]);
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ message: 'Officer record already exists' });
//             return;
//         }
//         // Insert the new officer data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_officer (officer_no, officer_name, photo) 
//             VALUES (?, ?, ?)`,
//             [
//                 officerData.officer_no,
//                 officerData.officer_name,
//                 officerData.photo,
//             ]
//         );
//         res.status(201).json({ message: 'Officer record created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating officer record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Update an officer record
// router.put('/update/:officer_no', async (req: Request, res: Response): Promise<void> => {
//     const { officer_no } = req.params;
//     const officerData: OfficerData = req.body;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officerData.officer_no]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(409).json({ message: 'Officer record does not exist' });
//             return;
//         }
//         // Update the officer data
//         const [result] = await connection.execute(
//             `UPDATE tb_officer SET officer_name = ?, photo = ? 
//             WHERE officer_no = ?`,
//             [
//                 officerData.officer_name,
//                 officerData.photo,
//                 officer_no
//             ]
//         );
//         res.status(200).json({ message: 'Officer record updated successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating officer record', error });
//     } finally {
//         connection.end();
//     }
// });
// // Delete an officer record
// router.delete('/delete/:officer_no', async (req: Request, res: Response) => {
//     const { officer_no } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officer_no]);
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(409).json({ message: 'Officer record does not exist' });
//             return;
//         }
//         // Delete the officer record
//         const [result] = await connection.execute('DELETE FROM tb_officer WHERE officer_no = ?', [officer_no]);
//       res.status(200).json({ message: 'Officer record deleted successfully' });
//       return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting officer record', error });
//     } finally {
//         connection.end();
//     }
// });
// router.get('/retrieve', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_officer');
//        //res.status(200).json({ message: 'Officer record retrieved successfully', rows: rows });
//        res.json(rows);
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error getting officer records', error });
//     } finally {
//         connection.end();
//     }
// });
// router.get('/retrieve/:officer_no', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT officer_no FROM tb_officer WHERE officer_no = ?', [req.params.officer_no]);
//         // res.status(200).json({ message: 'Officer record retrieved successfully', rows: rows });
//         // return
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error getting officer record', error });
//     } finally {
//         connection.end();
//     }
// });
// router.get('/retrieve/:officer_name', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT officer_name FROM tb_officer WHERE officer_no = ?', [req.params.officer_no]);
//         // res.status(200).json({ message: 'Officer record retrieved successfully', rows: rows });
//         // return
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error getting officer record', error });
//     } finally {
//         connection.end();
//     }
// });
// export default router;
//# sourceMappingURL=officerRoutes.js.map