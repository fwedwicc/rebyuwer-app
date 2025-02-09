import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import API from '../utils/api'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')

  // Once logged in, user hasnt able to access the register page
  if (token) {
    if (userType === 'admin') {
      return <Navigate to="/admin" />
    }
    return <Navigate to="/" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await API.post('/auth/register', { username, password, confirmPassword })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userType', response.data.userType)

      if (response.data.userType === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response.data.message || 'An error occurred')
    }
  }

  return (
    <div>
      <h1>Register Peyds</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
