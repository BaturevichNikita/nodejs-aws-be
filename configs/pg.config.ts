import { ClientConfig } from 'pg';

const { PG_USER, PG_HOST, PG_PASSWORD, PG_DB_NAME, PG_PORT, PG_TIMEOUT } = process.env;

const PG_CONFIG: ClientConfig = {
    user: PG_USER,
    host: PG_HOST,
    password: PG_PASSWORD,
    database: PG_DB_NAME,
    port: +PG_PORT,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: +PG_TIMEOUT,
};

export default PG_CONFIG;
