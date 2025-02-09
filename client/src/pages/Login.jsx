import React from 'react'

const Login = () => {
  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')

  // Redirect to admin page if user is an admin or home page if default user
  // if (token) {
  //   if (userType === 'admin') {
  //     return <Navigate to="/admin" />
  //   }
  //   return <Navigate to="/home" />
  // }


  return (
    <div>
      Login Peyds
    </div>
  )
}

export default Login
