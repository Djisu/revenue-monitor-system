// backend/src/routes/api/operatorRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import { Pool, PoolClient, QueryResult } from 'pg';
import bcrypt from 'bcrypt';

const router: Router = express.Router();

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Operator data interface
export interface OperatorDefinition {
    OperatorID: string;
    OperatorName: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
}

// Create a new operator record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    console.log('in operator definition router.post');
    
    const operatorData: OperatorDefinition = req.body;

    console.log('operatorData:', operatorData);

    let client: PoolClient | null = null;

    try {
        // Validate required fields
        const requiredFields = ['OperatorID', 'OperatorName', 'password', 'firstname', 'lastname', 'email'];
        for (const field of requiredFields) {
            if (operatorData[field as keyof OperatorDefinition] === undefined) {
                res.status(400).json({ message: `${field} is required.` });
                return;
            }
        }

        client = await pool.connect();

        // Check if an operator with the same OperatorID already exists
        const existingOperatorByOperatorID = await client.query(
            'SELECT * FROM operatordefinition WHERE OperatorID = $1', 
            [operatorData.OperatorID]
        );

        if (existingOperatorByOperatorID.rows.length > 0) {
            res.status(409).json({ message: 'Operator with this OperatorID already exists.' });
            return;
        }

        // Check if an operator with the same OperatorName already exists
        const existingOperatorByOperatorName = await client.query(
            'SELECT * FROM operatordefinition WHERE OperatorName = $1', 
            [operatorData.OperatorName]
        );
        if (existingOperatorByOperatorName.rows.length > 0) {
            res.status(409).json({ message: 'Operator with this OperatorName already exists.' });
            return;
        }

        // Check if an operator with the same firstname and lastname already exists
        const existingOperatorByFirstnameLastname = await client.query(
            'SELECT * FROM operatordefinition WHERE firstname = $1 AND lastname = $2', 
            [operatorData.firstname, operatorData.lastname]
        );
        if (existingOperatorByFirstnameLastname.rows.length > 0) {
            res.status(409).json({ message: 'Operator with this firstname and lastname already exists.' });
            return;
        }

        // Validate lengths
        if (operatorData.OperatorName.length < 3) {
            res.status(409).json({ message: 'OperatorName must be at least 3 characters long.' });
            return;
        }
        if (operatorData.password.length < 8) {
            res.status(409).json({ message: 'Password must be at least 8 characters long.' });
            return;
        }
        if (operatorData.firstname.length < 3) {
            res.status(409).json({ message: 'Firstname must be at least 3 characters long.' });
            return;
        }
        if (operatorData.lastname.length < 3) {
            res.status(409).json({ message: 'Lastname must be at least 3 characters long.' });
            return;
        }
        if (operatorData.email.length < 3) {
            res.status(409).json({ message: 'Email must be at least 3 characters long.' });
            return;
        }

         // Hash the password
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(operatorData.password, salt);
         operatorData.password = hashedPassword;

        // Insert the new operator data
        await client.query(
            `INSERT INTO operatordefinition (OperatorID, OperatorName, password, firstname, lastname, email) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                operatorData.OperatorID,
                operatorData.OperatorName,
                operatorData.password,
                operatorData.firstname,
                operatorData.lastname,
                operatorData.email
            ]
        );

        res.status(201).json({ message: 'Operator created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating operator', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read all operators
router.get('/', async (req: Request, res: Response) => {
    let client: PoolClient | null = null;

    try {
        client = await pool.connect();

        const rows = await client.query('SELECT * FROM operatordefinition');
        res.json(rows.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching operators', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Read a single operator by OperatorID
router.get('/:OperatorID', async (req: Request, res: Response) => {
    const { OperatorID } = req.params;

    let client: PoolClient | null = null;

    try {
        client = await pool.connect();

        const result = await client.query(
            'SELECT * FROM operatordefinition WHERE OperatorID = $1', 
            [OperatorID]
        );

        if (result.rows.length == 0) {
            res.status(404).json({ message: 'Operator with this OperatorID does not exist.' });
            return;
        }
        res.json(result.rows[0]); // Return the first row
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching operator', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Update an operator record
router.put('/:OperatorID', async (req: Request, res: Response): Promise<void> => {
    const { OperatorID } = req.params;
    const operatorData: OperatorDefinition = req.body;

    let client: PoolClient | null = null;

    try {
        client = await pool.connect();

        // Check if an operator with the same OperatorID already exists
        const result = await client.query(
            'SELECT * FROM operatordefinition WHERE OperatorID = $1', 
            [OperatorID]
        );

        if (result.rows.length == 0) {
            res.status(404).json({ message: 'Operator with this OperatorID does not exist.' });
            return;
        }

        // Update the operator data
        await client.query(
            `UPDATE operatordefinition SET OperatorName = $1, password = $2, firstname = $3, lastname = $4 
            WHERE OperatorID = $5`,
            [
                operatorData.OperatorName,
                operatorData.password,
                operatorData.firstname,
                operatorData.lastname,
                OperatorID
            ]
        );
      
        res.status(200).json({ message: 'Operator updated successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating operator', error });
        return;
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Delete an operator record
router.delete('/:OperatorID', async (req: Request, res: Response): Promise<void> => {
    const { OperatorID } = req.params;

    let client: PoolClient | null = null;

    try {
        client = await pool.connect();

        // Check if an operator with the same OperatorID already exists
        const result = await client.query(
            'SELECT * FROM operatordefinition WHERE OperatorID = $1', 
            [OperatorID]
        );

        if (result.rows.length == 0) {
            res.status(404).json({ message: 'Operator with this OperatorID does not exist.' });
            return;
        }

        // Delete the operator record
        await client.query('DELETE FROM operatordefinition WHERE OperatorID = $1', [OperatorID]);
       
        res.status(200).json({ message: 'Operator deleted successfully' });
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting operator', error });
    } finally {
        if (client) {
            client.release();
        }
    }
});

export default router;






// // backend/src/routes/api/operatorRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader } from 'mysql2/promise';
// import bcrypt from 'bcrypt';

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
// // backend/src/models/OperatorDefinition.ts
// export interface OperatorDefinition {
//     OperatorID: string;
//     OperatorName: string;
//     password: string;
//     firstname: string;
//     lastname: string;
//     email: string;
// }


// // Create a new operator record
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//     console.log('in operator definition router.post');
    
//     const operatorData: OperatorDefinition = req.body;

//     console.log('operatorData:', operatorData);

//     const connection = await mysql.createConnection(dbConfig);
    
//     try {
//         // Validate required fields
//         const requiredFields = ['OperatorID', 'OperatorName', 'password', 'firstname', 'lastname', 'email'];
//         for (const field of requiredFields) {
//             if (operatorData[field as keyof OperatorDefinition] === undefined) {
//                 res.status(400).json({ message: `${field} is required.` });
//                 return;
//             }
//         }

//         // Check if an operator with the same OperatorID already exists
//         let [existingOperator] = await connection.execute(
//             'SELECT * FROM operatordefinition WHERE OperatorID = ?', 
//             [operatorData.OperatorID]
//         );

//         if ((existingOperator as any).length > 0) {
//             res.status(409).json({ message: 'Operator with this OperatorID already exists.' });
//             return;
//         }

       

//         // Check if an operator with the same OperatorName already exists
//         [existingOperator] = await connection.execute(
//             'SELECT * FROM Operator_definition WHERE OperatorName = ?', 
//             [operatorData.OperatorName]
//         );
//         if ((existingOperator as any).length > 0) {
//             res.status(409).json({ message: 'Operator with this OperatorName already exists.' });
//             return;
//         }

//         // Check if an operator with the same firstname and lastname already exists
//         [existingOperator] = await connection.execute(
//             'SELECT * FROM Operator_definition WHERE firstname = ? AND lastname = ?', 
//             [operatorData.firstname, operatorData.lastname]
//         );
//         if ((existingOperator as any).length > 0) {
//             res.status(409).json({ message: 'Operator with this firstname and lastname already exists.' });
//             return;
//         }

//         // Validate lengths
//         if (operatorData.OperatorName.length < 3) {
//             res.status(409).json({ message: 'OperatorName must be at least 3 characters long.' });
//             return;
//         }
//         if (operatorData.password.length < 8) {
//             res.status(409).json({ message: 'Password must be at least 8 characters long.' });
//             return;
//         }
//         if (operatorData.firstname.length < 3) {
//             res.status(409).json({ message: 'Firstname must be at least 3 characters long.' });
//             return;
//         }
//         if (operatorData.lastname.length < 3) {
//             res.status(409).json({ message: 'Lastname must be at least 3 characters long.' });
//             return;
//         }
//         if (operatorData.email.length < 3) {
//             res.status(409).json({ message: 'Email must be at least 3 characters long.' });
//             return;
//         }

//          // Hash the password
//          const salt = await bcrypt.genSalt(10);
//          const hashedPassword = await bcrypt.hash(operatorData.password, salt);
//          operatorData.password = hashedPassword;

//         // Insert the new operator data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO Operator_definition (OperatorID, OperatorName, password, firstname, lastname, email) 
//             VALUES (?, ?, ?, ?, ?, ?)`,
//             [
//                 operatorData.OperatorID,
//                 operatorData.OperatorName,
//                 operatorData.password,
//                 operatorData.firstname,
//                 operatorData.lastname,
//                 operatorData.email
//             ]
//         );

//         res.status(201).json({ message: 'Operator created successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error creating operator', error });
//     } finally {
//         connection.end();
//     }
// });


// // Read all operators
// router.get('/', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         let [existingOperator] = await connection.execute(
//             'SELECT * FROM Operator_definition WHERE OperatorID = ?'
//         );

//         if ((existingOperator as any).length == 0) {
//             res.status(409).json({ message: 'Operator with this OperatorID does not exist.' });
//             return;
//         }
//         const [rows] = await connection.execute('SELECT * FROM Operator_definition');
//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching operators', error });
//     } finally {
//         connection.end();
//     }
// });

// // Read a single operator by OperatorID
// router.get('/:OperatorID', async (req: Request, res: Response) => {
//     const { OperatorID } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         let [existingOperator] = await connection.execute(
//             'SELECT * FROM Operator_definition WHERE OperatorID = ?', 
//             [OperatorID]
//         );

//         if ((existingOperator as any).length == 0) {
//             res.status(409).json({ message: 'Operator with this OperatorID does not exist.' });
//             return;
//         }
//         const [rows] = await connection.execute('SELECT * FROM Operator_definition WHERE OperatorID = ?', [OperatorID]);
        
//         res.json(rows[0]); // Return the first row
//         return;
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching operator', error });
//     } finally {
//         connection.end();
//     }
// });

// // Update an operator record
// router.put('/:OperatorID', async (req: Request, res: Response): Promise<void> => {
//     const { OperatorID } = req.params;
//     const operatorData: OperatorDefinition = req.body;

//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Check if an operator with the same OperatorID already exists
//         let [existingOperator] = await connection.execute(
//             'SELECT * FROM Operator_definition WHERE OperatorID = ?', 
//             [operatorData.OperatorID]
//         );

//         if ((existingOperator as any).length == 0) {
//             res.status(409).json({ message: 'Operator with this OperatorID does not exist.' });
//             return;
//         }

//         const [result] = await connection.execute(
//             `UPDATE Operator_definition SET OperatorName = ?, password = ?, firstname = ?, lastname = ? 
//             WHERE OperatorID = ?`,
//             [
//                 operatorData.OperatorName,
//                 operatorData.password,
//                 operatorData.firstname,
//                 operatorData.lastname,
//                 OperatorID
//             ]
//         );
      
//         res.status(200).json({ message: 'Operator updated successfully' });
//         return
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating operator', error });
//         return
//     } finally {
//         connection.end();
//     }
// });

// // Delete an operator record
// router.delete('/:OperatorID', async (req: Request, res: Response) => {
//     const { OperatorID } = req.params;

//     const connection = await mysql.createConnection(dbConfig);

//     try {
//         // Check if an operator with the same OperatorID already exists
//         let [existingOperator] = await connection.execute(
//             'SELECT * FROM Operator_definition WHERE OperatorID = ?', 
//             [OperatorID]
//         );

//         if ((existingOperator as any).length == 0) {
//             res.status(409).json({ message: 'Operator with this OperatorID does not exist.' });
//             return;
//         }
//         const [result] = await connection.execute('DELETE FROM Operator_definition WHERE OperatorID = ?', [OperatorID]);
       
//         res.status(200).json({ message: 'Operator deleted successfully' });
       
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting operator', error });
//     } finally {
//         connection.end();
//     }
// });

// export default router;