import dotenv from 'dotenv';
import path from 'path';

// Determine the correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;

dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

export default {
  NODE_ENV: process.env.NODE_ENV || 'dev',
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || ''
};
