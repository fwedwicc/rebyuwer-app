import React, { useEffect, useState, useRef } from 'react'
import api from '../../utils/api'
import { useParams, Link, useLocation } from 'react-router-dom'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import Swal from 'sweetalert2'

const Nav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState(null)
  const dropdownRef = useRef(null)
  const location = useLocation()

  // Handle the logout func
  const handleLogout = () => {
    setIsDropdownOpen(false)
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

  // Close the dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className='fixed w-full flex items-center justify-center mt-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          scale: 0,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
        }}
        className='flex gap-1 border p-1 rounded-full'
      >
        {/* Home */}
        <Link to='/' className='border flex items-center justify-center px-4 py-1 rounded-full'>Home</Link>
        {/* Card Set name */}
        <AnimatePresence initial={false}>
          {location.pathname.includes('card-set') && (
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
              className='border flex items-center justify-center px-4 py-1 rounded-full'
            >
              Cardsetname
            </motion.div>
          )}
        </AnimatePresence>
        {/* Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className='flex items-center gap-2 border pl-1 pr-3 py-1 rounded-full text-sm'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className='block rounded-full size-9 border'></span>
            {user?.username}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-4 transform transition-transform duration-300 ease-in-out ${isDropdownOpen ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {/* Dropdown menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-36 bg-stone-950 border rounded-2xl p-2"
              >
                <Link
                  to="/settings"
                  className="block rounded-xl px-3 py-1 hover:bg-stone-900 transition duration-300 ease-in-out"
                >
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>Settings</button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block rounded-xl w-full text-left px-3 py-1 hover:bg-stone-900 transition duration-300 ease-in-out"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default Nav
