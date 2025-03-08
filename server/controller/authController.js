import User from '../model/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { username, password, confirmPassword, userType } = req.body

    // Validate the input
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    // Password length check
    if (password.length < 8) {
      return res.status(400).json({ message: 'Use at least 8 characters' })
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Use at least 1 uppercase' })
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return res.status(400).json({ message: 'Use at least 1 number' })
    }

    // Check for at least one special character
    if (!/[\W_]/.test(password)) {
      return res.status(400).json({ message: 'Use at least 1 special character' })
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create a new user and save it
    const newUser = new User({
      username,
      password: hashedPassword,
      userType
    })
    await newUser.save()

    // Generate a token
    const token = jwt.sign(
      { id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '2h' }
    )

    // Send the response
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        userType: newUser.userType
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if the user exists
    const existingUser = await User.findOne({ username })
    if (!existingUser) {
      return res.status(404).json({ message: 'Invalid credentials' })
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    await existingUser.save()

    // Generate token
    const token = jwt.sign({ id: existingUser._id, userType: existingUser.userType }, process.env.JWT_SECRET, { expiresIn: '20s' })

    res.status(200).json({ message: 'Login successful', result: existingUser, token, userType: existingUser.userType })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Logout Controller
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
}