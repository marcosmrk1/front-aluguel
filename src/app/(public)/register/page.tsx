import { LoginContainer } from '@/components/Login/LoginContainer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro - Sistema de Aluguel',
  description: 'Crie sua conta no sistema de gestão de aluguel',
}

export default function RegisterPage() {
  return (
    <div>
      <LoginContainer />
    </div>
  )
}
