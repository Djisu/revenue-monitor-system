// import * as dotenv from 'dotenv';
// dotenv.config();
// import express from 'express';
// import { Request, Response } from 'express';

// import pg from 'pg'
// const { Pool } = pg
// import {PoolClient} from 'pg'


// //import { generateBusinessData } from './seedDataGenerator.js';

// // PostgreSQL connection configuration
// const pool = new Pool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'postgres',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
//     port: parseInt(process.env.DB_PORT || '5432', 10),
// });

// // Array of month names
// const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
// ];

// async function updateBusPaymentsMonthPaid(): Promise<string> {
//     const client = await pool.connect();

//     try {
//         await client.query('BEGIN'); // Start a transaction

//         // Retrieve all buspayments where monthpaid is currently "February"
//         const busPaymentsResult = await client.query(
//             'SELECT buss_no FROM buspayments WHERE monthpaid = $1',
//             ['February']
//         );
//         const busPayments = busPaymentsResult.rows;

//         // Loop through each buspayment
//         for (const payment of busPayments) {
//             // Randomly select a month from the months array
//             const randomMonth = months[Math.floor(Math.random() * months.length)];

//             // Update the monthpaid for this payment
//             await client.query(
//                 'UPDATE buspayments SET monthpaid = $1 WHERE buss_no = $2',
//                 [randomMonth, payment.buss_no]
//             );
//         }

//         await client.query('COMMIT'); // Commit the transaction
//         return 'Month paid updated successfully!';
//     } catch (error) {
//         await client.query('ROLLBACK'); // Rollback the transaction on error
//         console.error('Error updating month paid:', error);
//         throw new Error('Failed to update month paid.');
//     } finally {
//         client.release(); // Release the client back to the pool
//     }
// }

// // Usage example
// updateBusPaymentsMonthPaid()
//     .then(console.log)
//     .catch(console.error);