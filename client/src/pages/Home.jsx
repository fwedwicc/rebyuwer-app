import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const Home = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false)
  const [user, setUser] = useState(null)

  // Handle the logout func
  const handleLogout = () => {
    localStorage.removeItem('token')
    alert('Logged out successfully')
    setIsLoggedOut(true)
    window.location.href = '/login'
  }

  // Redirect to login page after logout
  // if (isLoggedOut) {
  //   window.location.href = '/login'
  // }

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
    <div>
      <h1>Home Peyds</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>Hello {user?.username}</h2>
    </div>
  )
}

export default Home
