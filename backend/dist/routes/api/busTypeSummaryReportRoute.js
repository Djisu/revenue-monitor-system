import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
// import { createClient } from '../../db.js';
const { Pool } = pkg;
dotenv.config(); // Load .env file from the default location
// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
const router = Router();
// Load environment variables from .env file
dotenv.config();
const emailPassword = process.env.EMAIL_PASSWORD;
const appPassword = process.env.APP_PASSWORD;
const emailUser = process.env.EMAIL_USER;
const port = process.env.PORT || 3001;
// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});
// CRUD Operations
// Create
router.get('/create/:firstDate/:lastDate/:zone/:bussType/:user', async (req, res) => {
    const client = await pool.connect();
    try {
        const { firstDate, lastDate, zone, bussType, user } = req.params;
        console.log('zone:', zone);
        console.log('bussType:', bussType);
        console.log('user:', user);
        const userId = String(user); // Convert user to string
        console.log('User ID: ', userId);
        const thisYear = lastDate.substring(0, 4);
        console.log('This year: ', thisYear);
        // Delete from bustypesummaryreport table for the specific user
        await client.query('DELETE FROM bustypesummaryreport WHERE user_id = $1', [userId]);
        // Check for existing records
        let searchResult = await client.query('SELECT * FROM bustypesummaryreport WHERE user_id = $1', [userId]);
        if (searchResult.rows.length > 0) {
            console.log('Deleted records NOT DELETED!!!!!');
            res.status(404).json({ message: "Deleted records NOT DELETED", data: [] });
        }
        // Begin querying business data based on zone
        console.log('SELECT DISTINCT electroral_area FROM business WHERE status = $1');
        let result;
        if (zone === 'All electoral areas') {
            // When zone is "All electoral areas", only filter by bussType if it is not "All business types"
            if (bussType === 'All business types') {
                result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1', ['Active']);
            }
            else {
                result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND buss_type ILIKE $2', ['Active', bussType]);
            }
        }
        else {
            // When a specific zone is provided
            if (bussType === 'All business types') {
                result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND electroral_area ILIKE $2', ['Active', zone]);
            }
            else {
                result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND electroral_area ILIKE $2 AND buss_type ILIKE $3', ['Active', zone, bussType]);
            }
        }
        console.log('result.rows.length: ', result.rows.length);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No businesses found in the selected zone', data: [] });
        }
        let varCurrRate = 0;
        let varPayment = 0;
        let varBalance = 0;
        console.log('Calculating current rate and balance for each business');
        for (const row of result.rows) {
            // Reset variables for each iteration
            varCurrRate = 0;
            varPayment = 0;
            varBalance = 0;
            console.log('row.electroral_area: ', row.electroral_area);
            console.log('==========================================');
            // Calculate current balance
            console.log('busscurrbalance');
            if (bussType === 'All business types') {
                console.log('All business types');
                let recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND electoralarea ILIKE $2', [thisYear, row.electroral_area]);
                varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
            }
            else {
                console.log('specific business type');
                let recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type ILIKE $2 AND electoralarea ILIKE $3', [thisYear, bussType, row.electroral_area]);
                varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
            }
            console.log('varCurrRate: ', varCurrRate);
            // Calculate total payments
            console.log('buspayments');
            if (bussType === 'All business types') {
                console.log('All business types');
                let recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND electroral_area ILIKE $2', [thisYear, row.electroral_area]);
                varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
            }
            else {
                console.log('specific business type');
                let recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type ILIKE $2 AND electroral_area ILIKE $3', [thisYear, bussType, row.electroral_area]);
                varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
            }
            console.log('varPayment: ', varPayment);
            // Calculate balance
            varBalance = varCurrRate - varPayment;
            console.log('varBalance: ', varBalance);
            // Insert into bustypesummaryreport
            const insertQuery = `
                INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate, user_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `;
            await client.query(insertQuery, [bussType, varCurrRate, varPayment, varBalance, row.electroral_area, lastDate, userId]);
        }
        // Fetching the report
        let results;
        results = await client.query(`SELECT DISTINCT * FROM bustypesummaryreport WHERE buss_type = $1 AND user_id = $2`, [bussType, userId]);
        // Return the response
        if (results.rows.length > 0) {
            console.log('Returning the data');
            return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: results.rows });
        }
        else {
            console.log('404---No data found in bustypesummaryreport');
            return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    finally {
        client.release();
    }
});
// router.get('/create/:firstDate/:lastDate/:zone/:bussType/:user', async (req: Request, res: Response): Promise<Response | void | any> => {
//    const client = await pool.connect()
;
//     try {
//         const { firstDate, lastDate, zone, bussType, user } = req.params;
//         console.log('zone:', zone)
//         console.log('bussType:', bussType)
//         console.log('user:', user)
//         // Ensure user is a string
//         const userId: string = String(user); // Convert user to string
//         // Assuming 'user' is the user ID passed from the frontend
//         console.log('User ID: ', userId);
//         const thisYear = lastDate.substring(0, 4);
//         console.log('This year: ', thisYear)
//         console.log('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area ILIKE $2 AND user_id = $2')
//         // Delete from bustypesummaryreport table for the specific user
//         await client.query('DELETE FROM bustypesummaryreport WHERE user_id = $1', [userId]);
//         let searchResult: QueryResult<any> = await client.query('SELECT * FROM bustypesummaryreport WHERE user_id = $1', [userId]);
//         if (searchResult.rows.length > 0) {           
//             console.log('Deleted records NOT DELETED!!!!!')
//         }
//         console.log('SELECT DISTINCT electoral_area, buss_type FROM business WHERE status = $1')
//         let result: QueryResult<any>;
//         if (zone === 'All electoral areas') {
//             result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1', ['Active']);
//         } else {
//             result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND electroral_area ILIKE $2', ['Active', zone]);
//         }
//         console.log('result.rows.length: ', result.rows.length)
//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: 'No businesses found in the selected zone', data: [] });
//         }
//         let recSumm: QueryResult<any>;
//         let varCurrRate: number = 0;
//         let varPayment: number = 0;
//         let varBalance: number = 0;
//         console.log('Calculating current rate and balance for each business')
//         // Calculate current rate
//         if (result.rows.length === 1) {
//             console.log('IN STANDALONE MODE')
//             // if (zone === 'All electoral areas') {
//             //     console.log('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2')
//             //     recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2', [thisYear, bussType]);
//             //     varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
//             // } else {
//                 recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea ILIKE $3', [thisYear, bussType, zone]);
//                 varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
//                 console.log('standalone varCurrRate: ', varCurrRate)
//            // }
//             // if (zone === 'All electoral areas') {
//             //     console.log('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2')
//             //     recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2', [thisYear, bussType]);
//             //     varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
//             // } else {
//                 console.log('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoralarea  ILIKE  $3')
//                 recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electroral_area  ILIKE  $3', [thisYear, bussType, zone]);
//                 varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
//                 console.log('standalone varPayment: ', varPayment)
//             //}
//             console.log('Calculating balance for each business')
//             varBalance = varCurrRate - varPayment;
//             console.log('varBalance: ', varBalance)
//             // Check if the report already exists for the specific user
//             console.log('SELECT * FROM bustypesummaryreport WHERE user_id = $3')
//             const reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE user_id = $1';
//             const reportCheckResult = await client.query(reportCheckQuery, [userId]);
//            // if (reportCheckResult.rowCount === 0) {
//                 console.log('INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)')
//                 const insertQuery = `
//                     INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate, user_id)
//                     VALUES ($1, $2, $3, $4, $5, $6, $7)
//                 `;
//                 await client.query(insertQuery, [bussType, varCurrRate, varPayment, varBalance, zone, lastDate, userId]);
//            // }
//         } 
//         if (result.rows.length > 1) {
//             console.log('IN MULTIPLE MODE')
//             for (const row of result.rows) {
//                  varCurrRate = 0;
//                  varPayment = 0;
//                  varBalance = 0;
//                 console.log('row.electroral_area: ', row.electroral_area)
//                 console.log('==========================================')
//                // if (zone === 'All electoral areas') {
//                     console.log('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2', [thisYear, bussType])
//                     recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea  ILIKE  $3', [thisYear, bussType, row.electroral_area]);
//                     varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
//                     console.log('IN MULTIPLE MODE varCurrRate: ', varCurrRate)
//                // }
//                 //  else {
//                 //     console.log('in the loop SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea = $3')
//                 //     recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, zone]);
//                 //     varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
//                 // }
//               //  if (zone === 'All electoral areas') {
//                     console.log('in the loop SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2')
//                     recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electroral_area  ILIKE  $3', [thisYear, bussType, row.electroral_area]);
//                     varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
//                     console.log('IN MULTIPLE MODE varPayment: ', varPayment)
//                 //} 
//                 // else {
//                 //     console.log('in the loop SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electroral_area = $3')
//                 //     recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electroral_area = $3', [thisYear, bussType, zone]);
//                 //     varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
//                 // }
//                 console.log(' in  the loop Calculating balance for each business')
//                 varBalance = varCurrRate - varPayment;
//                 console.log('IN MULTIPLE MODE varBalance: ', varBalance)
//                 // Check if the report already exists for the specific user
//                 // console.log(' Check if the report already exists for the specific user')
//                 // console.log('after the loop SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND user_id = $2')
//                 // const reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND user_id = $2';
//                 // const reportCheckResult = await client.query(reportCheckQuery, [bussType, userId]);
//                 // if (reportCheckResult.rowCount === 0) {
//                     console.log('before insert statement: NOT FOUND')
//                     console.log('INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)')
//                     const insertQuery = `
//                         INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate, user_id)
//                         VALUES ($1, $2, $3, $4, $5, $6, $7)
//                     `;
//                     await client.query(insertQuery, [bussType, varCurrRate, varPayment, varBalance, row.electroral_area, lastDate, userId]);
//                 // } else {
//                 //     console.log('bustypesummaryreport not deleted!!!!')
//                 // }
//                varCurrRate = 0;
//                varPayment = 0;
//                varBalance = 0;
//             }
//         }
//         let results: QueryResult<any>;
//         console.log('about to  SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND user_id = $2')
//         //if (zone === 'All electoral areas') {
//             results = await client.query(`SELECT DISTINCT * FROM bustypesummaryreport WHERE buss_type = $1 AND user_id = $2`, [bussType, userId]);
//         // } else {
//         //     results = await client.query('SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND user_id = $2', [bussType, userId]);
//         // }
//         let businessTypeSummaryReport = results.rows;
//         console.log('businessTypeSummaryReport.length > 0: ', businessTypeSummaryReport.length > 0)
//         if (businessTypeSummaryReport.length > 0) {
//             console.log('Returning the data')
//             return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
//         } else {
//             console.log('404---No data found in bustypesummaryreport')
//             return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
//         }
//     } catch (error: any) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     } finally {
//         client.release();
//     }
// });
// router.get('/create/:firstDate/:lastDate/:zone/:bussType/:user', async (req: Request, res: Response): Promise<Response | void | any> => {
//     try {
//         const { firstDate, lastDate, zone, bussType, user } = req.params;
//         // Assuming 'user' is the user ID passed from the frontend
//         console.log('User ID: ', user);
//         const thisYear = lastDate.substring(0, 4);
//        const client = await pool.connect()
;
//             // Make sure to validate the user ID against your application logic here
//             // Delete from bustypesummaryreport table for the specific user
//             await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND user_id = $3', [bussType, zone, user]);
//             let result: QueryResult<any>;
//             if (zone === 'All electoral areas') {
//                 result = await client.query('SELECT DISTINCT electoral_area, buss_type FROM business WHERE status = $1', ['Active']);
//             } else {
//                 result = await client.query('SELECT DISTINCT electoral_area, buss_type FROM business WHERE status = $1 AND electoral_area = $2', ['Active', zone]);
//             }
//             if (result.rows.length === 0) {
//                 return res.status(404).json({ message: 'No businesses found in the selected zone', data: [] });
//             }
//             let recSumm: QueryResult<any>
//             let varCurrRate: number = 0;
//             let varPayment: number = 0;
//             let varBalance: number = 0;
//                 // Calculate current rate
//             if (result.rows.length === 1) {
//                 if (zone === 'All electoral areas') {
//                     recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2', [thisYear, bussType]);
//                     varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
//                 } else {
//                     recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, zone]);
//                     varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
//                 }  
//                 if (zone === 'All electoral areas') {
//                     recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2', [thisYear, bussType]);
//                     varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
//                 } else {
//                     recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, zone]);
//                     varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
//                 }  
//                 varBalance = varCurrRate - varPayment;
//                 // Check if the report already exists for the specific user
//                 const reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND user_id = $3 AND transdate >= $4 AND transdate <= $5';
//                 const reportCheckResult = await client.query(reportCheckQuery, [bussType, zone, user, firstDate, lastDate]);
//                 if (reportCheckResult.rowCount === 0) {
//                     const insertQuery = `
//                         INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate, user_id)
//                         VALUES ($1, $2, $3, $4, $5, $6, $7)
//                     `;
//                     await client.query(insertQuery, [bussType, varCurrRate, varPayment, varBalance, zone, lastDate, user]);
//                 }
//             } else {
//                 for (const row of result.rows) {
//                     if (zone === 'All electoral areas') {
//                         recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, row.electoral_area]);
//                         varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
//                     } else {
//                         recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, zone]);
//                         varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
//                     }  
//                     if (zone === 'All electoral areas') {
//                         recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, row.electoral_area]);
//                         varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
//                     } else {
//                         recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, zone]);
//                         varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
//                     }  
//                     varBalance = varCurrRate - varPayment;
//                     // Check if the report already exists for the specific user
//                     const reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND user_id = $3 AND transdate >= $4 AND transdate <= $5';
//                     const reportCheckResult = await client.query(reportCheckQuery, [bussType, row.electoral_area, user, firstDate, lastDate]);
//                     if (reportCheckResult.rowCount === 0) {
//                         const insertQuery = `
//                             INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate, user_id)
//                             VALUES ($1, $2, $3, $4, $5, $6, $7)
//                         `;
//                         await client.query(insertQuery, [bussType, varCurrRate, varPayment, varBalance, row.electoral_area, lastDate, user]);
//                     }
//             }
//             let results: QueryResult<any>;
//             if (zone === 'All electoral areas') {
//                 results = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND user_id = $5`, [bussType, user]);
//             } else {
//                 results = await client.query('SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND user_id = $3', [bussType, zone, user]);
//             }
//             let businessTypeSummaryReport = results.rows;
//             if (businessTypeSummaryReport.length > 0) {
//                 return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
//             } else {
//                 return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
//             }
//         } catch (error: any) {
//             console.error(error);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         } finally {
//             client.release();
//         }
//     });
// router.get('/create/:firstDate/:lastDate/:zone/:bussType/:user', async (req: Request, res: Response): Promise<Response | void | any> => {
//     try {
//         const {firstDate, lastDate, zone, bussType} = req.params;
//         console.log('in router.get(/create/:firstDate/:lastDate/:zone/:bussType')
//         console.log('firstDate: ', firstDate)
//         console.log('lastDate: ', lastDate)
//         console.log('zone: ', zone)
//         console.log('bussType: ', bussType)
//         console.log('user: ', req.params.user)
//         // Check if the user is authorized to create reports
//         // Find year from cbolastdate
//         const thisYear = lastDate.substring(0, 4);
//        const client = await pool.connect()
;
//         try {
//             // Delete from bustypesummaryreport table
//             await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2', [bussType, zone]);
//             // Calculate current rate and balance for each electoral area
//             let result:  QueryResult<any>
//             if (zone === 'All electoral areas') {
//                 result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND buss_type = $2', ['Active', bussType]);
//             } else {
//                 result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND buss_type = $2 AND electroral_area = $3', ['Active', bussType, zone]);
//             }
//             // Check if there are any businesses in the selected zone
//             if (result.rows.length === 0) {
//                 console.log('No businesses found in the selected zone');
//                 return res.status(404).json({ message: 'No businesses found in the selected zone', data: [] });
//             }
//             console.log('Oh there are some businesses in the selected zone')
//             console.log('about to loop through electoral areas')
//             for (const row of result.rows) {
//                 // Calculate current rate
//                 let recSumm: any = 0
//                 //if (zone === 'All electoral areas') {
//                     recSumm =  await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_no = $2',
//                     [thisYear, row.buss_no]);
//                 // } else {
//                 //     recSumm =  await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_no = $2 AND electoralarea = $3',
//                 //     [thisYear, row.buss_no, zone]);
//                 // }
//                 console.log('about to calculate current rate')
//                 let varCurrRate = 0;
//                 if (recSumm.rows.length > 0 && recSumm.rows[0].totsum) {
//                     varCurrRate = parseFloat(recSumm.rows[0].totsum);
//                 }
//                 console.log('varCurrRate: ', varCurrRate)
//                 // Calculate total payments
//                 //if (zone === 'All electoral areas') {
//                     recSumm =  await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_no = $2',
//                     [thisYear, row.buss_no]);
//                 // } else {
//                 //     recSumm =  await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electroral_area = $3',
//                 //     [thisYear, bussType, zone]);
//                 // }
//                 console.log('about to calculate total payments')
//                 let varPayment = 0;
//                 if (recSumm.rows.length > 0 && recSumm.rows[0].totpayments) {
//                     varPayment = parseFloat(recSumm.rows[0].totpayments);
//                 } else {
//                     varPayment = 0;
//                 }
//                 console.log('varPayment: ', varPayment)
//                 console.log('about to calculate balance')
//                 // Calculate balance
//                 const balance = varCurrRate - varPayment;
//                 console.log('balance: ', balance)
//                 let reportCheckResult: any = 0
//                 let reportCheckQuery = ''
//                 console.log('about to check if report already exists')
//                 // Check if the report already exists
//                 //if (zone === 'All electoral areas') {
//                     reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_no = $1 AND transdate >= $3 AND transdate <= $4';
//                     reportCheckResult = await client.query(reportCheckQuery, [row.buss_no]);
//                 // } else {
//                 //     reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND transdate >= $3 AND transdate <= $4';
//                 //     reportCheckResult = await client.query(reportCheckQuery, [bussType, zone, firstDate, lastDate]);
//                 // }
//                 console.log('reportCheckResult.rowCount: ', reportCheckResult.rowCount)
//                 if (reportCheckResult.rowCount === 0) {
//                     // Insert new report
//                     const insertQuery = `
//                         INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate)
//                         VALUES ($1, $2, $3, $4, $5, $6)
//                     `;
//                     await client.query(insertQuery, [
//                         bussType,
//                         varCurrRate,
//                         varPayment,
//                         balance,
//                         row.electoral_area,
//                         lastDate,
//                     ]);
//                 }
//             }
//             console.log('BusTypeSummaryReport created');
//             // Select from bustypesummaryreport table
//             let results: QueryResult<any>  
//             if (zone === 'All electoral areas') {
//                 results = await client.query(
//                     `SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3`,
//                     [bussType, firstDate, lastDate]
//                 );
//             } else {
//                 results = await client.query(
//                     `SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`,
//                     [bussType, firstDate, lastDate, zone]
//                 );
//             }
//             console.log('results.rowCount: ', results.rowCount)
//             let businessTypeSummaryReport: BusTypeSummaryReport[] = results.rows;
//             if (businessTypeSummaryReport.length > 0) {
//                 console.log('BusTypeSummaryReport fetched');
//                 return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
//             } else {
//                 console.log('No data found in bustypesummaryreport');
//                 return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
//             }
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         } finally {
//             client.release();
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// });
// Update
router.put('/update/:firstDate/:lastDate/:zone/:bussType', async (req, res) => {
    try {
        const { firstDate, lastDate, zone, bussType } = req.params;
        // Find year from cbolastdate
        const thisYear = lastDate.substring(0, 4);
        const client = await pool.connect();
        try {
            // Delete from bustypesummaryreport table
            await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4', [bussType, firstDate, lastDate, zone]);
            // Calculate current rate and balance for each electoral area
            let result;
            if (zone === 'All electoral areas') {
                result = await client.query('SELECT DISTINCT electoral_area FROM business WHERE status = $1 AND buss_type = $2', ['Active', bussType]);
            }
            else {
                result = await client.query('SELECT DISTINCT electoral_area FROM business WHERE status = $1 AND buss_type = $2 AND electoral_area = $3', ['Active', bussType, zone]);
            }
            for (const row of result.rows) {
                // Calculate current rate
                let recSumm = 0;
                if (zone === 'All electoral areas') {
                    recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2', [thisYear, bussType]);
                }
                else {
                    recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoral_area = $3', [thisYear, bussType, zone]);
                }
                let varCurrRate = 0;
                if (recSumm.rows.length > 0 && recSumm.rows[0].totsum) {
                    varCurrRate = parseFloat(recSumm.rows[0].totsum);
                }
                // Calculate total payments
                if (zone === 'All electoral areas') {
                    recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2', [thisYear, bussType]);
                }
                else {
                    recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoral_area = $3', [thisYear, bussType, zone]);
                }
                let varPayment = 0;
                if (recSumm.rows.length > 0 && recSumm.rows[0].totpayments) {
                    varPayment = parseFloat(recSumm.rows[0].totpayments);
                }
                else {
                    varPayment = 0;
                }
                // Calculate balance
                const balance = varCurrRate - varPayment;
                let reportCheckResult = 0;
                let reportCheckQuery = '';
                // Check if the report already exists
                if (zone === 'All electoral areas') {
                    reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $3 AND transdate <= $4';
                    reportCheckResult = await client.query(reportCheckQuery, [bussType, row.electoral_area, firstDate, lastDate]);
                }
                else {
                    reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND transdate >= $3 AND transdate <= $4';
                    reportCheckResult = await client.query(reportCheckQuery, [bussType, zone, firstDate, lastDate]);
                }
                if (reportCheckResult.rowCount === 0) {
                    // Insert new report                    
                    const insertQuery = `                    
                        INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate)
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `;
                    await client.query(insertQuery, [
                        bussType,
                        varCurrRate,
                        varPayment,
                        balance,
                        row.electoral_area,
                        lastDate,
                    ]);
                }
            }
            // Select from bustypesummaryreport table
            let results;
            if (zone === 'All electoral areas') {
                results = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3`, [bussType, firstDate, lastDate]);
            }
            else {
                results = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`, [bussType, firstDate, lastDate, zone]);
            }
            let businessTypeSummaryReport = results.rows;
            if (businessTypeSummaryReport.length > 0) {
                console.log('BusTypeSummaryReport fetched');
                return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
            }
            else {
                console.log('No data found in bustypesummaryreport');
                return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Delete
router.delete('/delete/:firstDate/:lastDate/:zone/:bussType', async (req, res) => {
    try {
        const { firstDate, lastDate, zone, bussType } = req.params;
        const client = await pool.connect();
        try {
            // Delete from bustypesummaryreport table
            await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4', [bussType, firstDate, lastDate, zone]);
            // Select from bustypesummaryreport table
            let result = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`, [bussType, firstDate, lastDate, zone]);
            let businessTypeSummaryReport = result.rows;
            if (businessTypeSummaryReport.length > 0) {
                console.log('BusTypeSummaryReport fetched');
                return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
            }
            else {
                console.log('No data found in bustypesummaryreport');
                return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Read
router.get('/read/:firstDate/:lastDate/:zone/:bussType', async (req, res) => {
    try {
        const { firstDate, lastDate, zone, bussType } = req.params;
        const client = await pool.connect();
        try {
            // Select from bustypesummaryreport table
            let result = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`, [bussType, firstDate, lastDate, zone]);
            let busTypeSummaryReport = result.rows;
            res.status(200).json({ message: "Fetch successful", data: busTypeSummaryReport });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
export default router;
//# sourceMappingURL=busTypeSummaryReportRoute.js.map