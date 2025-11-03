'use client'
import ButtonDefault from '@/components/DefaultComponents/ButtonDefault'
import InputDefault from '@/components/DefaultComponents/InputDefault'
import { loginSchema } from '@/schema/loginSchema'
import { useFormik } from 'formik'
import { Lock, Mail } from 'lucide-react'

const FormLogin = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log(values)
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: loginSchema,
  })
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="relative">
        <InputDefault
          icon={<Mail />}
          formik={formik}
          name="email"
          id="E-mail"
          type="email"
          placeholder="Digite seu E-mail"
        />
      </div>

      <div className="relative">
        <InputDefault
          icon={<Lock />}
          formik={formik}
          id="Senha"
          name="password"
          type="password"
          placeholder="Digite sua senha"
        />
      </div>
      <ButtonDefault type="submit">Entrar</ButtonDefault>
    </form>
  )
}
export { FormLogin }

{
  /* <div className="text-center mt-8">
 <p className="text-sm">
   Feito pelo Desenvolvedor <span className="font-semibold">Marcos Sousa</span>
   <br />
   <a
     href="https://www.linkedin.com/in/marcosp-rsd-/"
     target="_blank"
     rel="noopener noreferrer"
     className="font-medium underline"
   >
     Linkedin
   </a>
   {' | '}
   <a
     href="https://github.com/marcosmrk1"
     target="_blank"
     rel="noopener noreferrer"
     className="font-medium underline"
   >
     GitHub
   </a>
 </p>
</div> */
}
