// backend/src/routes/api/propertyRateRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import { Pool, PoolClient, QueryResult } from 'pg';

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

// PropertyRate data interface
interface PropertyRateData {
    property_Class: string;
    fiscalyear: number;
    rate: number;
    registrationrate: number;
}

router.post('/create', async (req: Request, res: Response): Promise<void> => {
    // Validate the request body
    const propertyRateData: PropertyRateData = req.body;
    
    console.log('in create property rate');
    console.log('propertyRateData: ', propertyRateData);
   
    console.log(' propertyRateData.property_Class: ',  propertyRateData.property_Class ) 
    console.log(' propertyRateData.rate: ',  propertyRateData.rate)
    console.log(' propertyRateData.registrationrate: ',  propertyRateData.registrationrate)
    console.log(' propertyRateData.fiscalyear: ',  propertyRateData.fiscalyear)

    console.log('===========================')

    if (!propertyRateData.property_Class || !propertyRateData.fiscalyear) {
        console.log('invalid property rate data')   
        res.status(400).json({ message: 'Invalid property rate data' });
        return;
    }

    console.log('after validation: ')

    let client: PoolClient | null = null;

    try {
        client = await pool.connect();
        const { property_Class, fiscalyear, rate, registrationrate } = propertyRateData;

        const queryText = 'SELECT * FROM propertyrate WHERE property_class = $1 AND fiscalyear = $2';
        const values = [property_Class.toLowerCase(), fiscalyear];

        const result: QueryResult = await client.query(queryText, values); // Convert property_class to lowercase

        if (result.rows.length > 0) {
            res.status(409).json({ success: false, message: 'Property rate record already exists' });
            return;
        }

        console.log('before insert')

        // Insert the new property rate data
        const insertQueryText = `
            INSERT INTO propertyrate 
            (property_class, fiscalyear, rate, registrationrate) 
            VALUES ($1, $2, $3, $4)
            RETURNING property_class, rate`;
        const insertValues = [
            propertyRateData.property_Class.toLowerCase(), // Convert property_class to lowercase
            propertyRateData.fiscalyear,
            propertyRateData.rate,
            propertyRateData.registrationrate,
        ];

        const insertResult: QueryResult = await client.query(insertQueryText, insertValues);
        console.log('after insert')

        if (insertResult.rows.length > 0) {
            res.status(201).json({ 
                success: true, 
                message: 'Property rate record created successfully', 
                property_class: insertResult.rows[0].property_class, // Use the processed property class   
                rate: insertResult.rows[0].rate 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to create property rate record' 
            });
        }
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property rate record', error: error.message }); // Send only the error message
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read all property rate records
router.get('/', async (req: Request, res: Response) => {
    let client: PoolClient | null = null;

    try {
        client = await pool.connect();
        const result: QueryResult = await client.query('SELECT * FROM propertyrate');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property rate records', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read a single property rate record by property_Class and fiscalyear
router.get('/:property_Class/:fiscalyear', async (req: Request, res: Response) => {
    console.log('in get property rate: ', req.params)

    const { property_Class, fiscalyear } = req.params;
    let client: PoolClient | null = null;

    try {
        client = await pool.connect();
        const queryText = 'SELECT * FROM propertyrate WHERE property_class = $1 AND fiscalyear = $2';
        const values = [property_Class, fiscalyear];

        const result: QueryResult = await client.query(queryText, values);

        if (result.rows.length > 0) {
            console.log('rows: ', result.rows)
            console.log('rows[0]: ', result.rows[0])
            res.status(200).json(result.rows); // Return the first row
        } else {
            console.log('rows: ', result.rows)
            res.status(404).json({ message: 'Property rate record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property rate record', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Update a property rate record
router.put('/:property_Class/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
    const { property_Class, fiscalyear } = req.params;
    const propertyRateData: PropertyRateData = req.body;
    let client: PoolClient | null = null;

    try {
        client = await pool.connect();
        const queryText = 'SELECT * FROM propertyrate WHERE property_class = $1 AND fiscalyear = $2';
        const values = [propertyRateData.property_Class, propertyRateData.fiscalyear];

        const result: QueryResult = await client.query(queryText, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Property rate record not found' });
            return
        }

        // Update the property rate data
        const updateQueryText = `
            UPDATE propertyrate 
            SET rate = $1, registrationrate = $2 
            WHERE property_class = $3 AND fiscalyear = $4`;
        const updateValues = [
            propertyRateData.rate,
            propertyRateData.registrationrate,
            property_Class,
            fiscalyear
        ];

        await client.query(updateQueryText, updateValues);
        
        res.status(200).json({ message: 'Property rate record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property rate record', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Delete a property rate record
router.delete('/:property_Class/:fiscalyear', async (req: Request, res: Response) => {
    const { property_Class, fiscalyear } = req.params;
    let client: PoolClient | null = null;

    try {
        client = await pool.connect();
        const queryText = 'SELECT * FROM propertyrate WHERE property_class = $1 AND fiscalyear = $2';
        const values = [property_Class, fiscalyear];

        const result: QueryResult = await client.query(queryText, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Property rate record not found' });
            return
        }

        // Delete the property rate record
        const deleteQueryText = 'DELETE FROM propertyrate WHERE property_class = $1 AND fiscalyear = $2';
        const deleteValues = [property_Class, fiscalyear];

        await client.query(deleteQueryText, deleteValues);
     
        res.status(200).json({ message: 'Property rate record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property rate record', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

export default router;






// // backend/src/routes/api/propertyRateRoutes.ts
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

// // PropertyRate data interface
// // interface PropertyRateData {
// //     property_class: string;
// //     fiscalyear: number;
// //     rate: number;
// //     registrationrate: number;
// // }


// interface PropertyRateData {
//     property_Class: string;
//     fiscalyear: number;
//     rate: number;
//     registrationrate: number;
// }

// router.post('/create', async (req: Request, res: Response): Promise<void> => {
//     // Validate the request body
//     const propertyRateData: PropertyRateData = req.body;
    
//     console.log('in create property rate');
//     console.log('propertyRateData: ', propertyRateData);
   
//     console.log(' propertyRateData.property_Class: ',  propertyRateData.property_Class ) 
//     console.log(' propertyRateData.rate: ',  propertyRateData.rate)
//     console.log(' propertyRateData.registrationrate: ',  propertyRateData.registrationrate)
//     console.log(' propertyRateData.fiscalyear: ',  propertyRateData.fiscalyear)

//     console.log('===========================')

//     if (!propertyRateData.property_Class || // Changed to property_class
//         !propertyRateData.fiscalyear 
//         // || 
//         // typeof propertyRateData.rate !== 'number' || 
//         // typeof propertyRateData.registrationrate !== 'number'
//         ) {

//         console.log('invalid property rate data')   
//         res.status(400).json({ message: 'Invalid property rate data' });
//         return;
//     }

//     console.log('after validation: ')

//     const connection = await mysql.createConnection(dbConfig);
    
    
//     try {
//         const [rows] = await connection.execute('SELECT * FROM propertyrate WHERE property_class = ? AND fiscalyear = ?', 
//         [propertyRateData.property_Class.toLowerCase(), propertyRateData.fiscalyear]); // Convert property_class to lowercase

//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ success: false, message: 'Property rate record already exists' });
//             return;
//         }

//         console.log('before insert')

//         // Insert the new property rate data  <ResultSetHeader>
//         const [result] = await connection.execute(
//             `INSERT INTO tb_propertyrate 
//             (property_class, fiscalyear, rate, registrationrate) 
//             VALUES (?, ?, ?, ?)`,
//             [
//                 propertyRateData.property_Class.toLowerCase(), // Convert property_class to lowercase
//                 propertyRateData.fiscalyear,
//                 propertyRateData.rate,
//                 propertyRateData.registrationrate,
//             ]
//         );
//         console.log('after insert')

//        // Ensure result is not undefined before accessing insertId
//        if (result && 'insertId' in result) {
//         res.status(201).json({ 
//             success: true, 
//             message: 'Property rate record created successfully', 
//             property_class: propertyRateData.property_Class, // Use the processed property class   
//             rate: propertyRateData.rate 
//             });
//         } else {
//             res.status(500).json({ 
//                 success: false, 
//                 message: 'Failed to create property rate record' 
//             });
//         }
//     } catch (error: any) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating property rate record', error: error.message }); // Send only the error message
//     } finally {
//         connection.end();
//     }
// });


// // Read all property rate records
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_propertyrate');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching property rate records', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read a single property rate record by property_Class and fiscalyear
// router.get('/:property_Class/:fiscalyear', async (req: Request, res: Response) => {
//     console.log('in get property rate: ', req.params)

//     const { property_Class, fiscalyear } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_propertyrate WHERE property_Class = ? AND fiscalyear = ?',
//           [property_Class, fiscalyear]
//         );

//         if (Array.isArray(rows) && rows.length > 0) {
//             console.log('rows: ', rows)
//             console.log('rows[0]: ', rows[0])
//             res.status(200).json(rows); // Return the first row
//         } else {
//             console.log('rows: ', rows)
//             res.status(404).json({ message: 'Property rate record not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching property rate record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Update a property rate record
// router.put('/:property_Class/:fiscalyear', async (req: Request, res: Response): Promise<void> => {
//     const { property_Class, fiscalyear } = req.params;
//     const propertyRateData: PropertyRateData = req.body;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_propertyrate WHERE property_Class = ? AND fiscalyear = ?', 
//         [propertyRateData.property_Class, propertyRateData.fiscalyear]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(409).json({ message: 'Property rate record does not exist' });
//             return
//         }

//         // Update the property rate data
//         const [result] = await connection.execute(
//             `UPDATE tb_propertyrate 
//             SET rate = ?, registrationrate = ? 
//             WHERE property_Class = ? AND fiscalyear = ?`,
//             [
//                 propertyRateData.rate,
//                 propertyRateData.registrationrate,
//                 property_Class,
//                 fiscalyear
//             ]
//         );

        
//         res.status(200).json({ message: 'Property rate record updated successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating property rate record', error });
//     } finally {
//         connection.end();
//     }
// });

// // Delete a property rate record
// router.delete('/:property_Class/:fiscalyear', async (req: Request, res: Response) => {
//     const { property_Class, fiscalyear } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_propertyrate WHERE property_Class = ? AND fiscalyear = ?', 
//         [property_Class, fiscalyear]);

//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(409).json({ message: 'Property rate record does not exist' });
//             return
//         }

//         // Delete the property rate record
//         const [result] = await connection.execute('DELETE FROM tb_propertyrate WHERE property_Class = ? AND fiscalyear = ?',
//          [property_Class, fiscalyear]
//     );

     
//         res.status(200).json({ message: 'Property rate record deleted successfully' });
//        return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting property rate record', error });
//     } finally {
//         connection.end();
//     }
// });

// export default router;