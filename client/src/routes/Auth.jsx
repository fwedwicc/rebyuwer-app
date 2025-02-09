import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const Auth = ({ children }) => {
  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" />
  }

  if (location.pathname === '/admin' && userType == 'admin') {
    return <Navigate to="/admin" />
  } else if (location.pathname === '/home' && userType == 'user') {
    return <Navigate to="/home" />
  }

  return children
}

export default Auth