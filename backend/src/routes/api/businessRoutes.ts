import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';

import pkg from 'pg';
const { Pool } = pkg;

// import { generatePdf } from '../../generatePdf.js';
import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import PDFDocument from 'pdfkit';

import { printPdf } from '../../utils/printHelper.js';

const router: Router = express.Router();

// experiment ///
// Load the environment variables from the .env file
dotenv.config();

// Determine the environment (development or production)
const env = process.env.NODE_ENV || 'development';  // Defaults to 'development'
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

// Example usage of environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('Initial NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', DB_HOST);
console.log('DB_USER:', DB_USER);
console.log('DB_NAME:', DB_NAME);
console.log('DB_PORT:', DB_PORT);
console.log('DB_PASSWORD:', DB_PASSWORD);
console.log('JWT_SECRET:', JWT_SECRET);

// SSL configuration
let sslConfig: false | { rejectUnauthorized: boolean };

if (process.env.NODE_ENV === 'production') { 
  sslConfig = { rejectUnauthorized: true }; // Important for Render.com
} else {
  sslConfig = false;
}
// end of experiment ///


// PostgreSQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    ssl: sslConfig,
};

const pool = new Pool(dbConfig);

// Business data interface (this should match the expected structure in your request body)
export interface BusinessData {
    buss_no: number | null;
    buss_name?: string;
    buss_address?: string;
    buss_type?: string;
    buss_town?: string;
    buss_permitno?: string;
    street_name?: string;
    landmark?: string;
    electroral_area?: string;
    property_class?: string;
    tot_grade?: string;
    ceo?: string;
    telno?: string;
    strategiclocation?: number;
    productvariety?: number;
    businesspopularity?: number;
    businessenvironment?: number;
    sizeofbusiness?: number;
    numberofworkingdays?: number;
    businessoperatingperiod?: number;
    competitorsavailable?: number;
    assessmentby?: string;
    transdate?: Date | null;
    balance?: number;
    status?: string;
    current_rate?: number;
    property_rate?: number;
    totalmarks?: number;
    emailaddress?: string; 
    noofemployees?: number;
    noofbranches?: number;
    BALANCENEW?: number;
    gps_address?: string; 
    serialNo?: number;
    buss_location: string;
}

interface ReceiptData {
    buss_no: string;
    buss_name: string;
    buss_type: string;
    property_class: string;
    landmark: string;
    electroral_area: string;
    tot_grade: string;
    current_rate: string;
    property_rate: string;
    serialno?: string;
  }

function generateReceiptContent(doc: PDFDocument, data: ReceiptData, totalPayable: number, varSerialNo: string) {
    console.log('in generateReceiptContent')

    doc.fontSize(20).text('Business Operating Permit', { align: 'center' });
    doc.moveDown();
  
    doc.fontSize(12);
    doc.text(`Serial No: ${varSerialNo}`);
    doc.moveDown(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  
    doc.moveDown();
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
  
  export async function generatePdf(data: ReceiptData): Promise<Buffer> {
    console.log('in generatePdf');
  
    const currentRate = parseFloat(data.current_rate);
    const propertyRate = parseFloat(data.property_rate);
    const totalPayable = currentRate + propertyRate;
  
    const baseSerialNo = data.serialno !== undefined ? parseInt(data.serialno, 10) : 0;
    const varSerialNo = baseSerialNo.toString().padStart(10, '0');
  
    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks: any[] = [];
  
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
  
      generateReceiptContent(doc, data, totalPayable, varSerialNo);
      doc.end();
    });
  }
  
  export async function generatePdfToPrinter(data: ReceiptData): Promise<void> {
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
  
    return new Promise<void>((resolve, reject) => {
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
function sanitizeBusinessData(data: BusinessData): BusinessData {
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

const fsPromises = fs.promises;

// Function to add record to busscurrbalance 
async function addRecord(txtBussNo: number | null, dtTransdate: Date, txtBalanceBF: number, 
    txtCurrentRate: number, txtRate: number, cboElectoralArea: string, cboAssessmentBy: string): Promise<boolean> {
    
    const client = await pool.connect();

    console.log(txtBalanceBF)
    console.log(txtCurrentRate)

    try {
        const deleteQuery = `
            DELETE  
            FROM busscurrbalance 
            WHERE buss_no = $1;
        `;
        await client.query(deleteQuery, [txtBussNo]);

        // Find previous fiscal year balance
        const varFiscalYear = dtTransdate.getFullYear();
        const varPrevFiscalYear = varFiscalYear - 1;

        const findPreviousFiscalYearQuery = `
            SELECT balancebf 
            FROM busscurrbalance 
            WHERE buss_no = $1 AND fiscalyear = $2;
        `;

        const prevResults = await client.query(findPreviousFiscalYearQuery, [txtBussNo, varPrevFiscalYear]);
        let varBalanceBF: number = 0;

        if (prevResults.rows.length > 0) {
            varBalanceBF = prevResults.rows[0].balancebf;
        }

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
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            return false;
        } else {
            console.error('Unknown error:', error);
            return false;
        }
    } finally {
        client.release();
    }
}


// Read all businesses
router.get('/all', async (req: Request, res: Response) => {
      const client = await pool.connect()
    try {
       
        const result = await client.query('SELECT * FROM business ORDER BY buss_no ASC');
       

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        res.status(200).json(result.rows);
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }finally{
        client.release();
    }
});

// Read last business
router.get('/last', async (req: Request, res: Response) => {
    console.log('in router.get(/last')
      const client = await pool.connect()

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
    } catch (error: unknown) {
        if (error instanceof Error){
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        }else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
        
    }finally{
        client.release();
    }
});

// Read a single business by buss_no
router.get('/:buss_no', async (req: Request, res: Response): Promise<void> => {
    const { buss_no } = req.params;

    console.log('in router.get(/:buss_no)', req.params); // Debugging output

    // Check if buss_no is invalid
    if (!buss_no || isNaN(Number(buss_no))) {
       res.status(400).json({ message: 'Valid business number is required', data: []  });
       return       
    }

     const client = await pool.connect()
    
    try {
        // Debugging: Log the query being executed
        console.log('Executing query for buss_no:', buss_no);

        const newBuss_no = parseInt(buss_no);
        const result = await client.query('SELECT * FROM business WHERE buss_no = $1', [newBuss_no]);
       // client.release();

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Business record not found', data: [] });
            return 
          
        } 
        res.status(200).json({ message: 'Business record found', data: result.rows[0] });
        return 
    } catch (error: unknown) {
        if (error instanceof Error){
          console.error('Database query error:', error);
          res.status(500).json({ message: 'Error fetching business', data: error.message });
          return 
        }else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }       
    } finally {
        client.release(); // Ensure the client is released
    }
});


// Read all electoral_areas
router.get('/electoralAreas', async (req: Request, res: Response) => {
      const client = await pool.connect()
    try {
       

        const result = await client.query('SELECT DISTINCT electroral_area FROM business');
       

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No electoral areas found' });
        } else {
            res.status(200).json(result.rows);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }finally{
         client.release();
    }
});

// Read a single electoral_area
router.get('/electoral/:electoral_area', async (req: Request, res: Response) => {
    const { electoral_area } = req.params;
     const client = await pool.connect()

    try {
       
        const result = await client.query('SELECT * FROM business WHERE electroral_area = $1', [electoral_area]);
      

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No businesses found for the electoral area' });
        } else {
            res.status(200).json(result.rows);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }finally{
          client.release();
    }
});

// Read a single business by buss_name
router.get('/name/:buss_name', async (req: Request, res: Response) => {
    const { buss_name } = req.params;

      const client = await pool.connect()
    try {
       
        const result = await client.query('SELECT * FROM business WHERE buss_name = $1', [buss_name]);
      

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Business record not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }finally{
          client.release();
    }
});

// Create a new business record
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    console.log('Creating a new business');

    // Sanitize the input data
    const sanitizedData = sanitizeBusinessData(req.body);
   // console.log(sanitizedData);

     const client = await pool.connect()
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
        } else {
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
        const addRecordSuccess = await addRecord(
            sanitizedData.buss_no, 
            sanitizedData.transdate as Date , 
            sanitizedData.balance as number, 
            sanitizedData.current_rate as number, 
            sanitizedData.property_rate as number, 
            sanitizedData.electroral_area as string,
            sanitizedData.assessmentby as string,
        );

        if (!addRecordSuccess) {
            throw new Error('Failed to add record to busscurrbalance');
        }

        res.status(201).json({ success: true, message: 'Business record created successfully', BUSS_NO: sanitizedData.buss_no });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }finally{
        client.release()
    }
});

// Update a business record
router.put('/:buss_no', async (req: Request, res: Response) => {
    console.log('in router.put(/:buss_no)');

     const client = await pool.connect()
    try{
        

    const { buss_no } = req.params;

    //console.log('THIS IS THE businessData:', businessData);

    // Sanitize the input data
    const sanitizedData = sanitizeBusinessData(req.body);
    //console.log('sanitizedData:', sanitizedData);

    if (
        sanitizedData.buss_name === null || sanitizedData.buss_name === undefined ||
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
        isNaN(sanitizedData.strategiclocation  as number) ||
        isNaN(sanitizedData.productvariety as number) ||
        isNaN(sanitizedData.businesspopularity as number) ||
        isNaN(sanitizedData.businessenvironment as number) ||
        isNaN(sanitizedData.sizeofbusiness as number) ||
        isNaN(sanitizedData.numberofworkingdays as number) ||
        isNaN(sanitizedData.businessoperatingperiod as number) ||
        isNaN(sanitizedData.competitorsavailable as number) ||
        sanitizedData.assessmentby === null || sanitizedData.assessmentby === undefined ||
        sanitizedData.transdate === null || sanitizedData.transdate === undefined ||
        isNaN(sanitizedData.balance as number) ||
        sanitizedData.status === null || sanitizedData.status === undefined ||
        isNaN(sanitizedData.current_rate as number) ||
        isNaN(sanitizedData.property_rate as number) ||
        isNaN(sanitizedData.totalmarks as number) ||
        sanitizedData.emailaddress === null || sanitizedData.emailaddress === undefined ||
        isNaN(sanitizedData.noofemployees as number) ||
        isNaN(sanitizedData.noofbranches as number) ||
        isNaN(sanitizedData.BALANCENEW as number) ||
        sanitizedData.gps_address === null || sanitizedData.gps_address === undefined ||
        sanitizedData.serialNo === null || sanitizedData.serialNo === undefined ||
        sanitizedData.buss_location === null || sanitizedData.buss_location === undefined
    ) {
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

        if (updateResult.rowCount as number > 0) {
            res.status(200).json({ success: true, message: 'Business updated successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to update business' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }finally{
        client.release()
    }
});

// Delete a business record
router.delete('/delete/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

     const client = await pool.connect()
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }finally{
        client.release()
    }
});

// Process business operating permits for a fiscal year
router.post('/processOperatingPermits/:electoral_area/:fiscal_year', async (req: Request, res: Response) => {
   
   
    console.log('in router.post(/processOperatingPermits/:electoral_area/:fiscal_year)', req.params);

     const client = await pool.connect()
    try {
        // Ensure the permits directory is empty
        console.log('about to make permit directory')
        await ensurePermitDirIsEmpty();

        console.log('after ensurePermitDirIsEmpty()')

        const { electoral_area, fiscal_year } = req.params;

        console.log('electoral_area:', electoral_area, 'fiscal_year:', fiscal_year);

         // Select all businesses
        // const businessesResult: QueryResult = await client.query('SELECT * FROM business');

         console.log('ABOUT TO BILL ALL BUSINESSES')
 

        // Select all businesses in the electoral area
        const businessRows = await client.query('SELECT * FROM business WHERE electroral_area ILIKE $1', [electoral_area]);

       console.log('after SELECT * FROM business WHERE electroral_area = $1')

       console.log('businessRows.rows.length === 0: ', businessRows.rows.length === 0)

        if (businessRows.rows.length === 0) {
            res.status(404).json({ message: 'No businesses found for the electoral area' });
            return;
        }

        console.log('after SELECT * FROM business WHERE electroral_area = $1')

        // Update balancebf in busscurrbalance table for all businesses in the electoral area for the given fiscal year
        for (let i = 0; i < businessRows.rows.length; i++) {
            const { buss_no } = businessRows.rows[i];

            console.log('in the update busscurrbalance table loop')

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

        // Add serial numbers
        const recBusiness = await client.query('SELECT * FROM tmpbusiness ORDER BY buss_no');

        if (recBusiness.rows.length === 0) {
            res.status(404).json({ message: 'No businesses found for the electoral area' });
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
        const recBills = await client.query('SELECT * FROM tmpbusiness ORDER BY buss_name ASC');

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

                // To printer
                await generatePdfToPrinter(bill);
            } catch (error: unknown) {
                if (error instanceof Error){
                    console.error('Error generating PDF for bill:', bill, error);
                    res.status(500).json({ message: `Error generating PDF for bill ${bill.buss_no}: ${error.message}` });
                    return;
                }else{
                    res.status(500).json({ message: `Error unknown for bill ${bill.buss_no}` });
                    return;
                }                
            }
        }

        res.status(200).json({ message: 'Bills generated successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching businesses', error: error.message });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }finally{
        client.release()
    }
});

// Function to find business balance
async function findBusinessBalance(bussNo: number): Promise<number> {
    console.log('in findBusinessBalance()');  

      const client = await pool.connect()
    try {
       

        // Get current year and previous fiscal year
        const currentYear = new Date().getFullYear();

        // Find all payments
        const prevPaymentsResult = await client.query('SELECT SUM(paidAmount) AS totsum FROM buspayments WHERE buss_no = $1 AND fiscal_year < $2', 
        [bussNo, currentYear]);
        const prevPayments = prevPaymentsResult.rows[0]?.totsum ?? 0;

        // Find all billings
        const prevBalancesResult = await client.query('SELECT SUM(current_balance) AS totPrevBal FROM busscurrbalance WHERE buss_no = $1 AND fiscalyear < $2', 
        [bussNo, currentYear]);
        const prevBalances = prevBalancesResult.rows[0]?.totPrevBal ?? 0;

        // Calculate balance
        return prevBalances - prevPayments;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            return 0
        } else {
            console.error('Unknown error:', error);
           return 0
        }
    } finally {
        if (client) {
            client.release(); // Release the client instance
        }
    }
}

// Function to find total payable based on business number
export async function findTotalPayable(txtBussNo: number): Promise<number> {
     const client = await pool.connect()
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            return 0
        } else {
            console.error('Unknown error:', error);
            return 0
        }
    }finally{
        client.release()
    }
}

// Function to find the current rate
export async function findCurrentRate(txtBussNo: number): Promise<number> {
     const client = await pool.connect()
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            return 0;
        } else {
            console.error('Unknown error:', error);
           return 0
        }
        console.error('Error:', error);
        return 0;
    } finally{
        client.release()
    }
}

export  async function ensurePermitDirIsEmpty() {
    try {
        console.log('in  ensurePermitDirIsEmpty function')
        
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
            } else {
                // Remove files
                await fsPromises.unlink(filePath);
            }
        }
        console.log('Permits directory emptied:', permitDir);
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Directory does not exist, create it
            await fsPromises.mkdir(permitDir, { recursive: true });
            console.log('Created permits directory:', permitDir);
        } else {
            console.error('Error accessing permits directory:', error);
        }
    }
}

export default router;











