// backend/src/routes/api/operatorRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
//import { createClient } from '../../db.js';
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
// Connection using database url
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}
import { parse } from 'pg-connection-string';
const parsedConfig = parse(connectionString);
const configDB = {
    ...parsedConfig,
    ssl: {
        rejectUnauthorized: false
    }
};
// Create the pool
const pool = new Pool(configDB);
// Create a new operator record
router.post('/create', async (req, res) => {
    console.log('in operator definition router.post');
    const operatorData = req.body;
    console.log('operatorData:', operatorData);
    const client = await pool.connect();
    try {
        // Validate required fields
        const requiredFields = ['OperatorID', 'OperatorName', 'password', 'firstname', 'lastname', 'email'];
        for (const field of requiredFields) {
            if (operatorData[field] === undefined) {
                res.status(400).json({ message: `${field} is required.` });
                return;
            }
        }
        // Check if an operator with the same OperatorID already exists
        const existingOperatorByOperatorID = await client.query('SELECT * FROM operatordefinition WHERE OperatorID = $1', [operatorData.OperatorID]);
        if (existingOperatorByOperatorID.rows.length > 0) {
            res.status(409).json({ message: 'Operator with this OperatorID already exists.' });
            return;
        }
        // Check if an operator with the same OperatorName already exists
        const existingOperatorByOperatorName = await client.query('SELECT * FROM operatordefinition WHERE OperatorName = $1', [operatorData.OperatorName]);
        if (existingOperatorByOperatorName.rows.length > 0) {
            res.status(409).json({ message: 'Operator with this OperatorName already exists.' });
            return;
        }
        // Check if an operator with the same firstname and lastname already exists
        const existingOperatorByFirstnameLastname = await client.query('SELECT * FROM operatordefinition WHERE firstname = $1 AND lastname = $2', [operatorData.firstname, operatorData.lastname]);
        if (existingOperatorByFirstnameLastname.rows.length > 0) {
            res.status(409).json({ message: 'Operator with this firstname and lastname already exists.' });
            return;
        }
        // Validate lengths
        if (operatorData.OperatorName.length < 3) {
            res.status(409).json({ message: 'OperatorName must be at least 3 characters long.' });
            return;
        }
        if (operatorData.password.length < 8) {
            res.status(409).json({ message: 'Password must be at least 8 characters long.' });
            return;
        }
        if (operatorData.firstname.length < 3) {
            res.status(409).json({ message: 'Firstname must be at least 3 characters long.' });
            return;
        }
        if (operatorData.lastname.length < 3) {
            res.status(409).json({ message: 'Lastname must be at least 3 characters long.' });
            return;
        }
        if (operatorData.email.length < 3) {
            res.status(409).json({ message: 'Email must be at least 3 characters long.' });
            return;
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(operatorData.password, salt);
        operatorData.password = hashedPassword;
        // Insert the new operator data
        await client.query(`INSERT INTO operatordefinition (OperatorID, OperatorName, password, firstname, lastname, email) 
            VALUES ($1, $2, $3, $4, $5, $6)`, [
            operatorData.OperatorID,
            operatorData.OperatorName,
            operatorData.password,
            operatorData.firstname,
            operatorData.lastname,
            operatorData.email
        ]);
        res.status(201).json({ message: 'Operator created successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error creating record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error creating record', error });
        }
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
// Read all operators
router.get('/all', async (req, res) => {
    console.log('in operator definition router.get(all');
    const client = await pool.connect();
    try {
        const rows = await client.query('SELECT * FROM operatordefinition');
        if (rows.rows.length == 0) {
            res.status(200).json([]);
            return;
        }
        res.status(200).json(rows.rows);
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
// Read a single operator by OperatorID
router.get('/:OperatorID', async (req, res) => {
    const { OperatorID } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM operatordefinition WHERE OperatorID = $1', [OperatorID]);
        if (result.rows.length == 0) {
            res.status(200).json([]);
            return;
        }
        res.status(200).json(result.rows[0]); // Return the first row
        return;
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
// Update an operator record
router.put('/:OperatorID', async (req, res) => {
    const { OperatorID } = req.params;
    const operatorData = req.body;
    const client = await pool.connect();
    try {
        // Check if an operator with the same OperatorID already exists
        const result = await client.query('SELECT * FROM operatordefinition WHERE OperatorID = $1', [OperatorID]);
        if (result.rows.length == 0) {
            res.status(404).json({ message: 'Operator with this OperatorID does not exist.' });
            return;
        }
        // Update the operator data
        await client.query(`UPDATE operatordefinition SET OperatorName = $1, password = $2, firstname = $3, lastname = $4 
            WHERE OperatorID = $5`, [
            operatorData.OperatorName,
            operatorData.password,
            operatorData.firstname,
            operatorData.lastname,
            OperatorID
        ]);
        res.status(200).json({ message: 'Operator updated successfully' });
        return;
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
// Delete an operator record
router.delete('/:OperatorID', async (req, res) => {
    const { OperatorID } = req.params;
    const client = await pool.connect();
    try {
        // Check if an operator with the same OperatorID already exists
        const result = await client.query('SELECT * FROM operatordefinition WHERE OperatorID = $1', [OperatorID]);
        if (result.rows.length == 0) {
            res.status(404).json({ message: 'Operator with this OperatorID does not exist.' });
            return;
        }
        // Delete the operator record
        await client.query('DELETE FROM operatordefinition WHERE OperatorID = $1', [OperatorID]);
        res.status(200).json({ message: 'Operator deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error deleting record', error });
        }
        else {
            res.status(500).json({ success: false, message: 'Error deleting record', error });
        }
        if (client) {
            client.release();
        }
    }
});
export default router;
//# sourceMappingURL=operatorDefinitionRoutes.js.map