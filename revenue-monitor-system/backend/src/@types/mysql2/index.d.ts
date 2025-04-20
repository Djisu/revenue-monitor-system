declare module 'mysql2/promise' {
    import { Connection, QueryOptions, QueryResult, ResultSetHeader } from 'mysql2';

    interface PoolOptions {
        host?: string;
        port?: number;
        user?: string;
        password?: string;
        database?: string;
        connectionLimit?: number;
        waitForConnections?: boolean;
        queueLimit?: number;
        [key: string]: any; // Allow additional properties
    }

    interface Pool {
        getConnection(): Promise<Connection>;
        query<T = any>(sql: string, values?: any[]): Promise<[T[], FieldPacket[]]>;
        execute<T = any>(sql: string, values?: any[]): Promise<[T[], ResultSetHeader]>;
        end(): Promise<void>;
        // Add more methods as needed
    }

    interface ConnectionOptions {
        host?: string;
        user?: string;
        password?: string;
        database?: string;
        [key: string]: any; // Allow additional properties
    }

    interface Connection {
        query<T = any>(sql: string, values?: any[]): Promise<[T[], FieldPacket[]]>;
        execute<T = any>(sql: string, values?: any[]): Promise<[T[], ResultSetHeader]>;
        end(): Promise<void>;
        // Add more methods as needed
    }

    function createConnection(options: ConnectionOptions): Promise<Connection>;
    function createPool(options: PoolOptions): Pool;

    export { createConnection, createPool, Connection, QueryOptions, QueryResult, ResultSetHeader };
}