import  { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { Router } from 'express';
import { QueryResult } from 'pg';

import pkg from 'pg';
import { Business } from '../../models/Business.js';

const { Pool } = pkg;

// Define the interface
interface BusTypeDetailedReport {
    electoral_area: string;
    buss_no: number;
    buss_name: string;
    buss_type: string;
    amountdue: number;
    amountpaid: number;
    balance: number;
    tot_grade: string;
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

// Create
router.post('/', async (req: Request<object, object, BusTypeDetailedReport>, res: Response) => {
    const report: BusTypeDetailedReport = req.body;
const client = await pool.connect()
    const query = `
        INSERT INTO bustypedetailedreport (electoral_area, buss_no, buss_name, buss_type, amountdue, amountpaid, balance, tot_grade) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [report.electoral_area, report.buss_no, report.buss_name, report.buss_type, report.amountdue, report.amountpaid, report.balance, report.tot_grade];
    
    try {
        await client.query(query, values);
        res.status(201).send('Report created');
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    }finally{
        client.release()
    }
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
const client = await pool.connect()    
    try {
        const result = await client.query('SELECT * FROM bustypedetailedreport');

        if (result.rowCount === 0) {
            res.status(204).send({ message: 'No records found', data: [] });
            return 
        }

        res.status(200).send(result.rows);
        return 
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

// Read One
router.get('/:buss_no', async (req: Request<{ buss_no: string }>, res: Response) => {
    const buss_no = parseInt(req.params.buss_no);

 const client = await pool.connect()    
 
    try {
        const result = await client.query('SELECT * FROM bustypedetailedreport WHERE buss_no = $1', [buss_no]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Report not found');
        }
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    }finally{
        client.release()
    }
});

// Update
router.put('/:buss_no', async (req: Request<{ buss_no: string }, object, BusTypeDetailedReport>, res: Response) => {
    const buss_no = parseInt(req.params.buss_no);
    const report: BusTypeDetailedReport = req.body;
    const query = `
        UPDATE bustypedetailedreport 
        SET electoral_area = $1, buss_name = $2, buss_type = $3, amountdue = $4, amountpaid = $5, balance = $6, tot_grade = $7 
        WHERE buss_no = $8
    `;
    const values = [report.electoral_area, report.buss_name, report.buss_type, report.amountdue, report.amountpaid, report.balance, report.tot_grade, buss_no];
const client = await pool.connect()   
     try {
        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            res.status(404).send('Report not found');
        } else {
            res.status(200).send({message: 'Report updated', data: result});
        }
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    }finally{
        client.release()
    }
});

// Delete
router.delete('/:buss_no', async (req: Request<{ buss_no: string }>, res: Response) => {
    const buss_no = parseInt(req.params.buss_no);
 const client = await pool.connect()
    try {
        const result = await client.query('DELETE FROM bustypedetailedreport WHERE buss_no = $1', [buss_no]);

        if (result.rowCount === 0) {
            res.status(404).send({message: 'Report not found', data: 0});
        } else {
            res.status(200).send({message: 'Report updated', data: result});
        }
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error creating BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    }finally{
        client.release()
    }
});


router.get('/:zone/:businessType/:newFiscalYear', async (req: Request<{ zone: string, businessType: string, newFiscalYear: string }>, res: Response): Promise<Response | void | unknown> => {
    
const client = await pool.connect()    
      try {
        const zone = req.params.zone;   
        const businessType = req.params.businessType; 
        const fiscalyear = parseInt(req.params.newFiscalYear, 10);

        console.log('zone: ', zone);
        console.log('businessType: ', businessType);
        console.log('fiscalyear: ', fiscalyear);

        // Check if fiscalyear is a valid integer
        if (isNaN(fiscalyear)) {
            console.log('Invalid fiscal year provided');
            return res.status(400).json({ message: 'Invalid fiscal year provided' });
        }

        
        console.log('about to delete');
        await client.query('DELETE FROM bustypedetailedreport');

        let businessesResult: QueryResult<Business>;

        console.log('about to test zone and businessType')
        
        // Adjusting the query based on zone and businessType
        if (zone === 'All electoral areas') {
            console.log('zone is all, businessType is specific')

            if (businessType === 'All business types') {
                businessesResult = await client.query(
                    'SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 ORDER BY electroral_area ASC',
                    ['Active']
                );
            } else {
                console.log('zone is all, businessType is specific')
                businessesResult = await client.query(
                    'SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 AND buss_type ILIKE $2 ORDER BY electroral_area ASC',
                    ['Active', businessType]
                );
            }
        } else {
            if (businessType === 'All business types') {
                console.log('zone is specific, businessType is all')
                businessesResult = await client.query(
                    'SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 AND electroral_area ILIKE $2  AND current_rate IS NOT NULL AND tot_grade IS NOT NULL ORDER BY electroral_area ASC',
                    ['Active', zone]
                );
            } else {
                console.log('zone is specific, businessType is specific')
                businessesResult = await client.query(
                    'SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 AND buss_type ILIKE $2 AND electroral_area ILIKE $3 AND current_rate IS NOT NULL AND tot_grade IS NOT NULL ORDER BY electroral_area ASC',
                    ['Active', businessType, zone]
                );
            }
        }

        if (businessesResult.rowCount === 0) {
            console.log('No businesses found');
            return res.status(404).json({ message: 'No businesses found', data: [] });
        }

        const businesses: Business[] = businessesResult.rows;
        let varCurrRate: number = 0;
        let varTotPaid: number = 0;

        console.log('about to loop');
        for (let i = 0; i < businesses.length; i++) {
            const query = await client.query(
                `SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2`, 
                [businesses[i].buss_no, fiscalyear]
            );

            varCurrRate = query.rowCount === 0 ? 0 : query.rows[0].totsum;

            const paymentsResult = await client.query(
                `SELECT SUM(paidamount) AS totsum FROM buspayments WHERE buss_no = $1 AND fiscal_year = $2`, 
                [businesses[i].buss_no, fiscalyear]
            );

            // Ensure varTotPaid is set to 0 if no results are found
            varTotPaid = paymentsResult.rowCount === 0 ? 0 : paymentsResult.rows[0].totsum || 0;
            // Safely handle tot_grade
            const totGrade = businesses[i].tot_grade ?? 0; // Fallback to 0 if undefined

            const query2 = `    
                INSERT INTO bustypedetailedreport (electoral_area, buss_no, buss_name, buss_type, amountdue, amountpaid, balance, tot_grade) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            const values2 = [
                businesses[i].electroral_area, 
                businesses[i].buss_no, 
                businesses[i].buss_name, 
                businesses[i].buss_type, 
                varCurrRate | 0,                             
                varTotPaid | 0, // This will be 0 if the query returns null
                varCurrRate - varTotPaid | 0, 
                totGrade
            ];

            await client.query(query2, values2); 
        }
        console.log('after the loop')

        console.log('Executing query: SELECT * FROM public.bustypedetailedreport');
        const result: QueryResult<BusTypeDetailedReport> = await client.query(`SELECT * FROM public.bustypedetailedreport ORDER BY buss_type ASC`);
        const businessTypeDetailedReports: BusTypeDetailedReport[] = result.rows;

        if (businessTypeDetailedReports.length > 0) {
            console.log('BusTypeDetailedReport fetched');
            return res.status(200).json({ message: 'BusTypeDetailedReport fetched', data: businessTypeDetailedReports });
        } else {
            console.log('No data found in bustypedetailedreport');
            return res.status(404).json({ message: 'No data found in bustypedetailedreport', data: [] });
        }
    } catch (error: unknown) {
        if (error instanceof Error){
           console.error('Error:', error);
           res.status(500).json({ success: false, message: 'Error getting BusinessType record', error }); 
        }else{
            res.status(500).json({message: "Unknown error"})
        }
        
    }finally{
        client.release()
    }
});

export default router;