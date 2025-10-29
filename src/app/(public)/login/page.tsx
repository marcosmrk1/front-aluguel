'use client'

import { loginSchema } from '@/app/(public)/login/schema/loginSchema'
import { Card } from '@/components/ui/card'
import ButtonGeneric from '@/DefaultComponents/ButtonDefault'
import InputGeneric from '@/DefaultComponents/InputDefault'
import { ModeToggle } from '@/DefaultComponents/modeToggle'
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br rounded-2xl mb-4 shadow-lg">
            <Home className="w-8 h-8" />
            <ModeToggle />
          </div>
          <h1 className="text-3xl font-bold mb-2">Bem-vindo</h1>
          <p>Seu sistema de organização de casas de aluguel</p>
        </div>
        <Card className="backdrop-blur-sm rounded-3xl shadow-xl border p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Endereço de E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5" />
              </div>
              <InputGeneric
                formik={formik}
                name="email"
                id="email"
                type="email"
                placeholder="Digite seu E-mail"
              />
            </div>

            {/* Password Field */}
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5" />
              </div>
              <InputGeneric
                formik={formik}
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
              />
            </div>
            <ButtonGeneric type="submit">Entrar</ButtonGeneric>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3  rounded-full">
                  <a
                    href="..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline text-amber-link"
                  >
                    Resumo do sistema
                  </a>
                </span>
              </div>
            </div>
          </div>
        </Card>
        {/* Footer */}
        <div className="text-center mt-8">
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
        </div>
      </div>
    </div>
  )
}
