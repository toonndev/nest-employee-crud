import 'dotenv/config';

export const POSTGRESQL = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5432',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'employee_crud',
  schema: process.env.DB_SCHEMA || 'public',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === 'true',
  logging: process.env.DB_LOGGING === 'true',
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
};
