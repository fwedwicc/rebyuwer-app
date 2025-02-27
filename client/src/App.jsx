import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Nav } from './components/ui'
import { Login, Register, Home, Admin, Cards } from './pages'
import Auth from './routes/Auth'

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Auth><Home /></Auth>} />
        <Route path="/admin" element={<Auth><Admin /></Auth>} />
        <Route path="/card-set/:id" element={<Auth><Cards /></Auth>} />
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
