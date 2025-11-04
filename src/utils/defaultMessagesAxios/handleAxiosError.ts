import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

interface AxiosErrorResponse {
  messages?: string[]
}

/**
 * Exibe múltiplos toasts de erro, um para cada mensagem no array do response.
 * Se não houver response ou array de mensagens, exibe apenas a mensagem padrão.
 * @param error - O erro recebido (pode ser AxiosError ou qualquer outro erro)
 * @param defaultMessage - Mensagem padrão caso não seja possível extrair as mensagens do response
 */
export function handleAxiosError(
  error: unknown,
  defaultMessage: string = 'Erro inesperado.',
): void {
  if (error instanceof AxiosError && error.response?.data) {
    const responseData = error.response.data as AxiosErrorResponse
    const messages = responseData.messages

    if (messages && Array.isArray(messages) && messages.length > 0) {
      messages.forEach((message) => {
        toast.error(message)
      })
      return
    }
  }

  toast.error(defaultMessage)
}
