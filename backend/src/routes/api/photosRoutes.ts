import express, { Router, Request, Response } from 'express';

import pg, { QueryResult } from 'pg'
const { Pool } = pg
import multer, { diskStorage, StorageEngine } from 'multer';

import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
//import { createClient } from '../../db.js';

// type DestinationCallback = (error: Error | null, destination: string) => void
// type FileNameCallback = (error: Error | null, filename: string) => void

// Define the function parameters type
interface StorePhotoParams {
    officer_no: string;
    photoBuffer: Buffer;
    photo_name: string;
    photo_type: string;
}

interface Message {
    message: string;
}

type InsertResult = {
    message: string;
    photoUrl: string;
    affectedRows: number;
};

interface PhotoRow {
    officer_no: string;
    photo: Uint8Array; // or Buffer, depending on the client's return type
}

// Load environment variables from .env file
dotenv.config();

const BASE_URL = process.env.BASE_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'revenue-monitor-system.onrender.com');

console.log('Base URL:', BASE_URL);

const nodeEnv = process.env.NODE_ENV;

let frontendUrl = "" // Set frontend URL based on node environment

if (nodeEnv === 'development'){
    frontendUrl = "http://localhost:5173";
} else if (nodeEnv === 'production'){
    frontendUrl = "https://revenue-monitor-system.onrender.com";
} else if (nodeEnv === 'test'){
    console.log('Just testing')
} else {
    console.log('Invalid node environment variable') //.slice()
}

// Get the directory name from the current module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const router: Router = express.Router();

// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: 5432,
});

// Set up multer storage
const storage: StorageEngine = diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: any, destination: string) => void) => {
        cb(null, 'uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: any, filename: string) => void) => {
        cb(null, file.originalname);
    },
});

// Initialize multer with storage and file size limit
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});


// // Set up storage for multer
// const storage = multer.diskStorage({
//     destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
//       cb(null, 'uploads/');
//     },
//     filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     }
//   });

  

// // Initialize multer with the storage configuration
// const upload = multer({ 
//     storage: storage, 
//     limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
// });

// Function to retrieve all photos
const getAllPhotos = async (): Promise<Buffer[]> => {
    
const client = await pool.connect()

    const sql = 'SELECT officer_no, photo FROM photos';

    try {
        const result = await client.query<PhotoRow>(sql);
        return result.rows.map(row => Buffer.from(row.photo));
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

// Function to retrieve a photo
const getPhoto = async (officer_no: string): Promise<Buffer | null> => {
    
const client = await pool.connect()

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
    
const client = await pool.connect()

    const sql = 'DELETE FROM photos WHERE officer_no = $1 RETURNING *';

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
router.post('/store', upload.single('photo'), async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('in /store post');

        const { officer_no, photo, photo_name, photo_type } = req.body;

        if (!officer_no || !photo || !photo_name || !photo_type) {
            console.error('Missing officer number, photo, photo_name, or photo_type');
            res.status(400).send('Missing officer number, photo, photo_name, or photo_type');
            return 
        }

        // console.log('Officer number:', officer_no);
        // console.log('Photo name:', photo_name);

        // Convert Base64 string to Buffer
        const photoBuffer = Buffer.from(photo, 'base64');

        console.log('about to check if photo already exists for officer_no:', officer_no);

        
        const client = await pool.connect()

        try {
            // Check if the photo already exists for the given officer_no and photo_name
            const result = await client.query('SELECT * FROM photos WHERE officer_no = $1',
                 [officer_no]
            );
           

            if (result.rows.length > 0) {
                // update photo with the same officer_no
                const updateQuery = 'UPDATE photos SET photo_buffer = $1 WHERE officer_no = $2';
                await client.query(updateQuery, [photoBuffer, officer_no]);
                console.log(`Photo updated for officer_no: ${officer_no}`);

                const photoUrl = `${BASE_URL}/api/photos/retrieve/${officer_no}`;   
                 res.status(200).json({ message: 'Photo updated successfully', photoUrl: photoUrl });
                return
            }

            // Insert the new photo
            await client.query(
                'INSERT INTO photos (officer_no, photo_name,  photo_type, photo_buffer) VALUES ($1, $2, $3, $4)',
                [officer_no, photo_name, photo_type, photoBuffer]
            );

            const photoUrl = `${BASE_URL}/api/photos/retrieve/${officer_no}`;

            console.log(`Successfully stored photo for officer_no: ${officer_no}`);

            console.log('Photo URL:', photoUrl);

             res.status(200).json({ message: 'Photo stored successfully', photoUrl: photoUrl });
            return
        } catch (err) {
            console.error('Error storing photo:', err);
             res.status(500).json({ error: 'Error storing photo', details: err });
            return
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error storing photo:', err);
        res.status(500).json({ error: 'Error storing photo', details: err });
    }
});

// Endpoint to retrieve a photo
router.get('/retrieve/:officer_no', async (req: Request<{ officer_no: string }>, res: Response): Promise<void> => {
    const { officer_no } = req.params;

    console.log('in router.get(/retrieve/:officer_no', officer_no);

    if (!officer_no) {
         res.status(400).json({ error: 'officer_no is required' });
        return
    }

    try {
        
const client = await pool.connect()

        const sql = 'SELECT photo_buffer, photo_name, photo_type FROM photos WHERE officer_no = $1';

        try {
            const result = await client.query(sql, [officer_no]);

            if (result.rows.length === 0) {
                 res.status(404).json({ message: 'Photo not found' });
                return
            }

            const photo = result.rows[0] as { photo_buffer: Buffer, photo_name: string, photo_type: string };

            // Set the appropriate content type
            res.setHeader('Content-Type', photo.photo_type);
            res.setHeader('Content-Disposition', `attachment; filename=${photo.photo_name}`);

            console.log('Sending photo to client: ', photo.photo_buffer);

            // Send the binary photo data
            res.send(photo.photo_buffer);
        } catch (err) {
            console.error('Error retrieving photo:', err);
            res.status(500).json({ error: 'Error retrieving photo', details: err });
            return
        } finally {
            client.release();
        }
    } catch (err) {
        res.status(500).json({ error: 'Error getting photo', details: err });
    }
});

// Endpoint to delete a photo
router.delete('/delete/:officer_no', async (req: Request<{ officer_no: string }>, res: Response): Promise<void> => {
    const { officer_no } = req.params;

    if (!officer_no) {
         res.status(400).json({ error: 'officer_no is required' });
        return
    }

    try {
        const result = await deletePhoto(officer_no);

        if (result.rowCount > 0) { // Ensure deletion was successful
            res.status(200).json({ message: 'Photo deleted successfully', result });
            return
        } else {
            res.status(404).json({ error: 'Photo not found' });
            return
        }
    } catch (err) {
        res.status(500).json({ error: 'Error deleting photo', details: err });
        return
    }
});

export default router;






// import express, { Router, Request, Response } from 'express';
// import pkg from 'pg';
// const { Pool } = pkg;
// import type { QueryResult } from 'pg';  // Import QueryResult as a type

// import * as dotenv from 'dotenv';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Load environment variables from .env file
// dotenv.config();

// const BASE_URL = process.env.BASE_URL ||
//   (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://your-production-url.com');

// console.log('Base URL:', BASE_URL);

// // Get the directory name from the current module URL
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadDir = path.join(__dirname, 'uploads');

// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// const router: Router = express.Router();

// // PostgreSQL connection pool configuration
// const pool = new Pool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'postgres',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
//     port: Number(process.env.DB_PORT) || 5432,
// });

// // Set up storage for multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// // Initialize multer with the storage configuration
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
// });

// // Function to retrieve all photos
// const getAllPhotos = async (): Promise<Buffer[]> => {
//     
//const client = await pool.connect()

    
//     const sql = 'SELECT officer_no, photo FROM photos';

//     try {
//         const result = await client.query(sql);
//         return result.rows.map(row => Buffer.from(row.photo));
//     } catch (err) {
//         throw err;
//     } finally {
//         client.release();
//     }
// };

// // Function to retrieve a photo
// const getPhoto = async (officer_no: string): Promise<Buffer | null> => {
//     const client = await pool.connect();
    
//     const sql = 'SELECT photo FROM photos WHERE officer_no = $1';

//     try {
//         const result = await client.query(sql, [officer_no]);

//         if (result.rows.length === 0) {
//             return null;
//         }

//         return Buffer.from(result.rows[0].photo);
//     } catch (err) {
//         throw err;
//     } finally {
//         client.release();
//     }
// };

// // Function to delete a photo
// const deletePhoto = async (officer_no: string): Promise<any> => {
//     const client = await pool.connect();
    
//     const sql = 'DELETE FROM photos WHERE officer_no = $1';

//     try {
//         const result = await client.query(sql, [officer_no]);
//         return result;
//     } catch (err) {
//         throw err;
//     } finally {
//         client.release();
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
//     console.log('router.post(Storing photo')

//     try {
//         const { officer_no, photo_name, photo_type } = req.body;

//         if (!officer_no || !req.file) {
//             console.error('Missing officer number or photo');
//             return res.status(400).send('Missing officer number or photo');
//         }

//         const photoBuffer = req.file.buffer;

//         const client = await pool.connect();

//         // Check if the photo already exists for the given officer_no
//         const checkQuery = 'SELECT * FROM photos WHERE officer_no = $1';
//         const existingPhoto = await client.query(checkQuery, [officer_no]);

//         if (existingPhoto.rows.length > 0) {
//             console.log(`Photo already exists for officer_no: ${officer_no}`);
//             return res.status(409).json({ message: 'Photo already exists', photoUrl: '' });
//         }

//         // Insert the new photo
//         const insertQuery = 'INSERT INTO photos (officer_no, photo, photo_name, photo_type) VALUES ($1, $2, $3, $4)';
//         await client.query(insertQuery, [officer_no, photoBuffer, photo_name, photo_type]);

//         const photoUrl = `${BASE_URL}/api/photos/retrieve/${officer_no}`;
//         res.status(200).json({ message: 'Photo stored successfully', photoUrl: photoUrl });
//     } catch (err) {
//         console.error('Error storing photo:', err);
//         res.status(500).json({ error: 'Error storing photo', details: err });
//     }
// });

// // Endpoint to retrieve a photo
// router.get('/retrieve/:officer_no', async (req: Request, res: Response) => {
//     const { officer_no } = req.params;

//     if (!officer_no) {
//         return res.status(400).json({ error: 'officer_no is required' });
//     }

//     try {
//         const connection = await pool.connect();

//         const sql = 'SELECT photo, photo_name, photo_type FROM photos WHERE officer_no = $1';

//         try {
//             const result = await connection.query(sql, [officer_no]);

//             if (result.rows.length === 0) {
//                 return res.status(404).json({ message: 'Photo not found' });
//             }

//             const photo = result.rows[0] as { photo: Buffer, photo_name: string, photo_type: string };

//             // Set the appropriate content type
//             res.setHeader('Content-Type', photo.photo_type);
//             res.setHeader('Content-Disposition', `attachment; filename=${photo.photo_name}`);

//             // Send the binary photo data
//             res.send(photo.photo);
//         } catch (err) {
//             console.error('Error retrieving photo:', err);
//             res.status(500).json({ error: 'Error retrieving photo', details: err });
//         } finally {
//             connection.release();
//         }
//     } catch (err) {
//         res.status(500).json({ error: 'Error getting photo', details: err });
//     }
// });

// // Endpoint to delete a photo
// router.delete('/delete/:officer_no', async (req: Request, res: Response) => {
//     const { officer_no } = req.params;

//     if (!officer_no) {
//         return res.status(400).json({ error: 'officer_no is required' });
//     }

//     try {
//         const result = await deletePhoto(officer_no);

//         if (result.rowCount > 0) { // Ensure deletion was successful
//             res.status(200).json({ message: 'Photo deleted successfully', result });
//         } else {
//             res.status(404).json({ error: 'Photo not found' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: 'Error deleting photo', details: err });
//     }
// });

// export default router;




