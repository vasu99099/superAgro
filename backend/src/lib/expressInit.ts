import express, { Express } from 'express';
import dotenv from 'dotenv';
import errorHandler from '../middleware/errorHandler';
import indexRoutes from '../routes';
import config from './config';

const expressInit = async (server: Express) => {
  try {
    const PORT = config.PORT || 5000;

    server.use(errorHandler);
    server.use(express.json());
    server.use(indexRoutes);

    server.listen(PORT, () => console.log('server is running on Port: ' + PORT));
  } catch (e) {
    const error = e as Error;
    console.log('(error)=>' + error.message);
  }
};

export default expressInit;
