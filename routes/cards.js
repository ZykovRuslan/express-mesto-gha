import { Router } from 'express';
import {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.post('/', createCard);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCard);

export default cardsRouter;
