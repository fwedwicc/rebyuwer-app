import React, { useState, useEffect } from 'react'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import { Button } from '../components/ui'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import api from '../utils/api'
import { Link } from 'react-router-dom'

const Home = () => {
  const [cardSets, setCardSets] = useState([])

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


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='pt-36 px-24 pb-24 space-y-12'
    >
      <Toaster position="top-right" />
      <div className='flex flex-col items-center gap-2'>
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
            className='w-full h-13 border border-stone-800 rounded-full pl-12 pr-38 focus:shadow-2xl focus:shadow-indigo-500/20 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300 ease-in-out'
          />
          {/* Submit Button */}
          <Button type="submit" disabled={cardSetLoading} variant={'primary'} className='absolute transform -translate-y-1/2 top-1/2 right-[6.3px]'>
            {cardSetLoading ? 'Submitting...' : 'Add card set'}
          </Button>
        </form>
      </div>
      {/* Card Sets */}
      ilan na? {cardSets.length}
      <div className='border p-4'>
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
                  scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
                }}
                layout
                key={set._id}
                className='block border p-4'
              >
                <p>Name: {set.name}</p>
                <p>Card count: {set.cards.length}</p>
                <Link to={`/card-set/${set._id}`} className='rounded-md px-3 py-1.5 border'>View</Link>
                <button onClick={() => handleDeleteCardSet(set._id)} className='rounded-md px-3 py-1.5 border'>Delete</button>
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
