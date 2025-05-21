import * as dotenv from 'dotenv';
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import multer from 'multer';
const router = express.Router();
// experiment ///
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
// Load the environment variables from the .env file
dotenv.config();
// Determine the environment (development or production)
const env = process.env.NODE_ENV || 'development'; // Defaults to 'development'
console.log('[BACKEND] Initial NODE_ENV:', process.env.NODE_ENV); // Debugging log
// Construct the path to the appropriate .env file from the root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const permitDir = path.join(__dirname, 'permits');
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
let sslConfig;
if (process.env.NODE_ENV === 'production') {
    sslConfig = { rejectUnauthorized: true }; // Important for Render.com
}
else {
    sslConfig = false;
}
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
const pool = new Pool(dbConfig);
// end of experiment ///
// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Middleware
router.use(express.json());
// Create a new officer record
router.post('/create', upload.single('photo'), async (req, res) => {
    const officerData = req.body;
    const client = await pool.connect(); // Get a client from the pool
    try {
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
        res.status(201).json({ message: 'Officer record created successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error creating  record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error creating  record', error });
        }
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
    const client = await pool.connect(); // Get a client from the pool
    try {
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
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error updating record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error updating record', error });
        }
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
    const client = await pool.connect(); // Get a client from the pool
    try {
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
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error deleting record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error deleting record', error });
        }
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
    const client = await pool.connect(); // Get a client from the pool
    try {
        console.log('about to client.query');
        const result = await client.query(`
            SELECT o.*, p.photo_buffer, p.photo_name, p.photo_type 
            FROM officer o
            LEFT JOIN photos p ON o.officer_no = p.officer_no::int
        `);
        console.log('after const officers = result.rows.map(row => {');
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
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
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
    const client = await pool.connect(); // Get a client from the pool
    try {
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
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
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
    const client = await pool.connect(); // Get a client from the pool
    try {
        const result = await client.query('SELECT * FROM officer WHERE officer_name = $1', [officer_name]);
        if (result.rows.length == 0) {
            res.status(404).json({ message: 'Officer record not found' });
            return;
        }
        res.json(result.rows);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error getting record', error });
        }
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
export default router;
//# sourceMappingURL=officerRoutes.js.map