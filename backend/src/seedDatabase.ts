import * as dotenv from 'dotenv';
 dotenv.config();
import express from 'express';
import { Request, Response } from 'express';
import * as mysql from 'mysql2/promise';
import { generateBusinessData } from './seedDataGenerator.js';


async function seedDatabase() {
    try {
        console.log('Seeding business data...')

        dotenv.config({ path: '/Users/pauljesufleischer/revmonitor/backend/src/.env' });


        dotenv.config();

        // Define the number of businesses to seed
        const numBusinesses = 500;
        const businesses = generateBusinessData(281, numBusinesses);

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












