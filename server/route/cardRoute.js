import express from 'express'
import { addCards, getCards, editCard, deleteCard } from "../controller/cardController.js"
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/:cardSetId', authenticate, addCards)
router.get('/:cardSetId', authenticate, getCards)
router.put('/:cardSetId/:cardId', authenticate, editCard)
router.delete('/:cardSetId/:cardId', authenticate, deleteCard)

export default router
