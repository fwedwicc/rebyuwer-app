import React, { useState, useEffect } from 'react'
import * as motion from "motion/react-client"
import { useNavigate, Navigate, Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import API from '../utils/api'
import { LoginIllustration } from '../assets'
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
      toast.error(err.response.data.message + ' :(', {
        style: {
          border: "1px solid #262626",
          background: "rgba(12, 10, 9)",
          borderRadius: "2rem",
          padding: '10px',
          paddingLeft: '13px',
          color: '#fb7185',
        },
        iconTheme: {
          primary: '#fb7185',
          secondary: '#0c0a09',
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
    <div className='h-screen md:pb-0 pb-14 flex items-center justify-center p-4'>
      <Toaster position="top-right" />
      <motion.div
        className='border border-stone-900 bg-stone-900/20 grid md:grid-cols-9 grid-cols-1 w-full max-w-4xl gap-1 p-1 rounded-[2.2rem]'
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.2,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
        }}
      >
        {/* Wala lang AHYAHAHAHA */}
        <div className='w-full col-span-1 md:col-span-5 rounded-4xl md:h-auto h-[10rem] p-[1.5px] bg-gradient-to-r from-violet-200 via-violet-400 to-indigo-600 bg-[length:150%_150%] animate-gradientMove shadow-2xl shadow-indigo-500/20'>
          <div className='flex flex-col justify-between h-full rounded-[1.9rem] bg-stone-950 relative overflow-hidden'>
            <img src={LoginIllustration} alt="Login Illustration" className='absolute w-full h-full object-cover rounded-[1.9rem] z-10' />
            <div className='absolute -top-8 -left-8 md:h-40 h-24 md:w-78 w-56 rounded-r-full bg-stone-950 z-20 blur-xl' />
            <div className='p-4 z-30'>
              <p className='md:text-base text-sm text-stone-300'>Review, Memorize, and Succeed!</p>
              <h2>Rebyuwer :)</h2>
            </div>
            <div className='absolute -bottom-8 -left-8 md:h-36 h-24 md:w-64 w-56 rounded-r-full md:bg-stone-50 bg-stone-950 z-20 blur-xl' />
            <div className='p-4 -space-y-[2px] z-30'>
              <p className='text-sm md:text-stone-800 text-stone-200 flex items-center gap-[4px]'>
                Made with
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                by
              </p>
              <a href="https://fm-linktree.vercel.app" target="_blank" rel="noopener noreferrer" className='md:text-indigo-500 text-indigo-400 text-sm flex items-end gap-[1px]'>
                Frederick Moreno
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5 mb-[2px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        {/* Login Form */}
        <div className='rounded-4xl p-8 col-span-1 md:col-span-4 border border-stone-900'>
          <span>Sign in to continue!</span>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6 mt-9'>
            <div className='w-full space-y-1'>
              <label class="block text-sm font-medium text-stone-300 ml-1">Username</label>
              <InputText
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full'
              />
            </div>
            <div className='w-full space-y-1'>
              <label class="block text-sm font-medium text-stone-300 ml-1">Password</label>
              <InputText
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full'
              />
            </div>
            <Button type='submit' variant={'primary'} disabled={loginLoading} className='mt-4'>{loginLoading ? 'Logging in' : 'Login'}</Button>
            <p className='text-sm'>Don't have an account?
              <Link to='/register' className='text-center text-indigo-400 flex items-end gap-[1px]'>
                Register here
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5 mb-[2px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Login