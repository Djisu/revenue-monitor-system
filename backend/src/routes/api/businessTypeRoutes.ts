// backend/src/routes/api/businessTypeRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import mysql, { ResultSetHeader } from 'mysql2/promise';

const router = Router();

// Load environment variables from .env file
dotenv.config();

// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};

// BusinessType data interface
interface BusinessTypeData {
    Business_Type: string;
}

// Create a new BusinessType record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    console.log('Creating a new businessType record');

    const businessTypeData: BusinessTypeData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', 
        [businessTypeData.Business_Type]
        );

        if (Array.isArray(rows) && rows.length > 0) {          
            res.status(409).json({ message: 'Business Type record already exists.' });
            return;
        }

        // Insert the new BusinessType data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_BusinessType (Business_Type) 
            VALUES (?)`,
            [businessTypeData.Business_Type]
        );

        res.status(201).json({ success: true, message: 'BusinessType record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error creating BusinessType record', error });
    } finally {
        connection.end();
    }
});

// Read all BusinessType records
router.get('/all', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Fetching all businessType records');

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BusinessType');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({  success: false, message: 'Error fetching BusinessType records', error });
    } finally {
        connection.end();
    }
});

// Read a single BusinessType record by Business_Type
router.get('/:Business_Type', async (req: Request, res: Response) => {
    const { Business_Type } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', [Business_Type]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.status(200).json({ success: true, data: rows[0] }); // Return the first row
        } else {
            res.status(404).json({ success: false, message: 'BusinessType record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching BusinessType record', error });
    } finally {
        connection.end();
    }
});

// Update a BusinessType record
router.put('/:Business_Type', async (req: Request, res: Response): Promise<void> => {
    const { Business_Type } = req.params;
    const businessTypeData: BusinessTypeData = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', 
        [businessTypeData.Business_Type]
        );
        if (Array.isArray(rows) && rows.length > 0) {          
            res.status(409).json({ success: false, message: 'Business Type record already exists.' });
            return;
        }

        // Update the BusinessType data
        const [result] = await connection.execute(
            `UPDATE tb_BusinessType SET Business_Type = ? 
            WHERE Business_Type = ?`,
            [
                businessTypeData.Business_Type,
                Business_Type
            ]
        );

      
        res.status(200).json({ success: true, message: 'BusinessType record updated successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating BusinessType record', error });
    } finally {
        connection.end();
    }
});

// Delete a BusinessType record
router.delete('/:Business_Type', async (req: Request, res: Response) => {
    const { Business_Type } = req.params;

    console.log('Deleting BusinessType record:', Business_Type);

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BusinessType WHERE Business_Type = ?', 
        [Business_Type]
        );
        if (rows.length === 0) {          
            res.status(409).json({ success: true, message: 'Business Type record does not exists.' });
            return;
        }

        // Delete the BusinessType record
        const [result] = await connection.execute('DELETE FROM tb_BusinessType WHERE Business_Type = ?', [Business_Type]);
       
        res.status(200).json({ success: true, message: 'BusinessType record deleted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting BusinessType record', error });
    } finally {
        connection.end();
    }
});

export default router;









// app.get('/api/business-types', async (req, res) => {
//     try {
//         const result = await db.query("set dateformat dmy select distinct buss_type from tb_business order by buss_type asc");
//         res.status(200).json(result.recordset.map((row: any) => row.buss_type));
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
//             deleteQuery = "set dateformat dmy delete from tmp_business";
//             if (businessType) {
//                 insertQuery = `set dateformat dmy insert into tmp_business select * from tb_business where buss_type=convert(varchar(50),'${businessType}') and current_rate>0 order by tot_grade asc`;
//             } else {
//                 insertQuery = `set dateformat dmy insert into tmp_business select * from tb_business where current_rate>0 order by tot_grade asc`;
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
//             deleteQuery = "set dateformat dmy delete from rept_business";
//             if (businessType) {
//                 insertQuery = `set dateformat dmy insert into rept_business select * from tb_business where buss_type like '%${businessType}%' and current_rate>0 order by buss_type`;
//             } else {
//                 insertQuery = `set dateformat dmy insert into rept_business select * from tb_business where current_rate>0 order by buss_type`;
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
//         await db.query(insertQuery);

//         // Check the temporary table
//         const tmpResult = await db.query(`set dateformat dmy select * from tmp_business`);
//         if (tmpResult.recordset.length > 0) {
//             res.status(200).send({ success: true, message: "Processing completed", reportFileName });
//         } else {
//             res.status(404).send({ success: false, message: "No records found" });
//         }
//     } catch (error) {
//         res.status(500).send({ success: false, message: error.message });
//     }
// });
