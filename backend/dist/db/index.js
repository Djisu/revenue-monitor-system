import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();
let sslConfig;
if (process.env.NODE_ENV === 'production') {
    sslConfig = { rejectUnauthorized: true }; // Important for Render.com
}
else {
    sslConfig = false;
}
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: sslConfig,
};
const pool = new Pool(dbConfig);
export default pool;
// import { Pool, QueryResult } from 'pg';
// import colors from 'colors';
// const dbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: parseInt(process.env.DB_PORT || '5432'),
// };
// console.log(colors.green('PostgreSQL configuration:'), dbConfig);
// const pool = new Pool(dbConfig);
// export const query = async (
//   text: string,
//   params?: unknown[]
// ): Promise<QueryResult> => {
//   try {
//     const result = await pool.query(text, params);
//     return result;
//   } catch (error) {
//     console.error(colors.red('PostgreSQL query error:'), error);
//     throw error;
//   }
// };
//# sourceMappingURL=index.js.map