'use client'

import { loginSchema } from '@/app/(public)/login/schema/loginSchema'
import ButtonGeneric from '@/genericComponents/ButtonGeneric'
import InputGeneric from '@/genericComponents/InputGeneric'
import { Field, useFormik } from 'formik'
import { Home, Lock, Mail } from 'lucide-react'

export default function Login() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h1>
          <p className="text-gray-600">Seu sistema de organização de casas de aluguel</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Endereço de E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <InputGeneric
                  formik={formik}
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Digite seu E-mail"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <InputGeneric
                  formik={formik}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>
            <ButtonGeneric type="submit">Entrar</ButtonGeneric>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 rounded-full">
                  <a
                    href="..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 font-medium underline"
                  >
                    Resumo do sistema
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Feito pelo Desenvolvedor{' '}
            <span className="font-semibold text-amber-600">Marcos Sousa</span>
            <br />
            <a
              href="https://www.linkedin.com/in/marcosp-rsd-/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 font-medium underline"
            >
              Linkedin
            </a>
            {' | '}
            <a
              href="https://github.com/marcosmrk1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 font-medium underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
