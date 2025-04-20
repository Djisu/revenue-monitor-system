// db.ts
import dotenv from 'dotenv';
import pkg, { Client as PgClient } from 'pg'; // Import the entire package and rename Client to PgClient

// Load environment variables based on NODE_ENV
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

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

// Function to create a new client
export const createClient = (): PgClient => {
    return new pkg.Client(dbConfig); // Use pkg.Client to create a new client instance
};