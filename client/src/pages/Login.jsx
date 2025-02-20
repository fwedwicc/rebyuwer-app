import React, { useState, useEffect } from 'react'
import * as motion from "motion/react-client"
import { useNavigate, Navigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import API from '../utils/api'
import { InputText, Button } from '../components/ui'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
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
    setLoginLoading(true)

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
      toast.error(err.response.data.message, {
        style: {
          border: "1px solid rgba(229, 231, 235, 0.8)", // border-neutral-200/80
          boxShadow: "0px 4px 6px rgba(229, 231, 235, 0.3)", // shadow-md shadow-neutral-200/30
          borderRadius: "2rem",
          padding: '10px',
          paddingY: '20px',
          color: '#ef4444',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      })
    } finally {
      setLoginLoading(false)
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
      <Toaster position="top-right" reverseOrder={true} />
      <motion.div
        className='bg-white shadow-lg border border-neutral-200/80 shadow-neutral-100 rounded-4xl p-12 w-full max-w-sm'
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
        }}
      >
        <h1>Login Peyds</h1>
        <span>Maglogin ka na bhie.</span>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 mt-9'>
          <InputText
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputText
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type='submit' disabled={loginLoading} className='mt-4'>{loginLoading ? 'Logging in' : 'Login'}</Button>
        </form>
      </motion.div>

    </div>
  )
}

export default Login