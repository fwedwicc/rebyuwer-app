import express from 'express'
import { getCardSets, addCardSet } from "../controller/cardSetController.js"
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authenticate, getCardSets)
router.post('/', authenticate, addCardSet)

export default router