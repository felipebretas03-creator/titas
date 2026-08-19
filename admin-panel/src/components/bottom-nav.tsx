"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Database, DollarSign, BarChart3, Settings, TabletSmartphone } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Início" },
  { href: "/cadastros", icon: Database, label: "Cadastros" },
  { href: "/mesas", icon: TabletSmartphone, label: "Mesas" },
  { href: "/financeiro", icon: DollarSign, label: "Financeiro" },
  { href: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { href: "/configuracoes", icon: Settings, label: "Ajustes" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-border/40 pb-6 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around h-16 pt-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors pt-1",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <div className={cn(
                "p-1 rounded-full transition-all duration-300", 
                isActive ? "bg-primary/10 text-primary scale-110" : "bg-transparent text-muted-foreground"
              )}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn("text-[10px]", isActive ? "font-bold text-primary" : "font-medium text-muted-foreground")}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
