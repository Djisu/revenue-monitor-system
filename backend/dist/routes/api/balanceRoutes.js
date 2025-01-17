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
// Create a new balance record
router.post('/', async (req, res) => {
    const balanceData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        let [existingBalance] = await connection.execute('SELECT * FROM tb_balance WHERE buss_no = ?', [balanceData.buss_no]);
        if (Array.isArray(existingBalance) && existingBalance.length > 0) {
            res.status(409).json({ message: 'Balance record with this business number already exists.' });
            return;
        }
        // Insert the new balance data
        const [result] = await connection.execute(`INSERT INTO tb_balance (buss_no, buss_name, billamount, paidamount, balance, electroral_area, street_name) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            balanceData.buss_no,
            balanceData.buss_name,
            balanceData.billamount,
            balanceData.paidamount,
            balanceData.balance,
            balanceData.electroral_area,
            balanceData.street_name,
        ]);
        res.status(201).json({ message: 'Balance record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating balance record', error });
    }
    finally {
        connection.end();
    }
});
// Read all balance records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_balance');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching balance records', error });
    }
    finally {
        connection.end();
    }
});
// Read a single balance record by buss_no
router.get('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_balance WHERE buss_no = ?', [buss_no]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'Balance record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching balance record', error });
    }
    finally {
        connection.end();
    }
});
// Update a balance record
router.put('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const balanceData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        let [existingBalance] = await connection.execute('SELECT * FROM tb_balance WHERE buss_no = ?', [balanceData.buss_no]);
        if (Array.isArray(existingBalance) && existingBalance.length > 0) {
            res.status(409).json({ message: 'Balance record with this business number already exists.' });
            return;
        }
        // Update the balance data
        const [result] = await connection.execute(`UPDATE tb_balance SET buss_name = ?, billamount = ?, paidamount = ?, balance = ?, electroral_area = ?, street_name = ? 
            WHERE buss_no = ?`, [
            balanceData.buss_name,
            balanceData.billamount,
            balanceData.paidamount,
            balanceData.balance,
            balanceData.electroral_area,
            balanceData.street_name,
            buss_no
        ]);
        res.status(200).json({ message: 'Balance record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating balance record', error });
    }
    finally {
        connection.end();
    }
});
// Delete a balance record
router.delete('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        let [existingBalance] = await connection.execute('SELECT * FROM tb_balance WHERE buss_no = ?', [buss_no]);
        if (Array.isArray(existingBalance) && existingBalance.length > 0) {
            res.status(409).json({ message: 'Balance record with this business number already exists.' });
            return;
        }
        // Delete the balance record
        const [result] = await connection.execute('DELETE FROM tb_balance WHERE buss_no = ?', [buss_no]);
        res.status(200).json({ message: 'Balance record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting balance record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=balanceRoutes.js.map