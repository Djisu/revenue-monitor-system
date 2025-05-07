import { Pool } from 'pg';
import colors from 'colors';
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
};
console.log(colors.green('PostgreSQL configuration:'), dbConfig);
const pool = new Pool(dbConfig);
export const query = async (text, params) => {
    try {
        const result = await pool.query(text, params);
        return result;
    }
    catch (error) {
        console.error(colors.red('PostgreSQL query error:'), error);
        throw error;
    }
};
//# sourceMappingURL=index.js.map