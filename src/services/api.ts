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
 * Pega o accessToken da sessão do NextAuth no cliente.
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession()

      console.log('🔐 Sessão completa:', session)
      console.log('🔑 AccessToken:', session?.accessToken)

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`
        console.log('✅ Authorization header adicionado:', config.headers.Authorization)
      } else {
        console.warn('⚠️ Nenhum accessToken encontrado na sessão')
      }
    } catch (error) {
      console.error('❌ Erro ao pegar sessão:', error)
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
  (response) => {
    console.log('✅ Response recebido:', response.status)
    return response
  },
  (error) => {
    console.error('❌ Erro na response:', error.response?.status)

    if (error.response?.status === 401) {
      console.warn('⚠️ Token expirado ou não autorizado.')
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
