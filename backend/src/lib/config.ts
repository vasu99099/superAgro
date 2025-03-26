import dotenv from 'dotenv';
import path from 'path';

// Determine the correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;

dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

const origins = (process.env.ALLOW_ORIGIN ?? '')?.split(',') ?? [];

export default {
  NODE_ENV: process.env.NODE_ENV || 'dev',
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  ALLOW_ORIGIN: origins,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_REGION: process.env.AWS_REGION || '',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || ''
};
