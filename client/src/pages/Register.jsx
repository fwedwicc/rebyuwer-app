import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'

const Register = () => {

  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')

  // Once logged in, user hasnt able to access the register page
  if (token) {
    if (userType === 'admin') {
      return <Navigate to="/admin" />
    }
    return <Navigate to="/" />
  }

  return (
    <div>
      Register Peyds
    </div>
  )
}

export default Register
