'use client'
import ButtonDefault from '@/components/DefaultComponents/ButtonDefault'
import InputDefault from '@/components/DefaultComponents/InputDefault'
import { Card } from '@/components/ui/card'
import { useGetProprietario } from '@/hooks/proprietario/useGet/useGetProprietario'
import { useUpdateCompleteUser } from '@/hooks/proprietario/useUpdate/useUpdateCompleteUser'
import { completeProfileSchema } from '@/schema/completeProfileSchema'
import { maskCpf } from '@/utils/mask/maskCpf'
import { maskPhone } from '@/utils/mask/maskPhone'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

const initialValues = {
  cpf: '',
  phone: '',
}
const FormCompleteProfile = () => {
  const { mutate, isPending } = useUpdateCompleteUser()
  const { dataUser, isLoading } = useGetProprietario()
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (!dataUser?.id) {
        toast.error('Erro: ID do usuário não encontrado')
        return
      }

      mutate({ data: values, id: dataUser.id })
    },
    validationSchema: completeProfileSchema,
  })

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className="p-6 space-y-4 w-4xl mx-auto mt-20">
        <InputDefault
          formik={formik}
          name="cpf"
          id="CPF"
          type="text"
          placeholder="Digite seu CPF"
          mask={maskCpf}
        />
        <InputDefault
          formik={formik}
          name="phone"
          id="Telefone"
          type="text"
          placeholder="Digite seu telefone"
          mask={maskPhone}
        />
        <div className="flex justify-end">
          <ButtonDefault type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Completar Perfil'}
          </ButtonDefault>
        </div>
      </Card>
    </form>
  )
}
export { FormCompleteProfile }
