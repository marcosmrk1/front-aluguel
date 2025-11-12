import { useMutation } from '@tanstack/react-query'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'

export const usePostAuthGoogle = () => {
  const loginWithGoogle = useMutation({
    mutationFn: async () => {
      const result = await signIn('google', {
        callbackUrl: '/dashBoard?login=true',
        redirect: true,
      })
      return result
    },
    onError: (error) => {
      console.error('Erro ao autenticar com Google:', error)
      toast.error('Erro ao autenticar com Google')
    },
  })

  return { loginWithGoogle }
}
