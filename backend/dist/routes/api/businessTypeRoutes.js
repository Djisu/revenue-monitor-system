import * as dotenv from 'dotenv';
import { Router } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const router = Router();
// Load environment variables from .env file
dotenv.config();
// PostgreSQL connection pool configuration
const poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'revmonitor',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432', 10),
};
const pool = new Pool(poolConfig);
// Function to sanitize input data
function sanitizeBusinessTypeData(data) {
    return {
        Business_Type: data.Business_Type || ''
    };
}
// Create a new BusinessType record
router.post('/create', async (req, res) => {
    console.log('Creating a new businessType record');
    const businessTypeData = sanitizeBusinessTypeData(req.body);
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM businesstype WHERE business_type = $1', [businessTypeData.Business_Type]);
        if (Array.isArray(result.rows) && result.rows.length > 0) {
            res.status(409).json({ message: 'Business Type record already exists.' });
            return;
        }
        // Insert the new BusinessType data
        await client.query('INSERT INTO businesstype (business_type) VALUES ($1)', [businessTypeData.Business_Type]);
        res.status(201).json({ success: true, message: 'BusinessType record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error creating BusinessType record', error });
    }
    finally {
        client.release();
    }
});
// Read all BusinessType records
router.get('/all', async (req, res) => {
    console.log('in router.get(all Fetching all businessType records');
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT business_type FROM businesstype');
        console.log('result.rows: ', result.rows);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching BusinessType records', error });
    }
    finally {
        client.release();
    }
});
// Read a single BusinessType record by Business_Type
router.get('/:Business_Type', async (req, res) => {
    const { Business_Type } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [Business_Type]);
        if (Array.isArray(result.rows) && result.rows.length > 0) {
            res.status(200).json({ success: true, data: result.rows[0] }); // Return the first row
        }
        else {
            res.status(404).json({ success: false, message: 'BusinessType record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching BusinessType record', error });
    }
    finally {
        client.release();
    }
});
// Update a BusinessType record
router.put('/:Business_Type', async (req, res) => {
    const { Business_Type } = req.params;
    const businessTypeData = sanitizeBusinessTypeData(req.body);
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [businessTypeData.Business_Type]);
        if (Array.isArray(result.rows) && result.rows.length > 0) {
            res.status(409).json({ success: false, message: 'Business Type record already exists.' });
            return;
        }
        // Update the BusinessType data
        await client.query('UPDATE businesstype SET Business_Type = $1 WHERE Business_Type = $2', [businessTypeData.Business_Type, Business_Type]);
        res.status(200).json({ success: true, message: 'BusinessType record updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating BusinessType record', error });
    }
    finally {
        client.release();
    }
});
// Delete a BusinessType record
router.delete('/:Business_Type', async (req, res) => {
    const { Business_Type } = req.params;
    console.log('Deleting BusinessType record:', Business_Type);
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM businesstype WHERE Business_Type = $1', [Business_Type]);
        if (Array.isArray(result.rows) && result.rows.length === 0) {
            res.status(409).json({ success: true, message: 'Business Type record does not exist.' });
            return;
        }
        // Delete the BusinessType record
        await client.query('DELETE FROM businesstype WHERE Business_Type = $1', [Business_Type]);
        res.status(200).json({ success: true, message: 'BusinessType record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting BusinessType record', error });
    }
    finally {
        client.release();
    }
});
router.post('/billallbusinesses', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM gradefees ORDER BY buss_type ASC, grade ASC');
        if (Array.isArray(result.rows) && result.rows.length === 0) {
            res.status(409).json({ success: true, message: 'No records found' });
            return;
        }
        // Loop through all businesses and bill each business type and grade
        for (let i = 0; i < result.rows.length; i++) {
            let ansRow = await client.query('UPDATE business SET current_balance = $1 WHERE buss_type = $2 AND tot_grade = $3', [result.rows[i].fees, result.rows[i].buss_type, result.rows[i].grade]);
        }
        // Select all businesses
        const businessesResult = await client.query('SELECT * FROM business');
        // Insert into busscurrbalance
        for (let i = 0; i < businessesResult.rows.length; i++) {
            await client.query('INSERT INTO busscurrbalance (buss_no, fiscalyear, balancebf, current_balance, totalamountdue, transdate, electoralarea) SELECT $1, $2, $3, $4, $5, $6, $7 FROM business WHERE buss_no = $1', [
                businessesResult.rows[i].buss_no,
                new Date().getFullYear(),
                0,
                businessesResult.rows[i].current_balance,
                0,
                new Date(),
                businessesResult.rows[i].electoralarea
            ]);
        }
        res.status(200).json({ success: true, message: 'All businesses billed successfully' });
        return;
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error billing all businesses', error });
        return;
    }
});
// Ensure the permits directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const permitDir = path.join(__dirname, 'permits');
const fsPromises = fs.promises;
async function ensurePermitDirIsEmpty() {
    try {
        // Check if the directory exists
        await fsPromises.access(permitDir);
        console.log('Permits directory already exists:', permitDir);
        // Read all files and subdirectories in the directory
        const files = await fsPromises.readdir(permitDir);
        // Remove all files and subdirectories
        for (const file of files) {
            const filePath = path.join(permitDir, file);
            const stat = await fsPromises.lstat(filePath);
            if (stat.isDirectory()) {
                // Recursively remove subdirectories
                await fsPromises.rm(filePath, { recursive: true, force: true });
            }
            else {
                // Remove files
                await fsPromises.unlink(filePath);
            }
        }
        console.log('Permits directory emptied:', permitDir);
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            // Directory does not exist, create it
            await fsPromises.mkdir(permitDir, { recursive: true });
            console.log('Created permits directory:', permitDir);
        }
        else {
            console.error('Error accessing permits directory:', err);
        }
    }
}
// Function to find business balance
async function findBusinessBalance(bussNo) {
    const client = await pool.connect();
    try {
        // Get current year and previous fiscal year
        const currentYear = new Date().getFullYear();
        // Find all payments
        const prevPaymentsResult = await client.query('SELECT SUM(paidAmount) AS totsum FROM buspayments WHERE buss_no = $1 AND fiscal_year < $2', [bussNo, currentYear]);
        const prevPayments = prevPaymentsResult.rows[0]?.totsum ?? 0;
        // Find all billings
        const prevBalancesResult = await client.query('SELECT SUM(current_balance) AS totPrevBal FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear < $2', [bussNo, currentYear]);
        const prevBalances = prevBalancesResult.rows[0]?.totPrevBal ?? 0;
        // Calculate balance
        return prevBalances - prevPayments;
    }
    catch (error) {
        console.error(error);
        throw new Error('Error fetching business balance');
    }
    finally {
        client.release();
    }
}
// Function to find total payable based on business number
export async function findTotalPayable(txtBussNo) {
    const client = await pool.connect();
    try {
        // Prepare the SQL query
        const query = `
            SELECT SUM(current_balance) AS totsum
            FROM busscurrbalance
            WHERE buss_no = $1;
        `;
        // Execute the query with the business number
        const result = await client.query(query, [txtBussNo]);
        // Extract the total sum from the result
        return result.rows[0]?.totsum ?? 0;
    }
    catch (error) {
        console.error('Error finding total payable:', error);
        throw error; // Re-throw the error after logging it
    }
    finally {
        client.release();
    }
}
// Function to find the current rate
export async function findCurrentRate(txtBussNo) {
    const client = await pool.connect();
    try {
        // Get the current year
        const currentYear = new Date().getFullYear();
        // Query to find the current rate
        const query = `
            SELECT current_balance 
            FROM busscurrbalance 
            WHERE buss_no = $1 
              AND fiscalyear = $2
        `;
        // Execute the query
        const result = await client.query(query, [txtBussNo, currentYear]);
        // Check if results are returned and not null
        let varPrevBalances = 0;
        if (result.rows.length > 0 && result.rows[0].current_balance !== null) {
            varPrevBalances = result.rows[0].current_balance;
        }
        return varPrevBalances;
    }
    catch (error) {
        console.error('Error:', error);
        return 0;
    }
    finally {
        client.release();
    }
}
export default router;
//# sourceMappingURL=businessTypeRoutes.js.map