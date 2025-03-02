import React, { useState, useEffect, useRef } from 'react'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import { Button } from '../components/ui'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import api from '../utils/api'
import { Link } from 'react-router-dom'

const Home = () => {
  const [cardSets, setCardSets] = useState([])
  const [openToggles, setOpenToggles] = useState({})
  const cardToggleRefs = useRef({})

  // Card Sets Form
  const [cardSetLoading, setCardSetLoading] = useState(false)
  const [cardSetFormData, setCardSetFormData] = useState({
    name: ''
  })

  // Card Set Submit
  const handleCardSetSubmit = async (e) => {
    e.preventDefault()

    setCardSetLoading(true)

    try {
      await api.post('/cardSet', cardSetFormData)
      toast.success('Added successfully', {
        style: {
          border: "1px solid #262626",
          background: "rgba(12, 10, 9)",
          borderRadius: "2rem",
          padding: '10px',
          paddingLeft: '13px',
          color: '#84cc16',
        },
        iconTheme: {
          primary: '#84cc16',
          secondary: '#0c0a09',
        },
      })
      setCardSetFormData({
        name: ''
      })
      // Fetch updated card Set after submission
      const response = await api.get('/cardSet')
      setCardSets(response.data)
    } catch (err) {
      toast.error(err.response.data.message, {
        style: {
          border: "1px solid #262626",
          background: "rgba(12, 10, 9)",
          borderRadius: "2rem",
          padding: '10px',
          paddingLeft: '13px',
          color: '#f97316',
        },
        iconTheme: {
          primary: '#f97316',
          secondary: '#0c0a09',
        },
      })
    } finally {
      setCardSetLoading(false)
    }
  }

  // Fetch Card Set
  useEffect(() => {
    const fetchCardSets = async () => {
      try {
        const response = await api.get('/cardSet')
        setCardSets(response.data)
      } catch (error) {
        console.log('Error fetching cards:', error)
      }
    }

    fetchCardSets()
    const interval = setInterval(fetchCardSets, 5000)
    return () => clearInterval(interval)
  }, [])

  // Delete Card Set
  const handleDeleteCardSet = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "The card set will be deleted.",
      icon: "warning",
      iconColor: "#f97316",
      showCancelButton: true,
      confirmButtonText: "idelete mo bhie",
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
        (async () => {
          try {
            await api.delete(`/cardSet/${id}`)
            setCardSets((prevCardSets) => prevCardSets.filter((set) => set._id !== id))
            toast.success('Deleted successfully', {
              style: {
                border: "1px solid #262626",
                background: "rgba(12, 10, 9)",
                borderRadius: "2rem",
                padding: '10px',
                paddingLeft: '13px',
                color: '#84cc16',
              },
              iconTheme: {
                primary: '#84cc16',
                secondary: '#0c0a09',
              },
            })
          } catch (error) {
            console.error("Error deleting card set:", error)
            toast.error(error, {
              style: {
                border: "1px solid #262626",
                background: "rgba(12, 10, 9)",
                borderRadius: "2rem",
                padding: '10px',
                paddingLeft: '13px',
                color: '#f97316',
              },
              iconTheme: {
                primary: '#f97316',
                secondary: '#0c0a09',
              },
            })
          }
        })()
      }
    })
  }

  const toggleCardMenu = (id) => {
    setOpenToggles((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle only the clicked dropdown
    }))
  }

  // Close the dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close all dropdowns if click is outside any of them
      setOpenToggles((prev) => {
        const newState = { ...prev }
        Object.keys(cardToggleRefs.current).forEach((id) => {
          if (cardToggleRefs.current[id] && !cardToggleRefs.current[id].contains(event.target)) {
            newState[id] = false
          }
        })
        return newState
      })
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='md:pt-36 pt-28 md:px-24 px-4 md:pb-24 pb-4 space-y-12'
    >
      <Toaster position="top-right" />
      <div className='flex flex-col items-center gap-2'>
        {/* Greetings */}
        <h1 className='text-center'>What do you want to learn?</h1>
        <p className='text-center w-full max-w-xl'>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
        {/* Add Card Set Form */}
        <form onSubmit={handleCardSetSubmit} className='mt-5 relative w-full max-w-md'>
          {/* Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="text-stone-500 size-8 absolute transform -translate-y-1/2 top-1/2 left-2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          {/* Input Field */}
          <input
            type="text"
            placeholder="E.g. Peroidic Table"
            value={cardSetFormData.name}
            onChange={(e) => setCardSetFormData({ ...cardSetFormData, name: e.target.value })}
            className='w-full md:text-base text-sm h-13 border border-stone-800 rounded-full pl-12 md:pr-38 pr-[8.5rem] focus:shadow-2xl md:focus:shadow-indigo-500/20 focus:shadow-indigo-400/30 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300 ease-in-out'
          />
          {/* Submit Button */}
          <Button type="submit" disabled={cardSetLoading} variant={'primary'} className='absolute transform -translate-y-1/2 top-1/2 right-[6.3px]'>
            {cardSetLoading ? 'Submitting...' : 'Add card set'}
          </Button>
        </form>
      </div>
      {/* Card Sets */}
      ilan na? {cardSets.length}
      <div className='mt-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2'>
        <AnimatePresence initial={false}>
          {Array.isArray(cardSets) && cardSets.length > 0 ? (
            cardSets.map((set) => (
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
                key={set._id}
                className='group relative block border-t border-l border-stone-900 bg-stone-900/10 rounded-3xl p-2 group cursor-pointer overflow-hidden'
              >
                {/* Blur Effect */}
                {/* <div className='size-24 bg-stone-700/70 group-hover:bg-stone-700/30 group-hover:size-36 transition-all duration-500 ease-in-out absolute -m-2 -z-10 blur-3xl'></div> */}
                {/* Top Card */}
                <div className='absolute z-20 right-0'>
                  <div className="relative p-4" ref={(el) => (cardToggleRefs.current[set._id] = el)}>
                    {/* Toggle Button */}
                    <button onClick={() => toggleCardMenu(set._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                      </svg>
                    </button>
                    {/* Card Set Actions */}
                    <AnimatePresence>
                      {openToggles[set._id] && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-12 top-0 mt-2.5 w-36 bg-stone-950 text-stone-200 border border-stone-800 rounded-2xl p-1.5 space-y-1"
                        >
                          {/* <Link to={`/play/${set._id}`} className={`${set.cards.length === 0 ? 'bg-red-500' : ''}`}>Play</Link> */}
                          {/* <button onClick={() => handleDeleteCardSet(set._id)} className='rounded-md px-3 py-1.5 border'>Delete</button> */}
                          <Link
                            to={`/play/${set._id}`}
                            className="flex items-center md:text-base text-sm gap-2 rounded-xl px-3 py-2 hover:bg-stone-900/50 transition-all duration-300 ease-in-out"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-5 text-stone-300">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                            </svg>
                            Play
                          </Link>
                          <button
                            onClick={() => handleDeleteCardSet(set._id)}
                            className="flex items-center md:text-base text-sm gap-2 cursor-pointer rounded-xl w-full text-left px-3 py-2 hover:bg-stone-900/50 transition duration-300 ease-in-out"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-5 text-stone-300">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <Link to={`/card-set/${set._id}`} className='md:space-y-8 space-y-4'>
                  <div className='flex items-start'>
                    <h2 className='p-4'>{set.name}</h2>
                  </div>
                  {/* Bottom card */}
                  <div className='flex justify-between items-end'>
                    <p className='p-4'>{set.cards.length} card/s</p>
                    <span className='relative rounded-full size-9 flex items-center justify-center leading-none border-t border-stone-700 bg-stone-900/20 group-hover:bg-indigo-900/5 group-hover:border-indigo-700 transition-all duration-300 ease-in-out overflow-hidden'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-6 group-hover:rotate-45 transition-all duration-300 ease-in-out group-hover:text-indigo-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                      <span className='size-2 rounded-full absolute bottom-0 bg-stone-700 group-hover:bg-indigo-700 transition-all duration-300 ease-in-out blur-sm' />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <li>No card set available</li>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Home
