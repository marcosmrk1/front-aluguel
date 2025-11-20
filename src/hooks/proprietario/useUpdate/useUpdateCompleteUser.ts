import { useMutation } from '@tanstack/react-query'
import { endPointService } from '@/services/endPointService'
import { IProprietarioCompleteProfile } from '@/.interface/IProprietario'
import { toast } from 'react-toastify'
import { handleAxiosError } from '@/utils/defaultMessagesAxios/handleAxiosError'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const useUpdateCompleteUser = () => {
  const router = useRouter()
  const { update: updateSession } = useSession()

  return useMutation({
    mutationFn: async (variables: {
      data: IProprietarioCompleteProfile
      id: number
    }) => {
      const response = await endPointService.update<IProprietarioCompleteProfile>(
        '/proprietario/social/profile-complete',
        variables.id,
        variables.data,
      )
      return response
    },
    onSuccess: async () => {
      toast.success('Perfil completado com sucesso!')
      await updateSession({ profileComplete: true })
      router.push('/dashboard?login=true')
    },
    onError: (error) => {
      console.error('❌ Erro na mutation:', error)
      handleAxiosError(error, 'Erro ao completar perfil.')
    },
  })
}

export { useUpdateCompleteUser }
