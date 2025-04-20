"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mysql = require("mysql2/promise");
var dotenv = require("dotenv");
var seedDataGenerator_1 = require("./src/routes/api/seedDataGenerator");
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var numBusinesses, businesses, connection, _i, businesses_1, business, query, values, resultHeader, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    numBusinesses = 140;
                    businesses = (0, seedDataGenerator_1.generateBusinessData)(141, numBusinesses);
                    dotenv.config();
                    return [4 /*yield*/, mysql.createConnection({
                            host: process.env.DB_HOST || 'localhost',
                            user: process.env.DB_USER || 'root',
                            password: process.env.DB_PASSWORD || '',
                            database: process.env.DB_NAME || 'revmonitor',
                            connectionLimit: 10,
                            waitForConnections: true,
                            queueLimit: 0
                        })];
                case 1:
                    connection = _a.sent();
                    _i = 0, businesses_1 = businesses;
                    _a.label = 2;
                case 2:
                    if (!(_i < businesses_1.length)) return [3 /*break*/, 5];
                    business = businesses_1[_i];
                    query = "\n                INSERT INTO tb_business (buss_no, buss_name, buss_address, buss_type, buss_town, street_name, landmark, electroral_area, property_class, tot_grade, ceo, telno, strategiclocation, productvariety, businesspopularity, businessenvironment, sizeofbusiness, numberofworkingdays, businessoperatingperiod, competitorsavailable, assessmentby, transdate, balance, status, current_rate, property_rate, totalmarks, emailaddress, noofemployees, noofbranches, BALANCENEW, gps_address)\n                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n            ";
                    values = [
                        business.buss_no, business.buss_name, business.buss_address, business.buss_type, business.buss_town, business.street_name, business.landmark, business.electroral_area, business.property_class, business.tot_grade, business.ceo, business.telno, business.strategiclocation, business.productvariety, business.businesspopularity, business.businessenvironment, business.sizeofbusiness, business.numberofworkingdays, business.businessoperatingperiod, business.competitorsavailable, business.assessmentby, business.transdate, business.balance, business.status, business.current_rate, business.property_rate, business.totalmarks, business.emailaddress, business.noofemployees, business.noofbranches, business.BALANCENEW, business.gps_address
                    ];
                    return [4 /*yield*/, connection.execute(query, values)];
                case 3:
                    resultHeader = (_a.sent())[0];
                    // Check if the insert was successful
                    if (resultHeader && resultHeader.insertId !== undefined) {
                        console.log("Inserted business with buss_no: ".concat(business.buss_no, " and insertId: ").concat(resultHeader.insertId));
                    }
                    else {
                        console.log("Inserted business with buss_no: ".concat(business.buss_no, " but insertId is undefined"));
                    }
                    // Alternatively, check affectedRows
                    if (resultHeader && resultHeader.affectedRows > 0) {
                        console.log("Successfully inserted business with buss_no: ".concat(business.buss_no));
                    }
                    else {
                        console.log("Failed to insert business with buss_no: ".concat(business.buss_no));
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: 
                // Close the connection
                return [4 /*yield*/, connection.end()];
                case 6:
                    // Close the connection
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    console.error('Error seeding business data:', err_1);
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Call the function to seed the database
seedDatabase();
// import express, { Request, Response } from 'express';
// import { createConnection } from 'mysql2/promise';
// import * as dotenv from 'dotenv';
// import {generateBusinessData} from './src/routes/api/seedDataGenerator';
// async function seedDatabase() {
//     try {
//         // Define the number of businesses to seed
//         const numBusinesses = 140;
//         const businesses = generateBusinessData(141, numBusinesses);
//          dotenv.config();
//         // Create a connection to the database
//         const connection = await createConnection({
//             host: process.env.DB_HOST || 'localhost',
//             user: process.env.DB_USER || 'root',
//             password: process.env.DB_PASSWORD || '',
//             database: process.env.DB_NAME || 'revmonitor',
//             connectionLimit: 10,
//             waitForConnections: true,
//             queueLimit: 0,
//         });
//         // Insert each business into the tb_business table
//         for (const business of businesses) {
//             const query = `
//                 INSERT INTO tb_business (buss_no, buss_name, buss_address, buss_type, buss_town, street_name, landmark, electroral_area, property_class, tot_grade, ceo, telno, strategiclocation, productvariety, businesspopularity, businessenvironment, sizeofbusiness, numberofworkingdays, businessoperatingperiod, competitorsavailable, assessmentby, transdate, balance, status, current_rate, property_rate, totalmarks, emailaddress, noofemployees, noofbranches, BALANCENEW, gps_address)
//                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//             `;
//             const values = [
//                 business.buss_no, business.buss_name, business.buss_address, business.buss_type, business.buss_town, business.street_name, business.landmark, business.electroral_area, business.property_class, business.tot_grade, business.ceo, business.telno, business.strategiclocation, business.productvariety, business.businesspopularity, business.businessenvironment, business.sizeofbusiness, business.numberofworkingdays, business.businessoperatingperiod, business.competitorsavailable, business.assessmentby, business.transdate, business.balance, business.status, business.current_rate, business.property_rate, business.totalmarks, business.emailaddress, business.noofemployees, business.noofbranches, business.BALANCENEW, business.gps_address
//             ];
//             // Execute the query
//             const [resultHeader] = await connection.execute(query, values);
//             // Check if the insert was successful
//             if (resultHeader && (resultHeader as any).insertId !== undefined) {
//                 console.log(`Inserted business with buss_no: ${business.buss_no} and insertId: ${(resultHeader as any).insertId}`);
//             } else {
//                 console.log(`Inserted business with buss_no: ${business.buss_no} but insertId is undefined`);
//             }
//             // Alternatively, check affectedRows
//             if (resultHeader && (resultHeader as any).affectedRows > 0) {
//                 console.log(`Successfully inserted business with buss_no: ${business.buss_no}`);
//             } else {
//                 console.log(`Failed to insert business with buss_no: ${business.buss_no}`);
//             }
//         }
//         // Close the connection
//         await connection.end();
//     } catch (err) {
//         console.error('Error seeding business data:', err);
//         process.exit(1);
//     }
// }
// // Call the function to seed the database
// seedDatabase();
// // //import { generateBusinessData } from '../backend/seedDataGenerator';  //'./ seedDataGenerator';
// // import {generateBusinessData} from './src/routes/api/seedDataGenerator';
// // import { createConnection } from 'mysql2/promise';
// // import * as dotenv from 'dotenv';
// // dotenv.config();
// // async function seedDatabase() {
// //     try {
// //         // Define the number of businesses to seed
// //         const numBusinesses = 140;
// //         const businesses = generateBusinessData(141, numBusinesses);
// //         dotenv.config();
// //         // Create a connection to the database
// //         const connection = await createConnection({
// //             host: process.env.DB_HOST || 'localhost',
// //             user: process.env.DB_USER || 'root',
// //             password: process.env.DB_PASSWORD || '',
// //             database: process.env.DB_NAME || 'revmonitor',
// //             connectionLimit: 10,
// //             waitForConnections: true,
// //             queueLimit: 0,
// //         });
// //         // Insert each business into the tb_business table
// //         for (const business of businesses) {
// //             const query = `
// //                 INSERT INTO tb_business (buss_no, buss_name, buss_address, buss_type, buss_town, street_name, landmark, electroral_area, property_class, tot_grade, ceo, telno, strategiclocation, productvariety, businesspopularity, businessenvironment, sizeofbusiness, numberofworkingdays, businessoperatingperiod, competitorsavailable, assessmentby, transdate, balance, status, current_rate, property_rate, totalmarks, emailaddress, noofemployees, noofbranches, BALANCENEW, gps_address)
// //                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// //             `;
// //             const values = [
// //                 business.buss_no, business.buss_name, business.buss_address, business.buss_type, business.buss_town, business.street_name, business.landmark, business.electroral_area, business.property_class, business.tot_grade, business.ceo, business.telno, business.strategiclocation, business.productvariety, business.businesspopularity, business.businessenvironment, business.sizeofbusiness, business.numberofworkingdays, business.businessoperatingperiod, business.competitorsavailable, business.assessmentby, business.transdate, business.balance, business.status, business.current_rate, business.property_rate, business.totalmarks, business.emailaddress, business.noofemployees, business.noofbranches, business.BALANCENEW, business.gps_address
// //             ];
// //             // Execute the query
// //             const [resultHeader, _] = await connection.execute(query, values);
// //             // Check if the insert was successful
// //             if (resultHeader && (resultHeader as any).insertId !== undefined) {
// //                 console.log(`Inserted business with buss_no: ${business.buss_no} and insertId: ${(resultHeader as any).insertId}`);
// //             } else {
// //                 console.log(`Inserted business with buss_no: ${business.buss_no} but insertId is undefined`);
// //             }
// //             // Alternatively, check affectedRows
// //             if (resultHeader && (resultHeader as any).affectedRows > 0) {
// //                 console.log(`Successfully inserted business with buss_no: ${business.buss_no}`);
// //             } else {
// //                 console.log(`Failed to insert business with buss_no: ${business.buss_no}`);
// //             }
// //         }
// //         // Close the connection
// //         await connection.end();
// //     } catch (err) {
// //         console.error('Error seeding business data:', err);
// //         process.exit(1);
// //     }
// // }
// // // Call the function to seed the database
// // seedDatabase();
