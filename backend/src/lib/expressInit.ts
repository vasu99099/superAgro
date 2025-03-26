import express, { Express } from 'express';
import errorHandler from '../middleware/errorHandler';
import indexRoutes from '../routes';
import config from './config';
import cors, { CorsOptions } from 'cors';
import { getUploadSignedUrl } from '../utils/S3Service';

const expressInit = async (server: Express) => {
  try {
    const PORT = config.PORT || 5000;

    const corsOptions: CorsOptions = {
      origin: config.ALLOW_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
      optionsSuccessStatus: 200
    };

    server.use(cors(corsOptions));
    server.use(express.json());
    server.use(indexRoutes);
    server.use(errorHandler);

    server.listen(PORT, () => console.log('server is running on Port: ' + PORT));
  } catch (e) {
    const error = e as Error;
    console.log('(error)=>' + error.message);
  }
};

export default expressInit;
