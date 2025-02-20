// backend/src/routes/api/businessTypeRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import { Pool, PoolClient, QueryResult } from 'pg';
import { generatePdf } from '../../generatePdf.js';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection pool configuration
const poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'revmonitor',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432', 10),
};

const pool = new Pool(poolConfig);

// BusinessType data interface
interface BusinessTypeData {
    Business_Type: string;
}

// Function to sanitize input data
function sanitizeBusinessTypeData(data: any): BusinessTypeData {
    return {
        Business_Type: data.Business_Type || ''
    };
}

// Create a new BusinessType record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    console.log('Creating a new businessType record');

    const businessTypeData: BusinessTypeData = sanitizeBusinessTypeData(req.body);

    const client: PoolClient = await pool.connect();
    try {
        const result: QueryResult = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [businessTypeData.Business_Type]);

        if (Array.isArray(result.rows) && result.rows.length > 0) {          
            res.status(409).json({ message: 'Business Type record already exists.' });
            return;
        }

        // Insert the new BusinessType data
        await client.query('INSERT INTO businesstype (Business_Type) VALUES ($1)', [businessTypeData.Business_Type]);

        res.status(201).json({ success: true, message: 'BusinessType record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error creating BusinessType record', error });
    } finally {
        client.release();
    }
});

// Read all BusinessType records
router.get('/all', async (req: Request, res: Response) => {
    console.log('Fetching all businessType records');

    const client: PoolClient = await pool.connect();
    try {
        const result: QueryResult = await client.query('SELECT * FROM businesstype');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching BusinessType records', error });
    } finally {
        client.release();
    }
});

// Read a single BusinessType record by Business_Type
router.get('/:Business_Type', async (req: Request, res: Response) => {
    const { Business_Type } = req.params;

    const client: PoolClient = await pool.connect();
    try {
        const result: QueryResult = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [Business_Type]);

        if (Array.isArray(result.rows) && result.rows.length > 0) {
            res.status(200).json({ success: true, data: result.rows[0] }); // Return the first row
        } else {
            res.status(404).json({ success: false, message: 'BusinessType record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching BusinessType record', error });
    } finally {
        client.release();
    }
});

// Update a BusinessType record
router.put('/:Business_Type', async (req: Request, res: Response): Promise<void> => {
    const { Business_Type } = req.params;
    const businessTypeData: BusinessTypeData = sanitizeBusinessTypeData(req.body);

    const client: PoolClient = await pool.connect();
    try {
        const result: QueryResult = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [businessTypeData.Business_Type]);

        if (Array.isArray(result.rows) && result.rows.length > 0) {          
            res.status(409).json({ success: false, message: 'Business Type record already exists.' });
            return;
        }

        // Update the BusinessType data
        await client.query('UPDATE businesstype SET Business_Type = $1 WHERE Business_Type = $2', [businessTypeData.Business_Type, Business_Type]);

        res.status(200).json({ success: true, message: 'BusinessType record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating BusinessType record', error });
    } finally {
        client.release();
    }
});

// Delete a BusinessType record
router.delete('/:Business_Type', async (req: Request, res: Response) => {
    const { Business_Type } = req.params;

    console.log('Deleting BusinessType record:', Business_Type);

    const client: PoolClient = await pool.connect();
    try {
        const result: QueryResult = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [Business_Type]);

        if (Array.isArray(result.rows) && result.rows.length === 0) {          
            res.status(409).json({ success: true, message: 'Business Type record does not exist.' });
            return;
        }

        // Delete the BusinessType record
        await client.query('DELETE FROM businesstype WHERE Business_Type = $1', [Business_Type]);
       
        res.status(200).json({ success: true, message: 'BusinessType record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting BusinessType record', error });
    } finally {
        client.release();
    }
});

// Ensure the permits directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const permitDir = path.join(__dirname, 'permits');

const fsPromises = fs.promises;

async function ensurePermitDirIsEmpty() {
    try {
        // Check if the directory exists
        await fsPromises.access(permitDir);
        console.log('Permits directory already exists:', permitDir);

        // Read all files and subdirectories in the directory
        const files = await fsPromises.readdir(permitDir);

        // Remove all files and subdirectories
        for (const file of files) {
            const filePath = path.join(permitDir, file);
            const stat = await fsPromises.lstat(filePath);
            if (stat.isDirectory()) {
                // Recursively remove subdirectories
                await fsPromises.rm(filePath, { recursive: true, force: true });
            } else {
                // Remove files
                await fsPromises.unlink(filePath);
            }
        }
        console.log('Permits directory emptied:', permitDir);
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            // Directory does not exist, create it
            await fsPromises.mkdir(permitDir, { recursive: true });
            console.log('Created permits directory:', permitDir);
        } else {
            console.error('Error accessing permits directory:', err);
        }
    }
}

// Function to find business balance
async function findBusinessBalance(bussNo: number): Promise<number> {
    const client: PoolClient = await pool.connect();
    try {
        // Get current year and previous fiscal year
        const currentYear = new Date().getFullYear();

        // Find all payments
        const prevPaymentsResult: QueryResult = await client.query('SELECT SUM(paidAmount) AS totsum FROM buspayments WHERE buss_no = $1 AND fiscal_year < $2', [bussNo, currentYear]);
        const prevPayments = prevPaymentsResult.rows[0]?.totsum ?? 0;

        // Find all billings
        const prevBalancesResult: QueryResult = await client.query('SELECT SUM(current_balance) AS totPrevBal FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear < $2', [bussNo, currentYear]);
        const prevBalances = prevBalancesResult.rows[0]?.totPrevBal ?? 0;

        // Calculate balance
        return prevBalances - prevPayments;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching business balance');
    } finally {
        client.release();
    }
}

// Function to find total payable based on business number
export async function findTotalPayable(txtBussNo: number): Promise<number> {
    const client: PoolClient = await pool.connect();
    try {
        // Prepare the SQL query
        const query = `
            SELECT SUM(current_balance) AS totsum
            FROM busscurrbalance
            WHERE buss_no = $1;
        `;

         // Execute the query with the business number
        const result = await client.query(query, [txtBussNo]);
        
        // Extract the total sum from the result
        return result.rows[0]?.totsum ?? 0;

    } catch (error) {
        console.error('Error finding total payable:', error);
        throw error; // Re-throw the error after logging it
    } finally {
        client.release();
    }
}

// Function to find the current rate
export async function findCurrentRate(txtBussNo: number): Promise<number> {
    const client: PoolClient = await pool.connect();
    try {
        // Get the current year
        const currentYear = new Date().getFullYear();

        // Query to find the current rate
        const query = `
            SELECT current_balance 
            FROM busscurrbalance 
            WHERE buss_no = $1 
              AND fiscalyear = $2
        `;

        // Execute the query
        const result: QueryResult = await client.query(query, [txtBussNo, currentYear]);

        // Check if results are returned and not null
        let varPrevBalances = 0;
        if (result.rows.length > 0 && result.rows[0].current_balance !== null) {
            varPrevBalances = result.rows[0].current_balance;
        }

        return varPrevBalances;
    } catch (error) {
        console.error('Error:', error);
        return 0;
    } finally {
        client.release();
    }
}

export default router;

// app.get('/api/business-types', async (req, res) => {
//     try {
//         const result = await db.query("select distinct buss_type from tb_business order by buss_type asc");
//         res.status(200).json(result.rows.map((row: any) => row.buss_type));
//     } catch (error) {
//         res.status(500).send({ success: false, message: error.message });
//     }
// });

// app.post('/api/produce-report', async (req, res) => {
//     const { businessType, reportType, isActual } = req.body;

//     try {
//         let deleteQuery;
//         let insertQuery;
//         let reportFileName;

//         if (isActual) {
//             deleteQuery = "delete from tmp_business";
//             if (businessType) {
//                 insertQuery = `insert into tmp_business select * from tb_business where buss_type=$1 and current_rate>0 order by tot_grade asc`;
//             } else {
//                 insertQuery = `insert into tmp_business select * from tb_business where current_rate>0 order by tot_grade asc`;
//             }

//             switch (reportType) {
//                 case 'sorted-by-category':
//                     reportFileName = "ACTUAL BUSINESS TYPES REPORT GRADE.rpt";
//                     break;
//                 case 'electoral-area':
//                     reportFileName = "ACTUAL BUSINESS TYPES REPORT ELECTORAL AREA.rpt";
//                     break;
//                 case 'current-rates':
//                     reportFileName = "ACTUAL BUSINESS TYPES REPORT CURRENTRATE.rpt";
//                     break;
//                 default:
//                     return res.status(400).send({ success: false, message: "Invalid report type" });
//             }
//         } else {
//             deleteQuery = "delete from rept_business";
//             if (businessType) {
//                 insertQuery = `insert into rept_business select * from tb_business where buss_type like '%' || $1 || '%' and current_rate>0 order by buss_type`;
//             } else {
//                 insertQuery = `insert into rept_business select * from tb_business where current_rate>0 order by buss_type`;
//             }

//             switch (reportType) {
//                 case 'sorted-by-category':
//                     reportFileName = "business types report.rpt";
//                     break;
//                 case 'electoral-area':
//                     reportFileName = "BUSINESS TYPES REPORT ELECTORAL AREA.rpt";
//                     break;
//                 case 'current-rates':
//                     reportFileName = "BUSINESS TYPES REPORT CURRENTRATE.rpt";
//                     break;
//                 default:
//                     return res.status(400).send({ success: false, message: "Invalid report type" });
//             }
//         }

//         // Delete from the relevant temporary table
//         await db.query(deleteQuery);

//         // Insert into the relevant temporary table
//         await db.query(insertQuery, [businessType]);

//         // Check the temporary table
//         const tmpResult = await db.query(`select * from tmp_business`);
//         if (tmpResult.rows.length > 0) {
//             res.status(200).send({ success: true, message: "Processing completed", reportFileName });
//         } else {
//             res.status(404).send({ success: false, message: "No records found" });
//         }
//     } catch (error) {
//         res.status(500).send({ success: false, message: error.message });
//     }
// });




// // backend/src/routes/api/businessTypeRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader } from 'mysql2/promise';

// const router = Router();

// // Load environment variables from .env file
// dotenv.config();

// // MySQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
// };

// // BusinessType data interface
// interface BusinessTypeData {
//     Business_Type: string;
// }

// // Create a new BusinessType record
// router.post('/create', async (req: Request, res: Response): Promise<void> => {
//     console.log('Creating a new businessType record');

//     const businessTypeData: BusinessTypeData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         const [rows] = await connection.execute('SELECT * FROM businesstype WHERE Business_Type = ?', 
//         [businessTypeData.Business_Type]
//         );

//         if (Array.isArray(rows) && rows.length > 0) {          
//             res.status(409).json({ message: 'Business Type record already exists.' });
//             return;
//         }

//         // Insert the new BusinessType data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_BusinessType (Business_Type) 
//             VALUES (?)`,
//             [businessTypeData.Business_Type]
//         );

//         res.status(201).json({ success: true, message: 'BusinessType record created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ success: false, message: 'Error creating BusinessType record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read all BusinessType records
// router.get('/all', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     console.log('Fetching all businessType records');

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BusinessType');
//         res.status(200).json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({  success: false, message: 'Error fetching BusinessType records', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read a single BusinessType record by Business_Type
// router.get('/:Business_Type', async (req: Request, res: Response) => {
//     const { Business_Type } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', [Business_Type]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(200).json({ success: true, data: rows[0] }); // Return the first row
//         } else {
//             res.status(404).json({ success: false, message: 'BusinessType record not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error fetching BusinessType record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Update a BusinessType record
// router.put('/:Business_Type', async (req: Request, res: Response): Promise<void> => {
//     const { Business_Type } = req.params;
//     const businessTypeData: BusinessTypeData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', 
//         [businessTypeData.Business_Type]
//         );
//         if (Array.isArray(rows) && rows.length > 0) {          
//             res.status(409).json({ success: false, message: 'Business Type record already exists.' });
//             return;
//         }

//         // Update the BusinessType data
//         const [result] = await connection.execute(
//             `UPDATE tb_BusinessType SET Business_Type = ? 
//             WHERE Business_Type = ?`,
//             [
//                 businessTypeData.Business_Type,
//                 Business_Type
//             ]
//         );

      
//         res.status(200).json({ success: true, message: 'BusinessType record updated successfully' });
//         return;
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error updating BusinessType record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Delete a BusinessType record
// router.delete('/:Business_Type', async (req: Request, res: Response) => {
//     const { Business_Type } = req.params;

//     console.log('Deleting BusinessType record:', Business_Type);

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', 
//         [Business_Type]
//         );
//         if (rows.length === 0) {          
//             res.status(409).json({ success: true, message: 'Business Type record does not exists.' });
//             return;
//         }

//         // Delete the BusinessType record
//         const [result] = await connection.execute('DELETE FROM tb_BusinessType WHERE Business_Type = ?', [Business_Type]);
       
//         res.status(200).json({ success: true, message: 'BusinessType record deleted successfully' });
//         return;
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error deleting BusinessType record', error });
//     } finally {
//         connection.end();
//     }
// });

// export default router;









// // app.get('/api/business-types', async (req, res) => {
// //     try {
// //         const result = await db.query("set dateformat dmy select distinct buss_type from tb_business order by buss_type asc");
// //         res.status(200).json(result.recordset.map((row: any) => row.buss_type));
// //     } catch (error) {
// //         res.status(500).send({ success: false, message: error.message });
// //     }
// // });

// // app.post('/api/produce-report', async (req, res) => {
// //     const { businessType, reportType, isActual } = req.body;

// //     try {
// //         let deleteQuery;
// //         let insertQuery;
// //         let reportFileName;

// //         if (isActual) {
// //             deleteQuery = "set dateformat dmy delete from tmp_business";
// //             if (businessType) {
// //                 insertQuery = `set dateformat dmy insert into tmp_business select * from tb_business where buss_type=convert(varchar(50),'${businessType}') and current_rate>0 order by tot_grade asc`;
// //             } else {
// //                 insertQuery = `set dateformat dmy insert into tmp_business select * from tb_business where current_rate>0 order by tot_grade asc`;
// //             }

// //             switch (reportType) {
// //                 case 'sorted-by-category':
// //                     reportFileName = "ACTUAL BUSINESS TYPES REPORT GRADE.rpt";
// //                     break;
// //                 case 'electoral-area':
// //                     reportFileName = "ACTUAL BUSINESS TYPES REPORT ELECTORAL AREA.rpt";
// //                     break;
// //                 case 'current-rates':
// //                     reportFileName = "ACTUAL BUSINESS TYPES REPORT CURRENTRATE.rpt";
// //                     break;
// //                 default:
// //                     return res.status(400).send({ success: false, message: "Invalid report type" });
// //             }
// //         } else {
// //             deleteQuery = "set dateformat dmy delete from rept_business";
// //             if (businessType) {
// //                 insertQuery = `set dateformat dmy insert into rept_business select * from tb_business where buss_type like '%${businessType}%' and current_rate>0 order by buss_type`;
// //             } else {
// //                 insertQuery = `set dateformat dmy insert into rept_business select * from tb_business where current_rate>0 order by buss_type`;
// //             }

// //             switch (reportType) {
// //                 case 'sorted-by-category':
// //                     reportFileName = "business types report.rpt";
// //                     break;
// //                 case 'electoral-area':
// //                     reportFileName = "BUSINESS TYPES REPORT ELECTORAL AREA.rpt";
// //                     break;
// //                 case 'current-rates':
// //                     reportFileName = "BUSINESS TYPES REPORT CURRENTRATE.rpt";
// //                     break;
// //                 default:
// //                     return res.status(400).send({ success: false, message: "Invalid report type" });
// //             }
// //         }

// //         // Delete from the relevant temporary table
// //         await db.query(deleteQuery);

// //         // Insert into the relevant temporary table
// //         await db.query(insertQuery);

// //         // Check the temporary table
// //         const tmpResult = await db.query(`set dateformat dmy select * from tmp_business`);
// //         if (tmpResult.recordset.length > 0) {
// //             res.status(200).send({ success: true, message: "Processing completed", reportFileName });
// //         } else {
// //             res.status(404).send({ success: false, message: "No records found" });
// //         }
// //     } catch (error) {
// //         res.status(500).send({ success: false, message: error.message });
// //     }
// // });
