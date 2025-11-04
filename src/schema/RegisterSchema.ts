import { cpfRegex, phoneRegex } from '@/utils/regex'
import * as yup from 'yup'

const registerSchema = yup.object().shape({
  nome: yup.string().required('O nome é obrigatório'),
  cpf: yup
    .string()
    .matches(cpfRegex, 'CPF inválido')
    .required('O CPF é obrigatório')
    .length(14, 'O CPF deve ter 14 caracteres'),
  telefone: yup
    .string()
    .matches(
      phoneRegex,
      'Telefone inválido. Use o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX',
    )
    .required('O telefone é obrigatório'),
  email: yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('A senha é obrigatória'),
})

export { registerSchema }
