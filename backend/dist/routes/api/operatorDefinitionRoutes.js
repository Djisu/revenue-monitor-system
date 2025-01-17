import * as dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
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
// Create a new operator record
router.post('/', async (req, res) => {
    console.log('in operator definition router.post');
    const operatorData = req.body;
    console.log('operatorData:', operatorData);
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Validate required fields
        const requiredFields = ['OperatorID', 'OperatorName', 'password', 'firstname', 'lastname', 'email'];
        for (const field of requiredFields) {
            if (operatorData[field] === undefined) {
                res.status(400).json({ message: `${field} is required.` });
                return;
            }
        }
        // Check if an operator with the same OperatorID already exists
        let [existingOperator] = await connection.execute('SELECT * FROM Operator_definition WHERE OperatorID = ?', [operatorData.OperatorID]);
        if (existingOperator.length > 0) {
            res.status(409).json({ message: 'Operator with this OperatorID already exists.' });
            return;
        }
        // Check if an operator with the same OperatorName already exists
        [existingOperator] = await connection.execute('SELECT * FROM Operator_definition WHERE OperatorName = ?', [operatorData.OperatorName]);
        if (existingOperator.length > 0) {
            res.status(409).json({ message: 'Operator with this OperatorName already exists.' });
            return;
        }
        // Check if an operator with the same firstname and lastname already exists
        [existingOperator] = await connection.execute('SELECT * FROM Operator_definition WHERE firstname = ? AND lastname = ?', [operatorData.firstname, operatorData.lastname]);
        if (existingOperator.length > 0) {
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
        const [result] = await connection.execute(`INSERT INTO Operator_definition (OperatorID, OperatorName, password, firstname, lastname, email) 
            VALUES (?, ?, ?, ?, ?, ?)`, [
            operatorData.OperatorID,
            operatorData.OperatorName,
            operatorData.password,
            operatorData.firstname,
            operatorData.lastname,
            operatorData.email
        ]);
        res.status(201).json({ message: 'Operator created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating operator', error });
    }
    finally {
        connection.end();
    }
});
// Read all operators
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        let [existingOperator] = await connection.execute('SELECT * FROM Operator_definition WHERE OperatorID = ?');
        if (existingOperator.length == 0) {
            res.status(409).json({ message: 'Operator with this OperatorID does not exist.' });
            return;
        }
        const [rows] = await connection.execute('SELECT * FROM Operator_definition');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching operators', error });
    }
    finally {
        connection.end();
    }
});
// Read a single operator by OperatorID
router.get('/:OperatorID', async (req, res) => {
    const { OperatorID } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        let [existingOperator] = await connection.execute('SELECT * FROM Operator_definition WHERE OperatorID = ?', [OperatorID]);
        if (existingOperator.length == 0) {
            res.status(409).json({ message: 'Operator with this OperatorID does not exist.' });
            return;
        }
        const [rows] = await connection.execute('SELECT * FROM Operator_definition WHERE OperatorID = ?', [OperatorID]);
        res.json(rows[0]); // Return the first row
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching operator', error });
    }
    finally {
        connection.end();
    }
});
// Update an operator record
router.put('/:OperatorID', async (req, res) => {
    const { OperatorID } = req.params;
    const operatorData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check if an operator with the same OperatorID already exists
        let [existingOperator] = await connection.execute('SELECT * FROM Operator_definition WHERE OperatorID = ?', [operatorData.OperatorID]);
        if (existingOperator.length == 0) {
            res.status(409).json({ message: 'Operator with this OperatorID does not exist.' });
            return;
        }
        const [result] = await connection.execute(`UPDATE Operator_definition SET OperatorName = ?, password = ?, firstname = ?, lastname = ? 
            WHERE OperatorID = ?`, [
            operatorData.OperatorName,
            operatorData.password,
            operatorData.firstname,
            operatorData.lastname,
            OperatorID
        ]);
        res.status(200).json({ message: 'Operator updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating operator', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Delete an operator record
router.delete('/:OperatorID', async (req, res) => {
    const { OperatorID } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check if an operator with the same OperatorID already exists
        let [existingOperator] = await connection.execute('SELECT * FROM Operator_definition WHERE OperatorID = ?', [OperatorID]);
        if (existingOperator.length == 0) {
            res.status(409).json({ message: 'Operator with this OperatorID does not exist.' });
            return;
        }
        const [result] = await connection.execute('DELETE FROM Operator_definition WHERE OperatorID = ?', [OperatorID]);
        res.status(200).json({ message: 'Operator deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting operator', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=operatorDefinitionRoutes.js.map