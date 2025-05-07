"use strict";
// import * as dotenv from 'dotenv';
// dotenv.config();
// import pg from 'pg';
// const { Pool } = pg;
// // PostgreSQL connection configuration
// const pool = new Pool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'revmonitor',
//   port: parseInt(process.env.DB_PORT || '5432', 10),
// });
// async function updateBusPaymentsOfficerNo(): Promise<string> {
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN'); // Start a transaction
//     const busPaymentsResult = await client.query('SELECT * FROM buspayments');
//     const busPayments = busPaymentsResult.rows;
//     for (const payment of busPayments) {
//       const businessResult = await client.query(
//         'SELECT assessmentby FROM business WHERE buss_no = $1',
//         [payment.buss_no]
//       );
//       const relatedBusiness = businessResult.rows[0];
//       if (relatedBusiness) {
//         await client.query(
//           'UPDATE buspayments SET officer_no = $1 WHERE buss_no = $2',
//           [relatedBusiness.assessmentby, payment.buss_no]
//         );
//       }
//     }
//     await client.query('COMMIT');
//     return 'Officer numbers updated successfully!';
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error('Error updating officer numbers:', error);
//     throw new Error('Failed to update officer numbers.');
//   } finally {
//     client.release();
//   }
// }
// updateBusPaymentsOfficerNo();
//# sourceMappingURL=UpdateBuspayments.js.map