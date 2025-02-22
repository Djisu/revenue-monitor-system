// backend/src/routes/api/officerAssessmentRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';

import pkg from 'pg';
const { Pool } = pkg;

const router = Router();

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432'),
};

const pool = new Pool(dbConfig);

// OfficerAssessment data interface
interface OfficerAssessmentData {
    officer_no: string;
    officer_name: string;
    Noofclientsserved: number;
    valueofbillsdistributed: number;
    bus_year: number;
    JanuaryAmount: number;
    FebruaryAmount: number;
    MarchAmount: number;
    AprilAmount: number;
    MayAmount: number;
    JuneAmount: number;
    JulyAmount: number;
    AugustAmount: number;
    SeptemberAmount: number;
    OctoberAmount: number;
    NovemberAmount: number;
    DecemberAmount: number;
    totalReceiptTodate: number;
    balance: number;
    remarks: string;
}

async function getFiscalYears(): Promise<number[]> {
    try {
        const { rows } = await pool.query('SELECT DISTINCT fiscal_year FROM buspayments ORDER BY fiscal_year');
        return rows.map(row => row.fiscal_year);
    } catch (err) {
        console.error('Error fetching fiscal years:', err);
        throw err;
    }
}

async function getOfficers(): Promise<Officer[]> {
    try {
        const { rows } = await pool.query('SELECT officer_no, officer_name FROM officer');
        return rows as Officer[];
    } catch (err: any) {
        console.error('Error fetching officers:', err);
        throw err;
    }
}

async function getAmountByOfficerAndMonth(officerNo: string, fiscalYear: number, monthPaid: string): Promise<number | null> {
    try {
        const { rows } = await pool.query(`
            SELECT 
                SUM(amount) AS totsum 
            FROM buspayments 
            WHERE officer_no = $1 
              AND fiscal_year = $2 
              AND (monthpaid = $3 OR monthpaid = CAST($4 AS INTEGER))
        `, [officerNo, fiscalYear, monthPaid, monthPaid]);

        return rows[0]?.totsum ?? null;
    } catch (err) {
        console.error('Error fetching amount by officer and month:', err);
        throw err;
    }
}

async function deleteOfficerMonthAssess() {
    try {
        await pool.query('DELETE FROM officermonthassess');
    } catch (err) {
        console.error('Error deleting officer month assess:', err);
        throw err;
    }
}

async function insertOfficerMonthAssess(data: OfficerMonthlyPerformance[]) {
    try {
        const insertQuery = `
            INSERT INTO officermonthassess (officer_name, month, amount, fiscalyear) 
            VALUES ($1, $2, $3, $4)
        `;

        for (let item of data) {
            await pool.query(insertQuery, [item.officer_name, item.month, item.amount, item.fiscalyear]);
        }
    } catch (err: any) {
        console.error('Error inserting officer month assess:', err);
    }
}

interface FiscalYear {
    fiscal_year: number;
}

interface Officer {
    officer_no: string;
    officer_name: string;
}

interface OfficerMonthlyPerformance {
    officer_name: string;
    month: string;
    amount: number;
    fiscalyear: number;
}

router.get('/api/fiscalYears', async (req: Request, res: Response) => {
    try {
        const fiscalYears = await getFiscalYears();
        res.json(fiscalYears);
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

router.get('/api/officers', async (req: Request, res: Response) => {
    try {
        const officers = await getOfficers();
        res.json(officers);
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

router.post('/api/officerMonthAssess', async (req: Request, res: Response) => {
    try {
        const data = req.body as OfficerMonthlyPerformance[];
        await deleteOfficerMonthAssess();
        await insertOfficerMonthAssess(data);
        res.send('Officer month assess records created successfully');
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

router.delete('/api/officerMonthAssess', async (req: Request, res: Response) => {
    try {
        await deleteOfficerMonthAssess();
        res.send('Officer month assess deleted');
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

router.post('/api/officerMonthAssess', async (req: Request, res: Response) => {
    try {
        const data = req.body as OfficerMonthlyPerformance[];
        await insertOfficerMonthAssess(data);
        res.send('Officer month assess inserted');
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

router.get('/api/amountByOfficerAndMonth', async (req: Request, res: Response) => {
    try {
        const { officerNo, fiscalYear, monthPaid } = req.query as { officerNo: string; fiscalYear: string; monthPaid: string };
        const amount = await getAmountByOfficerAndMonth(officerNo, Number(fiscalYear), monthPaid);
        res.json({ totsum: amount });
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
});

// Create a new officer assessment record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const officerAssessmentData: OfficerAssessmentData = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND bus_year = $2', 
        [officerAssessmentData.officer_no, officerAssessmentData.bus_year]);

        if (rows.length > 0) {
            res.status(409).json({ message: 'Officer assessment record already exists' });
            return;
        }

        const { rows: result } = await pool.query(
            `INSERT INTO officerassessment 
            (officer_no, officer_name, Noofclientsserved, valueofbillsdistributed, bus_year, 
            JanuaryAmount, FebruaryAmount, MarchAmount, AprilAmount, MayAmount, 
            JuneAmount, JulyAmount, AugustAmount, SeptemberAmount, OctoberAmount, 
            NovemberAmount, DecemberAmount, totalReceiptTodate, balance, remarks) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
            [
                officerAssessmentData.officer_no,
                officerAssessmentData.officer_name,
                officerAssessmentData.Noofclientsserved,
                officerAssessmentData.valueofbillsdistributed,
                officerAssessmentData.bus_year,
                officerAssessmentData.JanuaryAmount,
                officerAssessmentData.FebruaryAmount,
                officerAssessmentData.MarchAmount,
                officerAssessmentData.AprilAmount,
                officerAssessmentData.MayAmount,
                officerAssessmentData.JuneAmount,
                officerAssessmentData.JulyAmount,
                officerAssessmentData.AugustAmount,
                officerAssessmentData.SeptemberAmount,
                officerAssessmentData.OctoberAmount,
                officerAssessmentData.NovemberAmount,
                officerAssessmentData.DecemberAmount,
                officerAssessmentData.totalReceiptTodate,
                officerAssessmentData.balance,
                officerAssessmentData.remarks,
            ]
        );

        res.status(201).json({ message: 'Officer assessment record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating officer assessment record', error });
    }
});

// Read all officer assessment records
router.get('/', async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query('SELECT * FROM officerassessment');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment records', error });
    }
});

// Read a single officer assessment record by officer_no
router.get('/:officer_no/:bus_year', async (req: Request, res: Response) => {
    const { officer_no, bus_year } = req.params;

    try {
        const { rows } = await pool.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND bus_year = $2', 
        [officer_no, bus_year]);

        if (rows.length == 0) {
            res.status(404).json({ message: 'Officer assessment record not found' });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching officer assessment record', error });
    }
});

// Update an officer assessment record
router.put('/:officer_no/:bus_year', async (req: Request, res: Response): Promise<void> => {
    const { officer_no, bus_year } = req.params;
    const officerAssessmentData: OfficerAssessmentData = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND bus_year = $2', 
        [officer_no, bus_year]);

        if (rows.length == 0) {
            res.status(404).json({ message: 'Officer assessment record not found' });
            return;
        }

        const { rows: result } = await pool.query(
            `UPDATE officerassessment SET 
            officer_name = $1, Noofclientsserved = $2, valueofbillsdistributed = $3, bus_year = $4, 
            JanuaryAmount = $5, FebruaryAmount = $6, MarchAmount = $7, AprilAmount = $8, 
            MayAmount = $9, JuneAmount = $10, JulyAmount = $11, AugustAmount = $12, 
            SeptemberAmount = $13, OctoberAmount = $14, NovemberAmount = $15, 
            DecemberAmount = $16, totalReceiptTodate = $17, balance = $18, remarks = $19 
            WHERE officer_no = $20`,
            [
                officerAssessmentData.officer_name,
                officerAssessmentData.Noofclientsserved,
                officerAssessmentData.valueofbillsdistributed,
                officerAssessmentData.bus_year,
                officerAssessmentData.JanuaryAmount,
                officerAssessmentData.FebruaryAmount,
                officerAssessmentData.MarchAmount,
                officerAssessmentData.AprilAmount,
                officerAssessmentData.MayAmount,
                officerAssessmentData.JuneAmount,
                officerAssessmentData.JulyAmount,
                officerAssessmentData.AugustAmount,
                officerAssessmentData.SeptemberAmount,
                officerAssessmentData.OctoberAmount,
                officerAssessmentData.NovemberAmount,
                officerAssessmentData.DecemberAmount,
                officerAssessmentData.totalReceiptTodate,
                officerAssessmentData.balance,
                officerAssessmentData.remarks,
                officer_no
            ]
        );

        res.status(200).json({ message: 'Officer assessment record updated successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating officer assessment record', error });
    }
});

// Delete an officer assessment record
router.delete('/:officer_no/:bus_year', async (req: Request, res: Response) => {
    const { officer_no, bus_year } = req.params;

    try {
        const { rows } = await pool.query('SELECT * FROM officerassessment WHERE officer_no = $1 AND bus_year = $2', 
        [officer_no, bus_year]);

        if (rows.length == 0) {
            res.status(409).json({ message: 'Officer assessment record does not exists' });
            return;
        }

        await pool.query('DELETE FROM officerassessment WHERE officer_no = $1', [officer_no]);
       
        res.status(200).json({ message: 'Officer assessment record deleted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting officer assessment record', error });
        return;
    }
});

export default router;



// // backend/src/routes/api/officerAssessmentRoutes.ts
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

// // OfficerAssessment data interface
// interface OfficerAssessmentData {
//     officer_no: string;
//     officer_name: string;
//     Noofclientsserved: number;
//     valueofbillsdistributed: number;
//     bus_year: number;
//     JanuaryAmount: number;
//     FebruaryAmount: number;
//     MarchAmount: number;
//     AprilAmount: number;
//     MayAmount: number;
//     JuneAmount: number;
//     JulyAmount: number;
//     AugustAmount: number;
//     SeptemberAmount: number;
//     OctoberAmount: number;
//     NovemberAmount: number;
//     DecemberAmount: number;
//     totalReceiptTodate: number;
//     balance: number;
//     remarks: string;
// }

// async function getFiscalYears(): Promise<number[]> {
//     try {
//       const connection = await mysql.createConnection(dbConfig);

//        const [rows] = await connection.execute('SELECT DISTINCT fiscal_year FROM buspayments ORDER BY fiscal_year')

//       return rows.map(row => row.fiscal_year);

//     } catch (err) {
//       console.error('Error fetching fiscal years:', err);
//       throw err;
//     }
//   }
  
//   async function getOfficers(): Promise<Officer[]> {
//     try {
//         const connection = await mysql.createConnection(dbConfig);

//         // Fetch the officers directly from the tb_officer table
//         const [rows] = await connection.execute('SELECT officer_no, officer_name FROM officer');

//         return rows as Officer[]; // Type assertion to match the Officer interface

//     } catch (err: any) {
//         console.error('Error fetching officers:', err);
//         throw err;
//     }
// }

// async function getAmountByOfficerAndMonth(officerNo: string, fiscalYear: number, monthPaid: string): Promise<number | null> {
//     try {
//         const connection = await mysql.createConnection(dbConfig);

//         const [rows] = await connection.execute(`
//             SELECT 
//                 SUM(amount) AS totsum 
//             FROM buspayments 
//             WHERE officer_no = ? 
//               AND fiscal_year = ? 
//               AND (monthpaid = ? OR monthpaid = CAST(? AS UNSIGNED))
//         `, [officerNo, fiscalYear, monthPaid, monthPaid]);

//         return rows[0]?.totsum ?? null;  // Use optional chaining and nullish coalescing

//     } catch (err) {
//         console.error('Error fetching amount by officer and month:', err);
//         throw err;
//     }
// }

// async function deleteOfficerMonthAssess() {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
        

//         // Execute the DELETE statement
//         await connection.execute(`DELETE FROM officermonthassess`);

//     } catch (err) {
//         console.error('Error deleting officer month assess:', err);
//         throw err;
//     } finally {
//         // Ensure the connection is closed after the operation
//         if (connection) {
//             await connection.end();
//         }
//     }
// }
  
// async function insertOfficerMonthAssess(data: OfficerMonthlyPerformance[]) {
//   const connection = await mysql.createConnection(dbConfig);

//   try {

//       // Prepare an insert statement
//       const insertQuery = `
//           INSERT INTO officermonthassess (officer_name, month, amount, fiscalyear) 
//           VALUES (?, ?, ?, ?)
//       `;

//       for (let item of data) {
//           await connection.execute(insertQuery, [item.officer_name, item.month, item.amount, item.fiscalyear]);
//       }
      
//   } catch (err: any) {
//       console.error('Error inserting officer month assess:', err);
//   } finally {
//       connection.end(); // Always release the connection back to the pool
//   }
// }

//   interface FiscalYear {
//     fiscal_year: number;
//   }
  
//   interface Officer {
//     officer_no: string;
//     officer_name: string;
//   }
  
//   interface OfficerMonthlyPerformance {
//     officer_name: string;
//     month: string;
//     amount: number;
//     fiscalyear: number;
//   }

//   router.get('/api/fiscalYears', async (req: Request, res: Response) => {
//     try {
//       const fiscalYears = await getFiscalYears();
//       res.json(fiscalYears);
//     } catch (err) {
//       res.status(500).send((err as Error).message);
//     }
//   });

//   router.get('/api/officers', async (req: Request, res: Response) => {
//     try {
//       const officers = await getOfficers();
//       res.json(officers);
//     } catch (err) {
//       res.status(500).send((err as Error).message);
//     }
//   });

//     router.post('/api/officerMonthAssess', async (req: Request, res: Response) => {
//         try {
//         const data = req.body as OfficerMonthlyPerformance[];
//         await deleteOfficerMonthAssess();
//         await insertOfficerMonthAssess(data);
//         res.send('Officer month assess records created successfully');
//         } catch (err) {
//         res.status(500).send((err as Error).message);
//         }
//     });

//     router.delete('/api/officerMonthAssess', async (req: Request, res: Response) => {
//         try {
//           await deleteOfficerMonthAssess();
//           res.send('Officer month assess deleted');
//         } catch (err) {
//           res.status(500).send((err as Error).message);
//         }
//       });
      
//       router.post('/api/officerMonthAssess', async (req: Request, res: Response) => {
//         try {
//           const data = req.body as OfficerMonthlyPerformance[];
//           await insertOfficerMonthAssess(data);
//           res.send('Officer month assess inserted');
//         } catch (err) {
//           res.status(500).send((err as Error).message);
//         }
//       });
      
 
// router.get('/api/amountByOfficerAndMonth', async (req: Request, res: Response) => {
//     try {
//       const { officerNo, fiscalYear, monthPaid } = req.query as { officerNo: string; fiscalYear: string; monthPaid: string };
//       const amount = await getAmountByOfficerAndMonth(officerNo, Number(fiscalYear), monthPaid);
//       res.json({ totsum: amount });
//     } catch (err) {
//       res.status(500).send((err as Error).message);
//     }
//   })

// // Create a new officer assessment record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const officerAssessmentData: OfficerAssessmentData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         const [rows] = await connection.execute('SELECT * FROM officerassessment WHERE officer_no = ? AND bus_year = ?', 
//         [officerAssessmentData.officer_no, officerAssessmentData.bus_year]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ message: 'Officer assessment record already exists' });
//             return
//         }
//         // Insert the new officer assessment data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO officerassessment 
//             (officer_no, officer_name, Noofclientsserved, valueofbillsdistributed, bus_year, 
//             JanuaryAmount, FebruaryAmount, MarchAmount, AprilAmount, MayAmount, 
//             JuneAmount, JulyAmount, AugustAmount, SeptemberAmount, OctoberAmount, 
//             NovemberAmount, DecemberAmount, totalReceiptTodate, balance, remarks) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 officerAssessmentData.officer_no,
//                 officerAssessmentData.officer_name,
//                 officerAssessmentData.Noofclientsserved,
//                 officerAssessmentData.valueofbillsdistributed,
//                 officerAssessmentData.bus_year,
//                 officerAssessmentData.JanuaryAmount,
//                 officerAssessmentData.FebruaryAmount,
//                 officerAssessmentData.MarchAmount,
//                 officerAssessmentData.AprilAmount,
//                 officerAssessmentData.MayAmount,
//                 officerAssessmentData.JuneAmount,
//                 officerAssessmentData.JulyAmount,
//                 officerAssessmentData.AugustAmount,
//                 officerAssessmentData.SeptemberAmount,
//                 officerAssessmentData.OctoberAmount,
//                 officerAssessmentData.NovemberAmount,
//                 officerAssessmentData.DecemberAmount,
//                 officerAssessmentData.totalReceiptTodate,
//                 officerAssessmentData.balance,
//                 officerAssessmentData.remarks,
//             ]
//         );

//         res.status(201).json({ message: 'Officer assessment record created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating officer assessment record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read all officer assessment records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM officerassessment');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching officer assessment records', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read a single officer assessment record by officer_no
// router.get('/:officer_no/:bus_year', async (req: Request, res: Response) => {
//     const { officer_no, bus_year } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM officerassessment WHERE officer_no = ? AND bus_year = ?', 
//         [officer_no, bus_year]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Officer assessment record not found' });
//             return;
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching officer assessment record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Update an officer assessment record
// router.put('/:officer_no/:bus_year', async (req: Request, res: Response): Promise<void> => {
//     const { officer_no, bus_year } = req.params;
//     const officerAssessmentData: OfficerAssessmentData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM officerassessment WHERE officer_no = ? AND bus_year = ?', 
//         [officer_no, bus_year]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(404).json({ message: 'Officer assessment record not found' });
//             return;
//         }
//         // Update the officer assessment data
//         const [result] = await connection.execute(
//             `UPDATE officerassessment SET 
//             officer_name = ?, Noofclientsserved = ?, valueofbillsdistributed = ?, bus_year = ?, 
//             JanuaryAmount = ?, FebruaryAmount = ?, MarchAmount = ?, AprilAmount = ?, 
//             MayAmount = ?, JuneAmount = ?, JulyAmount = ?, AugustAmount = ?, 
//             SeptemberAmount = ?, OctoberAmount = ?, NovemberAmount = ?, 
//             DecemberAmount = ?, totalReceiptTodate = ?, balance = ?, remarks = ? 
//             WHERE officer_no = ?`,
//             [
//                 officerAssessmentData.officer_name,
//                 officerAssessmentData.Noofclientsserved,
//                 officerAssessmentData.valueofbillsdistributed,
//                 officerAssessmentData.bus_year,
//                 officerAssessmentData.JanuaryAmount,
//                 officerAssessmentData.FebruaryAmount,
//                 officerAssessmentData.MarchAmount,
//                 officerAssessmentData.AprilAmount,
//                 officerAssessmentData.MayAmount,
//                 officerAssessmentData.JuneAmount,
//                 officerAssessmentData.JulyAmount,
//                 officerAssessmentData.AugustAmount,
//                 officerAssessmentData.SeptemberAmount,
//                 officerAssessmentData.OctoberAmount,
//                 officerAssessmentData.NovemberAmount,
//                 officerAssessmentData.DecemberAmount,
//                 officerAssessmentData.totalReceiptTodate,
//                 officerAssessmentData.balance,
//                 officerAssessmentData.remarks,
//                 officer_no
//             ]
//         );

//         res.status(200).json({ message: 'Officer assessment record updated successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating officer assessment record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Delete an officer assessment record
// router.delete('/:officer_no/:bus_year', async (req: Request, res: Response) => {
//     const { officer_no, bus_year } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM officerassessment WHERE officer_no = ? AND bus_year = ?', 
//         [officer_no, bus_year]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(409).json({ message: 'Officer assessment record does not exists' });
//             return
//         }
//         // Delete the officer assessment record
//         const [result] = await connection.execute('DELETE FROM officerassessment WHERE officer_no = ?', [officer_no]);
       
//         res.status(200).json({ message: 'Officer assessment record deleted successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting officer assessment record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// export default router;












// // // backend/src/routes/api/officerAssessmentRoutes.ts
// // import express from 'express';
// // import * as dotenv from 'dotenv';
// // import { Router, Request, Response } from 'express';
// // import mysql, { ResultSetHeader } from 'mysql2/promise';

// // const router = Router();

// // // Load environment variables from .env file
// // dotenv.config();

// // // MySQL connection configuration
// // const dbConfig = {
// //     host: process.env.DB_HOST || 'localhost',
// //     user: process.env.DB_USER || 'root',
// //     password: process.env.DB_PASSWORD || '',
// //     database: process.env.DB_NAME || 'revmonitor',
// // };

// // // OfficerAssessment data interface
// // interface OfficerAssessmentData {
// //     officer_no: string;
// //     officer_name: string;
// //     Noofclientsserved: number;
// //     valueofbillsdistributed: number;
// //     bus_year: number;
// //     JanuaryAmount: number;
// //     FebruaryAmount: number;
// //     MarchAmount: number;
// //     AprilAmount: number;
// //     MayAmount: number;
// //     JuneAmount: number;
// //     JulyAmount: number;
// //     AugustAmount: number;
// //     SeptemberAmount: number;
// //     OctoberAmount: number;
// //     NovemberAmount: number;
// //     DecemberAmount: number;
// //     totalReceiptTodate: number;
// //     balance: number;
// //     remarks: string;
// // }

// // async function getFiscalYears(): Promise<number[]> {
// //     try {
// //       const connection = await mysql.createConnection(dbConfig);

// //        const [rows] = await connection.execute('SELECT DISTINCT fiscal_year FROM tb_busPayments ORDER BY fiscal_year')

// //       return rows.map(row => row.fiscal_year);

// //     } catch (err) {
// //       console.error('Error fetching fiscal years:', err);
// //       throw err;
// //     }
// //   }
  
// //   async function getOfficers(): Promise<Officer[]> {
// //     try {
// //         const connection = await mysql.createConnection(dbConfig);

// //         // Fetch the officers directly from the tb_officer table
// //         const [rows] = await connection.execute('SELECT officer_no, officer_name FROM tb_officer');

// //         return rows as Officer[]; // Type assertion to match the Officer interface

// //     } catch (err: any) {
// //         console.error('Error fetching officers:', err);
// //         throw err;
// //     }
// // }

// // async function getAmountByOfficerAndMonth(officerNo: string, fiscalYear: number, monthPaid: string): Promise<number | null> {
// //     try {
// //         const connection = await mysql.createConnection(dbConfig);

// //         const [rows] = await connection.execute(`
// //             SELECT 
// //                 SUM(amount) AS totsum 
// //             FROM tb_buspayments 
// //             WHERE officer_no = ? 
// //               AND fiscal_year = ? 
// //               AND (monthpaid = ? OR monthpaid = CAST(? AS UNSIGNED))
// //         `, [officerNo, fiscalYear, monthPaid, monthPaid]);

// //         return rows[0]?.totsum ?? null;  // Use optional chaining and nullish coalescing

// //     } catch (err) {
// //         console.error('Error fetching amount by officer and month:', err);
// //         throw err;
// //     }
// // }

// // async function deleteOfficerMonthAssess() {
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
        

// //         // Execute the DELETE statement
// //         await connection.execute(`DELETE FROM officermonthassess`);

// //     } catch (err) {
// //         console.error('Error deleting officer month assess:', err);
// //         throw err;
// //     } finally {
// //         // Ensure the connection is closed after the operation
// //         if (connection) {
// //             await connection.end();
// //         }
// //     }
// // }
  
// // async function insertOfficerMonthAssess(data: OfficerMonthlyPerformance[]) {
// //   const connection = await mysql.createConnection(dbConfig);

// //   try {

// //       // Prepare an insert statement
// //       const insertQuery = `
// //           INSERT INTO tb_officerMonthAssess (officer_name, month, amount, fiscalyear) 
// //           VALUES (?, ?, ?, ?)
// //       `;

// //       for (let item of data) {
// //           await connection.execute(insertQuery, [item.officer_name, item.month, item.amount, item.fiscalyear]);
// //       }
      
// //   } catch (err: any) {
// //       console.error('Error inserting officer month assess:', err);
// //   } finally {
// //       connection.end(); // Always release the connection back to the pool
// //   }
// // }

// //   interface FiscalYear {
// //     fiscal_year: number;
// //   }
  
// //   interface Officer {
// //     officer_no: string;
// //     officer_name: string;
// //   }
  
// //   interface OfficerMonthlyPerformance {
// //     officer_name: string;
// //     month: string;
// //     amount: number;
// //     fiscalyear: number;
// //   }

// //   router.get('/api/fiscalYears', async (req: Request, res: Response) => {
// //     try {
// //       const fiscalYears = await getFiscalYears();
// //       res.json(fiscalYears);
// //     } catch (err) {
// //       res.status(500).send((err as Error).message);
// //     }
// //   });

// //   router.get('/api/officers', async (req: Request, res: Response) => {
// //     try {
// //       const officers = await getOfficers();
// //       res.json(officers);
// //     } catch (err) {
// //       res.status(500).send((err as Error).message);
// //     }
// //   });

// //     router.post('/api/officerMonthAssess', async (req: Request, res: Response) => {
// //         try {
// //         const data = req.body as OfficerMonthlyPerformance[];
// //         await deleteOfficerMonthAssess();
// //         await insertOfficerMonthAssess(data);
// //         res.send('Officer month assess records created successfully');
// //         } catch (err) {
// //         res.status(500).send((err as Error).message);
// //         }
// //     });

// //     router.delete('/api/officerMonthAssess', async (req: Request, res: Response) => {
// //         try {
// //           await deleteOfficerMonthAssess();
// //           res.send('Officer month assess deleted');
// //         } catch (err) {
// //           res.status(500).send((err as Error).message);
// //         }
// //       });
      
// //       router.post('/api/officerMonthAssess', async (req: Request, res: Response) => {
// //         try {
// //           const data = req.body as OfficerMonthlyPerformance[];
// //           await insertOfficerMonthAssess(data);
// //           res.send('Officer month assess inserted');
// //         } catch (err) {
// //           res.status(500).send((err as Error).message);
// //         }
// //       });
      
 
// // router.get('/api/amountByOfficerAndMonth', async (req: Request, res: Response) => {
// //     try {
// //       const { officerNo, fiscalYear, monthPaid } = req.query as { officerNo: string; fiscalYear: string; monthPaid: string };
// //       const amount = await getAmountByOfficerAndMonth(officerNo, Number(fiscalYear), monthPaid);
// //       res.json({ totsum: amount });
// //     } catch (err) {
// //       res.status(500).send((err as Error).message);
// //     }
// //   })

// // // Create a new officer assessment record
// // router.post('/', async (req: Request, res: Response): Promise<void> => {
// //     const officerAssessmentData: OfficerAssessmentData = req.body;

// //     const connection = await mysql.createConnection(dbConfig);
    
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM officerassessment WHERE officer_no = ? AND bus_year = ?', 
// //         [officerAssessmentData.officer_no, officerAssessmentData.bus_year]);

// //         if (Array.isArray(rows) && rows.length > 0) {
// //             res.status(409).json({ message: 'Officer assessment record already exists' });
// //             return
// //         }
// //         // Insert the new officer assessment data
// //         const [result] = await connection.execute<ResultSetHeader>(
// //             `INSERT INTO tb_officerAssessment 
// //             (officer_no, officer_name, Noofclientsserved, valueofbillsdistributed, bus_year, 
// //             JanuaryAmount, FebruaryAmount, MarchAmount, AprilAmount, MayAmount, 
// //             JuneAmount, JulyAmount, AugustAmount, SeptemberAmount, OctoberAmount, 
// //             NovemberAmount, DecemberAmount, totalReceiptTodate, balance, remarks) 
// //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// //             [
// //                 officerAssessmentData.officer_no,
// //                 officerAssessmentData.officer_name,
// //                 officerAssessmentData.Noofclientsserved,
// //                 officerAssessmentData.valueofbillsdistributed,
// //                 officerAssessmentData.bus_year,
// //                 officerAssessmentData.JanuaryAmount,
// //                 officerAssessmentData.FebruaryAmount,
// //                 officerAssessmentData.MarchAmount,
// //                 officerAssessmentData.AprilAmount,
// //                 officerAssessmentData.MayAmount,
// //                 officerAssessmentData.JuneAmount,
// //                 officerAssessmentData.JulyAmount,
// //                 officerAssessmentData.AugustAmount,
// //                 officerAssessmentData.SeptemberAmount,
// //                 officerAssessmentData.OctoberAmount,
// //                 officerAssessmentData.NovemberAmount,
// //                 officerAssessmentData.DecemberAmount,
// //                 officerAssessmentData.totalReceiptTodate,
// //                 officerAssessmentData.balance,
// //                 officerAssessmentData.remarks,
// //             ]
// //         );

// //         res.status(201).json({ message: 'Officer assessment record created successfully' });
// //     } catch (error) {
// //         console.error('Error:', error);
// //         res.status(500).json({ message: 'Error creating officer assessment record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });

// // // Read all officer assessment records
// // router.get('/', async (req: Request, res: Response) => {
// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment');
// //         res.json(rows);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error fetching officer assessment records', error });
// //     } finally {
// //         connection.end();
// //     }
// // });

// // // Read a single officer assessment record by officer_no
// // router.get('/:officer_no/:bus_year', async (req: Request, res: Response) => {
// //     const { officer_no, bus_year } = req.params;

// //     const connection = await mysql.createConnection(dbConfig);

// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', 
// //         [officer_no, bus_year]);

// //         if (Array.isArray(rows) && rows.length == 0) {
// //             res.status(404).json({ message: 'Officer assessment record not found' });
// //             return;
// //         }
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error fetching officer assessment record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });

// // // Update an officer assessment record
// // router.put('/:officer_no/:bus_year', async (req: Request, res: Response): Promise<void> => {
// //     const { officer_no, bus_year } = req.params;
// //     const officerAssessmentData: OfficerAssessmentData = req.body;

// //     const connection = await mysql.createConnection(dbConfig);
// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', 
// //         [officer_no, bus_year]);

// //         if (Array.isArray(rows) && rows.length == 0) {
// //             res.status(404).json({ message: 'Officer assessment record not found' });
// //             return;
// //         }
// //         // Update the officer assessment data
// //         const [result] = await connection.execute(
// //             `UPDATE tb_officerAssessment SET 
// //             officer_name = ?, Noofclientsserved = ?, valueofbillsdistributed = ?, bus_year = ?, 
// //             JanuaryAmount = ?, FebruaryAmount = ?, MarchAmount = ?, AprilAmount = ?, 
// //             MayAmount = ?, JuneAmount = ?, JulyAmount = ?, AugustAmount = ?, 
// //             SeptemberAmount = ?, OctoberAmount = ?, NovemberAmount = ?, 
// //             DecemberAmount = ?, totalReceiptTodate = ?, balance = ?, remarks = ? 
// //             WHERE officer_no = ?`,
// //             [
// //                 officerAssessmentData.officer_name,
// //                 officerAssessmentData.Noofclientsserved,
// //                 officerAssessmentData.valueofbillsdistributed,
// //                 officerAssessmentData.bus_year,
// //                 officerAssessmentData.JanuaryAmount,
// //                 officerAssessmentData.FebruaryAmount,
// //                 officerAssessmentData.MarchAmount,
// //                 officerAssessmentData.AprilAmount,
// //                 officerAssessmentData.MayAmount,
// //                 officerAssessmentData.JuneAmount,
// //                 officerAssessmentData.JulyAmount,
// //                 officerAssessmentData.AugustAmount,
// //                 officerAssessmentData.SeptemberAmount,
// //                 officerAssessmentData.OctoberAmount,
// //                 officerAssessmentData.NovemberAmount,
// //                 officerAssessmentData.DecemberAmount,
// //                 officerAssessmentData.totalReceiptTodate,
// //                 officerAssessmentData.balance,
// //                 officerAssessmentData.remarks,
// //                 officer_no
// //             ]
// //         );

// //         res.status(200).json({ message: 'Officer assessment record updated successfully' });
// //         return
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error updating officer assessment record', error });
// //     } finally {
// //         connection.end();
// //     }
// // });

// // // Delete an officer assessment record
// // router.delete('/:officer_no/:bus_year', async (req: Request, res: Response) => {
// //     const { officer_no, bus_year } = req.params;

// //     const connection = await mysql.createConnection(dbConfig);

// //     try {
// //         const [rows] = await connection.execute('SELECT * FROM tb_officerAssessment WHERE officer_no = ? AND bus_year = ?', 
// //         [officer_no, bus_year]);

// //         if (Array.isArray(rows) && rows.length == 0) {
// //             res.status(409).json({ message: 'Officer assessment record does not exists' });
// //             return
// //         }
// //         // Delete the officer assessment record
// //         const [result] = await connection.execute('DELETE FROM tb_officerAssessment WHERE officer_no = ?', [officer_no]);
       
// //         res.status(200).json({ message: 'Officer assessment record deleted successfully' });
// //         return
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Error deleting officer assessment record', error });
// //         return
// //     } finally {
// //         connection.end();
// //     }
// // });

// // export default router;