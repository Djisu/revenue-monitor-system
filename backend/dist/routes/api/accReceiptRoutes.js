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
// Create a new AccReceipt record
router.post('/', async (req, res) => {
    const accReceiptData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Insert the new AccReceipt data
        // Check if an operator permission with the same OperatorID already exists
        let [accReceipt] = await connection.execute('SELECT * FROM tb_AccReceipt WHERE batchno = ? AND fiscalyear = ?', [accReceiptData.batchno, accReceiptData.fiscalyear]);
        if (accReceipt.length > 0) {
            res.status(409).json({ message: 'Account reception with this batch number and fiscal year already exists.' });
            return;
        }
        const [result] = await connection.execute(`INSERT INTO tb_AccReceipt (fiscalyear, batchno, firstno, lastno) 
            VALUES (?, ?, ?, ?)`, [
            accReceiptData.fiscalyear,
            accReceiptData.batchno,
            accReceiptData.firstno,
            accReceiptData.lastno,
        ]);
        res.status(201).json({ message: 'AccReceipt created successfully' });
        return;
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating AccReceipt', error });
    }
    finally {
        connection.end();
    }
});
// Read all AccReceipt records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_AccReceipt');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching AccReceipts', error });
    }
    finally {
        connection.end();
    }
});
// Read a single AccReceipt by ID (batchno)
router.get('/:batchno/:fiscalyear', async (req, res) => {
    const { batchno, fiscalyear } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check if an operator permission with the same OperatorID already exists
        let [accReceipt] = await connection.execute('SELECT * FROM tb_AccReceipt WHERE batchno = ? AND fiscalyear = ?', [batchno, fiscalyear]);
        if (accReceipt.length == 0) {
            res.status(409).json({ message: 'Account reception with this batch number and fiscal year does not exist.' });
            return;
        }
        const [rows] = await connection.execute('SELECT * FROM tb_AccReceipt WHERE batchno = ? AND fiscalyear = ?', [batchno, fiscalyear]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'AccReceipt not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching AccReceipt', error });
    }
    finally {
        connection.end();
    }
});
// Update an AccReceipt record
router.put('/:batchno', async (req, res) => {
    const { batchno } = req.params;
    const accReceiptData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Check if an operator permission with the same OperatorID already exists
        let [accReceipt] = await connection.execute('SELECT * FROM tb_AccReceipt WHERE batchno = ? AND fiscalyear = ?', [accReceiptData.batchno, accReceiptData.fiscalyear]);
        if (accReceipt.length > 0) {
            res.status(409).json({ message: 'Operator permission with this OperatorID already exists.' });
            return;
        }
        // Update the AccReceipt data
        const [result] = await connection.execute(`UPDATE tb_AccReceipt SET fiscalyear = ?, firstno = ?, lastno = ? 
            WHERE batchno = ? AND fiscalyear = ?`, [
            accReceiptData.firstno,
            accReceiptData.lastno,
            batchno,
            accReceiptData.fiscalyear
        ]);
        res.status(200).json({ message: 'AccReceipt updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating AccReceipt', error });
    }
    finally {
        connection.end();
    }
});
// Delete an AccReceipt record
router.delete('/:batchno/:fiscalyear', async (req, res) => {
    const { batchno, fiscalyear } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Delete the AccReceipt record
        const [result] = await connection.execute('DELETE FROM tb_AccReceipt WHERE batchno = ? AND fiscalyear = ?', [batchno, fiscalyear]);
        res.status(200).json({ message: 'AccReceipt deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting AccReceipt', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=accReceiptRoutes.js.map