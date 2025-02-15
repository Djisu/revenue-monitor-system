// backend/src/routes/api/officerRoutes.ts
import * as dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2/promise';
import multer, { diskStorage } from 'multer';
import bodyParser from 'body-parser';
const router = express.Router();
// Load environment variables from .env file
dotenv.config();
// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
// Set up multer storage
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
// Middleware
router.use(bodyParser.json());
const upload = multer({ storage: multer.memoryStorage() });
// Custom Request type to include photo buffer if needed
// interface CustomRequest extends Request {
//     body: {
//         officer_no: string;
//         photo: Buffer;  // Assuming photo is sent as a Buffer
//     };
// }
// Create a new officer record
router.post('/create', async (req, res) => {
    const officerData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officerData.officer_no]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Officer record already exists' });
            return;
        }
        // Insert the new officer data
        const [result] = await connection.execute(`INSERT INTO tb_officer (officer_no, officer_name, photo) 
            VALUES (?, ?, ?)`, [
            officerData.officer_no,
            officerData.officer_name,
            officerData.photo,
        ]);
        res.status(201).json({ message: 'Officer record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating officer record', error });
    }
    finally {
        connection.end();
    }
});
// Update an officer record
router.put('/update/:officer_no', async (req, res) => {
    const { officer_no } = req.params;
    const officerData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officerData.officer_no]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Officer record does not exist' });
            return;
        }
        // Update the officer data
        const [result] = await connection.execute(`UPDATE tb_officer SET officer_name = ?, photo = ? 
            WHERE officer_no = ?`, [
            officerData.officer_name,
            officerData.photo,
            officer_no
        ]);
        res.status(200).json({ message: 'Officer record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating officer record', error });
    }
    finally {
        connection.end();
    }
});
// Delete an officer record
router.delete('/delete/:officer_no', async (req, res) => {
    const { officer_no } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officer_no]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Officer record does not exist' });
            return;
        }
        // Delete the officer record
        const [result] = await connection.execute('DELETE FROM tb_officer WHERE officer_no = ?', [officer_no]);
        res.status(200).json({ message: 'Officer record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer record', error });
    }
    finally {
        connection.end();
    }
});
router.get('/retrieve', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer');
        //res.status(200).json({ message: 'Officer record retrieved successfully', rows: rows });
        res.json(rows);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting officer records', error });
    }
    finally {
        connection.end();
    }
});
router.get('/retrieve/:officer_no', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT officer_no FROM tb_officer WHERE officer_no = ?', [req.params.officer_no]);
        // res.status(200).json({ message: 'Officer record retrieved successfully', rows: rows });
        // return
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting officer record', error });
    }
    finally {
        connection.end();
    }
});
router.get('/retrieve/:officer_name', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT officer_name FROM tb_officer WHERE officer_no = ?', [req.params.officer_no]);
        // res.status(200).json({ message: 'Officer record retrieved successfully', rows: rows });
        // return
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting officer record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=officerRoutes.js.map