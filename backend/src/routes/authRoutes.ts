import { Router } from 'express';

const authRoutes: Router = Router();

authRoutes.get('/', (req, res) => {
  console.log('Hi! vasu');
  res.status(200).json({ name: 'vasu' });
});

export default authRoutes;
