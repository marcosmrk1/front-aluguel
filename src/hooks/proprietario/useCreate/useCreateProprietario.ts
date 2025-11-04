import { endPointService } from '@/services/endPointService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IProprietario } from '@/.interface/IProprietario'
import { toast } from 'react-toastify'
import { handleAxiosError } from '@/utils/defaultMessagesAxios/handleAxiosError'
import { handleAxiosSuccess } from '@/utils/defaultMessagesAxios/handleAxiosSuccess'
export function useCreateProprietario() {
  const queryClient = useQueryClient()
  console.log(process.env.API_URL)

  const createUser = useMutation({
    mutationFn: (newUser: IProprietario) =>
      endPointService.create<IProprietario>('/proprietario', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proprietario'] })
      handleAxiosSuccess('Proprietário criado com sucesso!')
    },
    onError(error) {
      handleAxiosError(error, 'Erro ao criar proprietário.')
    },
  })

  return { createUser }
}
