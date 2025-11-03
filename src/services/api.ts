import axios from 'axios'
console.log(process.env.NEXT_PUBLIC_API_URL)
export const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
})
api.interceptors.request.use((config) => {
  cookieStore.set('token', 'Bearer' + config.headers?.Authorization || '')
  return config
})
api.interceptors.response.use((response) => {
  if (response.status === 401) {
    console.warn('Unauthorized! Please log in again.')
  }
  return Promise.reject(response)
})
