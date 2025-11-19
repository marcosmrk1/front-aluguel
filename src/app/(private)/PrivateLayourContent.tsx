'use client'

import { AppSidebar } from '@/components/Menu/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useGetProprietario } from '@/hooks/proprietario/useGet/useGetProprietario'
import { SessionProvider } from 'next-auth/react'
import { useAuthSession } from '@/hooks/auth/useGet/useAuthSession'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function PrivateLayoutContent({ children }: { children: React.ReactNode }) {
  const { status, isAuthenticated } = useAuthSession()
  const { userCompleteProfile, isLoading } = useGetProprietario()
  const router = useRouter()

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     console.warn('⚠️ Usuário não autenticado, redirecionando...')
  //     router.push('/login')
  //   }
  // }, [status, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <>
        <AppSidebar userCompleteProfile={userCompleteProfile} />
        <SidebarTrigger />
      </>

      <div className="w-full flex justify-center">
        <div className="p-4">{children}</div>
      </div>
    </SidebarProvider>
  )
}

export function PrivateLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Revalida a cada 5 minutos
      refetchOnWindowFocus={true} // Revalida ao focar na janela
    >
      <PrivateLayoutContent>{children}</PrivateLayoutContent>
    </SessionProvider>
  )
}
