import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const Admin = () => {
  const [users, setUsers] = useState([])

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/user') // Fetch only the logged-in user's cards
        setUsers(response.data)
      } catch (error) {
        console.log('Error fetching users:', error)
      }
    }

    fetchUsers()
    const interval = setInterval(fetchUsers, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h1>Admin PeydsAdmin</h1>
      <ul className="divide-y">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
              <p>username: {user.username}</p>
              <p>usertype: {user.userType}</p>
            </li>
          ))
        ) : (
          <li>No users available</li>
        )}
      </ul>
    </div>
  )
}

export default Admin
