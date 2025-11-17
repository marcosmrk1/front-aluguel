'use client'

import { AppSidebar } from '@/components/Menu/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useGetProprietario } from '@/hooks/proprietario/useGet/useGetProprietario'
import { SessionProvider } from 'next-auth/react'

function PrivateLayoutContent({ children }: { children: React.ReactNode }) {
  const { userCompleteProfile, isLoading } = useGetProprietario()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando...</div>
      </div>
    )
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
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <PrivateLayoutContent>{children}</PrivateLayoutContent>
    </SessionProvider>
  )
}
