import * as dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2/promise';
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
    const operatorData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check if an operator with the same OperatorID already exists
        let [existingOperator] = await connection.execute('SELECT * FROM Operator_definition WHERE OperatorID = ?', [operatorData.OperatorID]);
        if (existingOperator.length > 0) {
            res.status(409).json({ message: 'Operator with this OperatorID already exists.' });
            return;
        }
        // Insert the new operator data
        const [result] = await connection.execute(`INSERT INTO Operator_definition (OperatorID, OperatorName, password, firstname, lastname) 
            VALUES (?, ?, ?, ?, ?)`, [
            operatorData.OperatorID,
            operatorData.OperatorName,
            operatorData.password,
            operatorData.firstname,
            operatorData.lastname,
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