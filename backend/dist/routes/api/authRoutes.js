// backend/src/routes/api/loginRoutes.ts
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import { sendResetEmailUser } from '../../utils/emailUser.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const config = {
    jwtSecret: process.env.JWT_SECRET,
};
// PostgreSQL connection configuration
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'revmonitor',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432', 10),
};
const pool = new Pool(dbConfig);
const router = Router();
// Audit log endpoint
router.post('/audit-log', async (req, res) => {
    // Implementation of the audit log endpoint
    // For now, let's just return a simple response
    res.status(200).json({ message: 'Audit log endpoint hit' });
});
// Login endpoint <LoginResponse>
router.post('/login', async (req, res) => {
    console.log('Route hit backend login', req.body);
    const { username, password } = req.body;
    // Validate inputs
    if (!username || !password) {
        res.status(400).json({ json: '', user: [], message: 'username and password cannot be blank!' });
        return;
    }
    //console.log('I AM HERE')
    let client = null;
    try {
        client = await pool.connect();
        // Check if an operator with the same username exists
        const { rows: operators } = await client.query('SELECT * FROM operatordefinition WHERE operatorname = $1', [username]);
        //console.log('operators: ', operators)
        // Check if user exists
        if (operators.length === 0) {
            console.log('no user found, Invalid login parameters');
            res.json({ json: '', user: [], message: 'Invalid login parameters' });
            return;
        }
        // console.log('I AM HERE 2')
        // console.log('operators[0].password: ', operators[0].password)
        // console.log('password: ', password)
        // Compare the plain-text password with the hashed password
        const isPasswordMatch = await bcrypt.compare(password, operators[0].password);
        // console.log('isPasswordMatch: ', isPasswordMatch)
        if (!isPasswordMatch) {
            res.json({ json: '', user: [], message: 'Invalid login parameters' });
            return;
        }
        // Log the login attempt
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
        await client.query('INSERT INTO userlog (datex, userx, time_in) VALUES ($1, $2, $3)', [now, username, formattedDateTime]);
        // console.log('I AM HERE 3')
        // Check permissions
        const { rows: permissions } = await client.query('SELECT menus FROM operatorpermission WHERE operatorid = $1', [operators[0].operatorid]);
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
        //console.log('I AM HERE 4')
        // Generate JWT token
        const token = jwt.sign({ user }, config.jwtSecret, { expiresIn: '1h' });
        //console.log('I AM HERE 5', token)
        // Send back response
        res.json({ token, user });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ json: '', user: [], message: 'Error during login' });
    }
    finally {
        if (client) {
            client.release(); // Ensure connection is closed
        }
    }
});
router.post('/request-password-reset', async (req, res) => {
    console.log('in backend Auth.ts/request-password-reset');
    const { email } = req.body;
    console.log('email: ', email);
    let client = null;
    try {
        client = await pool.connect();
        // Check if an operator with the same OperatorName exists
        const { rows: user } = await client.query('SELECT * FROM operatordefinition WHERE email = $1', [email]);
        if (user.length === 0) {
            res.status(404).json({ message: 'User email not found.' });
            return;
        }
        const token = crypto.randomBytes(32).toString('hex'); // Generate token
        // Update the operator record with the new token
        await client.query('UPDATE operatordefinition SET resetToken = $1, resettokenexpiration = $2 WHERE email = $3', [token, new Date(Date.now() + 25200000), email]);
        console.log('after user token reset');
        await sendResetEmailUser(email, token); // Function to send email
        res.status(200).json({ message: 'Password reset email sent.' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error during password reset' });
    }
    finally {
        if (client) {
            client.release();
        }
    }
});
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    console.log('in BACKEND Auth.ts  /reset-password', token, newPassword);
    const isValidTokenFormat = (token) => /^[a-f0-9]{64}$/.test(token);
    if (!isValidTokenFormat(token)) {
        res.status(400).json({ message: 'Invalid token format.' });
        return;
    }
    let client = null;
    try {
        client = await pool.connect();
        // Fetch the user with the given resetToken
        const { rows } = await client.query('SELECT * FROM operatordefinition WHERE resettoken = $1', [token]);
        // Check if the query returned any rows
        if (rows.length === 0) {
            res.status(400).json({ message: 'Token not found.' });
            return;
        }
        // Access the first row (user object)
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
        await client.query('UPDATE operatordefinition SET password = $1, resettoken = $2, resettokenexpiration = $3 WHERE resettoken = $4', [hashedPassword, undefined, undefined, token]);
        res.status(200).json({ message: 'Password has been reset successfully.' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error during password reset' });
    }
    finally {
        if (client) {
            client.release(); // Ensure connection is closed
        }
    }
});
const isValidDate = (dateString) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString))
        return false;
    const parsedDate = new Date(dateString.split('/').reverse().join('-'));
    return !isNaN(parsedDate.getTime());
};
export default router;
// // backend/src/routes/api/loginRoutes.ts
// import express, { Router, Request, Response } from 'express';
// import mysql from 'mysql2/promise';  //, { ResultSetHeader }
// import { sendResetEmailUser } from '../../utils/emailUser.js';
// import crypto from 'crypto';
// import bcrypt from 'bcrypt';
// //import { OperatorDefinition } from '../../models/OperatorDefinition.js';
// //import { check, validationResult } from 'express-validator';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// interface OperatorDefinition {
//     operatorid: string;
//     OperatorName: string;
//     password: string;
//     firstname: string;
//     lastname: string;
//     email: string;
//     resetToken?: string; // Optional because it may not always be set
//     resetTokenExpiration?: Date; // Optional
// }
// interface LoginResponse {
//     message?: string;
//     token?: string;
//     user?: {
//         firstname: string;
//         lastname: string;
//         existingPermissions: string[]; // Adjust type as needed
//     };
// }
// dotenv.config();
// const config = {
//     jwtSecret: process.env.JWT_SECRET,
// };
// const router = Router();
// // MySQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
// };
// // Audit log endpoint
// router.post('/audit-log', async (req: Request, res: Response) => {
// })
// // Login endpoint <LoginResponse>
// router.post('/login', async (req: Request, res: Response): Promise<void> => {
//     console.log('Route hit backend login', req.body);
//     const { username, password } = req.body;
//     // console.log('username: ', username);
//     // console.log('password: ', password);
//     // Validate inputs
//     if (!username || !password) {
//         res.status(400).json({ json: '', user: [], message: 'username and password cannot be blank!' });
//         return;
//     }
//     const connection = await mysql.createConnection(dbConfig);
//    // console.log('after connection');
//     try {
//         // Check if an operator with the same username exists
//         const [operators] = await connection.execute<OperatorDefinition>(
//             'SELECT * FROM Operator_definition WHERE OperatorName = ?', 
//             [username]
//         );
//         //console.log('operators: ', operators);
//         // Check if user exists
//         if (operators.length === 0) {
//             console.log('no user found, Invalid login parameters');
//             res.json({ json: '', user: [], message: 'Invalid login parameters' });
//             return;
//         }
//         // Compare the plain-text password with the hashed password
//         const isPasswordMatch = await bcrypt.compare(password, operators[0].password);
//         if (!isPasswordMatch) {
//             res.json({ json: '', user: [], message: 'Invalid login parameters' });
//             return;
//         }
//         //console.log('passwords matched');
//         // Log the login attempt
//         const now = new Date();
//         const formattedDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
//         await connection.execute(
//             'INSERT INTO USERLOG (datex, User, time_in, time_out) VALUES (?, ?, ?, ?)',
//             [now, username, formattedDateTime, null]
//         );
//         // Check permissions
//         const [permissions] = await connection.execute(
//             'SELECT Menus FROM operator_permission WHERE OperatorID = ?', 
//             [operators[0].OperatorID]
//         );
//         if (!permissions) {
//             res.status(500).json({ json: '', user: [], message: `No permissions found for user ${username}` });
//             return;
//         }
//         const existingPermissions = permissions[0].Menus.split(',');
//         const user = {           
//             firstname: operators[0].firstname, 
//             lastname: operators[0].lastname,
//             existingPermissions 
//         };
//        // console.log('existingPermissions: ', existingPermissions);
//         // Generate JWT token
//         const token = jwt.sign({ user }, config.jwtSecret as string, { expiresIn: '1h' });
//         // Send back response
//         res.json({ token, user });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ json: '', user: [], message: 'Error during login' });
//     } finally {
//         await connection.end(); // Ensure connection is closed
//     }
// });
// router.post('/request-password-reset', async (req: Request, res: Response) => {
//     console.log('in backend Auth.ts/request-password-reset')
//     const { email } = req.body;
//     console.log('email: ', email)
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Check if an operator with the same OperatorName exists
//         const [user] = await connection.execute(
//             'SELECT * FROM Operator_definition WHERE email = ?', 
//             [email]
//         );
//         if (!user) {
//             res.status(404).json({ message: 'User email not found.' });
//         }
//         const token = crypto.randomBytes(32).toString('hex'); // Generate token
//         if (user){
//             // Update the operator record with the new token
//             const [updatedOperator] = await connection.execute(
//                 'UPDATE Operator_definition SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?', 
//                 [token, new Date(Date.now() + 25200000), email]
//             );
//             console.log('after user token reset')
//             await sendResetEmailUser(email, token); // Function to send email
//             res.status(200).json({ message: 'Password reset email sent.' });
//         }
//     }catch (error: any) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error during password reset' });
//     } finally {
//         connection.end();
//     }
// });
// router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
//     const { token, newPassword } = req.body;
//     console.log('in BACKEND Auth.ts  /reset-password', token, newPassword );
//     const isValidTokenFormat = (token: string) => /^[a-f0-9]{64}$/.test(token);
//     if (!isValidTokenFormat(token)) {
//         res.status(400).json({ message: 'Invalid token format.' });
//         return;
//     }
//     const connection = await mysql.createConnection(dbConfig);
//     // Fetch the user with the given resetToken
//     const [rows] = await connection.execute(
//         'SELECT * FROM Operator_definition WHERE resetToken = ?', 
//         [token]
//     );
//     // Check if the query returned any rows
//     if (rows.length === 0) {
//         res.status(400).json({ message: 'Token not found.' });
//         return;
//     }
//     // Access the first row (user object)
//     const user = rows[0];
//     // Validate new password length
//     if (newPassword.length < 6) {
//         res.status(400).json({ message: 'Password must be at least 6 characters long.' });
//         return;
//     }
//     // Check if the token is expired
//     if (!user.resetTokenExpiration || !(user.resetTokenExpiration instanceof Date) || user.resetTokenExpiration.getTime() < Date.now()) {
//         res.status(400).json({ message: 'Invalid or expired token.' });
//         return;
//     }
//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);
//     // Update the operator record with the new password and clear the token and expiration
//     await connection.execute(
//         'UPDATE Operator_definition SET password = ?, resetToken = ?, resetTokenExpiration = ? WHERE resetToken = ?', 
//         [hashedPassword, undefined, undefined, token]
//     );
//     res.status(200).json({ message: 'Password has been reset successfully.' });
//     res.end();
//     return;
// });
// const isValidDate = (dateString: string): boolean => {
//     const regex = /^\d{2}\/\d{2}\/\d{4}$/;
//     if (!regex.test(dateString)) return false;
//     const parsedDate = new Date(dateString.split('/').reverse().join('-'));
//     return !isNaN(parsedDate.getTime());
// };
// export default router;
//# sourceMappingURL=authRoutes.js.map