import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const Auth = ({ children }) => {
  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')
  const location = useLocation()

  // Redirect to login page if user is not logged in
  if (!token) {
    return <Navigate to="/login" />
  }

  // To not allow non-admin users to access the admin page
  if (location.pathname === '/admin' && userType !== 'admin') {
    return <Navigate to="/" />
  }

  return children
}

export default Auth