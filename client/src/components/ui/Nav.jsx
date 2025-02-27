import React, { useEffect, useState } from 'react'
import api from '../../utils/api'
import { useParams, Link } from 'react-router-dom'
import * as motion from "motion/react-client"
import Swal from 'sweetalert2'

const Nav = () => {
  const [user, setUser] = useState(null)

  // Handle the logout func
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      iconColor: "#f97316",
      showCancelButton: true,
      confirmButtonText: "ilogout mo bhie",
      cancelButtonText: "Cancel",
      customClass: {
        title: "swal-title",
        text: "swal-text",
        popup: "swal-popup",
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
    })
  }


  // Fetch the current user's data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user/me')
        setUser(response.data)
      } catch (error) {
        console.log('Error fetching user data:', error)
      }
    }

    fetchUser()
    const interval = setInterval(fetchUser, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='fixed w-full flex items-center justify-center mt-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          scale: 0,
          transition: { duration: 0.2 },
        }}
        transition={{
          duration: 0.2,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
        }}
        layout
        className='flex gap-1 border p-1 rounded-full'
      >
        <Link to='/' className='border px-4 py-2 rounded-full'>Home</Link>
        <button onClick={handleLogout} className='rounded-md px-3 py-1.5 border'>ssLogout</button>
        <p className='border px-4 py-2 rounded-full'>Cardsetname</p>
        <button className='border px-4 py-2 rounded-full'>Logged in as {user?.username}</button>
      </motion.div>
    </div>
  )
}

export default Nav
