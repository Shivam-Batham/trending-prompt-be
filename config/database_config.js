import dotenv from 'dotenv';
dotenv.config();

export const database_connection_string = process.env.DATABASE_URI;
export const database_name = process.env.DATABASE_NAME;