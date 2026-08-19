import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Database, DollarSign, BarChart3, Settings, Users, ChefHat } from "lucide-react"

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Mesas", url: "/mesas", icon: LayoutDashboard },
  { title: "Cadastros", url: "/cadastros", icon: Database },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
  { title: "Config. Tablet", url: "/configuracoes/tablet", icon: Settings },
  { title: "Usuários", url: "/usuarios", icon: Users },
]

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border flex flex-row items-center gap-2">
        <div className="bg-primary text-primary-foreground p-2 rounded-md">
          <ChefHat size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight tracking-tight text-primary">Tita&apos;s Core</span>
          <span className="text-xs text-muted-foreground">Painel Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <a href={item.url} className="flex items-center gap-2 w-full hover:text-primary transition-colors">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
