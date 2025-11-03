import { endPointService } from '@/services/endPointService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IProprietario } from '@/.interface/IProprietario'
import { toast } from 'react-toastify'
export function useCreateProprietario() {
  const queryClient = useQueryClient()
  console.log(process.env.API_URL)

  const createUser = useMutation({
    mutationFn: (newUser: IProprietario) =>
      endPointService.create<IProprietario>('/proprietario', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proprietario'] })
      toast.success('Proprietário criado com sucesso!')
    },
    onError(error, variables, onMutateResult, context) {
      console.log(error)
      toast.error(error.message || 'Erro ao criar proprietário.')
    },
  })

  return { createUser }
}
