import { endPointService } from '@/services/endPointService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleAxiosError } from '@/utils/defaultMessagesAxios/handleAxiosError'
import { handleAxiosSuccess } from '@/utils/defaultMessagesAxios/handleAxiosSuccess'
import { IProprietarioCreate } from '@/.interface/IProprietario'
export function useCreateUser() {
  const queryClient = useQueryClient()

  const createUser = useMutation({
    mutationFn: (newUser: IProprietarioCreate) =>
      endPointService.create<IProprietarioCreate>('/proprietario', newUser),
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
