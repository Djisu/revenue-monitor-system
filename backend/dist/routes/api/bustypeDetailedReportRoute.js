import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
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
router.post('/', async (req, res) => {
    const report = req.body;
    const query = `
        INSERT INTO bustypedetailedreport (electoral_area, buss_no, buss_name, buss_type, amountdue, amountpaid, balance, tot_grade) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [report.electoral_area, report.buss_no, report.buss_name, report.buss_type, report.amountdue, report.amountpaid, report.balance, report.tot_grade];
    try {
        const client = await pool.connect();
        await client.query(query, values);
        res.status(201).send('Report created');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error creating report');
    }
});
router.get('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM bustypedetailedreport');
        if (result.rowCount === 0) {
            res.status(204).send({ message: 'No records found', data: [] });
            return;
        }
        res.status(200).send(result.rows);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error fetching records');
        return;
    }
    finally {
        client.release();
    }
});
// router.get('/all', async (req: Request, res: Response) => {
//     console.log('in router.get(all')
//     const client: PoolClient = await pool.connect();
//     const bussResult = await client.query('SELECT * FROM bustypedetailedreport');
//     console.log('after execution')
//     console.log('bussResult.rowCount: ', bussResult.rowCount)
//     if (bussResult.rowCount === 0){
//         return res.status(202).send({ message: 'Records not found', data: [] })
//     }
//     console.log('Records found')
//     return res.status(200).send({message: 'Records found', data: bussResult.rows})
// })
// Read One
router.get('/:buss_no', async (req, res) => {
    const buss_no = parseInt(req.params.buss_no);
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM bustypedetailedreport WHERE buss_no = $1', [buss_no]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        }
        else {
            res.status(404).send('Report not found');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving report');
    }
});
// Update
router.put('/:buss_no', async (req, res) => {
    const buss_no = parseInt(req.params.buss_no);
    const report = req.body;
    const query = `
        UPDATE bustypedetailedreport 
        SET electoral_area = $1, buss_name = $2, buss_type = $3, amountdue = $4, amountpaid = $5, balance = $6, tot_grade = $7 
        WHERE buss_no = $8
    `;
    const values = [report.electoral_area, report.buss_name, report.buss_type, report.amountdue, report.amountpaid, report.balance, report.tot_grade, buss_no];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        if (result.rowCount === 0) {
            res.status(404).send('Report not found');
        }
        else {
            res.status(200).send({ message: 'Report updated', data: result });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating report', data: 0 });
    }
});
// Delete
router.delete('/:buss_no', async (req, res) => {
    const buss_no = parseInt(req.params.buss_no);
    try {
        const client = await pool.connect();
        const result = await client.query('DELETE FROM bustypedetailedreport WHERE buss_no = $1', [buss_no]);
        if (result.rowCount === 0) {
            res.status(404).send({ message: 'Report not found', data: 0 });
        }
        else {
            res.status(200).send({ message: 'Report updated', data: result });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error deleting report', data: 0 });
    }
});
router.get('/:zone/:businessType/:newFiscalYear', async (req, res) => {
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
        const client = await pool.connect();
        console.log('about to delete');
        await client.query('DELETE FROM bustypedetailedreport');
        let businessesResult;
        console.log('about to test zone and businessType');
        // Adjusting the query based on zone and businessType
        if (zone === 'All electoral areas') {
            console.log('zone is all, businessType is specific');
            if (businessType === 'All business types') {
                businessesResult = await client.query('SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 ORDER BY electroral_area ASC', ['Active']);
            }
            else {
                console.log('zone is all, businessType is specific');
                businessesResult = await client.query('SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 AND buss_type ILIKE $2 ORDER BY electroral_area ASC', ['Active', businessType]);
            }
        }
        else {
            if (businessType === 'All business types') {
                console.log('zone is specific, businessType is all');
                businessesResult = await client.query('SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 AND electroral_area ILIKE $2  AND current_rate IS NOT NULL AND tot_grade IS NOT NULL ORDER BY electroral_area ASC', ['Active', zone]);
            }
            else {
                console.log('zone is specific, businessType is specific');
                businessesResult = await client.query('SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 AND buss_type ILIKE $2 AND electroral_area ILIKE $3 AND current_rate IS NOT NULL AND tot_grade IS NOT NULL ORDER BY electroral_area ASC', ['Active', businessType, zone]);
            }
        }
        if (businessesResult.rowCount === 0) {
            console.log('No businesses found');
            return res.status(404).json({ message: 'No businesses found', data: [] });
        }
        const businesses = businessesResult.rows;
        let varCurrRate = 0;
        let varTotPaid = 0;
        console.log('about to loop');
        for (let i = 0; i < businesses.length; i++) {
            const query = await client.query(`SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2`, [businesses[i].buss_no, fiscalyear]);
            varCurrRate = query.rowCount === 0 ? 0 : query.rows[0].totsum;
            const paymentsResult = await client.query(`SELECT SUM(paidamount) AS totsum FROM buspayments WHERE buss_no = $1 AND fiscal_year = $2`, [businesses[i].buss_no, fiscalyear]);
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
        console.log('after the loop');
        console.log('Executing query: SELECT * FROM public.bustypedetailedreport');
        let result = await client.query(`SELECT * FROM public.bustypedetailedreport ORDER BY buss_type ASC`);
        let businessTypeDetailedReports = result.rows;
        if (businessTypeDetailedReports.length > 0) {
            console.log('BusTypeDetailedReport fetched');
            return res.status(200).json({ message: 'BusTypeDetailedReport fetched', data: businessTypeDetailedReports });
        }
        else {
            console.log('No data found in bustypedetailedreport');
            return res.status(404).json({ message: 'No data found in bustypedetailedreport', data: [] });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving reports', error: error.message });
    }
});
// router.get('/:zone/:businessType/:newFiscalYear', async (req: Request<{ zone: string, businessType: string, newFiscalYear: string }>, res: Response): Promise<Response | void | any> => {
//     try {
//         const zone = req.params.zone;   
//         const businessType = req.params.businessType; 
//         const fiscalyear = parseInt(req.params.newFiscalYear, 10);
//         console.log('zone: ', zone);
//         console.log('businessType: ', businessType);
//         console.log('fiscalyear: ', fiscalyear);
//         // Check if fiscalyear is a valid integer
//         if (isNaN(fiscalyear)) {
//             console.log('Invalid fiscal year provided');
//             return res.status(400).json({ message: 'Invalid fiscal year provided' });
//         }
//         const client: PoolClient = await pool.connect();
//         console.log('about to delete');
//         await client.query('DELETE FROM bustypedetailedreport');
//         let businessesResult: any;
//         if (zone === 'All electoral areas') {
//             businessesResult = await client.query(
//                 'SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 ORDER BY electroral_area ASC',
//                 ['Active']
//             );
//         } else if (zone) {
//             if (!businessType) {
//                 businessesResult = await client.query(
//                     'SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 AND electroral_area ILIKE $2 ORDER BY electroral_area ASC',
//                     ['Active', zone]
//                 );
//             } else {
//                 businessesResult = await client.query(
//                     'SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 AND buss_type = $2 AND electroral_area = $3 ORDER BY electroral_area ASC',
//                     ['Active', businessType, zone]
//                 );
//             }
//         } else {
//             businessesResult = await client.query(
//                 'SELECT electroral_area, buss_no, buss_name, buss_type, current_rate, tot_grade FROM business WHERE status = $1 ORDER BY electroral_area ASC',
//                 ['Active']
//             );
//         }
//         if (businessesResult.rowCount === 0) {
//             console.log('No businesses found');
//             return res.status(404).json({ message: 'No businesses found', data: [] });
//         }
//         const businesses: Business[] = businessesResult.rows;
//         let varCurrRate: number = 0;
//         let varTotPaid: number = 0;
//         console.log('about to loop');
//         for (let i = 0; i < businesses.length; i++) {
//             const query = await client.query(`SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear = $2`, 
//             [businesses[i].buss_no, fiscalyear]);
//             varCurrRate = query.rowCount === 0 ? 0 : query.rows[0].totsum;
//             const paymentsResult = await client.query(`SELECT SUM(paidamount) AS totsum FROM buspayments WHERE buss_no = $1 AND fiscal_year = $2`, 
//             [businesses[i].buss_no, fiscalyear]);
//             varTotPaid = paymentsResult.rowCount === 0 ? 0 : paymentsResult.rows[0].totsum;
//             const query2 = `    
//                 INSERT INTO bustypedetailedreport (electoral_area, buss_no, buss_name, buss_type, amountdue, amountpaid, balance, tot_grade) 
//                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//             `;
//             const values2 = [
//                 businesses[i].electroral_area, 
//                 businesses[i].buss_no, 
//                 businesses[i].buss_name, 
//                 businesses[i].buss_type, 
//                 varCurrRate,                             
//                 varTotPaid, 
//                 varCurrRate - varTotPaid, 
//                 businesses[i].tot_grade
//             ];
//             await client.query(query2, values2); 
//         } 
//         console.log('Executing query: SELECT * FROM public.bustypedetailedreport');
//         let result: QueryResult<BusTypeDetailedReport> = await client.query(`SELECT * FROM public.bustypedetailedreport`);
//         let businessTypeDetailedReports: BusTypeDetailedReport[] = result.rows;
//         if (businessTypeDetailedReports.length > 0) {
//             console.log('BusTypeDetailedReport fetched');
//             return res.status(200).json({ message: 'BusTypeDetailedReport fetched', data: businessTypeDetailedReports });
//         } else {
//             console.log('No data found in bustypedetailedreport');
//             return res.status(404).json({ message: 'No data found in bustypedetailedreport', data: [] });
//         }
//     } catch (error: any) {
//         console.error(error);
//         return res.status(500).json({ message: 'Error retrieving reports', error: error.message });
//     }
// });
export default router;
//# sourceMappingURL=bustypeDetailedReportRoute.js.map