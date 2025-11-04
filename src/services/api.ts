import axios from 'axios'

/**
 * Instância configurada do Axios para comunicação com a API backend.
 * Centraliza todas as configurações de requisição HTTP, incluindo baseURL, headers padrão e interceptors.
 * ⚠️ Roda apenas no client-side (navegador). Não pode ser usado em Server Components ou Server Actions.
 */
export const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de Request executado ANTES de cada requisição HTTP ser enviada ao servidor.
 * Armazena o token de autenticação no cookieStore antes da requisição.
 * @param config - Configuração da requisição
 */
api.interceptors.request.use((config) => {
  cookieStore.set('token', 'Bearer' + config.headers?.Authorization || '')
  return config
})

/**
 * Interceptor de Response executado APÓS receber a resposta do servidor.
 * Trata respostas de sucesso e erros HTTP.
 * ⚠️ NÃO exibe toasts aqui - isso é feito nos hooks com mensagens personalizadas.
 * @param response - Resposta de sucesso (status 2xx)
 * @param error - Erro HTTP (status 4xx, 5xx) ou erro de rede
 */
api.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      console.warn('Unauthorized! Please log in again.')
    }
    return response
  },
  (error) => {
    console.warn(error)
    return Promise.reject(error)
  },
)
