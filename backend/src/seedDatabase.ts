import * as dotenv from 'dotenv';
 dotenv.config();
import express from 'express';
import { Request, Response } from 'express';
import * as mysql from 'mysql2/promise';
import { generateBusinessData } from './seedDataGenerator.js';

  // MySQL connection configuration
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
};


// Function to add record to tb_BussCurrBalance
async function addRecord(txtBussNo: (number | null), dtTransdate: Date, txtBalanceBF: number, txtCurrentRate: number, txtRate: number, cboElectoralArea: string): Promise<boolean> {
    console.log('in addRecord')

    // MySQL connection configuration
      // MySQL connection configuration
      const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'revmonitor',
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
    };
    
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Get current year and previous fiscal year
        const currentYear = new Date().getFullYear();
        const varFiscalYear = dtTransdate.getFullYear();
        const varPrevFiscalYear = varFiscalYear - 1;

        // Find previous fiscal year balance
        const findPreviousFiscalYearQuery = `
            SELECT balancebf 
            FROM tb_BussCurrBalance 
            WHERE buss_no = ? AND fiscalyear = ?;
        `;

        const [prevResults] = await connection.execute(findPreviousFiscalYearQuery, [txtBussNo, varPrevFiscalYear]);

        let varBalanceBF: number = 0;
        if (prevResults.length > 0) {
            varBalanceBF = (prevResults[0] as any).balancebf;
        }

        // Insert or update record in tb_BussCurrBalance
        const insertNewRecordQuery = `
            INSERT INTO tb_BussCurrBalance (buss_no, fiscalyear, balancebf, current_balance, totalAmountDue, transdate, electoralarea) 
            VALUES (?, ?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE balancebf = VALUES(balancebf), current_balance = VALUES(current_balance), totalAmountDue = VALUES(totalAmountDue), transdate = VALUES(transdate), electoralarea = VALUES(electoralarea);
        `;

        const insertValues = [
            txtBussNo, varFiscalYear, varBalanceBF, txtCurrentRate, (varBalanceBF + txtCurrentRate), dtTransdate, cboElectoralArea
        ];

        await connection.execute(insertNewRecordQuery, insertValues);

        await connection.end();
        return true;
    } catch (error) {
        console.error('Error in adding a record:', error);
        await connection.end();
        return false;
    }
}

async function seedDatabase() {
    try {
        console.log('Seeding business data...')

        dotenv.config({ path: '/Users/pauljesufleischer/revmonitor/backend/src/.env' });


        dotenv.config();

        // Define the number of businesses to seed
        const numBusinesses = 1000;
        const businesses = generateBusinessData(1, numBusinesses);

          // MySQL connection configuration
          const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'revmonitor',
            connectionLimit: 10,
            waitForConnections: true,
            queueLimit: 0,
        };

        console.log('password: ', process.env.DB_PASSWORD)
        console.log('host: ', process.env.DB_HOST)
        console.log('user: ', process.env.DB_USER)
        console.log('database: ', process.env.DB_NAME)


      
        const connection = await mysql.createConnection(dbConfig);

       // console.log('connection: ', connection)

    //     // Insert each business into the tb_business table
        for (const business of businesses) {
            const query = `
                INSERT INTO tb_business (
                    buss_no, buss_name, buss_address, buss_type, buss_town, street_name, landmark,
                    electroral_area, property_class, tot_grade, ceo, telno, strategiclocation,
                    productvariety, businesspopularity, businessenvironment, sizeofbusiness,
                    numberofworkingdays, businessoperatingperiod, competitorsavailable, assessmentby,
                    transdate, balance, status, current_rate, property_rate, totalmarks, emailaddress,
                    noofemployees, noofbranches, BALANCENEW, gps_address
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?
                );
            `;
            const values = [
                business.buss_no, business.buss_name, business.buss_address, business.buss_type, 
                business.buss_town, business.street_name, business.landmark, business.electroral_area, 
                business.property_class, business.tot_grade, business.ceo, business.telno, 
                business.strategiclocation, business.productvariety, business.businesspopularity, business.businessenvironment, 
                business.sizeofbusiness, business.numberofworkingdays, business.businessoperatingperiod, business.competitorsavailable, 
                business.assessmentby, business.transdate, business.balance, business.status, 
                business.current_rate, business.property_rate, business.totalmarks, business.emailaddress,
                business.noofemployees, business.noofbranches, business.BALANCENEW, business.gps_address
            ];

            // Execute the query
            const [resultHeader] = await connection.execute(query, values);

            let transdate = new Date();
            if (business.transdate) {
                transdate = new Date(business.transdate);
            } 

            const balanceNew = business.BALANCENEW !== undefined ? business.BALANCENEW : 0; // 
            const currentRate = business.current_rate !== undefined ? business.current_rate : 0; //
            const propertyRate = business.property_rate !== undefined ? business.property_rate : 0; //
            const electoralArea = business.electroral_area !== undefined ? business.electroral_area : ''; //

            // Call the addRecord function with related business values here
            const addRecordResult = await addRecord(
                business.buss_no, 
                transdate, 
                balanceNew, 
                currentRate, 
                propertyRate, 
                electoralArea
            );

            if (addRecordResult) {
                console.log(`Added/Updated record in tb_BussCurrBalance for buss_no: ${business.buss_no}`);
            } else {
                console.log(`Failed to add/update record in tb_BussCurrBalance for buss_no: ${business.buss_no}`);
            }

            // Check if the insert was successful
            if (resultHeader && (resultHeader as any).insertId !== undefined) {
                console.log(`Inserted business with buss_no: ${business.buss_no} and insertId: ${(resultHeader as any).insertId}`);
            } else {
                console.log(`Inserted business with buss_no: ${business.buss_no} but insertId is undefined`);
            }

            // Alternatively, check affectedRows
            if (resultHeader && (resultHeader as any).affectedRows > 0) {
                console.log(`Successfully inserted business with buss_no: ${business.buss_no}`);
            } else {
                console.log(`Failed to insert business with buss_no: ${business.buss_no}`);
            }
        }

        //Close the connection
       await connection.end();
    } catch (err) {
        console.error('Error seeding business data:', err);
        process.exit(1);
    }
}

// Call the function to seed the database
seedDatabase();












