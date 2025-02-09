import axios from 'axios'

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Axios request interceptor to attach the token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Axios response interceptor to handle token expiration
api.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response && error.response.status === 401) {
    // Store flag in localStorage
    localStorage.setItem('sessionExpired', 'true')
    // Remove token from local storage
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    // Redirect to login page
    window.location.href = '/'
  } else {
    console.log("Error response: ", error.response)  // Log error details
  }
  return Promise.reject(error)
})


export default api