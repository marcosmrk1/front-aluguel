import { toast } from 'react-toastify'
export const handleAxiosSuccess = (
  message: string = 'Operação realizada com sucesso.',
) => {
  toast.success(message)
}
