import { Calendar, Home, Inbox, Search, Settings, LogOut, User } from 'lucide-react' // Adicionei LogOut e User
import { signOut, useSession } from 'next-auth/react' // Adicionei signOut

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ThemeSwitcher } from '@/components/Menu/ThemeSwitcher'

const itemsProfileComplete = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
]
const itemsProfileIncomplete = [
  {
    title: 'Completar Perfil',
    url: '/complete-profile',
    icon: Settings,
  },
]
export function AppSidebar({
  userCompleteProfile = null,
}: {
  userCompleteProfile: boolean | null
}) {
  const items = userCompleteProfile ? itemsProfileComplete : itemsProfileIncomplete
  const { data } = useSession()
  console.log(data)
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Application
            <div className="ml-auto flex items-center">
              <ThemeSwitcher />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {data?.user?.image ? (
              <img
                src={data.user.image}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border border-gray-200">
                <User className="h-4 w-4 text-gray-500" />
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[120px]">
                {data?.user?.name || 'Usuário'}
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 hover:text-red-500 transition-colors cursor-pointer"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-2 text-xs text-center text-gray-400">
          © 2023 Your Company
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
