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

      console.log('📊 Resultado:', result)

      if (!result?.ok) {
        throw new Error(result?.error || 'Erro ao autenticar')
      }

      return result
    },
    onSuccess: () => {
      console.log('✅ Login bem-sucedido!')
      toast.success('Bem-vindo')
      // window.location.href = '/dashBoard'
    },
    onError(error) {
      console.error('❌ Erro:', error)
      toast.error('Email ou senha incorretos')
    },
  })

  return { loginUser }
}
