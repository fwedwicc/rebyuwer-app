import express from 'express'
import { getCurrentUser } from '../controller/userController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/me', authenticate, getCurrentUser)

export default router