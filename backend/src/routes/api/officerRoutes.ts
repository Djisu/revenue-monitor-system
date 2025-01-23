// backend/src/routes/api/officerRoutes.ts
import * as dotenv from 'dotenv';
import express, { Router, Request, Response } from 'express';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import multer, { diskStorage, StorageEngine } from 'multer';
import bodyParser from 'body-parser';

const router: Router = express.Router();

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
const storage: StorageEngine = diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
        cb(null, 'uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
        cb(null, file.originalname);
    },
});


// Officer data interface
interface OfficerData {
    officer_no: string;
    officer_name: string;
    photo: string; // Assuming photo is a URL or base64 string
}

// Extend the Request interface to include the file property
interface CustomRequest extends Request {
    file?: Express.Multer.File; // Adding the file property
}


// Create a new officer record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    const officerData: OfficerData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officerData.officer_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Officer record already exists' });
            return;
        }

        // Insert the new officer data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_officer (officer_no, officer_name, photo) 
            VALUES (?, ?, ?)`,
            [
                officerData.officer_no,
                officerData.officer_name,
                officerData.photo,
            ]
        );

        res.status(201).json({ message: 'Officer record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating officer record', error });
    } finally {
        connection.end();
    }
});

// Read all officer records
router.get('/all', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer records', error });
    } finally {
        connection.end();
    }
});

// Read a single officer record by officer_no
router.get('/:officer_no', async (req: Request, res: Response) => {
    const { officer_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officer_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Officer record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer record', error });
    } finally {
        connection.end();
    }
});

// Update an officer record
router.put('/update/:officer_no', async (req: Request, res: Response): Promise<void> => {
    const { officer_no } = req.params;
    const officerData: OfficerData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_officer WHERE officer_no = ?', [officerData.officer_no]);

        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Officer record does not exist' });
            return;
        }
        // Update the officer data
        const [result] = await connection.execute(
            `UPDATE tb_officer SET officer_name = ?, photo = ? 
            WHERE officer_no = ?`,
            [
                officerData.officer_name,
                officerData.photo,
                officer_no
            ]
        );
      
        res.status(200).json({ message: 'Officer record updated successfully' });
       return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating officer record', error });
    } finally {
        connection.end();
    }
});

// Delete an officer record
router.delete('/delete/:officer_no', async (req: Request, res: Response) => {
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
      return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer record', error });
    } finally {
        connection.end();
    }
});

// Middleware
router.use(bodyParser.json());
const upload = multer({ storage: multer.memoryStorage() });

// Custom Request type to include photo buffer if needed
interface CustomRequest extends Request {
    body: {
        officer_no: string;
        photo: Buffer;  // Assuming photo is sent as a Buffer
    };
}

// Endpoint to store a photo
router.post('/photos', async (req: CustomRequest, res: Response) => {
    const { officer_no, photo } = req.body;

    if (!officer_no || !photo) {
        return res.status(400).json({ error: 'officer_no and photo are required' });
    }

    try {
        const result = await storePhoto(officer_no, photo);
        res.status(201).json({ message: 'Photo stored successfully', result });
    } catch (err) {
        res.status(500).json({ error: 'Error storing photo', details: err });
    }
});

// Endpoint to retrieve a photo
router.get('/photos/:officer_no', async (req: Request<{ officer_no: string }>, res: Response) => {
    const { officer_no } = req.params;

    if (!officer_no) {
        return res.status(400).json({ error: 'officer_no is required' });
    }

    try {
        const photo = await getPhoto(officer_no);
        if (photo) {
            res.type('image/jpeg').send(photo); // Set appropriate content type
        } else {
            res.status(404).json({ error: 'Photo not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error getting photo', details: err });
    }
});

// Endpoint to delete a photo
router.delete('/photos/:officer_no', async (req: Request<{ officer_no: string }>, res: Response) => {
    const { officer_no } = req.params;

    if (!officer_no) {
        return res.status(400).json({ error: 'officer_no is required' });
    }

    try {
        const result = await deletePhoto(officer_no);
        if (result.affectedRows > 0) { // Ensure deletion was successful
            res.status(200).json({ message: 'Photo deleted successfully', result });
        } else {
            res.status(404).json({ error: 'Photo not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error deleting photo', details: err });
    }
});
// Error hand

// Function to store a photo
export const storePhoto = async ( officer_no: string, photo: Buffer): Promise<any> => {
    const connection = await mysql.createConnection(dbConfig);
    
    const sql = 'INSERT INTO photos (officer_no, photo) VALUES (?, ?)';
    try {
        const [result] = await connection.execute(sql, [officer_no, photo]);
        return result;
    } catch (err) {
        throw err;
    }
};


// Function to retrieve a photo
export const getPhoto = async ( officer_no: string): Promise<Buffer | null> => {
    const connection = await mysql.createConnection(dbConfig);
    
    const sql = 'SELECT photo FROM photos WHERE officer_no = ?';
    try {
        const [rows] = await connection.execute(sql, [officer_no]);
        return rows.length > 0 ? rows[0].photo : null;
    } catch (err) {
        throw err;
    }
};

// Function to delete a photo
export const deletePhoto = async ( officer_no: string): Promise<any> => {
    const connection = await mysql.createConnection(dbConfig);
    
    const sql = 'DELETE FROM photos WHERE officer_no = ?';
    try {
        const [result] = await connection.execute(sql, [officer_no]);
        return result;
    } catch (err) {
        throw err;
    }
};



export default router;