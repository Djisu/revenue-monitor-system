import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
//import { Pool, PoolClient } from 'pg';
import { QueryResult, PoolClient } from 'pg';

import pkg from 'pg';
import { Business } from '../../models/Business';
const { Pool } = pkg;

dotenv.config(); // Load .env file from the default location

// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};

// Define the interface
interface BusTypeSummaryReport {
    buss_type: string;        // VARCHAR(50)
    amountdue: number;       // DECIMAL(13,2)
    amountpaid: number;      // DECIMAL(13,2)
    balance: number;         // DECIMAL(13,2)
    electoral_area: string;  // VARCHAR(50)
}

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
router.get('/create/:firstDate/:lastDate/:zone/:bussType/:user', async (req: Request, res: Response): Promise<Response | void | any> => {
    const client: PoolClient = await pool.connect();
    
    try {
        const { firstDate, lastDate, zone, bussType, user } = req.params;

        // Assuming 'user' is the user ID passed from the frontend
        console.log('User ID: ', user);

        const thisYear = lastDate.substring(0, 4);
        

        // Make sure to validate the user ID against your application logic here

        // Delete from bustypesummaryreport table for the specific user
        await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND user_id = $3', [bussType, zone, user]);

        let result: QueryResult<any>;
        if (zone === 'All electoral areas') {
            result = await client.query('SELECT DISTINCT electoral_area, buss_type FROM business WHERE status = $1', ['Active']);
        } else {
            result = await client.query('SELECT DISTINCT electoral_area, buss_type FROM business WHERE status = $1 AND electoral_area = $2', ['Active', zone]);
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No businesses found in the selected zone', data: [] });
        }

        let recSumm: QueryResult<any>;
        let varCurrRate: number = 0;
        let varPayment: number = 0;
        let varBalance: number = 0;

        // Calculate current rate
        if (result.rows.length === 1) {
            if (zone === 'All electoral areas') {
                recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2', [thisYear, bussType]);
                varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
            } else {
                recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, zone]);
                varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
            }

            if (zone === 'All electoral areas') {
                recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2', [thisYear, bussType]);
                varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
            } else {
                recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, zone]);
                varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
            }

            varBalance = varCurrRate - varPayment;

            // Check if the report already exists for the specific user
            const reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND user_id = $3 AND transdate >= $4 AND transdate <= $5';
            const reportCheckResult = await client.query(reportCheckQuery, [bussType, zone, user, firstDate, lastDate]);

            if (reportCheckResult.rowCount === 0) {
                const insertQuery = `
                    INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate, user_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `;
                await client.query(insertQuery, [bussType, varCurrRate, varPayment, varBalance, zone, lastDate, user]);
            }
        } else {
            for (const row of result.rows) {
                if (zone === 'All electoral areas') {
                    recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, row.electoral_area]);
                    varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
                } else {
                    recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, zone]);
                    varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
                }

                if (zone === 'All electoral areas') {
                    recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, row.electoral_area]);
                    varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
                } else {
                    recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoralarea = $3', [thisYear, bussType, zone]);
                    varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
                }

                varBalance = varCurrRate - varPayment;

                // Check if the report already exists for the specific user
                const reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND user_id = $3 AND transdate >= $4 AND transdate <= $5';
                const reportCheckResult = await client.query(reportCheckQuery, [bussType, row.electoral_area, user, firstDate, lastDate]);

                if (reportCheckResult.rowCount === 0) {
                    const insertQuery = `
                        INSERT INTO bustypesummaryreport(buss_type, amountdue, amountpaid, balance, electoral_area, transdate, user_id)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                    `;
                    await client.query(insertQuery, [bussType, varCurrRate, varPayment, varBalance, row.electoral_area, lastDate, user]);
                }
            }
        }

        let results: QueryResult<any>;
        if (zone === 'All electoral areas') {
            results = await client.query(`SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND user_id = $2`, [bussType, user]);
        } else {
            results = await client.query('SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND electoral_area = $2 AND user_id = $3', [bussType, zone, user]);
        }

        let businessTypeSummaryReport = results.rows;
        if (businessTypeSummaryReport.length > 0) {
            return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
        } else {
            return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
        }

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
});


// router.get('/create/:firstDate/:lastDate/:zone/:bussType/:user', async (req: Request, res: Response): Promise<Response | void | any> => {
//     try {
//         const { firstDate, lastDate, zone, bussType, user } = req.params;

//         // Assuming 'user' is the user ID passed from the frontend
//         console.log('User ID: ', user);

//         const thisYear = lastDate.substring(0, 4);
//         const client: PoolClient = await pool.connect();
       
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

//         const client: PoolClient = await pool.connect();
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
router.put('/update/:firstDate/:lastDate/:zone/:bussType', async (req: Request, res: Response): Promise<Response | void | any> => {
    try {
        const {firstDate, lastDate, zone, bussType} = req.params;

        // Find year from cbolastdate
        const thisYear = lastDate.substring(0, 4);

        const client: PoolClient = await pool.connect();
        try {
            // Delete from bustypesummaryreport table
            await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4', [bussType, firstDate, lastDate, zone]);

            // Calculate current rate and balance for each electoral area
            let result: QueryResult<any>

            if (zone === 'All electoral areas') {                
                result = await client.query('SELECT DISTINCT electoral_area FROM business WHERE status = $1 AND buss_type = $2', ['Active', bussType]);
            } else {
                result = await client.query('SELECT DISTINCT electoral_area FROM business WHERE status = $1 AND buss_type = $2 AND electoral_area = $3', ['Active', bussType, zone]);
            }

            for (const row of result.rows) {
                // Calculate current rate
                let recSumm: any = 0

                if (zone === 'All electoral areas') {
                    recSumm =  await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2',
                    [thisYear, bussType]);
                } else {
                    recSumm =  await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type = $2 AND electoral_area = $3',
                    [thisYear, bussType, zone]);
                }

                let varCurrRate = 0;
                if (recSumm.rows.length > 0 && recSumm.rows[0].totsum) {
                    varCurrRate = parseFloat(recSumm.rows[0].totsum);
                }

                // Calculate total payments
                if (zone === 'All electoral areas') {
                    recSumm =  await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2',
                    [thisYear, bussType]);
                } else {
                    recSumm =  await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type = $2 AND electoral_area = $3',
                    [thisYear, bussType, zone]);
                }

                let varPayment = 0;
                if (recSumm.rows.length > 0 && recSumm.rows[0].totpayments) {
                    varPayment = parseFloat(recSumm.rows[0].totpayments);
                } else {
                    varPayment = 0;
                }

                // Calculate balance
                const balance = varCurrRate - varPayment;

                let reportCheckResult: any = 0
                let reportCheckQuery = ''

                // Check if the report already exists
                if (zone === 'All electoral areas') {
                    reportCheckQuery = 'SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $3 AND transdate <= $4';
                    reportCheckResult = await client.query(reportCheckQuery, [bussType, row.electoral_area, firstDate, lastDate]);
                } else {
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
            let results: QueryResult<any>
            if (zone === 'All electoral areas') {
                results = await client.query(
                    `SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3`,
                    [bussType, firstDate, lastDate]
                );
            } else {
                results = await client.query(
                    `SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`,
                    [bussType, firstDate, lastDate, zone]
                );
            }

            let businessTypeSummaryReport: BusTypeSummaryReport[] = results.rows;

            if (businessTypeSummaryReport.length > 0) {
                console.log('BusTypeSummaryReport fetched');
                return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
            } else {
                console.log('No data found in bustypesummaryreport');
                return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete
router.delete('/delete/:firstDate/:lastDate/:zone/:bussType', async (req: Request, res: Response): Promise<Response | void | any> => {
    try {
        const {firstDate, lastDate, zone, bussType} = req.params;

        const client: PoolClient = await pool.connect();
        try {
            // Delete from bustypesummaryreport table
            await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4', [bussType, firstDate, lastDate, zone]);

            // Select from bustypesummaryreport table
            let result: QueryResult<BusTypeSummaryReport> = await client.query(
                `SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`,
                [bussType, firstDate, lastDate, zone]
            );
            let businessTypeSummaryReport: BusTypeSummaryReport[] = result.rows;

            if (businessTypeSummaryReport.length > 0) {
                console.log('BusTypeSummaryReport fetched');
                return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
            } else {
                console.log('No data found in bustypesummaryreport');
                return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Read
router.get('/read/:firstDate/:lastDate/:zone/:bussType', async (req: Request, res: Response) => {
    try {
        const {firstDate, lastDate, zone, bussType} = req.params;

        const client: PoolClient = await pool.connect();
        try {
            // Select from bustypesummaryreport table
            let result: QueryResult<BusTypeSummaryReport> = await client.query(
                `SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`,
                [bussType, firstDate, lastDate, zone]
            );
            let busTypeSummaryReport: BusTypeSummaryReport[] = result.rows;

            res.status(200).json({message: "Fetch successful", data: busTypeSummaryReport});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

                   
export default router;