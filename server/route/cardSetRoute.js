import express from 'express'
import { getCardSets, addCardSet, editCardSet, deleteCardSet } from "../controller/cardSetController.js"
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authenticate, getCardSets)
router.post('/', authenticate, addCardSet)
router.put('/:id', authenticate, editCardSet)
router.delete('/:id', authenticate, deleteCardSet)

export default router