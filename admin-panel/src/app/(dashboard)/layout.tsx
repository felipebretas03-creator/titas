import { LayoutDashboard, Database, DollarSign, BarChart3, Settings, Users, ChefHat, Search, TabletSmartphone, LogOut, LucideIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BottomNav } from "@/components/bottom-nav"
import { NotificationManager } from "@/components/notification-manager"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f0e9e8] md:p-6 lg:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-[1600px] h-screen md:h-[90vh] bg-[#fcfbfb] md:rounded-[2.5rem] md:shadow-2xl overflow-hidden flex md:ring-1 ring-black/5">
        
        {/* Sidebar Vertical (Oculta no Mobile) */}
        <div className="hidden md:flex w-[100px] flex-col items-center py-6 gap-6 bg-primary border-r border-primary/40 z-10 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.1)]">
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <Image src="/logo.png" alt="Tita's Logo" fill className="object-contain brightness-0 invert scale-125" />
          </div>
          
          <div className="flex flex-col gap-3 mt-2">
            <NavIcon href="/dashboard" icon={LayoutDashboard} label="Dashboard" active />
            <NavIcon href="/cadastros" icon={Database} label="Cadastros" />
            <NavIcon href="/financeiro" icon={DollarSign} label="Financeiro" />
            <NavIcon href="/relatorios" icon={BarChart3} label="Relatórios" />
            <NavIcon href="/mesas" icon={TabletSmartphone} label="Mesas" />
            <NavIcon href="/configuracoes" icon={Settings} label="Configurações" />
          </div>

          <div className="mt-auto pb-4">
            <NavIcon href="/usuarios" icon={Users} label="Usuários" />
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Top Header (Responsivo) */}
          <header className="h-20 md:h-28 px-4 md:px-10 flex items-center justify-between shrink-0 bg-white md:bg-transparent border-b md:border-none border-border/40 z-20">
            
            {/* Esquerda: Menu Hamburger no Mobile, Links no Desktop */}
            <div className="flex items-center gap-4">
              {/* Logo Mobile */}
              <div className="md:hidden flex items-center gap-2 text-primary">
                 <div className="relative w-12 h-12 mr-2">
                   <Image src="/logo.png" alt="Tita's Logo" fill className="object-contain brightness-0 scale-110" />
                 </div>
                 <span className="font-black text-xl tracking-tight">Tita&apos;s</span>
              </div>
              
              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm text-sm font-semibold border border-border/50 text-foreground hover:bg-black/5 transition-colors">
                  <LayoutDashboard size={18} className="text-primary" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/operacao" className="flex items-center gap-2 px-6 py-3 bg-transparent rounded-full text-sm font-medium text-muted-foreground hover:bg-black/5 transition-colors">
                  <Database size={18} />
                  <span>Operação</span>
                </Link>
                <Link href="/mesas" className="flex items-center gap-2 px-6 py-3 bg-transparent rounded-full text-sm font-medium text-muted-foreground hover:bg-black/5 transition-colors">
                  <TabletSmartphone size={18} />
                  <span>Mesas</span>
                </Link>
                <div className="w-11 h-11 rounded-full bg-white border border-border/50 shadow-sm flex items-center justify-center ml-2 cursor-pointer hover:bg-black/5 transition-colors">
                  <Search size={18} className="text-muted-foreground" />
                </div>
              </div>

            </div>

            {/* Direita: Perfil (Oculta nomes em telas super pequenas) */}
            <div className="flex items-center gap-3 md:gap-4">
              <Link href="/operacao" className="md:hidden flex items-center justify-center px-4 py-2 bg-primary text-white rounded-full text-xs font-bold shadow-sm">
                Operação
              </Link>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold">Admin Tita&apos;s</span>
                <span className="text-xs text-muted-foreground">@titasburguer</span>
              </div>
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm shrink-0">
                AD
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">2</span>
              </div>
              
              {/* Botão de Sair */}
              <Link href="/login" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 shrink-0 ml-1 md:ml-2">
                <LogOut size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </header>

          {/* Área Rolável - pb-20 para não ficar escondido atrás do BottomNav */}
          <main className="flex-1 overflow-y-auto px-4 md:px-10 pb-20 md:pb-10">
            {children}
          </main>

          <BottomNav />
          <NotificationManager />

        </div>
      </div>
    </div>
  )
}

function NavIcon({ icon: Icon, href, label, active = false }: { icon: LucideIcon, href: string, label: string, active?: boolean }) {
  return (
    <Link href={href} className="group relative flex items-center justify-start h-14 w-14 z-20">
      <div 
        className={`absolute left-0 top-0 h-14 flex items-center overflow-hidden rounded-full transition-all duration-300 ease-out shadow-sm
        ${active 
            ? 'w-14 bg-white/20 text-white md:group-hover:w-[176px] md:group-hover:bg-white md:group-hover:text-primary md:group-hover:shadow-lg' 
            : 'w-14 bg-transparent text-white/70 md:group-hover:w-[176px] md:group-hover:bg-white md:group-hover:text-primary md:group-hover:shadow-lg border border-transparent'
        }`}
      >
        <div className="min-w-[56px] h-[56px] flex items-center justify-center shrink-0">
          <Icon size={24} />
        </div>
        <span className="whitespace-nowrap font-bold text-sm pr-4 opacity-0 -translate-x-2 -ml-3 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-300 delay-75">
          {label}
        </span>
      </div>
    </Link>
  )
}


