import { Pool } from 'pg';
import colors from 'colors';
import * as db from '../db/index';
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'), // Default PostgreSQL port
};
console.log(colors.green('PostgreSQL configuration:'), dbConfig);
const pool = new Pool(dbConfig);
export const query = async (text, params) => {
    try {
        const result = await db.query(text, params);
        return result;
    }
    catch (error) {
        console.error(colors.red('PostgreSQL query error:'), error);
        throw error;
    }
};
// import pg from 'pg';
// // Define the type for the query function parameters
// type QueryCallback = (err: Error | null, result?: any) => void;
// const { Pool } = pg;
// // Create a new Pool instance with appropriate types
// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: 'localhost',
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: 5432,
// });
// // Add types for the text and params arguments
// export const query = (text: string, params?:  any[] | undefined : QueryCallback) => {
//     return pool.query(text, params, callback);
// };
// import pg from 'pg'
// const { Pool } = pg
// const pool = new Pool()
// export const query = (text, params, callback) => {
//   return pool.query(text, params, callback)
// }
//# sourceMappingURL=index.js.map