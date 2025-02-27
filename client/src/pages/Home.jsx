import React, { useState, useEffect } from 'react'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import api from '../utils/api'
import { Link } from 'react-router-dom'

const Home = () => {
  const [user, setUser] = useState(null)
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
      setCardSetFormData({
        name: ''
      })
      // Fetch updated card Set after submission
      const response = await api.get('/cardSet')
      setCardSets(response.data)
    } catch (err) {
      toast.error(err.response.data.message, {
        style: {
          border: "1px solid rgba(229, 231, 235, 0.8)",
          boxShadow: "0px 4px 6px rgba(229, 231, 235, 0.3)",
          borderRadius: "2rem",
          padding: '10px',
          color: '#f97316',
        },
        iconTheme: {
          primary: '#f97316',
          secondary: '#fff',
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
                border: "1px solid rgba(229, 231, 235, 0.8)",
                boxShadow: "0px 4px 6px rgba(229, 231, 235, 0.3)",
                borderRadius: "2rem",
                padding: '10px',
                color: '#84cc16',
              },
              iconTheme: {
                primary: '#84cc16',
                secondary: '#fff',
              },
            })
          } catch (error) {
            console.error("Error deleting card set:", error)
            toast.error(error, {
              style: {
                border: "1px solid rgba(229, 231, 235, 0.8)",
                boxShadow: "0px 4px 6px rgba(229, 231, 235, 0.3)",
                borderRadius: "2rem",
                padding: '10px',
                color: '#f97316',
              },
              iconTheme: {
                primary: '#f97316',
                secondary: '#fff',
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
      className='border pt-36 px-24'
    >
      <Toaster position="top-right" />
      <h1>Home Peyds</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi sequi </p>
      {/* Greeting */}
      {/* <h2>Hello {user?.username}</h2> */}
      {/* Add Card Set Form */}
      <form onSubmit={handleCardSetSubmit} className='border p-4'>
        <input
          type="text"
          placeholder="Name"
          value={cardSetFormData.name}
          onChange={(e) => setCardSetFormData({ ...cardSetFormData, name: e.target.value })}
          className='rounded-md px-3 py-1.5 border'
        />
        {/* Submit Button */}
        <button type="submit" disabled={cardSetLoading} className='rounded-md px-3 py-1.5 border'>
          {cardSetLoading ? 'Submitting...' : 'Add card set'}
        </button>
      </form>
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
