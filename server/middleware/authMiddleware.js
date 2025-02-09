import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  // Check if authorization header is present
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  // Extract the token
  const token = authHeader.split(' ')[1]

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: decoded.id,
      role: decoded.userType
    }
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    return res.status(401).json({ message: 'Token invalid' })
  }
}

export const authorize = (roles) => {
  return (req, res, next) => {
    // Ensure req.user is defined before accessing req.user.role
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Forbidden: No user role found' })
    }

    // Check if user role is authorized
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Access denied' })
    }

    next()
  }
}