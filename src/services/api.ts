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
 * Pega o token do NextAuth usando getSession (cliente).
 */
api.interceptors.request.use(
  async (config) => {
    // ✅ getSession funciona no cliente
    const session = await getSession()

    console.log('🔐 Sessão no interceptor:', session)
    console.log('🔑 AccessToken:', session?.accessToken)

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`
      console.log('✅ Authorization header adicionado')
    } else {
      console.warn('⚠️ Nenhum accessToken encontrado na sessão')
    }

    return config
  },
  (error) => {
    console.error('❌ Erro no interceptor de request:', error)
    return Promise.reject(error)
  },
)

/**
 * Interceptor de Response — trata erros e respostas.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expirado ou não autorizado.')
      // Opcional: redirecionar para login
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
