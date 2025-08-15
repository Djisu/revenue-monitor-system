import { Router, Request, Response } from 'express';
//import { sendResetEmailUser } from '../../utils/emailUser.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pkg from 'pg';

import path from 'path'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
//import { HttpError } from 'http-errors';
import fs from 'fs'; // Import the fs module to check file existence

const { Pool } = pkg;

dotenv.config();

interface OperatorDefinition {
    operatorid: string;
    operatorname: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    resettoken?: string;
    resettokenexpiration?: Date;
}

// Determine the environment (development or production)
const environment = process.env.NODE_ENV || 'development';  // Defaults to 'development'
console.log('Initial NODE_ENV:', process.env.NODE_ENV); // Debugging log


// Construct the path to the appropriate .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.resolve(__dirname, '../../..', `.env.${environment}`);


console.log('envPath:', envPath); // Debugging log

// Check if the .env file exists
if (!fs.existsSync(envPath)) {
  console.error(`.env file not found at ${envPath}. Please ensure the file exists.`);
  process.exit(1); // Exit the process if the file is not found
}

// Load the environment variables from the .env file
dotenv.config({ path: envPath });

console.log('environment:', environment);
console.log('NODE_ENV after dotenv.config:', process.env.NODE_ENV); // Debugging log


//dotenv.config();

// let sslConfig: false | { rejectUnauthorized: boolean };

// if (process.env.NODE_ENV === 'production') { 
//   sslConfig = { rejectUnauthorized: true }; // Important for Render.com
// } else {
//   sslConfig = false;    
// postgres://avnadmin:AVNS_qelbfa0qmovc8aI8-wT@pg-e3fb2c3-pfleischer2002-d5e5.l.aivencloud.com:21780/defaultdb?sslmode=require
// }


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // or your ssl config
    },
  });
  



// const pool = new Pool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   });

const config = {
    jwtSecret: process.env.JWT_SECRET,
};

const router = Router();

// Audit log endpoint
router.post('/audit-log', async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Audit log endpoint hit' });
});

router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Auth route is alive!' });
  });
  

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    console.log('Login request received:', req.body); // Log incoming request data

    const { username, password } = req.body;

    console.log('Received password:', `"${password}"`);

    console.log(' config.jwtSecret: ',  config.jwtSecret)
    if (!config.jwtSecret){
        res.status(401).json({ message: 'No jwt sectre found' });
        return
    }

    // Validate inputs
    if (!username || !password) {
        res.status(401).json({ message: 'Invalid login parameters' });
        return;
    }

    const client = await pool.connect();

    try {
        console.log('about to SELECT * FROM operatordefinition WHERE operatorname = $1');

        // Check if an operator with the same username exists
        const { rows: operators } = await client.query<OperatorDefinition>(
            'SELECT * FROM operatordefinition WHERE operatorname = $1', 
            [username]
        );

        // Check if user exists
        if (operators.length === 0) {
            console.log('No user found, Invalid login parameters');
            res.json({ json: '', user: [], message: 'Invalid login parameters' });
            return;
        }

        console.log('Password from request:', password);
        console.log('Hashed password from DB:', operators[0].password);

        if (!operators[0].password) {
            res.status(500).json({ json: '', user: [], message: 'Invalid login parameters' });
            return;
        }

        // Compare the plain-text password with the hashed password
        const isPasswordMatch = await bcrypt.compare(password, operators[0].password);

        console.log('Password match result:', isPasswordMatch);
        if (!isPasswordMatch) {
            res.json({ json: '', user: [], message: 'Invalid login parameters' });
            return;
        }

        // Log the login attempt
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

        await client.query(
            'INSERT INTO userlog (datex, userx, time_in) VALUES ($1, $2, $3)',
            [now, username, formattedDateTime]
        );

        // Check permissions
        const { rows: permissions } = await client.query<{ menus: string }>(
            'SELECT menus FROM operatorpermission WHERE operatorid = $1', 
            [operators[0].operatorid]
        );

        if (!permissions || permissions.length === 0) {
            res.status(500).json({ json: '', user: [], message: `No permissions found for user ${username}` });
            return;
        }

        const existingPermissions = permissions[0].menus.split(',');

        const user = {           
            firstname: operators[0].firstname, 
            lastname: operators[0].lastname,
            operatorid: operators[0].operatorid,
            existingPermissions 
        };

        // Generate JWT token
        const token = jwt.sign({ user }, config.jwtSecret as string, { expiresIn: '1h' });

        if (!token){
            res.status(500).json({ json: '', user: [], message: 'Error during login' });
            return
        }

        // Send back response
        res.json({ token, user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ json: '', user: [], message: 'Error during login' });
    } finally {
        try {
            await client.release(); // Ensure connection is closed properly
        } catch (releaseError) {
            console.error('Error releasing client:', releaseError);
        }
    }
});



// Login endpoint
// router.post('/login', async (req: Request, res: Response): Promise<void> => {
//     console.log('Route hit backend login', req.body);

//     const { username, password } = req.body;

//     // Validate inputs
//     if (!username || !password) {
//         res.status(400).json({ json: '', user: [], message: 'Username and password cannot be blank!' });
//         return;
//     }

//      const client = await pool.connect()

//     try {
//        // await client.connect();

//         console.log('about to SELECT * FROM operatordefinition WHERE operatorname = $1')

//         // Check if an operator with the same username exists
//         const { rows: operators } = await client.query<OperatorDefinition>(
//             'SELECT * FROM operatordefinition WHERE operatorname = $1', 
//             [username]
//         );

//         // Check if user exists
//         if (operators.length === 0) {
//             console.log('No user found, Invalid login parameters');
//             res.json({ json: '', user: [], message: 'Invalid login parameters' });
//             return;
//         }

//         // Compare the plain-text password with the hashed password
//         const isPasswordMatch = await bcrypt.compare(password, operators[0].password);
//         if (!isPasswordMatch) {
//             res.json({ json: '', user: [], message: 'Invalid login parameters' });
//             return;
//         }

//         // Log the login attempt
//         const now = new Date();
//         const formattedDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

//         await client.query(
//             'INSERT INTO userlog (datex, userx, time_in) VALUES ($1, $2, $3)',
//             [now, username, formattedDateTime]
//         );

//         // Check permissions
//         const { rows: permissions } = await client.query<{ menus: string }>(
//             'SELECT menus FROM operatorpermission WHERE operatorid = $1', 
//             [operators[0].operatorid]
//         );

//         if (!permissions || permissions.length === 0) {
//             res.status(500).json({ json: '', user: [], message: `No permissions found for user ${username}` });
//             return;
//         }

//         const existingPermissions = permissions[0].menus.split(',');

//         const user = {           
//             firstname: operators[0].firstname, 
//             lastname: operators[0].lastname,
//             operatorid: operators[0].operatorid,
//             existingPermissions 
//         };

//         // Generate JWT token
//         const token = jwt.sign({ user }, config.jwtSecret as string, { expiresIn: '1h' });

//         // Send back response
//         res.json({ token, user });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ json: '', user: [], message: 'Error during login' });
//     } finally {
//         await client.release(); // Ensure connection is closed
//     }
// });

// Request password reset endpoint
router.post('/request-password-reset', async (req: Request, res: Response) => {
    console.log('in backend Auth.ts/request-password-reset');

    const { email } = req.body;
    console.log('email: ', email);

     const client = await pool.connect()

    try {
        //await client.connect();

        // Check if an operator with the same email exists
        const { rows: user } = await client.query<OperatorDefinition>(
            'SELECT * FROM operatordefinition WHERE email = $1', 
            [email]
        );
    
        if (user.length === 0) {
            res.status(404).json({ message: 'User email not found.' });
            return;
        }
    
        const token = crypto.randomBytes(32).toString('hex'); // Generate token

        // Update the operator record with the new token
        await client.query(
            'UPDATE operatordefinition SET resettoken = $1, resettokenexpiration = $2 WHERE email = $3', 
            [token, new Date(Date.now() + 25200000), email]
        );

        //await sendResetEmailUser(email, token); // Function to send email
        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error during password reset' });
    } finally {
        await client.release(); // Ensure connection is closed
    }
});

// Reset password endpoint
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    console.log('in BACKEND Auth.ts /reset-password', token, newPassword);

    const isValidTokenFormat = (token: string) => /^[a-f0-9]{64}$/.test(token);
    if (!isValidTokenFormat(token)) {
        res.status(400).json({ message: 'Invalid token format.' });
        return;
    }

     const client = await pool.connect()

    try {
        //await client.connect();

        // Fetch the user with the given resetToken
        const { rows } = await client.query<OperatorDefinition>(
            'SELECT * FROM operatordefinition WHERE resettoken = $1', 
            [token]
        );

        // Check if the query returned any rows
        if (rows.length === 0) {
            res.status(400).json({ message: 'Token not found.' });
            return;
        }

        const user = rows[0];

        // Validate new password length
        if (newPassword.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters long.' });
            return;
        }

        // Check if the token is expired
        if (!user.resettokenexpiration || user.resettokenexpiration.getTime() < Date.now()) {
            res.status(400).json({ message: 'Invalid or expired token.' });
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the operator record with the new password and clear the token and expiration
        await client.query(
            'UPDATE operatordefinition SET password = $1, resettoken = $2, resettokenexpiration = $3 WHERE resettoken = $4', 
            [hashedPassword, null, null, token]
        );

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error during password reset' });
    } finally {
        await client.release(); // Ensure connection is closed
    }
});

export default router;

















