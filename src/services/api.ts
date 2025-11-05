import axios from 'axios'
import { getSession } from 'next-auth/react'

/**
 * Instância global do Axios configurada para comunicação com o backend.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de Request — executa ANTES de cada requisição.
 * Pega o token do NextAuth e injeta no header Authorization.
 */
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  console.log(session, 'o que esta acotnecendo aqui')
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

/**
 * Interceptor de Response — trata erros e respostas.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado ou não autorizado.')
    }
    return Promise.reject(error)
  },
)
