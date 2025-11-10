'use client'

import { AppSidebar } from '@/components/Menu/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { SessionProvider } from 'next-auth/react'

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
          <div className=" w-full flex    justify-center  ">
            <div className="  p-4">{children}</div>
          </div>
        </SessionProvider>
      </SidebarProvider>
    </main>
  )
}
