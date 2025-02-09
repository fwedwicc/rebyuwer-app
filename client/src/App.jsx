import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login, Register, Home, Admin } from './pages'
import Auth from './routes/Auth'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<Navigate to='/home' />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Auth><Home /></Auth>} />
        <Route path="/home" element={<Auth><Admin /></Auth>} />
      </Routes>
    </>
  )
}

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

export default AppWrapper
