import { Router } from 'express';
import usersRouter from './users.js';
import cardsRouter from './cards.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

export default router;
