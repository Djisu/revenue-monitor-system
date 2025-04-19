// db.ts
import dotenv from 'dotenv';
import pkg from 'pg'; // Import the entire package and rename Client to PgClient
// Load environment variables based on NODE_ENV
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});
const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
// Function to create a new client
export const createClient = () => {
    return new pkg.Client(dbConfig); // Use pkg.Client to create a new client instance
};
//# sourceMappingURL=db.js.map