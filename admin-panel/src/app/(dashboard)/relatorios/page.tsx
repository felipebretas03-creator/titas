"use client"

import { useState, useMemo } from "react"
import { DollarSign, Package, ShoppingBag, Landmark, Users, Bike, Briefcase, FileText, TrendingUp, Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { VendasReport } from "./components/VendasReport"
import { ProdutosReport } from "./components/ProdutosReport"
import { EstoqueReport } from "./components/EstoqueReport"
import { FinanceiroReport } from "./components/FinanceiroReport"
import { ClientesReport } from "./components/ClientesReport"
import { DeliveryReport } from "./components/DeliveryReport"
import { OperacaoReport } from "./components/OperacaoReport"
import { EvolutivoReport } from "./components/EvolutivoReport"
import { RelatoriosContext } from "./context"

type ReportCategory = 'vendas' | 'produtos' | 'estoque' | 'financeiro' | 'clientes' | 'delivery' | 'operacao' | 'evolutivo'

export default function RelatoriosPage() {
  const store = useStore()
  const [activeTab, setActiveTab] = useState<ReportCategory>('financeiro')
  
  // Default dates: first and last day of current month
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]

  const [startDate, setStartDate] = useState(firstDay)
  const [endDate, setEndDate] = useState(lastDay)
  const [turno, setTurno] = useState('Todos') // 'Todos', 'Manhã', 'Tarde', 'Noite'

  const menu = [
    { id: 'financeiro', label: 'DRE / Financeiro', icon: FileText },
    { id: 'vendas', label: 'Vendas e Faturamento', icon: DollarSign },
    { id: 'evolutivo', label: 'Evolução e Tendências', icon: TrendingUp },
    { id: 'produtos', label: 'Produtos e Categorias', icon: ShoppingBag },
    { id: 'estoque', label: 'Controle de Estoque', icon: Package },
    { id: 'clientes', label: 'Análise de Clientes', icon: Users },
    { id: 'delivery', label: 'Desempenho Delivery', icon: Bike },
    { id: 'operacao', label: 'Métricas da Operação', icon: Briefcase },
  ] as const

  // Central Filtering Logic
  const filteredData = useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`)
    const end = new Date(`${endDate}T23:59:59`)

    const isWithinTurno = (dateStr: string) => {
      if (turno === 'Todos') return true;
      const d = new Date(dateStr);
      const h = d.getHours();
      if (turno === 'Manhã') return h >= 6 && h < 12;
      if (turno === 'Tarde') return h >= 12 && h < 18;
      if (turno === 'Noite') return h >= 18 || h < 6;
      return true;
    }

    const isWithinDate = (dateStr: string) => {
      const d = new Date(dateStr)
      return d >= start && d <= end
    }

    return {
      pedidos: store.pedidos.filter(p => isWithinDate(p.createdAt) && isWithinTurno(p.createdAt)),
      transacoes: store.transacoes.filter(t => isWithinDate(t.data) && isWithinTurno(t.data)),
      movimentacoesEstoque: store.movimentacoesEstoque.filter(m => isWithinDate(m.data) && isWithinTurno(m.data)),
      startDate,
      endDate,
      turno
    }
  }, [store.pedidos, store.transacoes, store.movimentacoesEstoque, startDate, endDate, turno])


  const renderContent = () => {
    switch (activeTab) {
      case 'vendas': return <VendasReport />
      case 'evolutivo': return <EvolutivoReport />
      case 'produtos': return <ProdutosReport />
      case 'estoque': return <EstoqueReport />
      case 'financeiro': return <FinanceiroReport />
      case 'clientes': return <ClientesReport />
      case 'delivery': return <DeliveryReport />
      case 'operacao': return <OperacaoReport />
      default: return null
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-10 min-h-[calc(100vh-100px)] bg-slate-50">
      
      {/* Header com Filtros Globais */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b bg-white p-6 -mx-6 -mt-6 shadow-sm gap-4">
        <h1 className="text-2xl font-semibold text-slate-800">
          Relatórios
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 px-2 border-r border-border/50">
            <Calendar size={16} className="text-muted-foreground" />
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-[120px] cursor-pointer" 
            />
            <span className="text-muted-foreground text-sm font-medium">até</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-[120px] cursor-pointer" 
            />
          </div>

          <div className="flex items-center gap-2 px-2">
            <Clock size={16} className="text-muted-foreground" />
            <Select value={turno} onValueChange={(val) => setTurno(val as any)}>
              <SelectTrigger className="w-[130px] border-none shadow-none bg-transparent h-8 font-bold text-slate-700 focus:ring-0">
                <SelectValue placeholder="Turno" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Todos">Todos os Turnos</SelectItem>
                <SelectItem value="Manhã">Manhã (06h-12h)</SelectItem>
                <SelectItem value="Tarde">Tarde (12h-18h)</SelectItem>
                <SelectItem value="Noite">Noite (18h-06h)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-2">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex flex-col gap-1 shrink-0">
          {menu.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-sm font-medium",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                )}
              >
                <Icon size={18} className={isActive ? "opacity-100" : "opacity-60"} />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Report Content Area */}
        <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <RelatoriosContext.Provider value={filteredData}>
            {renderContent()}
          </RelatoriosContext.Provider>
        </div>
      </div>
    </div>
  )
}
