import express, { Express } from 'express';
import errorHandler from '../middleware/errorHandler';
import indexRoutes from '../routes';
import config from './config';
import cors, { CorsOptions } from 'cors';

const expressInit = async (server: Express) => {
  try {
    const PORT = config.PORT || 5000;
    const corsOptions: CorsOptions = {
      origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        console.log('Request Origin:', origin); // Log the origin of the request
    
        if (!origin || origin === 'http://192.168.102.78:3000') {
          callback(null, true); // Allow request
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"], 
      optionsSuccessStatus: 200 // For legacy browser support
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
