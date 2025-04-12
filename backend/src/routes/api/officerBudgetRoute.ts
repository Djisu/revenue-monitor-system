//import express from 'express';
import * as dotenv from 'dotenv';
import { Router, Request, Response } from 'express';
// import PDFDocument from 'pdfkit';
// import nodemailer, { SendMailOptions } from 'nodemailer';
import nodemailer, { SendMailOptions } from 'nodemailer';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

import pg from 'pg'
const { Pool } = pg
import {PoolClient} from 'pg'

export interface AddBudgetRequest {
    officer_no: string;
    officer_name: string;
    fiscal_year: number;
    annual_budget: number;
    monthly_budget: number;
    January_budget: number;
    January_Actual: number;
    February_budget: number;
    February_Actual: number;
    March_budget: number;
    March_Actual: number;
    April_budget: number;
    April_Actual: number;
    May_budget: number;
    May_Actual: number;
    June_budget: number;
    June_Actual: number;
    July_budget: number;
    July_Actual: number;
    August_budget: number;
    August_Actual: number;
    September_budget: number;
    September_Actual: number;
    October_budget: number;
    October_Actual: number;
    November_budget: number;
    November_Actual: number;
    December_budget: number;
    December_Actual: number;
    Actual_total: number;
    outstanding: number;
    electoral_area: string;
 }

interface UpdateBudgetRequest {
    officer_no: string;
    officer_name: string;
    fiscal_year: number;
    annual_budget: number;
    monthly_budget: number;
    January_budget: number;
    January_Actual: number;
    February_budget: number;
    February_Actual: number;
    March_budget: number;
    March_Actual: number;
    April_budget: number;
    April_Actual: number;
    May_budget: number;
    May_Actual: number;
    June_budget: number;
    June_Actual: number;
    July_budget: number;
    July_Actual: number;
    August_budget: number;
    August_Actual: number;
    September_budget: number;
    September_Actual: number;
    October_budget: number;
    October_Actual: number;
    November_budget: number;
    November_Actual: number;
    December_budget: number;
    December_Actual: number;
    Actual_total: number;
    outstanding: number;
    electoral_area: string;
    month: string;
    paidAmount: number;
}

// PostgreSQL connection pool
const emailPassword = process.env.EMAIL_PASSWORD;
const appPassword = process.env.APP_PASSWORD;
const emailUser = process.env.EMAIL_USER;
const port = process.env.PORT || 3001;

// PostgreSQL connection configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});


const router = Router();

// Load environment variables from .env file
dotenv.config();

router.get('/all', async (req: Request, res: Response): Promise<void> => {
    console.log('in router.get(/all')

    const client: PoolClient = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM officerbudget`);

        if (result.rows.length === 0){
            res.status(200).json([]);
            return
        }
        res.status(200).json(result.rows);
        return
    }
    catch (error: any) {
        console.error(error);
        res.status(500).send('Error fetching officer budgets');
        return
    }
    finally {
        client.release();
    }
});

router.get('/officerbudget/:officer_no/:fiscal_year/:electoral_area', async (req: Request, res: Response): Promise<void> => {
    const {officer_no, fiscal_year, electoral_area} = req.params;

    const client: PoolClient = await pool.connect();

    try {
        const result = await client.query(`SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2 AND electoral_area = $3`, 
             [officer_no, fiscal_year, electoral_area]
        );

        // Check if there are any rows returned
        if (result.rows.length > 0) {
            res.status(200).json({ exists: true, data: result.rows });
            return
        } else {
            res.status(200).json({ exists: false });
            return
        }

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ exists: false, message: 'Error fetching officer budget' });
        return

    }
});

router.get('/:officer_no/:fiscal_year', async (req: Request, res: Response): Promise<void> => {
    const {officer_no, fiscal_year} = req.params;

    //console.clear();
    console.log('in router.get(/:officer_no/:fiscal_year): ', req.params)

   
    const officerNoNew = parseInt(officer_no.split(' ')[0], 10)
    console.log('officerNoNew: ', officerNoNew)

    const client: PoolClient = await pool.connect();

    console.log('about to SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2')

    try {
        const result = await client.query(`SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2`, 
             [officerNoNew, fiscal_year]
        );

        console.log('after SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2')
        // Check if there are any rows returned
        if (result.rows.length > 0) {

            console.log('Data found!!!!')

            res.status(200).json({ message: "Data found", data: result.rows });
            return
        } else {
            console.log('No data found')

            res.status(200).json({ message: "No data found", data: [] });
            return
        }

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ exists: false, message: 'Error fetching officer budget' });
        return
    }
});

// Function to populate electoral areas based on officer number
router.get('/electoralArea/:officerNo', async (req: Request, res: Response) => {
    const {officerNo} = req.params;

      const client: PoolClient = await pool.connect();

    try {
        const result = await client.query(`
            SELECT electoralarea FROM collectorElectoralArea 
            WHERE officer_no = $1
            ORDER BY officer_no`, [officerNo]);

        res.json(result.rows);
    } catch (error: any) {
        console.error(error);
        res.status(500).send('Error fetching electoral areas');
    }
});

// Function to get the total number of businesses for a given electoral area
router.get('/businessCount/:electoralArea', async (req: Request, res: Response) => {
    const {electoralArea} = req.params;

    const client: PoolClient = await pool.connect();

    try {
        const result = await client.query(`
            SELECT COUNT(buss_no) AS total FROM business 
            WHERE electoral_area = $1`, [electoralArea]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching business count');
    }
});

// Function to add a budget record
router.post('/addBudget', async (req: Request<{}, {}, AddBudgetRequest>, res: Response): Promise<void> => {
    const { officer_no, fiscal_year } = req.body;

    console.log("in router.post(/addBudget): ", req.body);

    const client: PoolClient = await pool.connect();

    try { 
        
         // Delete existing record if it exists
         const checkRecord = await client.query(`
         DELETE FROM officerbudget 
         WHERE officer_no = $1 AND fiscal_year = $2`, [officer_no, fiscal_year]);

 
         // select to find out if deleted
        const checkResult = await client.query(`
         SELECT * FROM officerbudget 
         WHERE officer_no = $1 AND fiscal_year = $2`, [officer_no, fiscal_year]);

         console.log('checkResult:', checkResult.rows)

         if (checkResult.rows.length > 0) {
             console.log('officerbudget record still exists, deletion not successful')
              res.status(400).json({
                status: 'fail',
                message: 'officerbudget record still exists, deletion not successful',
                data: {}
            });
            return
         }

         console.log('officer budget found!!!')
         console.log('about to SELECT * FROM office WHERE officer_no = $1, [officer_no]')

         // Find officer name from officer_no
         const officerName = await client.query(`
            SELECT * FROM officer 
            WHERE officer_no = $1`, [officer_no]);

        if (officerName.rows.length === 0) {
            console.log('Officer not found')

            res.status(400).json({
                status: 'fail',
                message: 'Officer not found',
                data: {}
            });
            return
        }

        console.log('officerName.rows[0].officer_name:', officerName.rows[0].officer_name)

        console.log('about to  SELECT SUM(current_rate) AS totsum FROM business WHERE assessmentby = $1')

        // Find Annual Budget
        const annual_budget = await client.query(`
            SELECT SUM(current_balance) AS totsum FROM busscurrbalance
            WHERE assessmentby = $1 AND fiscalyear = $2`, [officer_no, fiscal_year]);

        console.log('annual_budget.rows[0].totsum:', annual_budget.rows[0].totsum)

        if (annual_budget.rows[0].totsum === null) {
            console.log('Annual budget not found for officer')

             res.status(400).json({
                status: 'fail',
                message: 'Annual budget not found for officer ' + officerName.rows[0].officer_name,
                data: {}
            });
            return
        }

        // if (annual_budget.rows[0].length === 0) {
        //      res.status(400).json({
        //         status: 'fail',
        //         message: 'Annual budget not found for officer ' + officerName.rows[0].officer_name,
        //         data: {}
        //     });
        //     return
        // }

        console.log('annual_budget.rows[0].totsum:', annual_budget.rows[0].totsum)

        console.log('about to Find monthly budget')
        // Find Monthly Budget
        const monthly_budget = parseFloat(annual_budget.rows[0].totsum) / 12;
        console.log('monthly_budget:', monthly_budget)
       

        // Convert annual_budget to a number
        const newAnnualBudget = parseFloat(annual_budget.rows[0].totsum);
        console.log('newAnnualBudget:', newAnnualBudget)

        console.log('about to INSERT INTO officerbudget')

        
        // Insert new record
        const result = await client.query(`
        INSERT INTO officerbudget (
            officer_no, officer_name, fiscal_year, 
            annual_budget, monthly_budget,  January_budget,
            January_Actual, February_budget, February_Actual, 
            March_budget, March_Actual, April_budget, 
            April_Actual,  May_budget, May_Actual, 
            June_budget, June_Actual, July_budget,
            July_Actual, August_budget, August_Actual, 
            September_budget, September_Actual, October_budget, 
            October_Actual, November_budget, November_Actual, 
            December_budget, December_Actual, Actual_total, 
            outstanding
        ) VALUES (
            $1, $2, $3, $4, $5, 
            $6, $7, $8, $9, 
            $10, $11, $12, $13, 
            $14, $15, $16, $17, 
            $18, $19, $20, $21, 
            $22, $23, $24, $25, 
            $26, $27, $28, $29, 
            $30, $31
        )`, [
        officerName.rows[0].officer_no,
        officerName.rows[0].officer_name,
        fiscal_year,
        newAnnualBudget,
        monthly_budget,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        monthly_budget,
        0,
        0,
        newAnnualBudget
    ]);
        
       console.log('about to SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2')
       console.log('Find out if officerbudget record was inserted successfully')

       // Find out if officerbudget record was inserted successfully
       const officerExists = await client.query(`
         SELECT * FROM officerbudget WHERE officer_no = $1 AND fiscal_year = $2`, [officer_no, fiscal_year]);

         console.log('officerExists.rows:', officerExists.rows)

         if (officerExists.rows.length === 0) {
             console.log('Officer budget not found')
              res.status(400).json({
                status: 'fail',
                message: 'Officer budget not found',
                data: {}
            });
            return
         }
        
        console.log('INSERT INTO officerbudget successful')

        console.log('about to call updateOfficerBudget')

        // call updateOfficerBudget function to update the officer's budget
        // const updateResult = await updateOfficerBudget(officer_no, fiscal_year);
        // console.log('updateResult:', updateResult);

        ///////////// include the updateOfficerBudget function here////////////
        console.log('Updating officerbudget for officer_no:', officer_no, 'in fiscal year:', fiscal_year);

    
            console.log('officerName.rows[0].officer_name:', officerName.rows[0].officer_name)
  
            // Check again if insertion was successful
            const budgetQuery = `
                SELECT * 
                FROM officerbudget 
                WHERE officer_name = $1 AND fiscal_year = $2
            `;
            const budgetResult = await client.query(budgetQuery, [officerName.rows[0].officer_name, fiscal_year]);
            const budget = budgetResult.rows;
    
            console.log('budget.length === 0:', budget.length === 0)
            
            if (budget.length === 0) {
                console.log('No budget found for officer_no: ', officerName.rows[0].officer_name, 'in fiscal year: ', fiscal_year);

                 res.status(400).json({
                    status: 'fail',
                    message: 'No budget found for officerName.rows[0].officer_name: ' + officerName.rows[0].officer_name + 'in fiscal year: ' + fiscal_year,
                    data: {}
                });
                return
            }

            console.log('budget.length:', budget.length)
            if (budget.length > 1) {
                console.error('Multiple budget records found for officerName.rows[0].officer_name: ', officerName.rows[0].officer_name, 'in fiscal year: ', fiscal_year);
            }

            const budgetRecord = budget[0]; // Get the first (and expected only) budget record   
            console.log('budget:', budgetRecord);
           

        // Step 3: Update the budget based on payments
        let actualTotal = parseFloat(budgetRecord.actual_total) || 0; 

        // Step 4: Fetch all payments for the given officer and fiscal year
        console.log('about to loop through payments')

        // Find all payments for the given officer and fiscal year
        const paymentsQuery = `
        SELECT monthpaid, paidAmount, officer_no, fiscal_year
        FROM buspayments 
        WHERE officer_no = $1 AND fiscal_year = $2
        `;
        const paymentsResult = await client.query(paymentsQuery, [officer_no, fiscal_year]); 
        const payments = paymentsResult.rows;

        if (payments.length === 0) {
             console.log('No payments found for officer_no: ', officer_no, 'in fiscal year: ', fiscal_year);
             res.status(404).json({
                status: 'fail',
                message: 'Payments not found his businesses',
                data: {}
            });
            return
        }

        console.log('payments found:')
        let totActuals: number = 0;

        for (let i = 0; i < payments.length; i++) {
            console.log('payment:', payments[i].monthpaid, payments[i].paidamount, payments[i].officer_no)

            const payment = payments[i]; // Get the payment object
            const { monthpaid, paidamount, fiscal_year } = payment;
        
            // Convert paidAmount to a number
            const paidAmountNum = parseFloat(paidamount);
            console.log('paidAmount: ', paidAmountNum)

            if (isNaN(paidAmountNum)) {
                console.error('Invalid paidAmount:', paidamount);
                continue; // Skip this payment if it's invalid
            }

            totActuals += paidAmountNum
            console.log('totActuals:', totActuals)
        
            // Update the actual total
            actualTotal += paidAmountNum;
        
            // Convert monthpaid to lowercase and construct the monthColumn
            const monthColumn = `${monthpaid.toLowerCase()}_actual`;

            const updateQuery = `
                UPDATE officerbudget 
                SET ${monthColumn} = ${monthColumn} + $1, 
                    actual_total = $2, 
                    outstanding = annual_budget - $2 
                WHERE officer_name = $3 AND fiscal_year = $4
            `;

            // Log the constructed query and parameters for debugging
            console.log('Update Query:', updateQuery);
            console.log('Parameters:', [paidAmountNum, actualTotal, officerName.rows[0].officer_name, fiscal_year]);

            // Execute the update query
            await client.query(updateQuery, [paidAmountNum, actualTotal, officerName.rows[0].officer_name, fiscal_year]);


            // Check if the update query was successful
            console.log('updateQuery.length: ', updateQuery.length)
            if (updateQuery.length === 0) {
                console.error('Error updating officerbudget for month:', monthpaid);
                res.status(404).json({
                    status: 'fail',
                    message: 'Error updating officerbudget for month:', monthpaid,
                    data: {}
                });
            }
        }
    
        console.log('update officerbudget successful!!!!')

        console.log('final totActuals: ', totActuals)
       //////////////End of the updateOfficerBudget function//////////////////

       
        // // Send email to officer
        // const officerEmail = await pool.query(`
        //     SELECT email FROM officer 
        //     WHERE officer_no = $1`, [officer_no]);

        // if (officerEmail.rows.length === 0) {
        //     res.status(404).send('Officer email not found');
        //     return;
        // }

        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: emailUser,
        //         pass: emailPassword
        //     }
        // });

        // const mailOptions: SendMailOptions = {
        //     from: emailUser,
        //     to: officerEmail.rows[0].email,
        //     subject: 'RevMonitor - Budget Updated',
        //     text: `Your budget for ${fiscal_year} has been updated successfully. Please check your email for more details.`
        // };

        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error('Error sending email:', error);
        //     } else {
        //         console.log('Email sent:', info.messageId);
        //     }
        // });

        console.log('Sending email to officer skipped')

        res.status(200).json({
            status: 'success',
            message: 'Budget record added successfully',
            data: { /* your data here */ }
        });
        return
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding budget record');
        return
    }finally {
        client.release();
    }
});

router.post('/updateBudget', async (req: Request<{}, {}, UpdateBudgetRequest>, res: Response): Promise<void> => {
    const { officer_no, fiscal_year, month, paidAmount } = req.body;

    console.log("in router.post(/updateBudget): ", req.body);

    const client: PoolClient = await pool.connect();

    try {
        // Find officer name from officer_no
        const officerName = await client.query(`
            SELECT * FROM officer 
            WHERE officer_no = $1`, [officer_no]);

        if (officerName.rows.length === 0) {
            console.log('Officer not found')
             res.status(400).json({
                status: 'fail',
                message: 'Officer not found',
                data: {}
            });
            return
        }

        console.log('officerName.rows[0].officer_name:', officerName.rows[0].officer_name)

        // Find the corresponding month column name
        const monthColumn = `${month.toLowerCase()}_actual`;

        // Find the corresponding month budget
        const monthBudgetQuery = `
            SELECT ${monthColumn} AS budget FROM officerbudget 
            WHERE officer_name = $1 AND fiscal_year = $2
        `;
        const monthBudgetResult = await client.query(monthBudgetQuery, [officerName.rows[0].officer_name, fiscal_year]);
        const monthBudget = monthBudgetResult.rows[0].budget;

        console.log('monthBudget:', monthBudget)

        if (monthBudget === null) {
            console.log('No budget found for month:', month)
             res.status(400).json({
                status: 'fail',
                message: 'No budget found for month:', month,
                data: {}
            });
            return
        }

        // Convert paidAmount to a number
        const paidAmountNum = paidAmount;
        console.log('paidAmount: ', paidAmountNum)

        if (isNaN(paidAmountNum)) {
            console.error('Invalid paidAmount:', paidAmount);
             res.status(400).json({
                status: 'fail',
                message: 'Invalid paidAmount:', paidAmount,
                data: {}
            });
            return
        }

        // Update the actual total
        const actualTotal = monthBudget + paidAmountNum;

        // Update the corresponding month column
        const updateQuery = `
            UPDATE officerbudget 
            SET ${monthColumn} = $1, 
                actual_total = $2, 
                outstanding = annual_budget - $2 
            WHERE officer_name = $3 AND fiscal_year = $4
        `;

        // Log the constructed query and parameters for debugging
        // console.log('Update Query:', updateQuery);
        // console.log('Parameters:', [paidAmountNum, actualTotal, officerName.rows[0].officer_name, fiscal_year]);

        // Execute the update query
        const updateResult = await client.query(updateQuery, [paidAmountNum, actualTotal, officerName.rows[0].officer_name, fiscal_year]);

        console.log('updateResult:', updateResult)

        if (updateResult.rowCount === 0) {
            console.error('Error updating officerbudget for month:', month);
             res.status(400).json({
                status: 'fail',
                message: 'Error updating officerbudget for month:', month,
                data: {}
            });
            return
        }


        // The send email will be replaced by text message
        // Send email to officer
        const officerEmail = await pool.query(`
            SELECT email FROM officer 
            WHERE officer_no = $1`, [officer_no]);

        if (officerEmail.rows.length === 0) {
            res.status(404).send('Officer email not found');
            return; // Skip email if officer email not found
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPassword
            }
        });

        const mailOptions: SendMailOptions = {
            from: emailUser,
            to: officerEmail.rows[0].email,
            subject: 'RevMonitor - Budget Updated',
            text: `Your budget for ${month} has been updated successfully. Please check your email for more details.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.messageId);
            }
        });

        console.log('Sending email to officer successful')

        res.status(200).json({
            status: 'success',
            message: 'Budget record updated successfully',
            data: { /* your data here */ }
        });
        return
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating budget record');
        return
    }finally {
        client.release();
    }
});

// Function to update Officer's budget based on bus payments
async function updateOfficerBudget(officer_no: string, fiscal_year: number) {
    const client = await pool.connect();

    console.log('Updating budget for officer_no:', officer_no, 'in fiscal year:', fiscal_year);

    const officerName = await client.query(`
            SELECT officer_name FROM officer 
            WHERE officer_no = $1`, [officer_no]);

        if (officerName.rows[0].length === 0) {
            return 'Officer name not found';
        }

        console.log('officerName.rows[0].officer_name:', officerName.rows[0].officer_name)
    
    try {
        // Step 1: Fetch all payments for the given officer and fiscal year
        const paymentsQuery = `
            SELECT monthpaid, paidAmount 
            FROM buspayments 
            WHERE officer_no = $1 AND fiscal_year = $2
        `;
        const paymentsResult = await client.query(paymentsQuery, [officerName.rows[0].officer_name, fiscal_year]);
        const payments = paymentsResult.rows[0];

        if (payments.length === 0) {
            return `No payments found for officer_no: ${officer_no} in fiscal year: ${fiscal_year}.`;
        }

        console.log('payments:', payments)

        console.log('officerName.rows[0].officer_name: ', officerName.rows[0].officer_name)
        
        // Step 2: Fetch the officer's budget
        const budgetQuery = `
            SELECT * 
            FROM officerbudget 
            WHERE officer_name = $1 AND fiscal_year = $2
        `;
        const budgetResult = await client.query(budgetQuery, [officerName.rows[0].officer_name, fiscal_year]);
        const budget = budgetResult.rows[0];

        console.log('budget:', budget)

        if (!budget) {
            return `No budget found for officer_no: ${officer_no} in fiscal year: ${fiscal_year}.`;
        }

   
       return `Successfully updated budget for officer_no: ${officer_no} in fiscal year: ${fiscal_year}.`;
    } catch (error) {
        console.error('Error updating officer budget:', error);
        return `Error updating budget for officer_no: ${officer_no} in fiscal year: ${fiscal_year}.`;
    } finally {
        client.release();
    }
}

// Example usage
updateOfficerBudget('OFFICER123', 2023)
    .then(message => console.log(message))
    .catch(err => console.error(err));

export default router;