import React, { useState, useEffect } from 'react'
import * as motion from "motion/react-client"
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { InputText, Button } from '../components/ui'
import API from '../utils/api'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)
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
    setRegisterLoading(true)

    try {
      const response = await API.post('/auth/register', { username, password, confirmPassword })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userType', response.data.userType)

      Swal.fire({
        title: "Happy Learning :)",
        text: "Account created succesfully!",
        icon: "success",
        iconColor: "#34d399",
        confirmButtonText: "Got it",
        customClass: {
          title: "swal-title",
          text: "swal-text",
          popup: "swal-popup",
          confirmButton: "swal-confirm-success",
        },
      })

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
      setRegisterLoading(false)
    }
  }

  return (
    <div className='h-screen md:pb-0 pb-14 flex items-center justify-center p-4'>
      <Toaster position="top-right" />
      <motion.div
        className='bg-gradient-to-r from-violet-200 via-violet-400 to-indigo-600 bg-[length:150%_150%] animate-gradientMove shadow-2xl shadow-indigo-500/20 p-[1px] rounded-[2.2rem] w-full max-w-md'
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.2,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
        }}
      >
        <div className='p-8 border-stone-900 bg-stone-950 rounded-[2.2rem]'>
          <h1>Get Started :)</h1>
          <span>Create an account.</span>
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
            <div className='w-full space-y-1'>
              <label class="block text-sm font-medium text-stone-300 ml-1">Confirm password</label>
              <InputText
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full'
              />
            </div>
            <Button type='submit' variant={'primary'} disabled={registerLoading} className='mt-4'>{registerLoading ? 'Setting up' : 'Register'}</Button>
            <p className='text-sm'>Already have an account?
              <Link to='/login' className='text-center text-indigo-400 flex items-end gap-[1px]'>
                Login here
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

export default Register
