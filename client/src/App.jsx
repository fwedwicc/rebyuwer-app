import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Nav } from './components/ui'
import { Login, Register, Home, Admin, Cards, Play, Settings, NoPage } from './pages'
import Auth from './routes/Auth'

const App = () => {
  const location = useLocation()

  return (
    <>
      {location.pathname !== '/' && location.pathname !== '/register' && location.pathname !== '*' && <Nav />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Auth><Home /></Auth>} />
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
