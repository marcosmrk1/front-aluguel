import * as yup from 'yup'
const registerSchema = yup.object().shape({
  nome: yup.string().required('O nome é obrigatório'),
  cpf: yup
    .string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
    .required('O CPF é obrigatório')
    .length(14, 'O CPF deve ter 14 caracteres'),
  telefone: yup
    .string()
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido')
    .required('O telefone é obrigatório'),
  email: yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('A senha é obrigatória'),
})

export { registerSchema }
