'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Import } from 'lucide-react'
import { ENUM_AUTH_ERROR } from '@/.interface/IAuth'
export function useAuthSession() {
  const { data: session, status, update } = useSession()

  useEffect(() => {
    if (status !== 'authenticated' || !session?.jwtValidade) return

    const checkTokenExpiration = async () => {
      const expiresTimestamp = Math.floor(new Date(session.jwtValidade).getTime() / 1000)
      const nowInSeconds = Math.floor(Date.now() / 1000)
      const remainingTime = expiresTimestamp - nowInSeconds

      if (remainingTime <= 60) {
        await update()
      }
      if (session.error === ENUM_AUTH_ERROR.ERROR_REFRESH_TOKEN) {
        toast.error('Sessão expirada. Por favor, faça login novamente.')
        signOut({ callbackUrl: '/login' })
      }
    }

    checkTokenExpiration()
    const interval = setInterval(checkTokenExpiration, 5000)

    return () => clearInterval(interval)
  }, [session, status, update])

  return { session, status, isAuthenticated: status === 'authenticated' }
}
