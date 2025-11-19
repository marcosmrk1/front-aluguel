'use client'

import { useSession, signOut, getSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export function useAuthSession() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && !session?.accessToken) {
      console.warn('⚠️ Sessão sem accessToken. Forçando logout...')
      signOut({ callbackUrl: '/login' })
      return
    }

    const interval = setInterval(async () => {
      if (session?.jwtValidade) {
        const expiresTimestamp = Math.floor(
          new Date(session.jwtValidade).getTime() / 1000,
        )
        const nowInSeconds = Math.floor(Date.now() / 1000)
        const remainingTime = expiresTimestamp - nowInSeconds

        if (remainingTime > 0 && remainingTime <= 300) {
          try {
            await update()
            console.log('✅ Sessão atualizada via update()')
          } catch (error) {
            console.error('❌ Erro ao atualizar sessão:', error)
            toast.error('Erro ao renovar sessão !')
            signOut({ callbackUrl: '/login' })
          }
        }

        if (remainingTime <= 0) {
          console.warn('⚠️ JWT expirado! Fazendo logout...')
          signOut({ callbackUrl: '/login' })
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [session, status, router, update])

  return { session, status, isAuthenticated: status === 'authenticated' }
}
