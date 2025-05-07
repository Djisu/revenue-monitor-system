// db.ts
import dotenv from 'dotenv';
import pkg, { Client as PgClient } from 'pg'; // Import the entire package and rename Client to PgClient

const path: string = ''

console.log('in db.ts')
// Load environment variables based on NODE_ENV
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

console.log('path: ', path)

// PostgreSQL connection configuration
interface DbConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

const dbConfig: DbConfig = {
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string, 10) || 5432,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
};

console.log('dbConfig: ', dbConfig)

// Function to create a new client
export const createClient = (): PgClient => {
    return new pkg.Client(dbConfig); // Use pkg.Client to create a new client instance
};

// // Function to test the client connection
// export const testClientConnection = async (): Promise<void> => {
//     const client = createClient();

//     try {
//         await client.connect();
//         console.log('Connected to the database successfully.');

//         // Perform a simple query to fetch the current database time
//         const currentTimeRes = await client.query('SELECT NOW()');
//         console.log('Current database time:', currentTimeRes.rows[0].now);

//         // Perform a sample query to fetch data from a table
//         const sampleQueryRes = await client.query('SELECT * FROM business LIMIT 10');
//         console.log('Sample data from your_table_name:', sampleQueryRes.rows);
//     } catch (err: any) {
//         console.error('Connection error:', err.stack);
//     } finally {
//         await client.end();
//         console.log('Database connection closed.');
//     }
// };

// // Uncomment the following line to test the connection when you run the file
//  testClientConnection();