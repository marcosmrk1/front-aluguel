'use client'
import { ModeToggle } from '@/components/DefaultComponents/modeToggle'
import { FormLogin } from '@/components/Login/Form/FormLogin'
import { Card } from '@/components/ui/card'
import { Home } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FormRegister } from '@/components/Login/Form/FormRegister'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const LoginContainer = () => {
  const pathname = usePathname()
  const isRegisterPage = pathname === '/register'

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
          <AnimatePresence mode="wait">
            {isRegisterPage ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 2, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FormRegister />
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FormLogin />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 rounded-full">
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
              <div className="relative flex justify-center text-sm">
                <span className="px-3 rounded-full">
                  <Link
                    href={isRegisterPage ? '/login' : '/register'}
                    className="font-medium underline text-amber-link"
                  >
                    {isRegisterPage ? 'Voltar' : 'Registre-se'}
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
export { LoginContainer }
