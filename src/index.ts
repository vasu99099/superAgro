import express from 'express';
import expressInit from './lib/expressInit';

const app = express();

(async () => {
  await expressInit(app);
})();
