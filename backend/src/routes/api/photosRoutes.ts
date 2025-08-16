import express, { Router, Request, Response } from 'express';

import pg from 'pg'
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
 const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';


interface PhotoRow {
    officer_no: string;
    photo: Uint8Array; // or Buffer, depending on the client's return type
}

// Load environment variables from .env file
dotenv.config();

// Get the directory name from the current module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const router: Router = express.Router();

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


// Set up multer storage
const storage: StorageEngine = diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: unknown, destination: string) => void) => {
        cb(null, 'uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: unknown, filename: string) => void) => {
        cb(null, file.originalname);
    },
});

// Initialize multer with storage and file size limit
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Function to retrieve all photos
const getAllPhotos = async (): Promise<Buffer[]> => {
    const client = await pool.connect();
  
    const sql = 'SELECT officer_no, photo FROM photos';
  
    try {
      const result = await client.query<PhotoRow>(sql);
      return result.rows.map(row => Buffer.from(row.photo));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      // 🔧 Ensure something is thrown here too
      throw new Error("Unknown error occurred while fetching photos");
    } finally {
      client.release();
    }
  };
  



// Function to delete a photo
const deletePhoto = async (officer_no: string): Promise<string> => {
    
const client = await pool.connect()

    const sql = 'DELETE FROM photos WHERE officer_no = $1 RETURNING *';

    try {
        await client.query(sql, [officer_no]);
        return "Photo deleted"
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error;
          }
          // 🔧 Ensure something is thrown here too
          throw new Error("Unknown error occurred while fetching photos");
    } finally {
        client.release();
    }
};

// Endpoint to retrieve all photos
router.get('/retrieve', async (req: Request, res: Response) => {
    try {
        const photos = await getAllPhotos();
        res.json(photos);
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error getting record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
        
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
        } catch (error: unknown) {
            if (error instanceof Error) {
               console.error('Error:', error);
               res.status(500).json({ success: false, message: 'Error creating record', error });
            }else{
                res.status(500).json({ success: false, message: 'Error creating record', error });
            }
            
        } finally {
            client.release();
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error storing record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error storing record', error });
        }
        
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
        } catch (error: unknown) {
            if (error instanceof Error) {
               console.error('Error:', error);
               res.status(500).json({ success: false, message: 'Error getting record', error });
            }else{
                res.status(500).json({ success: false, message: 'Error getting record', error });
            }
            
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

        if (result === "Photo deleted"){
            res.status(200).json({ error: 'Photo deleted' });
            return
        } else {
            res.status(404).json({ error: 'Photo not found' });
            return
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error deleting record', error });
        }else{
            res.status(500).json({ success: false, message: 'Error deleting record', error });
        }
        
    }
});

export default router;






