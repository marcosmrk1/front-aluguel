import { useFormik } from 'formik'
import { useEffect } from 'react'
import InputDefault from '@/components/DefaultComponents/InputDefault'
import {
  EqualApproximatelyIcon,
  Lock,
  PenSquareIcon,
  PersonStanding,
  PersonStandingIcon,
  Phone,
} from 'lucide-react'
import { maskCpf } from '@/utils/mask/maskCpf'
import { maskPhone } from '@/utils/mask/maskPhone'
import { registerSchema } from '@/schema/RegisterSchema'
import ButtonDefault from '@/components/DefaultComponents/ButtonDefault'
import { useCreateProprietario } from '@/hooks/proprietario/useCreate/useCreateProprietario'
import { useRouter } from 'next/navigation'

const FormRegister = () => {
  const { createUser } = useCreateProprietario()
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      email: '',
      telefone: '',
      password: '',
      cpf: '',
      nome: '',
    },
    onSubmit: (values) => {
      createUser.mutate(values)
    },
    validationSchema: registerSchema,
    validateOnBlur: false,
    validateOnChange: false,
  })

  useEffect(() => {
    if (createUser.isSuccess) {
      formik.resetForm()
      router.push('/login')
    }
  }, [createUser.isSuccess])

  return (
    <div className="flex flex-col">
      <form onSubmit={formik.handleSubmit}>
        <div className="relative">
          <InputDefault
            icon={<PersonStandingIcon />}
            formik={formik}
            name="nome"
            id="Nome"
            type="text"
            placeholder="Digite seu nome"
          />
        </div>

        <div className="relative">
          <InputDefault
            icon={<PenSquareIcon />}
            formik={formik}
            mask={maskCpf}
            name="cpf"
            id="CPF"
            type="text"
            placeholder="Digite seu CPF"
            maxLength={14}
          />
        </div>

        <div className="relative">
          <InputDefault
            icon={<Phone />}
            formik={formik}
            mask={maskPhone}
            name="telefone"
            id="Telefone"
            type="text"
            placeholder="Digite seu telefone"
            maxLength={15}
          />
        </div>

        <div className="relative">
          <InputDefault
            icon={<EqualApproximatelyIcon />}
            formik={formik}
            name="email"
            id="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
          />
        </div>

        <div className="relative">
          <InputDefault
            icon={<Lock />}
            formik={formik}
            name="password"
            id="Senha"
            type="password"
            placeholder="Digite sua senha"
          />
        </div>
        <div className="mt-6">
          <ButtonDefault type="submit" disabled={createUser.isPending}>
            Registrar-se
          </ButtonDefault>
        </div>
      </form>
    </div>
  )
}
export { FormRegister }
