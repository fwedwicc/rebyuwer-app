import express from 'express'
import { addCards, getCards } from "../controller/cardController.js"
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/:cardSetId', authenticate, addCards)
router.get('/:cardSetId', authenticate, getCards)

export default router
