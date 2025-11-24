import { PrivateLayoutClient } from '@/app/(private)/PrivateLayourContent'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <PrivateLayoutClient>{children}</PrivateLayoutClient>
    </main>
  )
}
