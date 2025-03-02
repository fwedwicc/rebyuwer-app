import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import Swal from 'sweetalert2'
import api from '../../utils/api'

const Nav = () => {
  const location = useLocation()
  const [cardSetNameLoading, setCardSetNameLoading] = useState(true)
  const [cardSetName, setCardSetName] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState(null)
  const dropdownRef = useRef(null)

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

  // Fetch Card Set Details
  useEffect(() => {
    const match = location.pathname.match(/^\/card-set\/([a-zA-Z0-9]+)$/)
    if (!match) return // If no ID in the URL, do nothing

    const id = match[1] // Extract the ID from URL
    setCardSetNameLoading(true)

    const fetchCardSetDetails = async () => {
      try {
        const response = await api.get(`/cardSet`)
        const currentCardSet = response.data.find(set => set._id === id)

        if (currentCardSet) {
          setCardSetName(currentCardSet.name)
          setCardSetNameLoading(false)
        }
      } catch (error) {
        console.log("Error fetching cards:", error)
      }
    }

    fetchCardSetDetails()
  }, [location.pathname])

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
      className='fixed z-50 mt-4 transform -translate-x-1/2 left-1/2 inline-flex gap-1 border border-stone-900 bg-stone-900/30 backdrop-blur-md p-1 rounded-full'
    >
      {/* Home */}
      <Link to='/' className='relative overflow-hidden flex items-center justify-center p-[1px] rounded-full'>
        {location.pathname === '/' && (
          <span
            className={`absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]`}
          />
        )}
        <span className={`inline-flex h-full w-full items-center justify-center transition duration-300 ease-in-out rounded-full bg-stone-950 text-stone-200 md:text-base text-sm backdrop-blur-3xl gap-3 px-4 py-1 ${location.pathname === '/' ? '' : 'border border-stone-800'}`}>
          Home
        </span>
      </Link>
      {/* Card Set name */}
      <AnimatePresence initial={false}>
        {location.pathname.includes('card-set') && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0,
              transition: { duration: 0.3 },
            }}
            transition={{
              duration: 0.2,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
            }}
            className='relative overflow-hidden flex items-center justify-center p-[1px] rounded-full'
          >
            <span
              className={`absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]`}
            />
            <span
              className={`inline-flex h-full w-full items-center justify-center transition duration-300 ease-in-out rounded-full bg-stone-950 text-stone-200 backdrop-blur-3xl gap-3 px-4 py-1`}
            >
              {cardSetNameLoading ? '...' : <span className='truncate max-w-[6rem] md:text-base text-sm'>{cardSetName}</span>}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          className='flex items-center gap-2 border border-stone-800 bg-stone-950 pl-1 pr-3 py-1 rounded-full text-sm cursor-pointer'
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className='relative rounded-full size-9 flex items-center justify-center leading-none border-t border-stone-500 bg-stone-900/50 overflow-hidden'>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
            <span className='size-2 rounded-full absolute bottom-0 bg-stone-400 blur-sm' />
          </span>
          <span className='text-stone-200 md:text-base text-sm'>{user?.username || 'you'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`text-stone-600 size-4 transform transition-transform duration-300 ease-in-out ${isDropdownOpen ? 'rotate-180' : ''}`}>
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
              className="absolute right-0 mt-2.5 w-36 bg-stone-950 text-stone-200 border border-stone-800 rounded-2xl p-1.5 space-y-1"
            >
              <Link
                to="/settings"
                className="group block rounded-xl px-3 py-2 hover:bg-stone-900/50 transition duration-300 ease-in-out"
              >
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-5 text-stone-300 group-hover:rotate-90 transition-all duration-300 ease-in-out">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Settings
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 cursor-pointer rounded-xl w-full text-left px-3 py-2 hover:bg-stone-900/50 transition duration-300 ease-in-out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-5 text-stone-300 rotate-90 group-hover:rotate-270 transition-all duration-300 ease-in-out">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Nav
