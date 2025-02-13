import express from 'express'
import { addCards, getCards, deleteCard } from "../controller/cardController.js"
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/:cardSetId', authenticate, addCards)
router.get('/:cardSetId', authenticate, getCards)
router.delete('/:cardSetId/:cardId', authenticate, deleteCard)

export default router
