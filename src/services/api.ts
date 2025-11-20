import axios from 'axios'

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
 * Busca o accessToken da API route /api/token (server-side).
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const res = await fetch('/api/auth/token')

      if (res.ok) {
        const { accessToken } = await res.json()

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar token:', error)
    }

    return config
  },
  (error) => {
    console.error('❌ Erro no interceptor de request:', error)
    return Promise.reject(error)
  },
)
