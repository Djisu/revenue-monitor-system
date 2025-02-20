import express, { Router, Request, Response } from 'express';
import { Pool } from 'pg'; // Import Pool from pg instead of mysql2
import * as dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const BASE_URL = process.env.BASE_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://your-production-url.com');

console.log('Base URL:', BASE_URL);

// Get the directory name from the current module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const router: Router = express.Router();

// PostgreSQL connection pool configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: Number(process.env.DB_PORT) || 5432,
});

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer with the storage configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Function to retrieve all photos
const getAllPhotos = async (): Promise<Buffer[]> => {
    const client = await pool.connect();
    
    const sql = 'SELECT officer_no, photo FROM photos';

    try {
        const result = await client.query(sql);
        return result.rows.map(row => Buffer.from(row.photo));
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

// Function to retrieve a photo
const getPhoto = async (officer_no: string): Promise<Buffer | null> => {
    const client = await pool.connect();
    
    const sql = 'SELECT photo FROM photos WHERE officer_no = $1';

    try {
        const result = await client.query(sql, [officer_no]);

        if (result.rows.length === 0) {
            return null;
        }

        return Buffer.from(result.rows[0].photo);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

// Function to delete a photo
const deletePhoto = async (officer_no: string): Promise<any> => {
    const client = await pool.connect();
    
    const sql = 'DELETE FROM photos WHERE officer_no = $1';

    try {
        const result = await client.query(sql, [officer_no]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

// Endpoint to retrieve all photos
router.get('/retrieve', async (req: Request, res: Response) => {
    try {
        const photos = await getAllPhotos();
        res.json(photos);
    } catch (err) {
        res.status(500).json({ error: 'Error getting photos', details: err });
    }
});

// Endpoint to store a photo
router.post('/store', upload.single('photo'), async (req: Request, res: Response) => {
    try {
        const { officer_no, photo_name, photo_type } = req.body;

        if (!officer_no || !req.file) {
            console.error('Missing officer number or photo');
            return res.status(400).send('Missing officer number or photo');
        }

        const photoBuffer = req.file.buffer;

        const client = await pool.connect();

        // Check if the photo already exists for the given officer_no
        const checkQuery = 'SELECT * FROM photos WHERE officer_no = $1';
        const existingPhoto = await client.query(checkQuery, [officer_no]);

        if (existingPhoto.rows.length > 0) {
            console.log(`Photo already exists for officer_no: ${officer_no}`);
            return res.status(409).json({ message: 'Photo already exists', photoUrl: '' });
        }

        // Insert the new photo
        const insertQuery = 'INSERT INTO photos (officer_no, photo, photo_name, photo_type) VALUES ($1, $2, $3, $4)';
        await client.query(insertQuery, [officer_no, photoBuffer, photo_name, photo_type]);

        const photoUrl = `${BASE_URL}/api/photos/retrieve/${officer_no}`;
        res.status(200).json({ message: 'Photo stored successfully', photoUrl: photoUrl });
    } catch (err) {
        console.error('Error storing photo:', err);
        res.status(500).json({ error: 'Error storing photo', details: err });
    }
});

// Endpoint to retrieve a photo
router.get('/retrieve/:officer_no', async (req: Request, res: Response) => {
    const { officer_no } = req.params;

    if (!officer_no) {
        return res.status(400).json({ error: 'officer_no is required' });
    }

    try {
        const connection = await pool.connect();

        const sql = 'SELECT photo, photo_name, photo_type FROM photos WHERE officer_no = $1';

        try {
            const result = await connection.query(sql, [officer_no]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Photo not found' });
            }

            const photo = result.rows[0] as { photo: Buffer, photo_name: string, photo_type: string };

            // Set the appropriate content type
            res.setHeader('Content-Type', photo.photo_type);
            res.setHeader('Content-Disposition', `attachment; filename=${photo.photo_name}`);

            // Send the binary photo data
            res.send(photo.photo);
        } catch (err) {
            console.error('Error retrieving photo:', err);
            res.status(500).json({ error: 'Error retrieving photo', details: err });
        } finally {
            connection.release();
        }
    } catch (err) {
        res.status(500).json({ error: 'Error getting photo', details: err });
    }
});

// Endpoint to delete a photo
router.delete('/delete/:officer_no', async (req: Request, res: Response) => {
    const { officer_no } = req.params;

    if (!officer_no) {
        return res.status(400).json({ error: 'officer_no is required' });
    }

    try {
        const result = await deletePhoto(officer_no);

        if (result.rowCount > 0) { // Ensure deletion was successful
            res.status(200).json({ message: 'Photo deleted successfully', result });
        } else {
            res.status(404).json({ error: 'Photo not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error deleting photo', details: err });
    }
});

export default router;




// import express, { Router, Request, Response } from 'express';

// import mysql, { ResultSetHeader, QueryResult } from 'mysql2/promise';
// import { OkPacket } from 'mysql2'; // Import OkPacket from mysql2


// import multer from 'multer';
// import * as dotenv from 'dotenv';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Define the function parameters type
// interface StorePhotoParams {
//     officer_no: string;
//     photoBuffer: Buffer;
//     photo_name: string;
//     photo_type: string;
// }


// interface Message {
//     message: string;
// }

// type InsertResult = {
//     message: string;
//     photoUrl: string;
//     affectedRows: number;
// };

// // Load environment variables from .env file
// dotenv.config();

// const BASE_URL = process.env.BASE_URL || 
//   (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// console.log('Base URL:', BASE_URL);


// // Get the directory name from the current module URL
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadDir = path.join(__dirname, 'uploads');

// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

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


// // Set up storage for multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//     }
// });
  
// // Initialize multer with the storage configuration
// const upload = multer({ 
//     storage: storage, 
//     limits: { fileSize: 10 * 1024 * 1024 } 
// }); // 10MB limit
// //const upload = multer({ dest: uploadDir }); // Use the uploads directory



// // Function to retrieve all photos ${BASE_URL}
// const getAllPhotos = async (): Promise<Buffer[]> => {
//     const connection = await mysql.createConnection(dbConfig);
    
//     const sql = 'SELECT officer_no, photo FROM photos';

//     try {
//         const [rows] = await connection.execute(sql);

//         return rows.map((row: any) => Buffer.from(row.photo));
//     } catch (err) {
//         throw err;
//     } finally {
//         connection.end();
//     }
// };

// // Function to retrieve a photo
// const getPhoto = async (officer_no: string): Promise<Buffer | null> => {
//     console.log('in getPhoto', officer_no);

//     const connection = await mysql.createConnection(dbConfig);
    
//     const sql = 'SELECT photo FROM tb_photos WHERE officer_no = ?';

//     try {
//         const [rows] = await connection.execute(sql, [officer_no]);

//         if (rows.length === 0) {
//             return null;
//         }

//         return Buffer.from(rows[0].photo);
//     } catch (err) {
//         throw err;
//     } finally {
//         connection.end();
//     }
// };

// // Function to delete a photo
// const deletePhoto = async (officer_no: string): Promise<any> => {
//     const connection = await mysql.createConnection(dbConfig);
    
//     const sql = 'DELETE FROM tb_photos WHERE officer_no = ?';

//     try {
//         const [result] = await connection.execute(sql, [officer_no]);
//         return result;
//     } catch (err) {
//         throw err;
//     } finally {
//         connection.end();
//     }
// };

// // Endpoint to retrieve all photos
// router.get('/retrieve', async (req: Request, res: Response) => {
//     try {
//         const photos = await getAllPhotos();

//         res.json(photos);
//     } catch (err) {
//         res.status(500).json({ error: 'Error getting photos', details: err });
//     }
// });

// // Endpoint to store a photo
// router.post('/store', upload.single('photo'), async (req: Request, res: Response) => {
//     try {
//         console.log('in /store post', req.body);

//         const { officer_no, photo, photo_name, photo_type } = req.body;

//         if (!officer_no || !photo || !photo_name || !photo_type) {
//             console.error('Missing officer number, photo, photo_name, or photo_type');
//             return res.status(400).send('Missing officer number, photo, photo_name, or photo_type');
//         }

//         console.log('Officer number:', officer_no);
//         console.log('Photo name:', photo_name);

//         // Convert Base64 string to Buffer
//         const photoBuffer = Buffer.from(photo, 'base64');

//         console.log('about to check if photo already exists for officer_no:', officer_no);

//         let connection;
//         try {
//             connection = await mysql.createConnection(dbConfig);

//             // Check if the photo already exists for the given officer_no
//             const [results] = await connection.execute<OkPacket | ResultSetHeader>(
//                 'SELECT * FROM tb_photos WHERE officer_no = ?',
//                 [officer_no]
//             );

//             if (results.length > 0) {
//                 console.log(`Photo already exists for officer_no: ${officer_no}`);
//                 return res.status(409).json({ message: 'Photo already exists', photoUrl: '' });
//             }

//             // Insert the new photo
//             const [insertResult] = await connection.execute<OkPacket>(
//                 'INSERT INTO tb_photos (officer_no, photo, photo_name, photo_type) VALUES (?, ?, ?, ?)',
//                 [officer_no, photoBuffer, photo_name, photo_type]
//             );

//             const photoUrl = `${BASE_URL}/api/photos/retrieve/${officer_no}`;

//             console.log(`Successfully stored photo for officer_no: ${officer_no}`);
//             console.log('Photo URL:::::::::', photoUrl);
//             return res.status(200).json({ message: 'Photo stored successfully', photoUrl: photoUrl });
//         } catch (err) {
//             console.error('Error storing photo:', err); // Log the error details
//             return res.status(500).json({ error: 'Error storing photo', details: err });
//         } finally {
//             if (connection) {
//                 await connection.end(); // Ensure the connection is closed if it was opened
//             }
//         }
//     } catch (err) {
//         console.error('Error storing photo:', err); // Log the error details
//         res.status(500).json({ error: 'Error storing photo', details: err });
//     }
// });

// // Endpoint to retrieve a photo
// router.get('/retrieve/:officer_no', async (req: Request<{ officer_no: string }>, res: Response) => {
   
//     const { officer_no } = req.params;

//     console.log('in /retrieve/:officer_no', officer_no);

//     if (!officer_no) {
//         return res.status(400).json({ error: 'officer_no is required' });
//     }

//     try {
//         //// experiment
//         // const photo = await getPhoto(officer_no);

//         // console.log('in getPhoto', officer_no);
    
//         const connection = await mysql.createConnection(dbConfig);
        
//         const sql = 'SELECT photo, photo_name, photo_type FROM tb_photos WHERE officer_no = ?';
    
//         try {
//             const [rows] = await connection.execute(sql, [officer_no]);
    
//             if (rows.length === 0) {
//                 return res.status(404).json({ message: 'Photo not found' });
//             }
    
//             const photo = rows[0] as { photo: Buffer, photo_name: string, photo_type: string };

//             // Set the appropriate content type
//             res.setHeader('Content-Type', photo.photo_type);
//             res.setHeader('Content-Disposition', `attachment; filename=${photo.photo_name}`);

//             // Send the binary photo data
//             res.send(photo.photo);
//         } catch (err: any) {
//             console.error('Error retrieving photo:', err);
//         res.status(500).json({ error: 'Error retrieving photo', details: err });
//         } finally {
//             connection.end();
//         }
//         ///////
//     } catch (err) {
//         res.status(500).json({ error: 'Error getting photo', details: err });
//     }
// });

// // Endpoint to delete a photo
// router.delete('/delete/:officer_no', async (req: Request<{ officer_no: string }>, res: Response) => {
//     const { officer_no } = req.params;

//     if (!officer_no) {
//         return res.status(400).json({ error: 'officer_no is required' });
//     }

//     try {
//         const result = await deletePhoto(officer_no);

//         if (result.affectedRows > 0) { // Ensure deletion was successful
//             res.status(200).json({ message: 'Photo deleted successfully', result });
//         } else {
//             res.status(404).json({ error: 'Photo not found' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: 'Error deleting photo', details: err });
//     }
// });

// export default router;
