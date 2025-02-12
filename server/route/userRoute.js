import express from 'express'
import { getCurrentUser, getUsers } from '../controller/userController.js'
import { authenticate, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authenticate, authorize(['admin']), getUsers)
router.get('/me', authenticate, getCurrentUser)

export default router