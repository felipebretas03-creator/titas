"use client"

import { useState, useMemo } from "react"
import { Activity, Clock, FileWarning, TrendingUp, Filter, MoreHorizontal } from "lucide-react"
import { useStore } from "@/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const formatCurrency = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;

export default function DashboardPage() {
  const { pedidos, sessoesMesa } = useStore()
  
  const [periodo, setPeriodo] = useState<string>("Hoje")
  const [canal, setCanal] = useState<string>("Todas")
  const [selectedOrder, setSelectedOrder] = useState<{titulo: string, status: string, tempo: string, itens: string[]} | null>(null)

  // 1. Filtro Global
  const filteredPedidos = useMemo(() => {
    const now = new Date()
    return pedidos.filter(p => {
      // Filtro de Canal
      if (canal === "Delivery" && p.channel !== "DELIVERY") return false;
      if (canal === "Salão" && p.channel !== "TABLE") return false;
      if (canal === "Retirada" && p.channel !== "PICKUP") return false;

      // Filtro de Período
      if (periodo !== "Todas") {
        const pDate = new Date(p.createdAt)
        const diffTime = Math.abs(now.getTime() - pDate.getTime())
        const diffDays = diffTime / (1000 * 60 * 60 * 24)

        if (periodo === "Hoje" && diffDays > 1) return false;
        if (periodo === "7d" && diffDays > 7) return false;
        if (periodo === "30d" && diffDays > 30) return false;
      }
      
      return true
    })
  }, [pedidos, periodo, canal])

  // 2. Cálculos dos KPIs
  const pedidosValidos = filteredPedidos.filter(p => p.status !== 'CANCELLED')
  const totalFaturamento = pedidosValidos.reduce((acc, p) => acc + p.total, 0)
  const totalPedidos = pedidosValidos.length
  
  const totalCancelados = filteredPedidos.filter(p => p.status === 'CANCELLED').length
  const taxaRejeicao = filteredPedidos.length > 0 ? (totalCancelados / filteredPedidos.length) * 100 : 0
  
  const pedidosComTempo = pedidosValidos.filter(p => p.tempoEntregaMins)
  const tempoMedioMins = pedidosComTempo.length > 0 
    ? Math.round(pedidosComTempo.reduce((acc, p) => acc + (p.tempoEntregaMins || 0), 0) / pedidosComTempo.length) 
    : 0
  const tempoMedioStr = tempoMedioMins > 0 ? `${tempoMedioMins}m` : "0m"

  // 3. Dados Faturamento (AreaChart)
  const faturamentoData = useMemo(() => {
    const map: Record<string, { faturamento: number, pedidos: number }> = {}
    
    // Para criar um gráfico bonitinho mesmo com poucos dados (mock smooth lines)
    if (pedidosValidos.length === 0) {
      return [{ time: "0h", faturamento: 0, pedidos: 0 }, { time: "24h", faturamento: 0, pedidos: 0 }]
    }

    pedidosValidos.forEach(p => {
      const d = new Date(p.createdAt)
      const key = periodo === "Hoje" 
        ? `${d.getHours().toString().padStart(2, '0')}h` 
        : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        
      if (!map[key]) map[key] = { faturamento: 0, pedidos: 0 }
      map[key].faturamento += p.total
      map[key].pedidos += 1
    })
    
    // Sorting temporally
    return Object.entries(map)
      .map(([time, data]) => ({ time, ...data }))
      .sort((a,b) => a.time.localeCompare(b.time))
  }, [pedidosValidos, periodo])

  // 4. Dados Operação (BarChart de Distribuição de Tempos)
  const operacaoData = useMemo(() => {
    const faixas = { "<20m": 0, "20-30m": 0, "30-45m": 0, ">45m": 0 }
    pedidosComTempo.forEach(p => {
      const t = p.tempoEntregaMins || 0
      if (t < 20) faixas["<20m"]++
      else if (t <= 30) faixas["20-30m"]++
      else if (t <= 45) faixas["30-45m"]++
      else faixas[">45m"]++
    })
    return Object.entries(faixas).map(([faixa, count]) => ({ faixa, count }))
  }, [pedidosComTempo])

  // 5. Dados Fluxo Produção (BarChart Produzidos vs Pendentes)
  const fluxoProducaoData = useMemo(() => {
    const map: Record<string, { produzidos: number, pendentes: number }> = {}
    filteredPedidos.forEach(p => {
      const d = new Date(p.createdAt)
      const key = `${d.getHours().toString().padStart(2, '0')}h`
      if (!map[key]) map[key] = { produzidos: 0, pendentes: 0 }
      
      if (['DELIVERED'].includes(p.status)) {
        map[key].produzidos += 1
      } else if (['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(p.status)) {
        map[key].pendentes += 1
      }
    })
    return Object.entries(map)
      .map(([hora, data]) => ({ hora, ...data }))
      .sort((a,b) => a.hora.localeCompare(b.hora))
      .slice(-8)
  }, [filteredPedidos])

  const totalProduzidos = fluxoProducaoData.reduce((acc, curr) => acc + curr.produzidos, 0)
  const totalFluxoPendentes = fluxoProducaoData.reduce((acc, curr) => acc + curr.pendentes, 0)

  // 6. Fila do Caixa
  const filaPedidos = useMemo(() => {
    return pedidos
      .filter(p => ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(p.status))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
  }, [pedidos])

  // Configurações do Recharts
  const chartConfigFat = {
    faturamento: { label: "Faturamento (R$)", color: "hsl(var(--primary))" },
    pedidos: { label: "Pedidos", color: "#eab308" }
  }

  const chartConfigFluxo = {
    produzidos: { label: "Produzidos", color: "hsl(var(--primary))" },
    pendentes: { label: "Pendentes", color: "#eab308" }
  }

  const chartConfigOp = {
    count: { label: "Pedidos", color: "hsl(var(--primary))" }
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Título e Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-2 gap-6">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">
          Visão Geral
        </h1>
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-[140px] min-w-[120px]">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="bg-white rounded-full border-border/50 h-11 px-4 md:px-5 shadow-sm font-bold text-foreground w-full">
                <SelectValue placeholder="Data" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="Hoje">Hoje</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="Todas">Todo Período</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 md:w-[160px] min-w-[120px]">
            <Select value={canal} onValueChange={setCanal}>
              <SelectTrigger className="bg-white rounded-full border-border/50 h-11 px-4 md:px-5 shadow-sm font-bold text-foreground w-full">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Delivery">Delivery</SelectItem>
                <SelectItem value="Salão">Salão</SelectItem>
                <SelectItem value="Retirada">Retirada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-11 h-11 shrink-0 rounded-full bg-white border border-border/50 flex items-center justify-center shadow-sm cursor-pointer hover:bg-black/5 transition-colors">
            <Filter size={16} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda (2/3) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Linha Superior (Métricas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card Faturamento */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/40 flex flex-col justify-between h-[280px] md:h-[300px] relative overflow-hidden">
              <div className="flex items-center justify-between z-20">
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground">Faturamento</span>
                <MoreHorizontal size={20} className="text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
              
              <div className="flex items-end gap-6 md:gap-10 mt-6 z-20">
                <div>
                  <div className="text-emerald-500 flex items-center mb-1 md:mb-2"><TrendingUp size={16} /></div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">{formatCurrency(totalFaturamento).replace(',00', '')}</div>
                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground mt-1">Líquido</div>
                </div>
                <div>
                  <div className="text-amber-500 flex items-center mb-1 md:mb-2"><Activity size={16} /></div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">{totalPedidos}</div>
                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground mt-1">Pedidos Totais</div>
                </div>
              </div>

              {/* AreaChart Recharts */}
              <div className="absolute bottom-0 left-0 right-0 h-40 opacity-80 z-10 pointer-events-none">
                <ChartContainer config={chartConfigFat} className="h-full w-full">
                  <AreaChart data={faturamentoData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-faturamento)" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="var(--color-faturamento)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-pedidos)" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="var(--color-pedidos)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <RechartsTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="faturamento" stroke="var(--color-faturamento)" strokeWidth={3} fill="url(#colorFaturamento)" />
                    <Area type="monotone" dataKey="pedidos" stroke="var(--color-pedidos)" strokeWidth={2} fill="url(#colorPedidos)" />
                  </AreaChart>
                </ChartContainer>
              </div>
            </div>

            {/* Card Operação */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/40 flex flex-col justify-between h-[280px] md:h-[300px]">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground">Operação</span>
                <MoreHorizontal size={20} className="text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
              
              <div className="flex items-end gap-6 md:gap-10 mt-6">
                <div>
                  <div className="text-primary flex items-center mb-1 md:mb-2"><Clock size={16} /></div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">{tempoMedioStr}</div>
                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground mt-1">Tempo Médio</div>
                </div>
                <div>
                  <div className="text-destructive flex items-center mb-1 md:mb-2"><FileWarning size={16} /></div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">{taxaRejeicao.toFixed(1)}%</div>
                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground mt-1">Rejeição</div>
                </div>
              </div>

              {/* BarChart (Distribuição Tempos) */}
              <div className="mt-auto h-24 pt-4 w-full relative">
                <ChartContainer config={chartConfigOp} className="h-full w-full">
                  <BarChart data={operacaoData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <RechartsTooltip content={<ChartTooltipContent />} cursor={{fill: 'transparent'}} />
                    <XAxis dataKey="faixa" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={16}>
                      {operacaoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          index === 0 ? '#10b981' : 
                          index === 1 ? '#3b82f6' : 
                          index === 2 ? '#f59e0b' : 
                          '#ef4444'
                        } />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

          </div>

          {/* Linha Inferior (Fluxo Produção) */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/40 min-h-[380px] flex flex-col overflow-hidden">
             <div className="flex items-center justify-between mb-4">
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground">Fluxo de Produção</span>
                <MoreHorizontal size={20} className="text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
              
              <div className="flex-1 w-full min-h-[220px]">
                <ChartContainer config={chartConfigFluxo} className="h-full w-full">
                  <BarChart data={fluxoProducaoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="hora" axisLine={false} tickLine={false} tickMargin={10} tick={{fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <RechartsTooltip content={<ChartTooltipContent />} cursor={{fill: 'var(--color-primary)', opacity: 0.05}} />
                    <Bar dataKey="produzidos" radius={[4, 4, 0, 0]} fill="var(--color-produzidos)" barSize={12} />
                    <Bar dataKey="pendentes" radius={[4, 4, 0, 0]} fill="var(--color-pendentes)" barSize={12} />
                  </BarChart>
                </ChartContainer>
              </div>
              
              {/* Legenda */}
              <div className="flex items-center justify-between mt-6 px-4 pt-4 border-t border-border/40">
                 <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary/20"></div> Produzidos ({totalProduzidos})
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-amber-400/20"></div> Pendentes ({totalFluxoPendentes})
                    </div>
                 </div>
                 <div className="text-sm font-bold text-foreground">Total: <span className="text-primary">{totalProduzidos + totalFluxoPendentes}</span></div>
              </div>
          </div>
          
        </div>

        {/* Coluna Direita (1/3) - Fila do Caixa */}
        <div className="xl:col-span-1 bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 min-h-[700px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              Fila do Caixa
              <span className="bg-destructive/10 text-destructive text-[10px] px-2 py-0.5 rounded-full">{filaPedidos.length} pendentes</span>
            </span>
            <MoreHorizontal size={20} className="text-muted-foreground cursor-pointer hover:text-foreground" />
          </div>

          <div className="flex-1 relative mt-4">
             {filaPedidos.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                 <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    🎉
                 </div>
                 <p className="font-bold text-sm">Tudo tranquilo!</p>
                 <p className="text-xs">Nenhum pedido na fila.</p>
               </div>
             ) : (
               <div className="flex flex-col gap-6 ml-4 border-l-2 border-border/40 pl-6 py-4 relative">
                  {filaPedidos.map((pedido) => {
                    const d = new Date(pedido.createdAt)
                    const time = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
                    
                    let badge = { bg: "bg-slate-100", text: "text-slate-600", letter: "O", ring: "ring-slate-400" }
                    let title = `Pedido #${pedido.id.slice(0,4)}`
                    
                    if (pedido.channel === 'DELIVERY') {
                       badge = { bg: "bg-blue-100", text: "text-blue-600", letter: "D", ring: "ring-blue-400" }
                       title = `Delivery #${pedido.id.slice(0,4)}`
                    } else if (pedido.channel === 'TABLE') {
                       badge = { bg: "bg-emerald-100", text: "text-emerald-700", letter: "M", ring: "ring-emerald-400" }
                       title = `Mesa ${pedido.tableId}`
                    } else if (pedido.channel === 'PICKUP') {
                       badge = { bg: "bg-amber-100", text: "text-amber-700", letter: "R", ring: "ring-amber-400" }
                       title = `Retirada #${pedido.id.slice(0,4)}`
                    }

                    return (
                      <div key={pedido.id} className="relative">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] border-white ${badge.bg} z-10 shadow-sm`}></div>
                        
                        {/* Card */}
                        <div 
                          onClick={() => setSelectedOrder({
                             titulo: title,
                             status: pedido.status,
                             tempo: time,
                             itens: pedido.items.map(i => `${i.quantidade}x ${i.nome}`)
                          })}
                          className={`bg-white h-14 rounded-2xl flex items-center px-4 font-bold text-xs justify-between shadow-sm border border-border/50 cursor-pointer hover:ring-2 ${badge.ring} hover:border-transparent transition-all group`}
                        >
                           <div className="flex items-center gap-3">
                             <span className={`w-8 h-8 rounded-full ${badge.bg} ${badge.text} flex items-center justify-center shadow-inner`}>{badge.letter}</span>
                             <span className="text-sm">{title}</span>
                           </div>
                           <span className="text-muted-foreground group-hover:text-foreground transition-colors">{time}</span>
                        </div>
                      </div>
                    )
                  })}
               </div>
             )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between text-xs font-bold flex-wrap gap-4">
            <div className="flex gap-4">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Mesas</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Delivery</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Retirada</span>
            </div>
          </div>

        </div>

      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-0 border-border/40 overflow-hidden">
            <div className="bg-popover p-6 border-b border-border/40 flex items-center justify-between">
              <div className="flex flex-col">
                <DialogTitle className="text-2xl font-black text-foreground">
                  {selectedOrder?.titulo}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-sm font-bold text-emerald-600">{selectedOrder?.status}</span>
                  <span className="text-sm text-muted-foreground ml-2">⏳ {selectedOrder?.tempo}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-[#fcfbfb]">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Itens do Pedido</h4>
              <div className="flex flex-col gap-3">
                {selectedOrder?.itens?.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-border/40 shadow-sm">
                    <span className="font-bold text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      toast.success(`Pedido de ${selectedOrder?.titulo} confirmado com sucesso!`)
                      setSelectedOrder(null)
                    }}
                    className="flex-1 bg-black text-white rounded-xl py-3 font-bold shadow-sm hover:bg-black/80 transition-colors"
                  >
                    Confirmar
                  </button>
                  <button 
                    onClick={() => {
                      toast.error(`Pedido de ${selectedOrder?.titulo} foi cancelado.`)
                      setSelectedOrder(null)
                    }}
                    className="flex-1 bg-red-50 text-red-500 rounded-xl py-3 font-bold hover:bg-red-100 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  )
}
