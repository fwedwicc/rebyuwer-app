import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Nav } from './components/ui'
import { Login, Register, Home, Admin, Cards, Play, Settings, NoPage } from './pages'
import Auth from './routes/Auth'

const App = () => {
  const location = useLocation()

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/register' && <Nav />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Auth><Home /></Auth>} />
        <Route path="/settings" element={<Auth><Settings /></Auth>} />
        <Route path="/admin" element={<Auth><Admin /></Auth>} />
        <Route path="/card-set/:id" element={<Auth><Cards /></Auth>} />
        <Route path="/play/:id" element={<Auth><Play /></Auth>} />
        <Route path="*" element={<NoPage />} />
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
