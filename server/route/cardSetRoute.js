import express from 'express'
import { getCardSets, addCardSet, deleteCardSet } from "../controller/cardSetController.js"
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authenticate, getCardSets)
router.post('/', authenticate, addCardSet)
router.delete('/:id', authenticate, deleteCardSet)

export default router