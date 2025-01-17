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
// Create a new BussCurrBalance record
router.post('/', async (req, res) => {
    const bussCurrBalanceData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?', [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(404).json({ message: 'BussCurrBalance record exists' });
            return;
        }
        // Insert the new BussCurrBalance data
        const [result] = await connection.execute(`INSERT INTO tb_BussCurrBalance (buss_no, fiscalyear, balancebf, current_balance, totalAmountDue, transdate, electoralarea) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            bussCurrBalanceData.buss_no,
            bussCurrBalanceData.fiscalyear,
            bussCurrBalanceData.balancebf,
            bussCurrBalanceData.current_balance,
            bussCurrBalanceData.totalAmountDue,
            bussCurrBalanceData.transdate,
            bussCurrBalanceData.electoralarea,
        ]);
        res.status(201).json({ message: 'BussCurrBalance record created successfully' });
        return;
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating BussCurrBalance record', error });
    }
    finally {
        connection.end();
    }
});
// Read all BussCurrBalance records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BussCurrBalance records', error });
    }
    finally {
        connection.end();
    }
});
// Read a single BussCurrBalance record by buss_no
router.get('/:buss_no/:fiscalyear', async (req, res) => {
    const { buss_no, fiscalyear } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?', [buss_no, fiscalyear]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'BussCurrBalance record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching BussCurrBalance record', error });
    }
    finally {
        connection.end();
    }
});
// Update a BussCurrBalance record
router.put('/:buss_no/:fiscalyear', async (req, res) => {
    const { buss_no } = req.params;
    const bussCurrBalanceData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?', [bussCurrBalanceData.buss_no, bussCurrBalanceData.fiscalyear]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'BussCurrBalance record not exist' });
            return;
        }
        // Update the BussCurrBalance data
        const [result] = await connection.execute(`UPDATE tb_BussCurrBalance SET fiscalyear = ?, balancebf = ?, current_balance = ?, totalAmountDue = ?, 
            transdate = ?, electoralarea = ? 
            WHERE buss_no = ? AND fiscalyear = ?`, [
            bussCurrBalanceData.fiscalyear,
            bussCurrBalanceData.balancebf,
            bussCurrBalanceData.current_balance,
            bussCurrBalanceData.totalAmountDue,
            bussCurrBalanceData.transdate,
            bussCurrBalanceData.electoralarea,
            buss_no
        ]);
        res.status(200).json({ message: 'BussCurrBalance record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating BussCurrBalance record', error });
    }
    finally {
        connection.end();
    }
});
// Delete a BussCurrBalance record
router.delete('/:buss_no/:fiscalyear', async (req, res) => {
    const { buss_no, fiscalyear } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?', [buss_no, fiscalyear]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ message: 'BussCurrBalance record not exist' });
            return;
        }
        // Delete the BussCurrBalance record
        const [result] = await connection.execute('DELETE FROM tb_BussCurrBalance WHERE buss_no = ?', [buss_no]);
        res.status(200).json({ message: 'BussCurrBalance record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting BussCurrBalance record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=bussCurrBalanceRoutes.js.map