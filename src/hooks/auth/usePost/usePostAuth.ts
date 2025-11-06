import { IProprietarioLogin } from '@/.interface/IProprietario'
import { handleAxiosError } from '@/utils/defaultMessagesAxios/handleAxiosError'
import { useMutation } from '@tanstack/react-query'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'

export const usePostAuth = () => {
  const loginUser = useMutation({
    mutationFn: async (loginUser: IProprietarioLogin) => {
      const result = await signIn('credentials', {
        email: loginUser.email,
        password: loginUser.password,
        redirect: false,
      })
      if (!result?.ok) {
        throw new Error(result?.error || 'Erro ao autenticar')
      }

      return result
    },
    onSuccess: () => {
      toast.success('Bem-vindo')
      window.location.href = '/dashBoard'
    },
    onError(error) {
      handleAxiosError(error)
    },
  })

  return { loginUser }
}
