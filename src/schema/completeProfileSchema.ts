import { cpfRegex, phoneRegex } from '@/utils/regex'
import { object, string } from 'yup'
import * as yup from 'yup'
export const completeProfileSchema = object({
  cpf: yup
    .string()
    .matches(cpfRegex, 'CPF inválido')
    .required('O CPF é obrigatório')
    .length(14, 'O CPF deve ter 14 caracteres'),
  phone: yup
    .string()
    .matches(
      phoneRegex,
      'Telefone inválido. Use o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX',
    )
    .required('O telefone é obrigatório'),
})
