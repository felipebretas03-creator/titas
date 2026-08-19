"use client"

import { LayoutDashboard, Database, DollarSign, BarChart3, Settings, Users, ChefHat, Menu, LucideIcon } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

function MobileNavLink({ icon: Icon, href, label, active = false }: { icon: LucideIcon, href: string, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-colors ${active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-transparent text-muted-foreground hover:bg-black/5'}`}>
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  )
}

export function MobileMenu() {
  return (
    <div className="md:hidden relative">
      {/* Indicador de versão para garantir que o cache não está preso */}
      <div className="absolute -top-4 -left-4 bg-green-500 text-white text-[9px] px-1 rounded-full z-[9999]">v3</div>
      <Sheet>
        <SheetTrigger render={<button className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary hover:bg-black/5 transition-colors" />}>
          <Menu size={20} />
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 border-r-0 bg-[#fcfbfb]">
          <SheetTitle className="sr-only">Menu Principal</SheetTitle>
          <div className="flex flex-col h-full py-8 px-4">
              <div className="flex items-center gap-3 px-4 mb-8">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md">
                  <ChefHat size={20} />
                </div>
                <span className="font-black text-xl tracking-tight">Tita&apos;s</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <MobileNavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" active />
                <MobileNavLink href="/cadastros" icon={Database} label="Cadastros" />
                <MobileNavLink href="/financeiro" icon={DollarSign} label="Financeiro" />
                <MobileNavLink href="/relatorios" icon={BarChart3} label="Relatórios" />
                <MobileNavLink href="/configuracoes" icon={Settings} label="Configurações" />
              </div>

              <div className="mt-auto pt-4 border-t border-border/40">
                <MobileNavLink href="/usuarios" icon={Users} label="Usuários" />
              </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
