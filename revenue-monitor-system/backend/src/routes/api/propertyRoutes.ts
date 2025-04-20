// backend/src/routes/api/propertyRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';

import pkg from 'pg';
import type { PoolClient, QueryResult } from 'pg';
const { Pool } = pkg;

const router = Router();

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
});

// Property data interface
interface PropertyData {
    house_no: string;
    owner: string;
    tenant: string;
    propertyuse: string;
    propertytype: string;
    propertyclass: string;
    electroral_area: string;
    landmark: string;
    street_name: string;
    lattitude: number;
    longitude: number;
    code: string;
    elevation: number;
    rate: number;
    Assessmentby: string;
    balance: number;
    PropertyUseRate: number;
    PropertytypeRate: number;
    PropertyclassRate: number;
}

// Create a new property record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const propertyData: PropertyData = req.body;

    const client: PoolClient = await pool.connect();
    
    try {
        const { rowCount } = await client.query('SELECT * FROM property WHERE house_no = $1', [propertyData.house_no]);

        if (rowCount as number > 0) {
            res.status(409).json({ message: 'Property record already exists' });
            return;
        }

        // Insert the new property data
        const result: QueryResult = await client.query(
            `INSERT INTO property 
            (house_no, owner, tenant, propertyuse, propertytype, propertyclass, 
            electroral_area, landmark, street_name, lattitude, longitude, 
            code, elevation, rate, Assessmentby, balance, 
            PropertyUseRate, PropertytypeRate, PropertyclassRate) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
            [
                propertyData.house_no,
                propertyData.owner,
                propertyData.tenant,
                propertyData.propertyuse,
                propertyData.propertytype,
                propertyData.propertyclass,
                propertyData.electroral_area,
                propertyData.landmark,
                propertyData.street_name,
                propertyData.lattitude,
                propertyData.longitude,
                propertyData.code,
                propertyData.elevation,
                propertyData.rate,
                propertyData.Assessmentby,
                propertyData.balance,
                propertyData.PropertyUseRate,
                propertyData.PropertytypeRate,
                propertyData.PropertyclassRate,
            ]
        );

        res.status(201).json({ message: 'Property record created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property record', error });
        return;
    } finally {
        client.release();
    }
});

// Read all property records
router.get('/', async (req: Request, res: Response) => {
    const client: PoolClient = await pool.connect();
    try {
        const result: QueryResult = await client.query('SELECT * FROM property');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property records', error });
    } finally {
        client.release();
    }
});

// Read a single property record by house_no
router.get('/:house_no', async (req: Request, res: Response) => {
    const { house_no } = req.params;

    const client: PoolClient = await pool.connect();

    try {
        const result: QueryResult = await client.query('SELECT * FROM property WHERE house_no = $1', [house_no]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Property record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property record', error });
    } finally {
        client.release();
    }
});

// Update a property record
router.put('/:house_no', async (req: Request, res: Response): Promise<void> => {
    const { house_no } = req.params;
    const propertyData: PropertyData = req.body;

    const client: PoolClient = await pool.connect();
    try {
        const { rowCount } = await client.query('SELECT * FROM property WHERE house_no = $1', [propertyData.house_no]);

        if (rowCount == 0) {
            res.status(409).json({ message: 'Property record does not exist' });
            return;
        }

        // Update the property data
        const result: QueryResult = await client.query(
            `UPDATE property 
            SET owner = $1, tenant = $2, propertyuse = $3, propertytype = $4, 
            propertyclass = $5, electroral_area = $6, landmark = $7, 
            street_name = $8, lattitude = $9, longitude = $10, 
            code = $11, elevation = $12, rate = $13, Assessmentby = $14, 
            balance = $15, PropertyUseRate = $16, 
            PropertytypeRate = $17, PropertyclassRate = $18 
            WHERE house_no = $19`,
            [
                propertyData.owner,
                propertyData.tenant,
                propertyData.propertyuse,
                propertyData.propertytype,
                propertyData.propertyclass,
                propertyData.electroral_area,
                propertyData.landmark,
                propertyData.street_name,
                propertyData.lattitude,
                propertyData.longitude,
                propertyData.code,
                propertyData.elevation,
                propertyData.rate,
                propertyData.Assessmentby,
                propertyData.balance,
                propertyData.PropertyUseRate,
                propertyData.PropertytypeRate,
                propertyData.PropertyclassRate,
                house_no
            ]
        );

        res.status(200).json({ message: 'Property record updated successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property record', error });
        return;
    } finally {
        client.release();
    }
});

// Delete a property record
router.delete('/:house_no', async (req: Request, res: Response) => {
    const { house_no } = req.params;

    const client: PoolClient = await pool.connect();

    try {
        const { rowCount } = await client.query('SELECT * FROM property WHERE house_no = $1', [house_no]);

        if (rowCount == 0) {
            res.status(409).json({ message: 'Property record does not exist' });
            return;
        }

        // Delete the property record
        const result: QueryResult = await client.query('DELETE FROM property WHERE house_no = $1', [house_no]);

        res.status(200).json({ message: 'Property record deleted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property record', error });
        return;
    } finally {
        client.release();
    }
});

export default router;








// // backend/src/routes/api/propertyRoutes.ts
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

// // Property data interface
// interface PropertyData {
//     house_no: string;
//     owner: string;
//     tenant: string;
//     propertyuse: string;
//     propertytype: string;
//     propertyclass: string;
//     electroral_area: string;
//     landmark: string;
//     street_name: string;
//     lattitude: number;
//     longitude: number;
//     code: string;
//     elevation: number;
//     rate: number;
//     Assessmentby: string;
//     balance: number;
//     PropertyUseRate: number;
//     PropertytypeRate: number;
//     PropertyclassRate: number;
// }

// // Create a new property record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     const propertyData: PropertyData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_Property WHERE house_no = ?', [propertyData.house_no]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ message: 'Property record already exists' });
//             return
//         }

//         // Insert the new property data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_Property 
//             (house_no, owner, tenant, propertyuse, propertytype, propertyclass, 
//             electroral_area, landmark, street_name, lattitude, longitude, 
//             code, elevation, rate, Assessmentby, balance, 
//             PropertyUseRate, PropertytypeRate, PropertyclassRate) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 propertyData.house_no,
//                 propertyData.owner,
//                 propertyData.tenant,
//                 propertyData.propertyuse,
//                 propertyData.propertytype,
//                 propertyData.propertyclass,
//                 propertyData.electroral_area,
//                 propertyData.landmark,
//                 propertyData.street_name,
//                 propertyData.lattitude,
//                 propertyData.longitude,
//                 propertyData.code,
//                 propertyData.elevation,
//                 propertyData.rate,
//                 propertyData.Assessmentby,
//                 propertyData.balance,
//                 propertyData.PropertyUseRate,
//                 propertyData.PropertytypeRate,
//                 propertyData.PropertyclassRate,
//             ]
//         );

//         res.status(201).json({ message: 'Property record created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating property record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Read all property records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_Property');
//         res.json(rows);
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching property records', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Read a single property record by house_no
// router.get('/:house_no', async (req: Request, res: Response) => {
//     const { house_no } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_Property WHERE house_no = ?', [house_no]);

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.json(rows[0]); // Return the first row
//             return
//         } else {
//             res.status(404).json({ message: 'Property record not found' });
//             return
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching property record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Update a property record
// router.put('/:house_no', async (req: Request, res: Response): Promise<void> => {
//     const { house_no } = req.params;
//     const propertyData: PropertyData = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_Property WHERE house_no = ?', [propertyData.house_no]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(409).json({ message: 'Property record not exist' });
//             return
//         }
//         // Update the property data
//         const [result] = await connection.execute(
//             `UPDATE tb_Property 
//             SET owner = ?, tenant = ?, propertyuse = ?, propertytype = ?, 
//             propertyclass = ?, electroral_area = ?, landmark = ?, 
//             street_name = ?, lattitude = ?, longitude = ?, 
//             code = ?, elevation = ?, rate = ?, Assessmentby = ?, 
//             balance = ?, PropertyUseRate = ?, 
//             PropertytypeRate = ?, PropertyclassRate = ? 
//             WHERE house_no = ?`,
//             [
//                 propertyData.owner,
//                 propertyData.tenant,
//                 propertyData.propertyuse,
//                 propertyData.propertytype,
//                 propertyData.propertyclass,
//                 propertyData.electroral_area,
//                 propertyData.landmark,
//                 propertyData.street_name,
//                 propertyData.lattitude,
//                 propertyData.longitude,
//                 propertyData.code,
//                 propertyData.elevation,
//                 propertyData.rate,
//                 propertyData.Assessmentby,
//                 propertyData.balance,
//                 propertyData.PropertyUseRate,
//                 propertyData.PropertytypeRate,
//                 propertyData.PropertyclassRate,
//                 house_no
//             ]
//         );

//         res.status(200).json({ message: 'Property record updated successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating property record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Delete a property record
// router.delete('/:house_no', async (req: Request, res: Response) => {
//     const { house_no } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_Property WHERE house_no = ?', [house_no]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(409).json({ message: 'Property record does not exist' });
//             return
//         }
//         // Delete the property record
//         const [result] = await connection.execute('DELETE FROM tb_Property WHERE house_no = ?', [house_no]);

//         res.status(200).json({ message: 'Property record deleted successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting property record', error });
//         return
//     } finally {
//         connection.end();
//     }
// });










// // import express from 'express';
// // import sql from 'mssql';

// // const app = express();
// // app.use(express.json());

// // const config = {
// //     user: 'sa',
// //     password: 'Timbuk2tu',
// //     server: '(local)',
// //     database: 'Saltpond',
// //     options: {
// //         encrypt: false,
// //         trustServerCertificate: true,
// //     }
// // };

// // app.get('/api/officers', async (req, res) => {
// //     try {
// //         await sql.connect(config);
// //         const result = await sql.query`SELECT officer_no, officer_name FROM tb_officer`;
// //         res.json(result.recordset);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).send('Server error');
// //     }
// // });

// // // Add similar endpoints for properties, property-types, property-uses, property-classes, electoral-areas, and property-details

// // app.post('/api/edit-property', async (req, res) => {
// //     const { house_no, owner, tenant, propertyuse, propertytype, propertyclass, electroral_area, landmark, street_name, lattitude, longitude, code, elevation, rate, propertyuserate, propertytyperate, propertyclassrate, assessmentby } = req.body;

// //     try {
// //         await sql.connect(config);
// //         const updateProperty = await sql.query`
// //             UPDATE tb_Property 
// //             SET owner = ${owner}, 
// //                 tenant = ${tenant}, 
// //                 propertyuse = ${propertyuse}, 
// //                 propertytype = ${propertytype}, 
// //                 propertyclass = ${propertyclass}, 
// //                 electroral_area = ${electroral_area}, 
// //                 landmark = ${landmark}, 
// //                 street_name = ${street_name}, 
// //                 lattitude = ${lattitude}, 
// //                 longitude = ${longitude}, 
// //                 code = ${code}, 
// //                 elevation = ${elevation}, 
// //                 rate = ${rate}, 
// //                 propertyuserate = ${propertyuserate}, 
// //                 propertytyperate = ${propertytyperate}, 
// //                 propertyclassrate = ${propertyclassrate}, 
// //                 assessmentby = ${assessmentby}
// //             WHERE house_no = ${house_no}
// //         `;

// //         if (updateProperty.rowsAffected[0] > 0) {
// //             res.send("Record successfully edited");
// //         } else {
// //             res.send("Record does not exist");
// //         }
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).send('Server error');
// //     }
// // });

// // app.listen(3000, () => {
// //     console.log('Server running on port 3000');
// // });


//  export default router;