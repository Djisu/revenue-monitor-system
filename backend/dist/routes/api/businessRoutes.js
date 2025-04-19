import express from 'express';
import * as dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
import { generatePdf } from '../../generatePdf.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ensurePermitDirIsEmpty from '../../utils/ensurePermitDirIsEmpty.js'; //'../../utils/ensurePermitDirIsEmpty.js';
import { createClient } from '../../db.js';
dotenv.config(); // Load .env file from the default location
const nodeEnv = process.env.NODE_ENV;
let frontendUrl = ""; // Set frontend URL based on node environment
if (nodeEnv === 'development') {
    frontendUrl = "http://localhost:5173";
}
else if (nodeEnv === 'production') {
    frontendUrl = "https://revenue-monitor-system.onrender.com";
}
else if (nodeEnv === 'test') {
    console.log('Just testing');
}
else {
    console.log('Invalid node environment variable'); //.slice()
}
const router = express.Router();
// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
const pool = new Pool(dbConfig);
// Function to sanitize input data
function sanitizeBusinessData(data) {
    return {
        buss_no: Number(data.buss_no) || null,
        buss_name: data.buss_name || '',
        buss_address: data.buss_address || '',
        buss_type: data.buss_type || '',
        buss_town: data.buss_town || '',
        buss_permitno: data.buss_permitno || '',
        street_name: data.street_name || '',
        landmark: data.landmark || '',
        electroral_area: data.electroral_area || '',
        property_class: data.property_class || '',
        tot_grade: data.tot_grade || '',
        ceo: data.ceo || '',
        telno: data.telno || '',
        strategiclocation: Number(data.strategiclocation) || 0,
        productvariety: Number(data.productvariety) || 0,
        businesspopularity: Number(data.businesspopularity) || 0,
        businessenvironment: Number(data.businessenvironment) || 0,
        sizeofbusiness: Number(data.sizeofbusiness) || 0,
        numberofworkingdays: Number(data.numberofworkingdays) || 0,
        businessoperatingperiod: Number(data.businessoperatingperiod) || 0,
        competitorsavailable: Number(data.competitorsavailable) || 0,
        assessmentby: data.assessmentby || '',
        transdate: data.transdate ? new Date(data.transdate) : new Date(),
        balance: Number(data.balance) || 0,
        status: data.status || '',
        current_rate: Number(data.current_rate) || 0,
        property_rate: Number(data.property_rate) || 0,
        totalmarks: Number(data.totalmarks) || 0,
        emailaddress: data.emailaddress || '',
        noofemployees: Number(data.noofemployees) || 0,
        noofbranches: Number(data.noofbranches) || 0,
        BALANCENEW: Number(data.BALANCENEW) || 0,
        gps_address: data.gps_address || '',
        serialNo: Number(data.serialNo) || 0,
        buss_location: data.buss_location || '',
    };
}
// Ensure the permits directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const permitDir = path.join(__dirname, 'permits');
const fsPromises = fs.promises;
// Function to add record to tb_BussCurrBalance
async function addRecord(txtBussNo, dtTransdate, txtBalanceBF, txtCurrentRate, txtRate, cboElectoralArea, cboAssessmentBy) {
    const client = createClient();
    try {
        // Get current year and previous fiscal year
        const currentYear = new Date().getFullYear();
        const varFiscalYear = dtTransdate.getFullYear();
        const varPrevFiscalYear = varFiscalYear - 1;
        // Find previous fiscal year balance
        const findPreviousFiscalYearQuery = `
            SELECT balancebf 
            FROM busscurrbalance 
            WHERE buss_no = $1 AND fiscalyear = $2;
        `;
        const prevResults = await client.query(findPreviousFiscalYearQuery, [txtBussNo, varPrevFiscalYear]);
        let varBalanceBF = 0;
        if (prevResults.rows.length > 0) {
            varBalanceBF = prevResults.rows[0].balancebf;
        }
        // Insert or update record in tb_BussCurrBalance
        const insertNewRecordQuery = `
            INSERT INTO busscurrbalance (buss_no, fiscalyear, balancebf, current_balance, totalAmountDue, transdate, electoralarea, assessmentby) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            ON CONFLICT (buss_no, fiscalyear) DO UPDATE 
            SET balancebf = EXCLUDED.balancebf, 
                current_balance = EXCLUDED.current_balance, 
                totalAmountDue = EXCLUDED.totalAmountDue, 
                transdate = EXCLUDED.transdate, 
                electoralarea = EXCLUDED.electoralarea;
        `;
        const insertValues = [
            txtBussNo, varFiscalYear, varBalanceBF, txtCurrentRate, (varBalanceBF + txtCurrentRate), dtTransdate, cboElectoralArea, cboAssessmentBy
        ];
        await client.query(insertNewRecordQuery, insertValues);
        return true;
    }
    catch (error) {
        console.error('Error in adding a record:', error);
        return false;
    }
    finally {
        client.end();
    }
}
// Read all businesses
router.get('/all', async (req, res) => {
    const client = createClient();
    try {
        const result = await client.query('SELECT * FROM business ORDER BY buss_no ASC');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching businesses', error: error.message });
    }
    finally {
        client.end();
    }
});
// Read last business
router.get('/last', async (req, res) => {
    console.log('in router.get(/last');
    const client = createClient();
    try {
        // Fetch the last business
        const result = await client.query('SELECT * FROM business ORDER BY buss_no DESC LIMIT 1');
        let newBussNo = 1; // Default value if no businesses are found
        if (result.rows.length > 0) {
            // Get the last business's buss_no and increment it
            const lastBussNo = result.rows[0].buss_no;
            newBussNo = lastBussNo + 1;
        }
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.status(200).json({ newBussNo }); // Return the new buss_no
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching businesses', error: error.message });
    }
    finally {
        client.end();
    }
});
// Read a single business by buss_no
router.get('/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    console.log('in router.get(/:buss_no)', req.params); // Debugging output
    // Check if buss_no is invalid
    if (!buss_no || isNaN(Number(buss_no))) {
        res.status(400).json({ message: 'Valid business number is required', data: [] });
        return;
    }
    const client = createClient();
    try {
        // Debugging: Log the query being executed
        console.log('Executing query for buss_no:', buss_no);
        const newBuss_no = parseInt(buss_no);
        const result = await client.query('SELECT * FROM business WHERE buss_no = $1', [newBuss_no]);
        // client.release();
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Business record not found', data: [] });
            return;
        }
        res.status(200).json({ message: 'Business record found', data: result.rows[0] });
        return;
    }
    catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Error fetching business', data: error.message });
        return;
    }
    finally {
        client.end(); // Ensure the client is released
    }
});
// Read all electoral_areas
router.get('/electoralAreas', async (req, res) => {
    const client = createClient();
    try {
        const result = await client.query('SELECT DISTINCT electroral_area FROM business');
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No electoral areas found' });
        }
        else {
            res.status(200).json(result.rows);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching electoral areas', error });
    }
    finally {
        client.end();
    }
});
// Read a single electoral_area
router.get('/electoral/:electoral_area', async (req, res) => {
    const { electoral_area } = req.params;
    const client = createClient();
    try {
        const result = await client.query('SELECT * FROM business WHERE electroral_area = $1', [electoral_area]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No businesses found for the electoral area' });
        }
        else {
            res.status(200).json(result.rows);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching businesses for electoral area', error });
    }
    finally {
        client.end();
    }
});
// Read a single business by buss_name
router.get('/name/:buss_name', async (req, res) => {
    const { buss_name } = req.params;
    const client = createClient();
    try {
        const result = await client.query('SELECT * FROM business WHERE buss_name = $1', [buss_name]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Business record not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching business by name', error });
    }
    finally {
        client.end();
    }
});
// Create a new business record
router.post('/create', async (req, res) => {
    console.log('Creating a new business');
    // Sanitize the input data
    const sanitizedData = sanitizeBusinessData(req.body);
    // console.log(sanitizedData);
    const client = createClient();
    try {
        // Check if a business with the same buss_no already exists
        const existingBusinessResult = await client.query('SELECT * FROM business WHERE buss_no = $1', [sanitizedData.buss_no]);
        if (existingBusinessResult.rows.length > 0) {
            res.status(409).json({ success: false, message: 'Business record already exists', BALANCENEW: 0 });
            return;
        }
        let mysqlDate;
        if (sanitizedData.transdate) {
            mysqlDate = sanitizedData.transdate.toISOString().split('T')[0];
        }
        else {
            // Handle the case when transdate is null or undefined
            mysqlDate = new Date().toISOString().split('T')[0]; // Set to current date or any default date
            // Or, you can skip the insertion of this field or mark it as null in the database
        }
        // Insert the new business data
        const insertBusinessQuery = `
        INSERT INTO business (
            buss_no, buss_name, buss_address, 
            buss_type, buss_town, buss_permitno,
            street_name, landmark, electroral_area,
            property_class, tot_grade, ceo, 
            telno, strategiclocation, productvariety, 
            businesspopularity, businessenvironment, sizeofbusiness, 
            numberofworkingdays, businessoperatingperiod, competitorsavailable, 
            assessmentby, transdate, balance, 
            status, current_rate, property_rate,
            totalmarks, emailaddress, noofemployees, 
            noofbranches, balancenew, gps_address, 
            serialNo, buss_location) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35);
    `;
        const insertValues = [
            sanitizedData.buss_no, sanitizedData.buss_name, sanitizedData.buss_address,
            sanitizedData.buss_type, sanitizedData.buss_town, sanitizedData.buss_permitno,
            sanitizedData.street_name, sanitizedData.landmark, sanitizedData.electroral_area,
            sanitizedData.property_class, sanitizedData.tot_grade, sanitizedData.ceo,
            sanitizedData.telno, sanitizedData.strategiclocation, sanitizedData.productvariety,
            sanitizedData.businesspopularity, sanitizedData.businessenvironment, sanitizedData.sizeofbusiness,
            sanitizedData.numberofworkingdays, sanitizedData.businessoperatingperiod, sanitizedData.competitorsavailable,
            sanitizedData.assessmentby, mysqlDate, sanitizedData.balance,
            sanitizedData.status, sanitizedData.current_rate, sanitizedData.property_rate,
            sanitizedData.totalmarks, sanitizedData.emailaddress, sanitizedData.noofemployees,
            sanitizedData.noofbranches, sanitizedData.BALANCENEW, sanitizedData.gps_address,
            sanitizedData.serialNo, sanitizedData.buss_location,
        ];
        // Ensure the number of columns matches the number of values
        if (insertValues.length !== 35) {
            throw new Error(`Mismatch in columns and values: expected 34, found ${insertValues.length}`);
        }
        await client.query(insertBusinessQuery, insertValues);
        // Call addRecord function to add new record to busscurrbalance table
        const addRecordSuccess = await addRecord(sanitizedData.buss_no, sanitizedData.transdate, sanitizedData.balance, sanitizedData.current_rate, sanitizedData.property_rate, sanitizedData.electroral_area, sanitizedData.assessmentby);
        if (!addRecordSuccess) {
            throw new Error('Failed to add record to busscurrbalance');
        }
        res.status(201).json({ success: true, message: 'Business record created successfully', BUSS_NO: sanitizedData.buss_no });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating business', error });
    }
    finally {
        client.end();
    }
});
// Update a business record
router.put('/:buss_no', async (req, res) => {
    console.log('in router.put(/:buss_no)');
    const client = createClient();
    try {
        const { buss_no } = req.params;
        const businessData = req.body;
        //console.log('THIS IS THE businessData:', businessData);
        // Sanitize the input data
        const sanitizedData = sanitizeBusinessData(req.body);
        //console.log('sanitizedData:', sanitizedData);
        if (sanitizedData.buss_name === null || sanitizedData.buss_name === undefined ||
            sanitizedData.buss_address === null || sanitizedData.buss_address === undefined ||
            sanitizedData.buss_type === null || sanitizedData.buss_type === undefined ||
            sanitizedData.buss_town === null || sanitizedData.buss_town === undefined ||
            sanitizedData.buss_permitno === null || sanitizedData.buss_permitno === undefined ||
            sanitizedData.street_name === null || sanitizedData.street_name === undefined ||
            sanitizedData.landmark === null || sanitizedData.landmark === undefined ||
            sanitizedData.electroral_area === null || sanitizedData.electroral_area === undefined ||
            sanitizedData.property_class === null || sanitizedData.property_class === undefined ||
            sanitizedData.tot_grade === null || sanitizedData.tot_grade === undefined ||
            sanitizedData.ceo === null || sanitizedData.ceo === undefined ||
            sanitizedData.telno === null || sanitizedData.telno === undefined ||
            isNaN(sanitizedData.strategiclocation) ||
            isNaN(sanitizedData.productvariety) ||
            isNaN(sanitizedData.businesspopularity) ||
            isNaN(sanitizedData.businessenvironment) ||
            isNaN(sanitizedData.sizeofbusiness) ||
            isNaN(sanitizedData.numberofworkingdays) ||
            isNaN(sanitizedData.businessoperatingperiod) ||
            isNaN(sanitizedData.competitorsavailable) ||
            sanitizedData.assessmentby === null || sanitizedData.assessmentby === undefined ||
            sanitizedData.transdate === null || sanitizedData.transdate === undefined ||
            isNaN(sanitizedData.balance) ||
            sanitizedData.status === null || sanitizedData.status === undefined ||
            isNaN(sanitizedData.current_rate) ||
            isNaN(sanitizedData.property_rate) ||
            isNaN(sanitizedData.totalmarks) ||
            sanitizedData.emailaddress === null || sanitizedData.emailaddress === undefined ||
            isNaN(sanitizedData.noofemployees) ||
            isNaN(sanitizedData.noofbranches) ||
            isNaN(sanitizedData.BALANCENEW) ||
            sanitizedData.gps_address === null || sanitizedData.gps_address === undefined ||
            sanitizedData.serialNo === null || sanitizedData.serialNo === undefined ||
            sanitizedData.buss_location === null || sanitizedData.buss_location === undefined) {
            console.log('Invalid or missing input data');
            res.status(400).json({ success: false, message: 'Invalid or missing input data' });
            return;
        }
        // Check if a business with the same buss_no already exists
        const existingBusinessResult = await client.query('SELECT * FROM business WHERE buss_no = $1', [buss_no]);
        if (existingBusinessResult.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Business record not found' });
            return;
        }
        const mysqlDate = sanitizedData.transdate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
        // Update the business data
        const updateBusinessQuery = `
            UPDATE business SET 
                buss_name = $1, 
                buss_address = $2, 
                buss_type = $3, 
                buss_town = $4, 
                buss_permitno = $5,
                street_name = $6, 
                landmark = $7, 
                electroral_area = $8, 
                property_class = $9, 
                tot_grade = $10, 
                ceo = $11, 
                telno = $12, 
                strategiclocation = $13, 
                productvariety = $14, 
                businesspopularity = $15, 
                businessenvironment = $16, 
                sizeofbusiness = $17, 
                numberofworkingdays = $18, 
                businessoperatingperiod = $19, 
                competitorsavailable = $20, 
                assessmentby = $21, 
                transdate = $22, 
                balance = $23, 
                status = $24, 
                current_rate = $25, 
                property_rate = $26, 
                totalmarks = $27, 
                emailaddress = $28, 
                noofemployees = $29, 
                noofbranches = $30, 
                BALANCENEW = $31, 
                gps_address = $32, 
                serialNo = $33, 
                buss_location = $34
            WHERE buss_no = $35;
        `;
        const updateValues = [
            sanitizedData.buss_name,
            sanitizedData.buss_address,
            sanitizedData.buss_type,
            sanitizedData.buss_town,
            sanitizedData.buss_permitno,
            sanitizedData.street_name,
            sanitizedData.landmark,
            sanitizedData.electroral_area,
            sanitizedData.property_class,
            sanitizedData.tot_grade,
            sanitizedData.ceo,
            sanitizedData.telno,
            sanitizedData.strategiclocation,
            sanitizedData.productvariety,
            sanitizedData.businesspopularity,
            sanitizedData.businessenvironment,
            sanitizedData.sizeofbusiness,
            sanitizedData.numberofworkingdays,
            sanitizedData.businessoperatingperiod,
            sanitizedData.competitorsavailable,
            sanitizedData.assessmentby,
            mysqlDate,
            sanitizedData.balance,
            sanitizedData.status,
            sanitizedData.current_rate,
            sanitizedData.property_rate,
            sanitizedData.totalmarks,
            sanitizedData.emailaddress,
            sanitizedData.noofemployees,
            sanitizedData.noofbranches,
            sanitizedData.BALANCENEW,
            sanitizedData.gps_address,
            sanitizedData.serialNo,
            sanitizedData.buss_location,
            buss_no
        ];
        const updateResult = await client.query(updateBusinessQuery, updateValues);
        if (updateResult.rowCount > 0) {
            res.status(200).json({ success: true, message: 'Business updated successfully' });
        }
        else {
            res.status(400).json({ success: false, message: 'Failed to update business' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating business', error });
    }
    finally {
        client.end();
    }
});
// Delete a business record
router.delete('/delete/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const client = createClient();
    try {
        // Check if a business with the same buss_no already exists
        const existingBusinessResult = await client.query('SELECT * FROM business WHERE buss_no = $1', [buss_no]);
        if (existingBusinessResult.rows.length === 0) {
            res.status(404).json({ message: 'Business record not found' });
            return;
        }
        // Delete the business record
        await client.query('DELETE FROM business WHERE buss_no = $1', [buss_no]);
        res.status(200).json({ message: 'Business deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting business', error });
    }
    finally {
        client.end();
    }
});
// Process business operating permits for a fiscal year
router.post('/processOperatingPermits/:electoral_area/:fiscal_year', async (req, res) => {
    console.log('in router.post(/processOperatingPermits/:electoral_area/:fiscal_year)', req.params);
    const client = createClient();
    try {
        // Ensure the permits directory is empty
        await ensurePermitDirIsEmpty();
        console.log('after ensurePermitDirIsEmpty()');
        const { electoral_area, fiscal_year } = req.params;
        console.log('electoral_area:', electoral_area, 'fiscal_year:', fiscal_year);
        //console.log('before SELECT * FROM business WHERE electroral_area = $1')
        // Delete fiscalyear from busscurrbalance table
        //await client.query('DELETE FROM busscurrbalance WHERE fiscalyear = $1', [fiscal_year]);
        // Select all businesses
        const businessesResult = await client.query('SELECT * FROM business');
        console.log('ABOUT TO BILL ALL BUSINESSES');
        // Insert into busscurrbalance
        //  for (const businessRow of businessesResult.rows) {
        //      await client.query(
        //          'INSERT INTO busscurrbalance (buss_no, fiscalyear, balancebf, current_balance, totalamountdue, transdate, electoralarea, assessmentby) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        //          [
        //              businessRow.buss_no,
        //              new Date().getFullYear(),
        //              0, // balancebf
        //              businessRow.current_rate,
        //              0, // totalamountdue
        //              new Date().toISOString().split('T')[0], // transdate
        //              businessRow.electroral_area,
        //              businessRow.assessmentby // Add the appropriate value for `assessmentby`
        //          ]
        //      );
        //  }
        // Select all businesses in the electoral area
        let businessRows = await client.query('SELECT * FROM business WHERE electroral_area ILIKE $1', [electoral_area]);
        console.log('after SELECT * FROM business WHERE electroral_area = $1');
        console.log('businessRows.rows.length === 0: ', businessRows.rows.length === 0);
        if (businessRows.rows.length === 0) {
            res.status(404).json({ message: 'No businesses found for the electoral area' });
            return;
        }
        console.log('after SELECT * FROM business WHERE electroral_area = $1');
        // Update balancebf in busscurrbalance table for all businesses in the electoral area for the given fiscal year
        for (let i = 0; i < businessRows.rows.length; i++) {
            const { buss_no } = businessRows.rows[i];
            console.log('in the update busscurrbalance table loop');
            let varCurrentRate = 0;
            let varBalance = await findBusinessBalance(buss_no);
            console.log('about to update busscurrbalance table');
            // Update busscurrbalance table with current balance and fiscal year
            await client.query('UPDATE busscurrbalance SET balancebf = $1 WHERE buss_no = $2 AND fiscalyear = $3', [varBalance, buss_no, fiscal_year]);
            console.log('after updating busscurrbalance table');
        }
        // Delete from tmp_business
        await client.query('DELETE FROM tmpbusiness');
        // Delete from tmp_BussCurrBalance
        await client.query('DELETE FROM tmpbusscurrbalance');
        // Insert into tmp_business
        let tmpBusinessRows = await client.query(`
            INSERT INTO tmpbusiness 
            SELECT * FROM business 
            WHERE electroral_area ILIKE $1 
              AND current_rate > 0 
              AND status = 'Active' 
            ORDER BY buss_name ASC 
            RETURNING *;
        `, [electoral_area]);
        console.log('after insert into tmpbusiness');
        const recReport = await client.query('SELECT DISTINCT * FROM busscurrbalance WHERE fiscalyear = $1 AND electoralarea ILIKE  $2', [fiscal_year, electoral_area]);
        console.log('after SELECT DISTINCT * FROM busscurrbalance WHERE fiscalyear = $1 AND electoralarea ILIKE  $2');
        console.log('recReport.rows.length:', recReport.rows.length);
        if (recReport.rows.length === 0) {
            res.status(404).json({ message: 'No paid bills found for the electoral area' });
            return;
        }
        await client.query('INSERT INTO tmpbusscurrbalance SELECT * FROM busscurrbalance WHERE fiscalyear = $1 AND electoralarea ILIKE  $2', [fiscal_year, electoral_area]);
        console.log('after INSERT INTO tmpbusscurrbalance SELECT * FROM busscurrbalance');
        // Add serial numbers
        let recBusiness = await client.query('SELECT * FROM tmpbusiness ORDER BY buss_no');
        if (recBusiness.rows.length === 0) {
            res.status(404).json({ message: 'No buainesses found for the electoral area' });
            return;
        }
        let permitNo = 1;
        for (let i = 0; i < recBusiness.rows.length; i++) {
            const varSerialNo = permitNo.toString().padStart(10, '0');
            console.log(`Updating buss_no: ${recBusiness.rows[i].buss_no}, Serial No: ${varSerialNo}`);
            await client.query('UPDATE tmpbusiness SET serialno = $1 WHERE buss_no = $2', [varSerialNo, recBusiness.rows[i].buss_no]);
            permitNo++;
        }
        console.log('after serial number generation');
        // Check if there are any bills in tmp_business
        let recBills = await client.query('SELECT * FROM tmpbusiness ORDER BY buss_name ASC');
        if (recBills.rows.length === 0) {
            res.status(404).json({ message: 'No bills found for the electoral area' });
            return;
        }
        console.log('ABOUT TO GENERATE PDFs');
        // Produce Bills now
        for (const bill of recBills.rows) {
            console.log('Generating PDF for bill:', bill.buss_no);
            try {
                const pdfBuffer = await generatePdf(bill);
                // Save the PDF to a file or handle it as needed
                fs.writeFileSync(path.join(__dirname, 'permits', `permit_${bill.buss_no}.pdf`), pdfBuffer);
            }
            catch (error) {
                console.error('Error generating PDF for bill:', bill, error);
                res.status(500).json({ message: `Error generating PDF for bill ${bill.buss_no}: ${error.message}` });
                return;
            }
        }
        res.status(200).json({ message: 'Bills generated successfully' });
    }
    catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ message: 'Error processing operating permits', error });
    }
    finally {
        client.end();
    }
});
// Function to find business balance
async function findBusinessBalance(bussNo) {
    console.log('in findBusinessBalance()');
    const client = createClient();
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
        if (client) {
            client.end(); // Release the client instance
        }
    }
}
// Function to find total payable based on business number
export async function findTotalPayable(txtBussNo) {
    const client = createClient();
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
        client.end();
    }
}
// Function to find the current rate
export async function findCurrentRate(txtBussNo) {
    const client = createClient();
    try {
        // Get the current year
        const currentYear = new Date().getFullYear();
        // Query to find the current rate
        const query = `
            SELECT current_balance 
            FROM busscurrbalance 
            WHERE buss_no = $1 
              AND fiscalyear = $2;
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
        client.end();
    }
}
export default router;
// // backend/src/routes/api/businessRoutes.ts
// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import mysql, { ResultSetHeader }  from 'mysql2/promise';
// import { generatePdf } from '../../generatePdf.js'
// import fs from 'fs';
// import path from 'path';
// import PDFDocument from 'pdfkit';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import Connection from 'mysql2/typings/mysql/lib/Connection.js';
// const router = Router();
// dotenv.config(); // Load .env file from the default location
// // MySQL connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'revmonitor',
//     connectionLimit: 10,
//     waitForConnections: true,
//     queueLimit: 0,
// };
// // Business data interface (this should match the expected structure in your request body)
// export interface BusinessData {
//     buss_no: number;
//     buss_name?: string;
//     buss_address?: string;
//     buss_type?: string;
//     buss_town?: string;
//     street_name?: string;
//     landmark?: string;
//     electroral_area?: string;
//     property_class?: string;
//     tot_grade?: string;
//     ceo?: string;
//     telno?: string;
//     strategiclocation?: number;
//     productvariety?: number;
//     businesspopularity?: number;
//     businessenvironment?: number;
//     sizeofbusiness?: number;
//     numberofworkingdays?: number;
//     businessoperatingperiod?: number;
//     competitorsavailable?: number;
//     assessmentby?: string;
//     transdate?: Date;
//     balance?: number;
//     status?: string;
//     current_rate?: number;
//     property_rate?: number;
//     totalmarks?: number;
//     emailaddress?: string; 
//     noofemployees?: number;
//     noofbranches?: number;
//     BALANCENEW?: number;
//     gps_address?: string; 
//     serialNo?: number;
// }
// // Function to sanitize input data
// function sanitizeBusinessData(data: any) {
//     return {
//         buss_no: Number(data.buss_no) || null,
//         buss_name: data.buss_name || '',
//         buss_address: data.buss_address || '',
//         buss_type: data.buss_type || '',
//         buss_town: data.buss_town || '',
//         street_name: data.street_name || '',
//         landmark: data.landmark || '',
//         electroral_area: data.electroral_area || '',
//         property_class: data.property_class || '',
//         tot_grade: data.tot_grade || '',
//         ceo: data.ceo || '',
//         telno: data.telno || '',
//         strategiclocation: Number(data.strategiclocation) || 0,
//         productvariety: Number(data.productvariety) || 0,
//         businesspopularity: Number(data.businesspopularity) || 0,
//         businessenvironment: Number(data.businessenvironment) || 0,
//         sizeofbusiness: Number(data.sizeofbusiness) || 0,
//         numberofworkingdays: Number(data.numberofworkingdays) || 0,
//         businessoperatingperiod: Number(data.businessoperatingperiod) || 0,
//         competitorsavailable: Number(data.competitorsavailable) || 0,
//         assessmentby: data.assessmentby || '',
//         transdate: data.transdate || '',
//         balance: Number(data.balance) || 0,
//         status: data.status || '',
//         current_rate: Number(data.current_rate) || 0,
//         property_rate: Number(data.property_rate) || 0,
//         totalmarks: Number(data.totalmarks) || 0,
//         emailaddress: data.emailaddress || '',
//         noofemployees: Number(data.noofemployees) || 0,
//         noofbranches: Number(data.noofbranches) || 0,
//         BALANCENEW: Number(data.BALANCENEW) || 0,
//         gps_address: data.gps_address || '',
//         serialNo: Number(data.serialNo) || 0
//     };
// }
//  // Ensure the receipts directory exists
//  const __filename = fileURLToPath(import.meta.url);
//  const __dirname = dirname(__filename);
//  const permitDir = path.join(__dirname, 'permits');
//  const fsPromises = fs.promises;
//  async function ensurePermitDirIsEmpty() {
//     try {
//         // Check if the directory exists
//         await fsPromises.access(permitDir);
//         console.log('Permits directory already exists:', permitDir);
//         // Read all files and subdirectories in the directory
//         const files = await fsPromises.readdir(permitDir);
//         // Remove all files and subdirectories
//         for (const file of files) {
//             const filePath = path.join(permitDir, file);
//             const stat = await fsPromises.lstat(filePath);
//             if (stat.isDirectory()) {
//                 // Recursively remove subdirectories
//                 await fsPromises.rm(filePath, { recursive: true, force: true });
//             } else {
//                 // Remove files
//                 await fsPromises.unlink(filePath);
//             }
//         }
//         console.log('Permits directory emptied:', permitDir);
//     } catch (err: any) {
//         if (err.code === 'ENOENT') {
//             // Directory does not exist, create it
//             await fsPromises.mkdir(permitDir, { recursive: true });
//             console.log('Created permits directory:', permitDir);
//         } else {
//             console.error('Error accessing permits directory:', err);
//         }
//     }
// }
// // Implement a type guard to check if results is of type ResultSetHeader
// // function isResultSetHeader(obj: any): obj is mysql.ResultSetHeader {
// //     return obj !== undefined && obj !== null && 'insertId' in obj;
// // }
// // Seeding endpoint
// // router.post('/seed', async (req: Request, res: Response): Promise<void> => {
// //     console.log('Seeding the business table');
// //     const connection = await mysql.createConnection(dbConfig);
// //     console.log("typeof businessData: ", typeof businessData)
// //     try {
// //         await Promise.all(businessData.map(async (business) => {
// //             const query = `
// //                 INSERT INTO tb_business (
// //                     buss_no, buss_name, buss_address, buss_type, buss_town, street_name, landmark,
// //                     electroral_area, property_class, tot_grade, ceo, telno, strategiclocation,
// //                     productvariety, businesspopularity, businessenvironment, sizeofbusiness,
// //                     numberofworkingdays, businessoperatingperiod, competitorsavailable, assessmentby,
// //                     transdate, balance, status, current_rate, property_rate, totalmarks, emailaddress,
// //                     noofemployees, noofbranches, BALANCENEW, gps_address, serialNo
// //                 ) VALUES (
// //                     ?, ?, ?, ?, ?, ?, ?,
// //                     ?, ?, ?, ?, ?, ?,
// //                     ?, ?, ?, ?, ?,
// //                     ?, ?, ?, ?, ?,
// //                     ?, ?, ?, ?, ?, ?, ?,
// //                     ?, ?, ?
// //                 );
// //             `;
// //             const values = [
// //                 business.buss_no, business.buss_name, business.buss_address, business.buss_type, 
// //                 business.buss_town, business.street_name, business.landmark, business.electroral_area, 
// //                 business.property_class, business.tot_grade, business.ceo, business.telno, 
// //                 business.strategiclocation, business.productvariety, business.businesspopularity, business.businessenvironment, 
// //                 business.sizeofbusiness, business.numberofworkingdays, business.businessoperatingperiod, business.competitorsavailable, 
// //                 business.assessmentby, business.transdate, business.balance, business.status, 
// //                 business.current_rate, business.property_rate, business.totalmarks, business.emailaddress,
// //                 business.noofemployees, business.noofbranches, business.BALANCENEW, business.gps_address, business.serialNo
// //             ];
// //             // Execute the query and get the results
// //             const [resultHeader, rows] = await connection.execute(query, values);
// //             console.log("results: ", resultHeader);
// //             console.log("resultHeader: ", resultHeader);
// //             // Check if insertId is available and log it
// //             if (typeof resultHeader === 'object' && resultHeader !== null && resultHeader[0].insertId !== undefined) {
// //                 console.log(`Inserted business with buss_no: ${business.buss_no} and insertId: ${resultHeader[0].insertId}`);
// //             } else {
// //                 console.log(`Inserted business with buss_no: ${business.buss_no} but insertId is undefined`);
// //             }
// //         }));
// //         res.status(200).send('Business data seeded successfully');    } catch (err) {
// //         console.error('Error seeding business data:', err);
// //         res.status(500).send('Error seeding business data');
// //     } finally {
// //         // Close the connection after seeding
// //         connection.end();
// //     }
// // });
// // Create a new business record
// router.post('/create', async (req: Request, res: Response): Promise<void> => {
//     console.log('Creating a new business');
//     // Sanitize the input data
//     const sanitizedData = sanitizeBusinessData(req.body);
//     console.log(sanitizedData);
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Check if a business with the same buss_no already exists
//         let [rows] = await connection.execute(
//             'SELECT * FROM tb_business WHERE buss_no = ?', 
//             [sanitizedData.buss_no]
//         );
//         if (Array.isArray(rows) && rows.length > 0) {
//             res.status(409).json({ success: true, message: 'Business record already exists', BALANCENEW: 0});
//             return;
//         }
//         const isoDate = new Date();
//         const mysqlDate = isoDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
//         // Insert the new business data
//         const [result] = await connection.execute<ResultSetHeader>(
//             `INSERT INTO tb_business (
//                 buss_no, buss_name, buss_address, buss_type, BUSS_TOWN, 
//                 street_name, landmark, electroral_area, property_class,
//                 Tot_grade, ceo, telno, strategiclocation, productvariety, 
//                 businesspopularity, businessenvironment, sizeofbusiness,  numberofworkingdays, businessoperatingperiod,
//                 competitorsavailable, assessmentby, transdate, balance, status, 
//                 current_rate, property_rate, totalmarks,  emailaddress,             
//                 noofemployees, noofbranches, BALANCENEW, gps_address, serialNo) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 sanitizedData.buss_no,
//                 sanitizedData.buss_name,
//                 sanitizedData.buss_address,
//                 sanitizedData.buss_type,
//                 sanitizedData.buss_town,
//                 sanitizedData.street_name,
//                 sanitizedData.landmark,
//                 sanitizedData.electroral_area,
//                 sanitizedData.property_class,
//                 sanitizedData.tot_grade,
//                 sanitizedData.ceo,
//                 sanitizedData.telno,
//                 sanitizedData.strategiclocation,
//                 sanitizedData.productvariety,
//                 sanitizedData.businesspopularity,
//                 sanitizedData.businessenvironment,
//                 sanitizedData.sizeofbusiness,
//                 sanitizedData.numberofworkingdays,
//                 sanitizedData.businessoperatingperiod,
//                 sanitizedData.competitorsavailable,
//                 sanitizedData.assessmentby,
//                 mysqlDate,
//                 sanitizedData.balance,
//                 sanitizedData.status,
//                 sanitizedData.current_rate,
//                 sanitizedData.property_rate,
//                 sanitizedData.totalmarks,
//                 sanitizedData.emailaddress,            
//                 sanitizedData.noofemployees,
//                 sanitizedData.noofbranches,
//                 sanitizedData.BALANCENEW,
//                 sanitizedData.gps_address,
//                 sanitizedData.serialNo
//             ]
//         );
//          // call addRecord function to add new record to busscurrbalance table HERE
//           // Call addRecord function to add new record to tb_BussCurrBalance table
//           const addRecordSuccess = await addRecord(
//             sanitizedData.buss_no, 
//             new Date(), 
//             sanitizedData.balance, 
//             sanitizedData.current_rate, 
//             sanitizedData.property_rate, 
//             sanitizedData.electroral_area
//         );
//         if (!addRecordSuccess) {
//             throw new Error('Failed to add record to tb_BussCurrBalance');
//         }
//         res.status(200).json({ success: true, message: 'Business record updated successfully', BUSS_NO: sanitizedData.buss_no });
//     } catch (error: any) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Error updating business', error });
//     } finally {
//         connection.end();
//     }
// });
// // Function to add record to tb_BussCurrBalance
// async function addRecord(txtBussNo: (number | null), dtTransdate: Date, txtBalanceBF: number, txtCurrentRate: number, txtRate: number, cboElectoralArea: string): Promise<boolean> {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Get current year and previous fiscal year
//         const currentYear = new Date().getFullYear();
//         const varFiscalYear = dtTransdate.getFullYear();
//         const varPrevFiscalYear = varFiscalYear - 1;
//         // Find previous fiscal year balance
//         const findPreviousFiscalYearQuery = `
//             SET dateformat = 'dmy';
//             SELECT balancebf 
//             FROM tb_BussCurrBalance 
//             WHERE buss_no = ? AND fiscalyear = ?;
//         `;
//         const [prevResults] = await connection.execute(findPreviousFiscalYearQuery, [txtBussNo, varPrevFiscalYear]);
//         let varBalanceBF: number = 0;
//         if (prevResults.length > 0) {
//             varBalanceBF = (prevResults[0] as any).balancebf;
//         }
//         // Insert or update record in tb_BussCurrBalance
//         const insertNewRecordQuery = `
//             SET dateformat = 'dmy';
//             INSERT INTO tb_BussCurrBalance (buss_no, fiscalyear, balancebf, current_balance, totalAmountDue, transdate, electoralarea) 
//             VALUES (?, ?, ?, ?, ?, ?, ?) 
//             ON DUPLICATE KEY UPDATE balancebf = VALUES(balancebf), current_balance = VALUES(current_balance), totalAmountDue = VALUES(totalAmountDue), transdate = VALUES(transdate), electoralarea = VALUES(electoralarea);
//         `;
//         const insertValues = [
//             txtBussNo, varFiscalYear, varBalanceBF, txtCurrentRate, (varBalanceBF + txtCurrentRate), dtTransdate, cboElectoralArea
//         ];
//         await connection.execute(insertNewRecordQuery, insertValues);
//         await connection.end();
//         return true;
//     } catch (error) {
//         console.error('Error in adding a record:', error);
//         await connection.end();
//         return false;
//     }
// }
// // Read all businesses
// router.get('/all', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_business');
//         res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//         res.setHeader('Pragma', 'no-cache');
//         res.setHeader('Expires', '0');
//        // console.log('rows are here:::', rows);
//         res.status(200).json(rows);
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching businesses', error: error.message });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single business by buss_no
// router.get('/:buss_no', async (req: Request, res: Response) => {
//     const { buss_no } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_business WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(rows) && rows.length === 0) {
//             res.status(404).json(rows);
//         } else {
//             res.status(200).json(rows);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching business', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read all electoral_areas
// router.get('/electoralAreas', async (req: Request, res: Response) => {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT DISTINCT electroral_area FROM tb_business')
//         if (Array.isArray(rows) && rows.length === 0) {
//             res.status(404).json(rows);
//         } else {
//             res.status(200).json(rows);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching electoral_area', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single electoral_area
// router.get('/:electoral_area', async (req: Request, res: Response) => {
//     const { electoral_area } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_business WHERE electroral_area = ?', [electoral_area]);
//         if (Array.isArray(rows) && rows.length === 0) {
//             res.status(404).json(rows);
//         } else {
//             res.status(200).json(rows);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching electoral_area', error });
//     } finally {
//         connection.end();
//     }
// });
// // Read a single business by buss_no
// router.get('/:buss_name', async (req: Request, res: Response) => {
//     const { buss_no } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         const [rows] = await connection.execute('SELECT * FROM tb_business WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(rows) && rows.length === 0) {
//             res.status(200).json(rows);
//         } else {
//             res.status(200).json({ success: true, data: rows[0] });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching business', error });
//     } finally {
//         connection.end();
//     }
// });
// // Update a business record
// router.put('/update/:buss_no', async (req: Request, res: Response) => {
//     console.log('in router.put(/:buss_no')
//     const { buss_no } = req.params;
//     const businessData = req.body;
//     console.log('THIS IS THE businessData:', businessData);
//     // Sanitize the input data
//     const sanitizedData = sanitizeBusinessData(req.body);
//     console.log('sanitizedData:', sanitizedData);
//     const isoDate = new Date();
//     const mysqlDate = isoDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD 
//     console.log('before SELECT STATEMENT')
//     if (sanitizedData.buss_name === null || sanitizedData.buss_name === undefined){ console.log('buss_name is missing')};
//     if (sanitizedData.buss_address === null || sanitizedData.buss_address === undefined){console.log('buss_address is missing')} ;
//     if (sanitizedData.buss_type === null || sanitizedData.buss_type === undefined){console.log('buss_type is missing')} ;
//     if (sanitizedData.buss_town === null || sanitizedData.buss_town === undefined){console.log('buss_town is missing')} ;
//     if (sanitizedData.street_name === null || sanitizedData.street_name === undefined){console.log('street_name is missing')} ;
//     if (sanitizedData.landmark === null || sanitizedData.landmark === undefined){console.log('landmark is missing')} ;
//     if (sanitizedData.electroral_area === null || sanitizedData.electroral_area === undefined){console.log('electroral_area is missing')} ;
//     if (sanitizedData.property_class === null || sanitizedData.property_class === undefined){console.log('property_class is missing')} ;
//     if (sanitizedData.tot_grade === null || sanitizedData.tot_grade === undefined){ console.log('tot_grade is missing')};
//     if (sanitizedData.ceo === null || sanitizedData.ceo === undefined){console.log('ceo is missing')} ;
//     if (sanitizedData.telno === null || sanitizedData.telno === undefined){console.log('telno is missing')} ;
//     if (isNaN(sanitizedData.strategiclocation)){console.log('strategiclocation is not a valid number')} ;
//     if (isNaN(sanitizedData.productvariety)){console.log('productvariety is not a valid number')} ;
//     if (isNaN(sanitizedData.businesspopularity)){console.log('businesspopularity is not a valid number')} ;
//     if (isNaN(sanitizedData.businessenvironment)){console.log('businessenvironment is not a valid number');} 
//     if (isNaN(sanitizedData.sizeofbusiness)){console.log('sizeofbusiness is not a valid number')} ;
//     if (isNaN(sanitizedData.numberofworkingdays)){console.log('numberofworkingdays is not a valid number')} ;
//     if (isNaN(sanitizedData.businessoperatingperiod)){console.log('businessoperatingperiod is not a valid number') };
//     if (isNaN(sanitizedData.competitorsavailable)){console.log('competitorsavailable is not a valid number')} ;
//     if (sanitizedData.assessmentby === null || sanitizedData.assessmentby === undefined){console.log('assessmentby is missing')} ;
//     if (sanitizedData.transdate === null || sanitizedData.transdate === undefined){console.log('transdate is missing')} ;
//     if (isNaN(sanitizedData.balance)){} console.log('balance is not a valid number');
//     if (sanitizedData.status === null || sanitizedData.status === undefined){console.log('status is missing')} ;
//     if (isNaN(sanitizedData.current_rate)){console.log('current_rate is not a valid number')} ;
//     if (isNaN(sanitizedData.property_rate)){console.log('property_rate is not a valid number')} ;
//     if (isNaN(sanitizedData.totalmarks)){console.log('totalmarks is not a valid number')} ;
//     if (sanitizedData.emailaddress === null || sanitizedData.emailaddress === undefined){console.log('emailaddress is missing')} ;
//     if (isNaN(sanitizedData.noofemployees)){console.log('noofemployees is not a valid number')} ;
//     if (isNaN(sanitizedData.noofbranches)){console.log('noofbranches is not a valid number')} ;
//     if (isNaN(sanitizedData.BALANCENEW)){console.log('BALANCENEW is not a valid number')} ;
//     if (sanitizedData.gps_address === null || sanitizedData.gps_address === undefined){console.log('gps_address is missing')} ;
//     if (sanitizedData.serialNo === null || sanitizedData.serialNo === undefined){console.log('serialNo is missing')} ;
//     // Corrected field names to match sanitizedData
//     if (
//         sanitizedData.buss_name === null || sanitizedData.buss_name === undefined ||
//         sanitizedData.buss_address === null || sanitizedData.buss_address === undefined ||
//         sanitizedData.buss_type === null || sanitizedData.buss_type === undefined ||
//         sanitizedData.buss_town === null || sanitizedData.buss_town === undefined ||
//         sanitizedData.street_name === null || sanitizedData.street_name === undefined ||
//         sanitizedData.landmark === null || sanitizedData.landmark === undefined ||
//         sanitizedData.electroral_area === null || sanitizedData.electroral_area === undefined ||
//         sanitizedData.property_class === null || sanitizedData.property_class === undefined ||
//         sanitizedData.tot_grade === null || sanitizedData.tot_grade === undefined ||
//         sanitizedData.ceo === null || sanitizedData.ceo === undefined ||
//         sanitizedData.telno === null || sanitizedData.telno === undefined ||
//         isNaN(sanitizedData.strategiclocation) ||
//         isNaN(sanitizedData.productvariety) ||
//         isNaN(sanitizedData.businesspopularity) ||
//         isNaN(sanitizedData.businessenvironment) ||
//         isNaN(sanitizedData.sizeofbusiness) ||
//         isNaN(sanitizedData.numberofworkingdays) ||
//         isNaN(sanitizedData.businessoperatingperiod) ||
//         isNaN(sanitizedData.competitorsavailable) ||
//         sanitizedData.assessmentby === null || sanitizedData.assessmentby === undefined ||
//         sanitizedData.transdate === null || sanitizedData.transdate === undefined ||
//         isNaN(sanitizedData.balance) ||
//         sanitizedData.status === null || sanitizedData.status === undefined ||
//         isNaN(sanitizedData.current_rate) ||
//         isNaN(sanitizedData.property_rate) ||
//         isNaN(sanitizedData.totalmarks) ||
//         sanitizedData.emailaddress === null || sanitizedData.emailaddress === undefined ||
//         isNaN(sanitizedData.noofemployees) ||
//         isNaN(sanitizedData.noofbranches) ||
//         isNaN(sanitizedData.BALANCENEW) ||
//         sanitizedData.gps_address === null || sanitizedData.gps_address === undefined ||
//         sanitizedData.serialNo === null || sanitizedData.serialNo === undefined
//     ) {
//         console.log('Invalid or missing input data');
//         res.status(400).json({ success: false, message: 'Invalid or missing input data' });
//         return;
//     }
//     console.log('Updating business with data:', sanitizedData);
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Check if a business with the same buss_no already exists
//         const [rows] = await connection.execute('SELECT * FROM tb_business WHERE buss_no = ?', [buss_no]);
//         if (Array.isArray(rows) && rows.length === 0) {
//             res.status(404).json({  success: false, message: 'Business record not found' });
//         } 
//         const [updateResult] = await connection.execute(
//             `UPDATE tb_business SET buss_name = ?, buss_address = ?, buss_type = ?, BUSS_TOWN = ?, 
//                 street_name = ?, landmark = ?, electroral_area = ?, property_class = ?, Tot_grade = ?, ceo = ?, 
//                 telno = ?, strategiclocation = ?, productvariety = ?, businesspopularity = ?, businessenvironment = ?, 
//                 sizeofbusiness = ?, numberofworkingdays = ?, businessoperatingperiod = ?, competitorsavailable = ?, 
//                 assessmentby = ?, transdate = ?, balance = ?, status = ?, current_rate = ?, 
//                 property_rate = ?, totalmarks = ?, emailaddress = ?,                
//                 noofemployees = ?, noofbranches = ?, BALANCENEW = ?, gps_address = ?, serialNo = ? WHERE buss_no = ?`,              
//             [
//                 sanitizedData.buss_name,
//                 sanitizedData.buss_address,
//                 sanitizedData.buss_type,
//                 sanitizedData.buss_town,
//                 sanitizedData.street_name,
//                 sanitizedData.landmark,
//                 sanitizedData.electroral_area,
//                 sanitizedData.property_class,
//                Number(sanitizedData.tot_grade),
//                 sanitizedData.ceo,
//                 sanitizedData.telno,
//                 sanitizedData.strategiclocation,
//                 sanitizedData.productvariety,
//                 sanitizedData.businesspopularity,
//                 sanitizedData.businessenvironment,
//                 sanitizedData.sizeofbusiness,
//                 sanitizedData.numberofworkingdays,
//                 sanitizedData.businessoperatingperiod,
//                 sanitizedData.competitorsavailable,
//                 sanitizedData.assessmentby,
//                 mysqlDate,
//                 sanitizedData.balance,
//                 sanitizedData.status,
//                 sanitizedData.current_rate,
//                 sanitizedData.property_rate,
//                 sanitizedData.totalmarks,
//                 sanitizedData.emailaddress,                  
//                 sanitizedData.noofemployees,
//                 sanitizedData.noofbranches,              
//                 sanitizedData.BALANCENEW,
//                 sanitizedData.gps_address,
//                 sanitizedData.serialNo,
//                 buss_no
//             ]
//         );
//         console.log('updateResult:::', updateResult);
//         if ((updateResult as any).affectedRows > 0) {
//             res.status(200).json({ success: true, message: 'Business updated successfully' });
//             return;
//         } else {
//             res.status(400).json({ success: false, message: 'Failed to update business' });
//             return;
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating business', error });
//     } finally {
//         connection.end();
//     }
// });
// // Delete a business record
// router.delete('/delete/:buss_no', async (req: Request, res: Response) => {
//     const { buss_no } = req.params;
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//          // Check if a business with the same buss_no already exists
//          let [rows] = await connection.execute(
//             'SELECT * FROM tb_business WHERE buss_no = ?', 
//             [buss_no]
//         );
//         if (Array.isArray(rows) && rows.length == 0) {
//             res.status(409).json({ message: 'Business record does not exist' });
//             return;
//         }
//         const [result] = await connection.execute('DELETE FROM tb_business WHERE buss_no = ?', [buss_no]);
//         res.status(201).json({ message: 'Business deleted successfully' });
//         return;
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting business', error });
//         return
//     } finally {
//         connection.end();
//     }
// });
// // Process business operating permits for a fiscal year
// router.post('/processOperatingPermits/:electoral_area/:fiscal_year', async (req: Request, res: Response) => {
//      console.log('in router.post(/processOperatingPermits/:electoral_area/:fiscal_year', req.params)
//      try {
//       // Ensure the permits directory is empty
//      await ensurePermitDirIsEmpty();
//      const {electoral_area, fiscal_year} = req.params;
//      console.log('electoralarea:', electoral_area, 'fiscalyear:', fiscal_year)
//      const connection = await mysql.createConnection(dbConfig);
//      let [businessRows] = await connection.execute(
//         'SELECT * FROM tb_business WHERE electroral_area = ?', 
//         [electoral_area]
//      );
//      if (Array.isArray(businessRows) && businessRows.length == 0) {
//         res.status(404).json({ message: 'No businesses found for the electoral area' });
//         return;
//      }
//    // console.log('businessRows:::', businessRows)
//      // Update balancebf in tb_bussCurrBalance table for all businesses in the electoral area for the given fiscal year
//      for (let i = 0; i < businessRows.length; i++) {
//         const {buss_no} = businessRows[i]
//         let varCurrentRate = 0
//         let varBalance =  await findBusinessBalance(buss_no)
//         console.log( 'about to update tb_BussCurrBalance table')
//         // Update tb_bussCurrBalance table with current balance and fiscal year
//         await connection.execute(
//             'UPDATE tb_BussCurrBalance  SET balancebf = ?  WHERE buss_no = ?  AND fiscalyear = ?',
//             [varBalance, buss_no, fiscal_year]
//         );
//         console.log( 'after updating tb_BussCurrBalance table')
//      } 
//      for (let i = 0; i < businessRows.length; i++) {
//         // console.log('businessRows[i].buss_no: ', businessRows[i].buss_no, 'fiscal_year: ', fiscal_year)
//          if (!businessRows[i].buss_no){
//              console.log('buss_no is missing')
//              continue
//          }
//          console.log('about to SELECT * FROM tb_BussCurrBalance WHERE buss_no')
//          console.log('=======================================================')
//          console.log('businessRows[i].buss_no: ', businessRows[i].buss_no, 'fiscal_year: ', fiscal_year)
//          let [busiUpdateRow] = await connection.execute('SELECT * FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear = ?', 
//          [businessRows[i].buss_no, fiscal_year]);
//          if (Array.isArray(busiUpdateRow) && busiUpdateRow.length == 0) {
//             res.status(404).json({ message: 'No current balance found for the business' });
//             return;
//          }
//          console.log('after SELECT * FROM tb_BussCurrBalance WHERE buss_no')
//          if (busiUpdateRow.length > 0) {
//             for (let j = 0; j < busiUpdateRow.length; j++) {
//                  console.log('in for loop:  for (let j = 0;')
//                 // console.log('=============================')
//                 // console.log('busiUpdateRow[j].buss_no: ', busiUpdateRow[j].buss_no, 'busiUpdateRow[j].current_rate: ', busiUpdateRow[j].current_rate)
//                 // await connection.execute(
//                 //     'UPDATE tb_business SET current_rate = ? WHERE buss_no = ?',
//                 //     [busiUpdateRow[j].current_rate, busiUpdateRow[j].buss_no]
//                 // );
//                 // console.log('after UPDATE tb_business SET current_rate = ? WHERE buss_no = ?')
//                 let varBalBf = await findBusinessBalance(busiUpdateRow[j].buss_no)
//                 //let varYear = new Date().getFullYear()
//                 await connection.execute(
//                     'UPDATE tb_business SET BALANCENEW = ? WHERE buss_no = ?',
//                     [varBalBf, busiUpdateRow[j].buss_no]
//                 );
//                 console.log('after UPDATE tb_business SET BALANCENEW = ? WHERE buss_no = ?')
//             }
//          } else {
//             console.log('No current balance found for the business')
//          }
//      } 
//  console.log('after updating tb_business ')
//      // Delete from tmp_business
//      await connection.execute('DELETE FROM tmp_business');
//      // Delete from tmpbusscurrbalance
//      await connection.execute('DELETE FROM tmpbusscurrbalance');
//      if (electoral_area){
//         const [electoralAreaResult] = await connection.execute(
//             'SELECT * FROM tb_electoralarea WHERE electoral_area = ?',
//             [electoral_area]
//         );
//      } else {
//         const [electoralAreaResult] = await connection.execute(
//             'SELECT * FROM tb_electoral_area'
//         );
//      }
//      console.log('about to insert into tmp_business')
//      // Insert into tmp_business
//      await connection.execute(
//         `INSERT INTO tmp_business 
//         SELECT * FROM tb_business 
//         WHERE electroral_area = ? 
//         AND current_rate > 0 
//         AND status = "Active" 
//         ORDER BY buss_name ASC`, 
//         [electoral_area]
//     );
//     console.log('after insert into tmp_business')
//     const [recReport] = await connection.execute(`SELECT DISTINCT * FROM tb_BussCurrBalance WHERE fiscalyear = ? AND electoralarea = ?`,
//        [fiscal_year, electoral_area]
//     )
//     if (recReport.length == 0){
//         res.status(404).json({ message: 'No paid bills found for the electoral area' });
//         return
//     }
//     const [tmpBussCurrBalanceRows] = await connection.execute(
//         `INSERT INTO tmp_BussCurrBalance SELECT * FROM tb_BussCurrBalance WHERE fiscalyear = ? AND electoralarea = ?`,
//         [fiscal_year, electoral_area]
//     )
//     console.log('after INSERT INTO tmp_BussCurrBalance SELECT * FROM tb_BussCurrBalance')
//     // Add serial numbers
//     let [recBusiness] = await connection.execute(
//         `SELECT * FROM tmp_business ORDER BY buss_no`
//     )
//     let varSerialNo = ''
//     let permitNo = 1
//     for (let i = 0; i < recBusiness.length; i++) {
//         varSerialNo = permitNo.toString().padStart(10, '0');
//         await connection.execute(
//             `UPDATE tmp_business SET serialNo = ? WHERE buss_no = ?`,
//             [varSerialNo, recBusiness[i].buss_no]
//         )
//         permitNo++;
//     }
//     console.log('after serial number generation')
//     // Check if there are any bills in tmp_business
//     let [recBills] = await connection.execute(`SELECT * FROM tmp_business ORDER BY buss_name ASC`);
//     if (recBills.length === 0) {
//         res.status(404).json({ message: 'No bills found for the electoral area' });
//         return;
//     }
//     console.log('ABOUT TO GENERATE PDFs')
//     // Produce Bills now
//     for (const bill of recBills) {
//         console.log('Generating PDF for bill:', bill.buss_no);
//         try {
//             const pdfBuffer = await generatePdf(bill);
//             // Save the PDF to a file or handle it as needed
//             fs.writeFileSync(path.join(__dirname, 'permits', `permit_${bill.buss_no}.pdf`), pdfBuffer);
//         } catch (error: any) {
//             console.error('Error generating PDF for bill:', bill, error);
//             res.status(500).json({ message: `Error generating PDF for bill ${bill.buss_no}: ${error.message}` });
//             return;
//         }
//     }
//     res.status(200).json({ message: 'Bills generated successfully' });
//     } catch (error: any) {
//         console.error('Error executing SQL query:', error);
//     }
// }) ;
// // Function to find business balance
// async function findBusinessBalance(bussNo: number): Promise<number> {
//     const connection = await mysql.createConnection(dbConfig);
//     try {
//         // Get current year and previous fiscal year
//         const currentYear = new Date().getFullYear()
//         // Find all payments
//         const [prevPaymentsResult] = await connection.execute(
//             'SELECT SUM(paidAmount) AS totsum FROM tb_buspayments WHERE buss_no = ? AND fiscal_year < ?',
//             [bussNo, currentYear]
//         );
//         const prevPayments = prevPaymentsResult[0]?.totsum ?? 0;
//         // Find all billings
//         const [prevBalancesResult] = await connection.execute(
//             'SELECT SUM(current_balance) AS totPrevBal FROM tb_BussCurrBalance WHERE buss_no = ? AND fiscalyear < ?',
//             [bussNo, currentYear]
//         );
//         const prevBalances = prevBalancesResult[0]?.totPrevBal ?? 0;
//         // Calculate balance
//         return prevBalances - prevPayments;
//     } catch (error) {
//         console.error(error);
//         throw new Error('Error fetching business balance');
//     } finally {
//         connection.end();
//     }
// }
// // Function to find total payable based on business number
// export async function findTotalPayable(txtBussNo: Number): Promise<number> {
//     try {
//         const connection = await mysql.createConnection(dbConfig);
//         // Prepare the SQL query
//         const query = `
//             SELECT SUM(current_balance) AS totsum
//             FROM tb_bussCurrBalance
//             WHERE buss_no = ?;
//         `;
//         // Execute the query with the business number
//         const [rows] = await connection.execute(query, [txtBussNo]);
//         // Close the connection
//         await connection.end();
//         // Extract the total sum from the result
//         return (rows as any[])[0]?.totsum ?? 0;
//     } catch (error) {
//         console.error('Error finding total payable:', error);
//         throw error; // Re-throw the error after logging it
//     }
// }
// // Function to find the current rate
// export async function findCurrentRate(txtBussNo: number): Promise<number> {
//     try {
//         // Connect to the database
//         const connection = await mysql.createConnection(dbConfig);
//         // await new Promise((resolve, reject) => {
//         //     connection.connect((err) => {
//         //         if (err) reject(err);
//         //         else resolve(true);
//         //     });
//         // });
//         // Get the current year
//         const currentYear = new Date().getFullYear();
//         // Query to find the current rate
//         const query = `
//             SELECT current_balance 
//             FROM tb_bussCurrBalance 
//             WHERE buss_no = ? 
//               AND fiscalyear = ?
//         `;
//         // Execute the query
//         const [results] = await connection.execute(query, [txtBussNo, currentYear]);
//         // Check if results are returned and not null
//         let varPrevBalances = 0;
//         if (results.length > 0 && results[0].current_balance !== null) {
//             varPrevBalances = results[0].current_balance;
//         }
//         // End the connection
//         // await new Promise((resolve, reject) => {
//         //     connection.end((err) => {
//         //         if (err) reject(err);
//         //         else resolve(true);
//         //     });
//         // });
//         return varPrevBalances;
//     } catch (error) {
//         console.error('Error:', error);
//         return 0;
//     } 
// }
// export default router;
//# sourceMappingURL=businessRoutes.js.map