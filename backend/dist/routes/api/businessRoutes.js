import express from 'express';
import * as dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
// import { generatePdf } from '../../generatePdf.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import PDFDocument from 'pdfkit';
import { printPdf } from '../../utils/printHelper.js';
const router = express.Router();
// experiment ///
// Load the environment variables from the .env file
dotenv.config();
// Determine the environment (development or production)
const env = process.env.NODE_ENV || 'development'; // Defaults to 'development'
console.log('[BACKEND] Initial NODE_ENV:', process.env.NODE_ENV); // Debugging log
// Construct the path to the appropriate .env file from the root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const permitDir = path.join(__dirname, 'permits');
//const rootDir = path.resolve(__dirname, '..');
const envPath = path.resolve(__dirname, `../.env.${env}`);
console.log('[BACKEND] envPath:', envPath); // Debugging log
// Check if the .env file exists
if (!fs.existsSync(envPath)) {
    console.error(`[BACKEND] .env file not found at ${envPath}. Please ensure the file exists.`);
    process.exit(1); // Exit the process if the file is not found
}
// Load the environment variables from the .env file
dotenv.config({ path: envPath });
console.log('[BACKEND] environment:', env);
console.log('[BACKEND] NODE_ENV after dotenv.config:', process.env.NODE_ENV); // Debugging log
// Connection using database url
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}
import { parse } from 'pg-connection-string';
const parsedConfig = parse(connectionString);
const configDB = {
    ...parsedConfig,
    ssl: {
        rejectUnauthorized: false
    }
};
// Create the pool
const pool = new Pool(configDB);
function generateReceiptContent(doc, data, totalPayable, varSerialNo) {
    console.log('in generateReceiptContent');
    // Format today's date as DD/MM/YYYY
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    doc.fontSize(20).text('Business Operating Permit', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Serial No: ${varSerialNo}`);
    doc.moveDown(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.text(`Transaction Date: ${formattedDate}`);
    doc.text(`Account No: ${data.buss_no}`);
    doc.text(`Business Name: ${data.buss_name}`);
    doc.text(`Type: ${data.buss_type}`);
    doc.text(`Property Class: ${data.property_class}`);
    doc.text(`Landmark: ${data.landmark}`);
    doc.text(`Electoral Area: ${data.electroral_area}`);
    doc.text(`Total Grade: ${data.tot_grade}`);
    doc.text(`Current Rate: ${data.current_rate}`);
    doc.text(`Property Rate: ${data.property_rate}`);
    doc.text(`Total Payable GHC: ${totalPayable.toFixed(2)}`);
}
export async function generatePdf(data) {
    console.log('in generatePdf');
    const currentRate = parseFloat(data.current_rate);
    const propertyRate = parseFloat(data.property_rate);
    const totalPayable = currentRate + propertyRate;
    const baseSerialNo = data.serialno !== undefined ? parseInt(data.serialno, 10) : 0;
    const varSerialNo = baseSerialNo.toString().padStart(10, '0');
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
        generateReceiptContent(doc, data, totalPayable, varSerialNo);
        doc.end();
    });
}
export async function generatePdfToPrinter(data) {
    console.log('in generatePdfToPrinter');
    const currentRate = parseFloat(data.current_rate);
    const propertyRate = parseFloat(data.property_rate);
    const totalPayable = currentRate + propertyRate;
    const baseSerialNo = data.serialno !== undefined ? parseInt(data.serialno, 10) : 0;
    const varSerialNo = baseSerialNo.toString().padStart(10, '0');
    const outputDir = path.join(__dirname, 'receipts');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const pdfPath = path.join(outputDir, `receipt-${varSerialNo}.pdf`);
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const stream = fs.createWriteStream(pdfPath);
        stream.on('finish', async () => {
            console.log(`PDF generated successfully at ${pdfPath}`);
            await printPdf(pdfPath);
            resolve();
        });
        stream.on('error', reject);
        doc.pipe(stream);
        generateReceiptContent(doc, data, totalPayable, varSerialNo);
        doc.end();
    });
}
// Function to sanitize input data
function sanitizeBusinessData(data) {
    return {
        buss_no: Number(data.buss_no) || null,
        buss_name: data.buss_name || '',
        buss_address: data.buss_address || '',
        buss_type: data.buss_type || '',
        buss_town: data.buss_town || '',
        bussPermitNo: data.bussPermitNo || '',
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
        property_type: data.property_type || '',
    };
}
const fsPromises = fs.promises;
// Function to add record to busscurrbalance 
async function addRecord(txtBussNo, dtTransdate, txtBalanceBF, txtCurrentRate, txtRate, cboElectoralArea, cboAssessmentBy) {
    const client = await pool.connect();
    console.log(txtBalanceBF);
    console.log(txtCurrentRate);
    try {
        // const deleteQuery = `
        //     DELETE  
        //     FROM busscurrbalance 
        //     WHERE buss_no = $1;
        // `;
        // await client.query(deleteQuery, [txtBussNo]);
        // Find previous fiscal year balance
        const varFiscalYear = dtTransdate.getFullYear();
        const varPrevFiscalYear = varFiscalYear - 1;
        const findPreviousFiscalYearQuery = `
            SELECT balancebf 
            FROM busscurrbalance 
            WHERE buss_no = $1 AND fiscalyear = $2;
        `;
        await client.query(findPreviousFiscalYearQuery, [txtBussNo, varPrevFiscalYear]);
        // let varBalanceBF: number = 0;
        // if (prevResults.rows.length > 0) {
        //     varBalanceBF = prevResults.rows[0].balancebf;
        // }
        // Insert or update record in busscurrbalance
        const insertNewRecordQuery = `
            INSERT INTO busscurrbalance (buss_no, fiscalyear, balancebf, current_balance, totalamountdue, transdate, electoralarea, assessmentby) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            ON CONFLICT (buss_no) DO UPDATE 
            SET balancebf = EXCLUDED.balancebf, 
                current_balance = EXCLUDED.current_balance, 
                totalamountdue = EXCLUDED.totalamountdue, 
                transdate = EXCLUDED.transdate, 
                electoralarea = EXCLUDED.electoralarea, 
                assessmentby = EXCLUDED.assessmentby;
        `;
        const today = new Date();
        const insertValues = [
            txtBussNo, varFiscalYear, 0, 0, 0, today, cboElectoralArea, cboAssessmentBy
        ];
        await client.query(insertNewRecordQuery, insertValues);
        return true;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return false;
        }
        else {
            console.error('Unknown error:', error);
            return false;
        }
    }
    finally {
        client.release();
    }
}
// Read all businesses
router.get('/all', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM business ORDER BY buss_no ASC');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
    finally {
        client.release();
    }
});
// Read last business
router.get('/last', async (req, res) => {
    console.log('in router.get(/last');
    const client = await pool.connect();
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
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
    finally {
        client.release();
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
    const client = await pool.connect();
    try {
        // Debugging: Log the query being executed
        console.log('Executing query for buss_no:', buss_no);
        const newBuss_no = parseInt(buss_no);
        const result = await client.query('SELECT * FROM business WHERE buss_no = $1', [newBuss_no]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Business record not found', data: [] });
            return;
        }
        console.log('Fetched Business details: ', result.rows[0]);
        res.status(200).json({ message: 'Business record found', data: result.rows[0] });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Database query error:', error);
            res.status(500).json({ message: 'Error fetching business', data: error.message });
            return;
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
    finally {
        client.release(); // Ensure the client is released
    }
});
// Read all electoral_areas
router.get('/electoralAreas', async (req, res) => {
    const client = await pool.connect();
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
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
    finally {
        client.release();
    }
});
// Read a single electoral_area
router.get('/electoral/:electoral_area', async (req, res) => {
    const { electoral_area } = req.params;
    const client = await pool.connect();
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
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
    finally {
        client.release();
    }
});
// Read a single business by buss_name
router.get('/name/:buss_name', async (req, res) => {
    const { buss_name } = req.params;
    const client = await pool.connect();
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
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
    finally {
        client.release();
    }
});
// Create a new business record
router.post('/create', async (req, res) => {
    console.log('Creating a new business');
    // Sanitize the input data
    const sanitizedData = sanitizeBusinessData(req.body);
    // console.log(sanitizedData);
    const client = await pool.connect();
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
            serialNo, buss_location, property_type) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36);
    `;
        const insertValues = [
            sanitizedData.buss_no, sanitizedData.buss_name, sanitizedData.buss_address,
            sanitizedData.buss_type, sanitizedData.buss_town, sanitizedData.bussPermitNo,
            sanitizedData.street_name, sanitizedData.landmark, sanitizedData.electroral_area,
            sanitizedData.property_class, sanitizedData.tot_grade, sanitizedData.ceo,
            sanitizedData.telno, sanitizedData.strategiclocation, sanitizedData.productvariety,
            sanitizedData.businesspopularity, sanitizedData.businessenvironment, sanitizedData.sizeofbusiness,
            sanitizedData.numberofworkingdays, sanitizedData.businessoperatingperiod, sanitizedData.competitorsavailable,
            sanitizedData.assessmentby, mysqlDate, sanitizedData.balance,
            sanitizedData.status, sanitizedData.current_rate, sanitizedData.property_rate,
            sanitizedData.totalmarks, sanitizedData.emailaddress, sanitizedData.noofemployees,
            sanitizedData.noofbranches, sanitizedData.BALANCENEW, sanitizedData.gps_address,
            sanitizedData.serialNo, sanitizedData.buss_location, sanitizedData.property_type,
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
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
    finally {
        client.release();
    }
});
// Update a business record
router.put('/:buss_no', async (req, res) => {
    console.log('in router.put(/:buss_no)', req.body);
    if (!req.body.bussPermitNo) {
        console.log('no permit number');
        return;
    }
    const client = await pool.connect();
    try {
        const { buss_no } = req.params;
        //console.log('THIS IS THE businessData:', businessData);
        // Sanitize the input data
        const sanitizedData = sanitizeBusinessData(req.body);
        //console.log('sanitizedData:', sanitizedData);
        if (sanitizedData.buss_name === null || sanitizedData.buss_name === undefined ||
            sanitizedData.buss_address === null || sanitizedData.buss_address === undefined ||
            sanitizedData.buss_type === null || sanitizedData.buss_type === undefined ||
            sanitizedData.buss_town === null || sanitizedData.buss_town === undefined ||
            sanitizedData.bussPermitNo === null || sanitizedData.bussPermitNo === undefined ||
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
            sanitizedData.buss_location === null || sanitizedData.buss_location === undefined ||
            sanitizedData.property_type === null || sanitizedData.property_type === undefined) {
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
                buss_location = $34,
                property_type = $35
            WHERE buss_no = $36;
        `;
        const updateValues = [
            sanitizedData.buss_name,
            sanitizedData.buss_address,
            sanitizedData.buss_type,
            sanitizedData.buss_town,
            sanitizedData.bussPermitNo,
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
            sanitizedData.property_type,
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
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
    finally {
        client.release();
    }
});
// Delete a business record
router.delete('/delete/:buss_no', async (req, res) => {
    const { buss_no } = req.params;
    const client = await pool.connect();
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
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
    finally {
        client.release();
    }
});
// Process business operating permits for a fiscal year
router.post('/processOperatingPermits/:electoral_area/:fiscal_year', async (req, res) => {
    console.log('in router.post(/processOperatingPermits/:electoral_area/:fiscal_year)', req.params);
    const client = await pool.connect();
    try {
        // Ensure the permits directory is empty
        console.log('about to make permit directory');
        await ensurePermitDirIsEmpty();
        console.log('after ensurePermitDirIsEmpty()');
        const { electoral_area, fiscal_year } = req.params;
        console.log('electoral_area:', electoral_area, 'fiscal_year:', fiscal_year);
        // Select all businesses
        // const businessesResult: QueryResult = await client.query('SELECT * FROM business');
        console.log('ABOUT TO BILL ALL BUSINESSES');
        // Select all businesses in the electoral area
        const businessRows = await client.query('SELECT * FROM business WHERE electroral_area ILIKE $1', [electoral_area]);
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
            //const varCurrentRate = 0;
            const varBalance = await findBusinessBalance(buss_no);
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
        await client.query(`
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
        // Delete from tmpbusiness where buss_no not in tmpbusscurrbalance
        //await client.query('DELETE FROM tmpbusiness WHERE buss_no NOT IN (SELECT buss_no FROM tmpbusscurrbalance)');
        // Add serial numbers
        const recBusiness = await client.query('SELECT * FROM tmpbusiness ORDER BY buss_no');
        if (recBusiness.rows.length === 0) {
            console.log('No businesses found for the electoral area');
            console.log('electoral_area:', electoral_area);
            res.status(404).json({ message: 'No businesses found for the electoral area' });
            return;
        }
        console.log('after SELECT * FROM tmpbusiness ORDER BY buss_no');
        console.log('recBusiness.rows.length:', recBusiness.rows.length);
        console.log('recBusiness.rows:', recBusiness.rows);
        console.log('about to add serial numbers');
        let permitNo = 1;
        for (let i = 0; i < recBusiness.rows.length; i++) {
            const varSerialNo = permitNo.toString().padStart(10, '0');
            console.log(`Updating buss_no: ${recBusiness.rows[i].buss_no}, Serial No: ${varSerialNo}`);
            await client.query('UPDATE tmpbusiness SET serialno = $1 WHERE buss_no = $2', [varSerialNo, recBusiness.rows[i].buss_no]);
            permitNo++;
        }
        console.log('after serial number generation');
        // Check if there are any bills in tmp_business
        const recBills = await client.query('SELECT * FROM tmpbusiness ORDER BY buss_no ASC');
        if (recBills.rows.length === 0) {
            res.status(404).json({ message: 'No bills found for the electoral area' });
            return;
        }
        console.log('ABOUT TO GENERATE PDFs');
        // Create permits directory - delete if exists and recreate
        const permitsDir = path.join(__dirname, "permits");
        if (fs.existsSync(permitsDir)) {
            fs.rmSync(permitsDir, { recursive: true, force: true });
            console.log('Existing permits directory deleted');
        }
        fs.mkdirSync(permitsDir, { recursive: true });
        console.log('Permits directory created');
        // Produce Bills now
        for (const bill of recBills.rows) {
            console.log('Generating PDF for bill:', bill.buss_no);
            try {
                const pdfBuffer = await generatePdfPermit(bill);
                // Save the PDF to a file or handle it as needed
                // fs.writeFileSync(path.join(__dirname, 'permits', `permit_${bill.buss_no}.pdf`), pdfBuffer);
                const filePath = path.join(permitsDir, `permit_${bill.buss_no}.pdf`);
                fs.writeFileSync(filePath, pdfBuffer);
                console.log(`PDF saved for business ${bill.buss_no}`);
                // To printer
                //await generatePdfToPrinter(bill);
                // Send to printer
                await generatePdfToPrinterPermit(bill);
                console.log('Client Bill generated successfully');
                // res.status(200).json({ success: true, message: 'One business billed successfully' });
                // return;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error generating PDF for bill:', bill, error);
                    // res.status(500).json({ message: `Error generating PDF for bill ${bill.buss_no}: ${error.message}` });
                    // return;
                }
                else {
                    console.log(`Error unknown for bill ${bill.buss_no}`);
                    // res.status(500).json({ message: `Error unknown for bill ${bill.buss_no}` });
                    // return;
                }
            }
        }
        res.status(200).json({ message: 'Bills generated successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
    finally {
        client.release();
    }
});
// a function to find out if a business exists in the busscurrbalance table or not. it is just a function and not an endpoint. 
export async function checkIfBusinessExists(buss_no) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM busscurrbalance WHERE buss_no = $1', [buss_no]);
        if (result.rows.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            throw new Error('Error checking if business exists');
        }
        else {
            console.error('Unknown error:', error);
            throw new Error('Unknown error');
        }
    }
    finally {
        client.release();
    }
}
export async function generatePdfPermit(data) {
    console.log('in generatePdfPermit');
    const currentRate = parseFloat(data.current_rate);
    const propertyRate = parseFloat(data.property_rate);
    const totalPayable = currentRate + propertyRate;
    // Calculate arrears before creating the PDF
    const arrears = await findPreviousBalance(parseInt(data.buss_no));
    const baseSerialNo = data.serialno !== undefined ? parseInt(data.serialno, 10) : 0;
    const varSerialNo = baseSerialNo.toString().padStart(10, '0');
    console.log('about to  return new Promise<Buffer>((resolve, reject) => {');
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
        generatePermitContent(doc, data, totalPayable, varSerialNo, arrears);
        doc.end();
        console.log('after generatePermitContent(doc, data, totalPayable, varSerialNo);');
    });
}
export async function generatePdfToPrinterPermit(data) {
    console.log('in generatePdfToPrinterPermits');
    try {
        const currentRate = parseFloat(data.current_rate);
        const propertyRate = parseFloat(data.property_rate);
        const totalPayable = currentRate + propertyRate;
        // Calculate arrears before creating the PDF
        const arrears = await findPreviousBalance(parseInt(data.buss_no));
        console.log('arrears:', arrears);
        const baseSerialNo = data.serialno !== undefined ? parseInt(data.serialno, 10) : 0;
        const varSerialNo = baseSerialNo.toString().padStart(10, '0');
        console.log('about to create our directory path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const permitsDir = path.join(__dirname, 'permits');
        console.log('permitsDir: ', permitsDir);
        console.log('__dirname: ', __dirname);
        console.log('path.join(__dirname, "permits"): ', path.join(__dirname, 'permits'));
        console.log('path.join(__dirname, "permits", `permits-${varSerialNo}.pdf`): ', path.join(__dirname, 'permits', `permits-${varSerialNo}.pdf`));
        console.log('about to create our directory path');
        const outputDir = path.join(__dirname, 'permits');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const pdfPath = path.join(permitsDir, `permits-${varSerialNo}.pdf`);
        console.log('pdfPath: ', pdfPath);
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 40 });
            const stream = fs.createWriteStream(pdfPath);
            stream.on('finish', async () => {
                console.log(`PDF generated successfully at ${pdfPath}`);
                await printPdf(pdfPath);
                resolve();
            });
            stream.on('error', reject);
            doc.pipe(stream);
            generatePermitContent(doc, data, totalPayable, varSerialNo, arrears);
            doc.end();
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Error occurred: ', error);
        }
        else {
            console.log('Unknown error');
        }
    }
}
async function generatePermitContent(doc, data, totalPayable, varSerialNo, arrears) {
    console.log('in generatePermitContent: XXXXXXXXXXXXXXXXXXXXXXXXXX', data.buss_no);
    // Fix the type issue by converting current_rate to number before adding
    const varTotalPayable = parseFloat(data.current_rate) + arrears;
    // Format the date as DD/MM/YYYY
    const formattedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const formattedYear = new Date().toLocaleDateString('en-GB', {
        year: 'numeric'
    });
    try {
        // Add logo images at the upper corners
        const leftLogoPath = path.resolve(process.cwd(), 'src/assets/Coat_of_arms_of_Ghana.svg.png');
        console.log('Trying to load logo from:', leftLogoPath);
        if (fs.existsSync(leftLogoPath)) {
            doc.image(leftLogoPath, 50, 40, { width: 80 });
            console.log('Left logo added successfully');
        }
        else {
            console.log('Logo file not found at:', leftLogoPath);
        }
        // Right logo - use absolute path from project root
        const rightLogoPath = path.resolve(process.cwd(), 'src/assets/Ashma Logo BIG.JPG');
        console.log('Trying to load right logo from:', rightLogoPath);
        if (fs.existsSync(rightLogoPath)) {
            doc.image(rightLogoPath, doc.page.width - 130, 40, { width: 80 });
            console.log('Right logo added successfully');
        }
        else {
            console.log('Right logo file not found at:', rightLogoPath);
        }
        // Add more vertical space to avoid overlapping with logos
        doc.fontSize(20)
            .text('Marcory Municipal Assembly', { align: 'center' });
        doc.fontSize(13)
            .text('P.O. Box 23', { align: 'center' });
        doc.fontSize(13)
            .text('Marcory', { align: 'center' });
        doc.moveDown(1);
        doc.moveDown(1);
        doc.moveDown(1);
        doc.fontSize(13)
            .text('BUSINESS OPERATING PERMIT AND DEMAND NOTICE', { align: 'center' });
        //doc.moveDown(2); // Move down to create space after logos
        // Title centered between the logos      
        doc.moveDown(1);
        // Horizontal line
        doc.fontSize(12)
            .moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke();
        doc.moveDown(1);
        // Create two columns for the permit information
        const leftColumnX = 100;
        const rightColumnX = 350;
        //const startY = doc.y + 20; // Add extra space after the line
        // Save the current y position to use for both headers
        const headerY = doc.y;
        // Left column header
        doc.text('CORPORATE DETAILS', leftColumnX, headerY);
        // Right column header - use the same y position
        doc.text(`FINANCIAL DETAILS ${formattedYear}`, rightColumnX, headerY);
        // Horizontal line
        doc.fontSize(12)
            .moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke();
        doc.moveDown(1);
        doc.moveDown(2);
        // Serial number in red
        doc.fillColor('red')
            .text(`Serial No: ${varSerialNo}`, leftColumnX, doc.y)
            .fillColor('black');
        // Save the Y position after the serial number for the right column
        // const firstItemY = doc.y;
        // Left column content
        doc.moveDown(0.8); // Add space after serial number
        const accountY = doc.y;
        doc.text(`Account No: ${data.buss_no}`, leftColumnX, accountY);
        doc.moveDown(0.8); // Add consistent spacing between items
        const businessNameY = doc.y;
        doc.text(`Business Name: ${data.buss_name}`, leftColumnX, businessNameY);
        // Right column content - first two items
        doc.text(`Arrears: GHC ${arrears.toFixed(2)}`, rightColumnX, accountY);
        doc.text(`Current Rate: GHC ${data.current_rate}`, rightColumnX, businessNameY);
        // Add Total Payable between Business Name and Type of Business
        const totalPayableY = businessNameY + 25; // Position it 25 points below business name
        doc.text(`Total Payable: GHC ${varTotalPayable.toFixed(2)}`, rightColumnX, totalPayableY);
        // Continue with left column after the gap
        doc.moveDown(5);
        const businessTypeY = doc.y;
        doc.text(`Type of Business: ${data.buss_type}`, leftColumnX, businessTypeY);
        doc.moveDown(0.8);
        const businessCategoryY = doc.y;
        doc.text(`Business Category: ${data.tot_grade}`, leftColumnX, businessCategoryY);
        doc.moveDown(0.8);
        const propertyClassY = doc.y;
        doc.text(`Property Class: ${data.property_class}`, leftColumnX, propertyClassY);
        doc.moveDown(0.8);
        const landmarkY = doc.y;
        doc.text(`Landmark: ${data.landmark || 'N/A'}`, leftColumnX, landmarkY);
        doc.moveDown(0.8);
        const electoralAreaY = doc.y;
        doc.text(`Electoral Area: ${data.electroral_area}`, leftColumnX, electoralAreaY);
        // Return to the position after the electoral area
        doc.y = electoralAreaY;
        doc.moveDown(5); // Add more space before signatures
        doc.text('Municipal Finance Officer', rightColumnX, doc.y);
        doc.moveDown(2);
        doc.text('Distributed By', rightColumnX, doc.y);
        doc.moveDown(1);
        doc.text(`Date Issued: ${formattedDate}`, rightColumnX, doc.y);
        // Add a footer note at the bottom of the page
        const currentYear = new Date().getFullYear();
        const footerY = doc.page.height - 50;
        // Set smaller font for the footer text
        doc.fontSize(8)
            .text(`This bill must be paid in full on or before the latter of 31 March, ${currentYear} or within two weeks of distribution date.`, 50, footerY, {
            align: 'center',
            width: doc.page.width - 100
        });
        console.log('Permit content generated successfully');
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Error occurred while generating permit content:', error.message);
            console.log(error.stack);
        }
        else {
            console.log('Unknown error occurred while generating permit content');
        }
    }
}
async function findPreviousBalance(bussNo) {
    console.log('in findPreviousBalance');
    console.log('bussNo:', bussNo); // Debugging statement to verify the value
    const client = await pool.connect();
    try {
        const currentYear = new Date().getFullYear();
        // Find previous payments
        const prevPaymentsResult = await client.query('SELECT SUM(paidAmount) AS totsum FROM buspayments WHERE buss_no = $1 AND fiscal_year < $2', [bussNo, currentYear]);
        const prevPayments = prevPaymentsResult.rows[0]?.totsum ?? 0;
        // Find previous billings
        const prevBalancesResult = await client.query('SELECT SUM(current_balance) AS totsum FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear < $2', [bussNo, currentYear]);
        const prevBalances = prevBalancesResult.rows[0]?.current_balance ?? 0;
        console.log('prevPayments:', prevPayments);
        console.log('prevBalances:', prevBalances);
        console.log('prevBalances - prevPayments:', prevBalances - prevPayments);
        // Calculate balance
        return prevBalances - prevPayments;
    }
    catch (error) {
        console.error(error);
        throw new Error('Error fetching previous balance');
    }
    finally {
        client.release();
    }
}
// Function to find business balance
async function findBusinessBalance(bussNo) {
    console.log('in findBusinessBalance()');
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
        if (error instanceof Error) {
            console.error(error);
            return 0;
        }
        else {
            console.error('Unknown error:', error);
            return 0;
        }
    }
    finally {
        if (client) {
            client.release(); // Release the client instance
        }
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
        if (error instanceof Error) {
            console.error(error);
            return 0;
        }
        else {
            console.error('Unknown error:', error);
            return 0;
        }
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
        if (error instanceof Error) {
            console.error(error);
            return 0;
        }
        else {
            console.error('Unknown error:', error);
            return 0;
        }
        console.error('Error:', error);
        return 0;
    }
    finally {
        client.release();
    }
}
export async function ensurePermitDirIsEmpty() {
    try {
        console.log('in  ensurePermitDirIsEmpty function');
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
    catch (error) {
        if (error instanceof Error) {
            // Directory does not exist, create it
            await fsPromises.mkdir(permitDir, { recursive: true });
            console.log('Created permits directory:', permitDir);
        }
        else {
            console.error('Error accessing permits directory:', error);
        }
    }
}
export default router;
//# sourceMappingURL=businessRoutes.js.map