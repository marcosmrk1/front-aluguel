'use client'
import ButtonDefault from '@/components/DefaultComponents/ButtonDefault'
import InputDefault from '@/components/DefaultComponents/InputDefault'
import { usePostAuth } from '@/hooks/auth/usePost/usePostAuth'
import { usePostAuthGoogle } from '@/hooks/auth/usePost/usePostAuthGoogle'
import { loginSchema } from '@/schema/loginSchema'
import { useFormik } from 'formik'
import { Lock, Mail } from 'lucide-react'
const FormLogin = () => {
  const { loginUser } = usePostAuth()
  const { loginWithGoogle } = usePostAuthGoogle()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      loginUser.mutate(values)
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
      <div className="flex flex-col gap-4">
        <ButtonDefault type="submit" disabled={loginUser.isPending}>
          Entrar
        </ButtonDefault>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => loginWithGoogle.mutate()}
            disabled={loginWithGoogle.isPending}
            className="px-4 py-2 border flex gap-2  hover:shadow transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
            />
            <span>
              {loginWithGoogle.isPending ? 'Carregando...' : 'Login with Google'}
            </span>
          </button>
        </div>
      </div>
    </form>
  )
}
export { FormLogin }
{
}
