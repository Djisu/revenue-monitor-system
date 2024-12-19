// backend/src/routes/api/businessRoutes.ts
import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
import mysql, { ResultSetHeader }  from 'mysql2/promise';
import { log } from 'util';

//import mysql, { ResultSetHeader } from 'mysql2/promise';

const router = Router();

// Load environment variables from .env file
const environment = process.env.NODE_ENV || 'development';
dotenv.config(); // Load .env file from the default location
console.log(process.env); // Log all environment variables to check loading


// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);



// Business data interface (this should match the expected structure in your request body)
interface BusinessData {
    buss_no: string;
    buss_name: string;
    buss_address: string;
    buss_type: string;
    BUSS_TOWN: string;
    buss_permitNo: string;
    street_name: string;
    landmark: string;
    electroral_area: string;
    property_class: string;
    Tot_grade: string;
    ceo: string;
    telno: string;
    strategiclocation: string;
    productvariety: string;
    businesspopularity: string;
    businessenvironment: string;
    sizeofbusiness: string;
    numberofworkingdays: string;
    businessoperatingperiod: string;
    competitorsavailable: string;
    assessmentby: string;
    transdate: string;
    balance: string;
    status: string;
    serialno: string;
    current_rate: string;
    property_rate: string;
    totalmarks: string;
    meterid: string;
    metercategory: string;
    emailaddress: string;
    FloorRoomNo: string;
    suburb: string;
    postaladdress: string;
    irsno: string;
    vatno: string;
    blocklayout: string;
    blockdivision: string;
    noofemployees: string;
    noofbranches: string;
    detailsofbranches: string;
    contactperson: string;
    contacttelno: string;
    BALANCENEW: string;
}



// Create a new business record
router.post('/', async (req: Request, res: Response): Promise<void> => {
    console.log('Creating a new business');

    // Get the business data from the request body
    const businessData: BusinessData = req.body;
    console.log(businessData);

    const connection = await mysql.createConnection(dbConfig);
    
    try {
        // Check if a business with the same buss_no already exists
        let [existingBusiness] = await connection.execute(
            'SELECT * FROM tb_business WHERE buss_no = ?', 
            [businessData.buss_no]
        );

        if ((existingBusiness as any).length > 0) {
            res.status(409).json({ message: 'Business with this buss_no already exists.' });
            return;
        }

        const isoDate = new Date(businessData.transdate);
        const mysqlDate = isoDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    
        // Insert the new business data
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO tb_business (buss_no, buss_name, buss_address, buss_type, BUSS_TOWN, buss_permitNo, street_name, landmark, electroral_area, 
                property_class, Tot_grade, ceo, telno, strategiclocation, productvariety, businesspopularity, businessenvironment, sizeofbusiness, 
                numberofworkingdays, businessoperatingperiod, competitorsavailable, assessmentby, transdate, balance, status, serialno, current_rate, 
                property_rate, totalmarks, meterid, metercategory, emailaddress, FloorRoomNo, suburb, postaladdress, irsno, 
                vatno, blocklayout, blockdivision, noofemployees, noofbranches, detailsofbranches, contactperson, contacttelno, BALANCENEW) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                businessData.buss_no,
                businessData.buss_name,
                businessData.buss_address,
                businessData.buss_type,
                businessData.BUSS_TOWN,
                businessData.buss_permitNo,
                businessData.street_name,
                businessData.landmark,
                businessData.electroral_area,
                businessData.property_class,
                businessData.Tot_grade,
                businessData.ceo,
                businessData.telno,
                businessData.strategiclocation,
                businessData.productvariety,
                businessData.businesspopularity,
                businessData.businessenvironment,
                businessData.sizeofbusiness,
                businessData.numberofworkingdays,
                businessData.businessoperatingperiod,
                businessData.competitorsavailable,
                businessData.assessmentby,
                mysqlDate,
                businessData.balance,
                businessData.status,
                businessData.serialno,
                businessData.current_rate,
                businessData.property_rate,
                businessData.totalmarks,
                businessData.meterid,
                businessData.metercategory,
                businessData.emailaddress,
                businessData.FloorRoomNo,
                businessData.suburb,
                businessData.postaladdress,
                businessData.irsno,
                businessData.vatno,
                businessData.blocklayout,
                businessData.blockdivision,
                businessData.noofemployees,
                businessData.noofbranches,
                businessData.detailsofbranches,
                businessData.contactperson,
                businessData.contacttelno,
                businessData.BALANCENEW,
            ]
        );

        // Access `affectedRows` directly from the result object
        existingBusiness = await connection.execute(
            'SELECT * FROM tb_business WHERE buss_no = ?', 
            [businessData.buss_no]
        );

        if ((existingBusiness as any).length > 0) {
            res.status(201).json({ message: 'Business created successfully' });
            return;
        }else {
            res.status(400).json({ message: 'Failed to create business' });
            return
        }
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating business', error });
        return
    } finally {
        connection.end();
    }
});


// Read all businesses
router.get('/', async (req: Request, res: Response) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_business');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching businesses', error });
    } finally {
        connection.end();
    }
});

// Read a single business by buss_no
router.get('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM tb_business WHERE buss_no = ?', [buss_no]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        } else {
            res.status(404).json({ message: 'Business not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching business', error });
    } finally {
        connection.end();
    }
});

// Update a business record
router.put('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;
    const businessData = req.body;

    const isoDate = new Date(businessData.transdate);
    const mysqlDate = isoDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [result] = await connection.execute(
            `UPDATE tb_business SET buss_name = ?, buss_address = ?, buss_type = ?, BUSS_TOWN = ?, buss_permitNo = ?, 
                street_name = ?, landmark = ?, electroral_area = ?, property_class = ?, Tot_grade = ?, ceo = ?, 
                telno = ?, strategiclocation = ?, productvariety = ?, businesspopularity = ?, businessenvironment = ?, 
                sizeofbusiness = ?, numberofworkingdays = ?, businessoperatingperiod = ?, competitorsavailable = ?, 
                assessmentby = ?, transdate = ?, balance = ?, status = ?, serialno = ?, current_rate = ?, 
                property_rate = ?, totalmarks = ?, meterid = ?, metercategory = ?, emailaddress = ?, 
                FloorRoomNo = ?, suburb = ?, postaladdress = ?, irsno = ?, vatno = ?, blocklayout = ?, 
                blockdivision = ?, noofemployees = ?, noofbranches = ?, detailsofbranches = ?, 
                contactperson = ?, contacttelno = ?, BALANCENEW = ? WHERE buss_no = ?`,
            [
                businessData.buss_name,
                businessData.buss_address,
                businessData.buss_type,
                businessData.BUSS_TOWN,
                businessData.buss_permitNo,
                businessData.street_name,
                businessData.landmark,
                businessData.electroral_area,
                businessData.property_class,
                businessData.Tot_grade,
                businessData.ceo,
                businessData.telno,
                businessData.strategiclocation,
                businessData.productvariety,
                businessData.businesspopularity,
                businessData.businessenvironment,
                businessData.sizeofbusiness,
                businessData.numberofworkingdays,
                businessData.businessoperatingperiod,
                businessData.competitorsavailable,
                businessData.assessmentby,
                mysqlDate,
                businessData.balance,
                businessData.status,
                businessData.serialno,
                businessData.current_rate,
                businessData.property_rate,
                businessData.totalmarks,
                businessData.meterid,
                businessData.metercategory,
                businessData.emailaddress,
                businessData.FloorRoomNo,
                businessData.suburb,
                businessData.postaladdress,
                businessData.irsno,
                businessData.vatno,
                businessData.blocklayout,
                businessData.blockdivision,
                businessData.noofemployees,
                businessData.noofbranches,
                businessData.detailsofbranches,
                businessData.contactperson,
                businessData.contacttelno,
                businessData.BALANCENEW,
                buss_no
            ]
        );
        
        let [existingBusiness] = await connection.execute(
            'SELECT * FROM tb_business WHERE buss_no = ?', 
            [businessData.buss_no]
        );

        console.log('Existing business:', existingBusiness);

        if ((existingBusiness as any).length > 0) {
            res.status(201).json({ message: 'Business updated successfully' });
            return;
        }else {
            res.status(400).json({ message: 'Failed to update business' });
            return
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating business', error });
    } finally {
        connection.end();
    }
});

// Delete a business record
router.delete('/:buss_no', async (req: Request, res: Response) => {
    const { buss_no } = req.params;

    const connection = await mysql.createConnection(dbConfig);

    try {
         // Check if a business with the same buss_no already exists
         let [existingBusiness] = await connection.execute(
            'SELECT * FROM tb_business WHERE buss_no = ?', 
            [buss_no]
        );

        if ((existingBusiness as any).length == 0) {
            res.status(409).json({ message: 'Business does not exist.' });
            return;
        }

        const [result] = await connection.execute('DELETE FROM tb_business WHERE buss_no = ?', [buss_no]);
       
        res.status(201).json({ message: 'Business deleted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting business', error });
        return
    } finally {
        connection.end();
    }
});

export default router;