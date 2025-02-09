import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { register, login, logout } from '../controller/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', authenticate, logout)

export default router