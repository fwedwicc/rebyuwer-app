import React, { useState, useEffect } from 'react'
import * as motion from "motion/react-client"
import { useNavigate, Navigate } from 'react-router-dom'
import API from '../utils/api'
import { Button } from '../components/ui'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')

  // Once logged in, user hasnt able to access the login page
  if (token) {
    if (userType === 'admin') {
      return <Navigate to="/admin" />
    }
    return <Navigate to="/" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await API.post('/auth/login', { username, password })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userType', response.data.userType) // Store userType

      if (response.data.userType === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response.data.message || 'An error occurred')
    }
  }

  // Check if the session has expired
  useEffect(() => {
    const sessionExpired = localStorage.getItem("sessionExpired")

    if (sessionExpired) {
      alert("Your session has expired. Please log in again.")
      localStorage.removeItem("sessionExpired")
    }
  }, [])

  return (
    <div className='md:min-h-screen flex items-center justify-center'>
      <motion.div
        className='bg-white shadow-lg border border-neutral-200/80 shadow-neutral-100 rounded-4xl p-12 w-full max-w-sm'
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 },
        }}
      >
        <h1>Login Peyds</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='rounded-md px-3 py-1.5 border'
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='rounded-md px-3 py-1.5 border'
          />
          <Button type='submit' className='mt-4'>Login</Button>
        </form>
      </motion.div>

    </div>
  )
}

export default Login