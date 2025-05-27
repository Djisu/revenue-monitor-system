import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import { QueryResult } from 'pg';

import pkg from 'pg';

const { Pool } = pkg;

export interface Business {
    buss_no: number;
    buss_name?: string;
    buss_address?: string;
    buss_type?: string;
    buss_town?: string;
    buss_permitNo?: string;
    street_name?: string;
    landmark?: string;
    electroral_area?: string;
    property_class?: string;
    tot_grade?: string;
    ceo?: string;
    telno?: string;
    strategiclocation?: number;
    productvariety?: number;
    businesspopularity?: number;
    businessenvironment?: number;
    sizeofbusiness?: number;
    numberofworkingdays?: number;
    businessoperatingperiod?: number;
    competitorsavailable?: number;
    assessmentby?: string;
    transdate?: Date;
    balance?: number;
    status?: string;
    current_rate?: number;
    property_rate?: number;
    totalmarks?: number;
    emailaddress?: string;  
    noofemployees?: number;
    noofbranches?: number;
    BALANCENEW?: number;
    gps_address?: string; 
    serialNo?: number;
    buss_location?: string;
}

interface SumResult {
    totsum: string | null;  
    totpayments: string | null; 
}

// Define the interface
interface BusTypeSummaryReport {
    buss_type: string;        // VARCHAR(50)
    amountdue: number;       // DECIMAL(13,2)
    amountpaid: number;      // DECIMAL(13,2)
    balance: number;         // DECIMAL(13,2)
    electoral_area: string;  // VARCHAR(50)
}


const router = Router();


// experiment ///
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Load the environment variables from the .env file
dotenv.config();

// Determine the environment (development or production)
const env = process.env.NODE_ENV || 'development';  // Defaults to 'development'
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
let sslConfig: false | { rejectUnauthorized: boolean };

if (process.env.NODE_ENV === 'production') { 
  sslConfig = { rejectUnauthorized: true }; // Important for Render.com
} else {
  sslConfig = false;
}

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    ssl: sslConfig,
};

const pool = new Pool(dbConfig);

// end of experiment ///



// CRUD Operations

// Create
router.get('/create/:firstDate/:lastDate/:zone/:bussType/:user', async (req: Request, res: Response): Promise<Response | void | unknown> => {
   const client = await pool.connect()

    try {
        const { lastDate, zone, bussType, user } = req.params;
        console.log('zone:', zone);
        console.log('bussType:', bussType);
        console.log('user:', user);
        
        const userId: string = String(user); // Convert user to string
        console.log('User ID: ', userId);
        
        const thisYear = lastDate.substring(0, 4);
        console.log('This year: ', thisYear);
        
        // Delete from bustypesummaryreport table for the specific user
        await client.query('DELETE FROM bustypesummaryreport WHERE user_id = $1', [userId]);

        // Check for existing records
        const searchResult: QueryResult<Business> = await client.query('SELECT * FROM bustypesummaryreport WHERE user_id = $1', [userId]);
        if (searchResult.rows.length > 0) {           
            console.log('Deleted records NOT DELETED!!!!!');
            res.status(404).json({message: "Deleted records NOT DELETED", data: []})
        }

        // Begin querying business data based on zone
        console.log('SELECT DISTINCT electroral_area FROM business WHERE status = $1');
        let result: QueryResult<Business>;

        if (zone === 'All electoral areas') {
            // When zone is "All electoral areas", only filter by bussType if it is not "All business types"
            if (bussType === 'All business types') {
                result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1', ['Active']);
            } else {
                result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND buss_type ILIKE $2', ['Active', bussType]);
            }
        } else {
            // When a specific zone is provided
            if (bussType === 'All business types') {
                result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND electroral_area ILIKE $2', ['Active', zone]);
            } else {
                result = await client.query('SELECT DISTINCT electroral_area FROM business WHERE status = $1 AND electroral_area ILIKE $2 AND buss_type ILIKE $3', ['Active', zone, bussType]);
            }
        }

        console.log('result.rows.length: ', result.rows.length);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No businesses found in the selected zone', data: [] });
        }

        let varCurrRate: number = 0;
        let varPayment: number = 0;
        let varBalance: number = 0;

        console.log('Calculating current rate and balance for each business');
        
        for (const row of result.rows) {
            // Reset variables for each iteration
            varCurrRate = 0;
            varPayment = 0;
            varBalance = 0;

            console.log('row.electroral_area: ', row.electroral_area);
            console.log('==========================================');

            // Calculate current balance
            console.log('busscurrbalance')
            if (bussType === 'All business types') {
                console.log('All business types')
                const recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND electoralarea ILIKE $2', 
                    [thisYear, row.electroral_area]
                );
                varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
            } else {
                console.log('specific business type')
                const recSumm = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE fiscalyear = $1 AND buss_type ILIKE $2 AND electoralarea ILIKE $3', 
                   [thisYear, bussType, row.electroral_area]
                );
                varCurrRate = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totsum) : 0;
            }
            console.log('varCurrRate: ', varCurrRate);

            // Calculate total payments
            console.log('buspayments')
            if (bussType === 'All business types') {
                console.log('All business types')
                const recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND electroral_area ILIKE $2', 
                   [thisYear, row.electroral_area]
                );
                varPayment = recSumm.rows.length > 0 ? parseFloat(recSumm.rows[0].totpayments) : 0;
            } else {
                console.log('specific business type')
                const recSumm = await client.query('SELECT SUM(paidamount) AS totpayments FROM buspayments WHERE fiscal_year = $1 AND buss_type ILIKE $2 AND electroral_area ILIKE $3', 
                   [thisYear, bussType, row.electroral_area]
                );
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
        const results: QueryResult<BusTypeSummaryReport> = await client.query(`SELECT DISTINCT * FROM bustypesummaryreport WHERE buss_type = $1 AND user_id = $2`, [bussType, userId]);

        // Return the response
        if (results.rows.length > 0) {
            console.log('Returning the data');
            return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: results.rows });
        } else {
            console.log('404---No data found in bustypesummaryreport');
            return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
        }
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    } finally {
        client.release();
    }
});


router.put('/update/:firstDate/:lastDate/:zone/:bussType', async (req: Request, res: Response): Promise<Response | void | unknown> => {
    try {
        const {firstDate, lastDate, zone, bussType} = req.params;

        // Find year from cbolastdate
        const thisYear = lastDate.substring(0, 4);

       const client = await pool.connect()

        try {
            // Delete from bustypesummaryreport table
            await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4', [bussType, firstDate, lastDate, zone]);

            // Calculate current rate and balance for each electoral area
            let result: QueryResult<BusTypeSummaryReport>

            if (zone === 'All electoral areas') {                
                result = await client.query('SELECT DISTINCT electoral_area FROM business WHERE status = $1 AND buss_type = $2', ['Active', bussType]);
            } else {
                result = await client.query('SELECT DISTINCT electoral_area FROM business WHERE status = $1 AND buss_type = $2 AND electoral_area = $3', ['Active', bussType, zone]);
            }

            for (const row of result.rows) {
                // Calculate current rate
                let recSumm: QueryResult<SumResult>;

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

                let varPayment: number = 0

                if (recSumm.rows.length > 0 && recSumm.rows[0].totpayments) {
                    varPayment = parseFloat(recSumm.rows[0].totpayments);
                } else {
                    varPayment = 0;
                }

                // Calculate balance
                const balance = varCurrRate - varPayment;

                let reportCheckResult: QueryResult<SumResult>;
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
            let results: QueryResult<BusTypeSummaryReport>
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

            const businessTypeSummaryReport: BusTypeSummaryReport[] = results.rows;

            if (businessTypeSummaryReport.length > 0) {
                console.log('BusTypeSummaryReport fetched');
                return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
            } else {
                console.log('No data found in bustypesummaryreport');
                return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
            }

        } catch (error: unknown) {
            if (error instanceof Error){
               console.error('Error:', error);
               res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
            }else{
                res.status(500).json({message: "Unknown error"})
            }
            
        } finally {
            client.release();
        }
    } catch (error: unknown) {
        if (error instanceof Error){
            console.error('Error in /busTypeSummaryReport endpoint:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete
router.delete('/delete/:firstDate/:lastDate/:zone/:bussType', async (req: Request, res: Response): Promise<Response | void | unknown> => {
    try {
        const {firstDate, lastDate, zone, bussType} = req.params;

       const client = await pool.connect()
;
        try {
            // Delete from bustypesummaryreport table
            await client.query('DELETE FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4', [bussType, firstDate, lastDate, zone]);

            // Select from bustypesummaryreport table
            const result: QueryResult<BusTypeSummaryReport> = await client.query(
                `SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`,
                [bussType, firstDate, lastDate, zone]
            );
            const businessTypeSummaryReport: BusTypeSummaryReport[] = result.rows;

            if (businessTypeSummaryReport.length > 0) {
                console.log('BusTypeSummaryReport fetched');
                return res.status(200).json({ message: 'BusTypeSummaryReport fetched', data: businessTypeSummaryReport });
            } else {
                console.log('No data found in bustypesummaryreport');
                return res.status(404).json({ message: 'No data found in bustypesummaryreport', data: [] });
            }

        } catch (error: unknown) {
            if (error instanceof Error){
               console.error('Error:', error);
               res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
            }else{
                res.status(500).json({message: "Unknown error"})
            }
            
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

       const client = await pool.connect()
;
        try {
            // Select from bustypesummaryreport table
            const result: QueryResult<BusTypeSummaryReport> = await client.query(
                `SELECT * FROM bustypesummaryreport WHERE buss_type = $1 AND transdate >= $2 AND transdate <= $3 AND electoral_area = $4`,
                [bussType, firstDate, lastDate, zone]
            );
            const busTypeSummaryReport: BusTypeSummaryReport[] = result.rows;

            res.status(200).json({message: "Fetch successful", data: busTypeSummaryReport});
        } catch (error: unknown) {
            if (error instanceof Error){
               console.error('Error:', error);
               res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
            }else{
               res.status(500).json({message: "Unknown error"})
            }    
        } finally {
            client.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

                   
export default router;