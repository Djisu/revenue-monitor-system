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
// Create a new operator permission record
router.post('/', async (req, res) => {
    const operatorPermissionData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check if an operator permission with the same OperatorID already exists
        let [existingPermission] = await connection.execute('SELECT * FROM operator_permission WHERE OperatorID = ?', [operatorPermissionData.OperatorID]);
        if (existingPermission.length > 0) {
            res.status(409).json({ message: 'Operator permission with this OperatorID already exists.' });
            return;
        }
        // Insert the new operator permission data
        const [result] = await connection.execute(`INSERT INTO operator_permission (OperatorID, Menus, Reports, databasesx, password) 
            VALUES (?, ?, ?, ?, ?)`, [
            operatorPermissionData.OperatorID,
            operatorPermissionData.Menus,
            operatorPermissionData.Reports,
            operatorPermissionData.databasesx,
            operatorPermissionData.password,
        ]);
        res.status(201).json({ message: 'Operator permission created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating operator permission', error });
    }
    finally {
        connection.end();
    }
});
// Read all operator permissions
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM operator_permission');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching operator permissions', error });
    }
    finally {
        connection.end();
    }
});
// Read a single operator permission by OperatorID
router.get('/:OperatorID', async (req, res) => {
    const { OperatorID } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM operator_permission WHERE OperatorID = ?', [OperatorID]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'Operator permission not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching operator permission', error });
    }
    finally {
        connection.end();
    }
});
// Update an operator permission record
router.put('/:OperatorID', async (req, res) => {
    const { OperatorID } = req.params;
    const operatorPermissionData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check if an operator permission with the same OperatorID exists
        let [existingPermission] = await connection.execute('SELECT * FROM operator_permission WHERE OperatorID = ?', [OperatorID]);
        if (existingPermission.length == 0) {
            res.status(404).json({ message: 'Operator permission with this OperatorID does not exist.' });
            return;
        }
        const [result] = await connection.execute(`UPDATE operator_permission SET Menus = ?, Reports = ?, databasesx = ?, password = ? 
            WHERE OperatorID = ?`, [
            operatorPermissionData.Menus,
            operatorPermissionData.Reports,
            operatorPermissionData.databasesx,
            operatorPermissionData.password,
            OperatorID
        ]);
        res.status(200).json({ message: 'Operator permission updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating operator permission', error });
    }
    finally {
        connection.end();
    }
});
// Delete an operator permission record
router.delete('/:OperatorID', async (req, res) => {
    const { OperatorID } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check if an operator permission with the same OperatorID exists
        let [existingPermission] = await connection.execute('SELECT * FROM operator_permission WHERE OperatorID = ?', [OperatorID]);
        if (existingPermission.length == 0) {
            res.status(404).json({ message: 'Operator permission with this OperatorID does not exist.' });
            return;
        }
        await connection.execute('DELETE FROM operator_permission WHERE OperatorID = ?', [OperatorID]);
        res.status(200).json({ message: 'Operator permission deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting operator permission', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=operatorPermissionRoutes.js.map