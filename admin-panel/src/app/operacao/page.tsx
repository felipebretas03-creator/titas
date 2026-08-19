"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Moon, Sun, Smartphone, Phone, Store, TrendingUp, CheckCircle2, Clock, AlertTriangle, Truck, ChefHat, Utensils } from "lucide-react"

export default function OperationsLiveBoard() {
  const [isDark, setIsDark] = useState(false)

  // Mocks Estáticos baseados no pedido do usuário
  const metrics = {
    origem: { ifood: 42, telefone: 18, salao: 65 },
    financeiro: {
      entrou: 3450.00,
      saiu: 210.00,
      pagos: 110,
      pendentes: 15,
      ticketMedio: 115.50
    },
    logistica: {
      atrasados: 4,
      entregando: 8,
      prontos: 12,
      mesasOcupadas: 18,
      totalMesas: 30
    }
  }

  const activeOrders = [
    { id: "1045", origem: "iFood", status: "Em Rota", valor: 145.90, pago: true, tempo: "45m" },
    { id: "1046", origem: "Telefone", status: "Atrasado", valor: 89.50, pago: false, tempo: "55m" },
    { id: "1047", origem: "Salão (Mesa 04)", status: "Pronto", valor: 210.00, pago: false, tempo: "12m" },
    { id: "1048", origem: "Salão (Mesa 16)", status: "Preparando", valor: 75.00, pago: true, tempo: "8m" },
    { id: "1049", origem: "iFood", status: "Preparando", valor: 45.90, pago: true, tempo: "15m" },
    { id: "1050", origem: "Telefone", status: "Pronto", valor: 120.00, pago: false, tempo: "22m" },
  ]

  const formatCurrency = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`

  // Estilos baseados no Tema
  const themeClasses = {
    bgApp: isDark ? "bg-[#0f1115]" : "bg-[#f0e9e8]",
    textMain: isDark ? "text-white" : "text-foreground",
    textMuted: isDark ? "text-gray-400" : "text-muted-foreground",
    cardBg: isDark ? "bg-[#1c1f26] border-[#2d313a]" : "bg-white border-border/40",
    headerBg: isDark ? "bg-[#15171c] border-[#2d313a]" : "bg-white border-border/40",
    btnHover: isDark ? "hover:bg-[#2d313a]" : "hover:bg-black/5",
  }

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-500 ${themeClasses.bgApp} ${themeClasses.textMain}`}>
      
      {/* HEADER LIVE BOARD */}
      <header className={`h-20 px-8 border-b shadow-sm flex items-center justify-between z-10 transition-colors duration-500 ${themeClasses.headerBg}`}>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-[#2d313a] text-white hover:bg-[#3f4451]' : 'bg-secondary text-foreground hover:bg-black/10'}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center shadow-sm">
                <ChefHat size={22} />
             </div>
             <div>
               <h1 className="hidden sm:block text-xl font-black uppercase tracking-tight leading-none">Painel de Operação</h1>
               <div className="flex items-center gap-2 mt-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className={`text-xs font-bold ${themeClasses.textMuted}`}>Atualizado em tempo real</span>
               </div>
             </div>
          </div>
        </div>

        <button 
          onClick={() => setIsDark(!isDark)}
          type="button"
          className={`relative z-50 cursor-pointer flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm transition-all border shrink-0 ${isDark ? 'bg-[#2d313a] border-[#3f4451] text-amber-400' : 'bg-white border-border/50 text-indigo-900 shadow-sm'}`}
        >
          <div className="pointer-events-none flex items-center gap-2">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="hidden sm:inline">{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
          </div>
        </button>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        
        {/* TOP ROW: ORIGEM DOS PEDIDOS & LOGÍSTICA BÁSICA */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          
          {/* Card Volume iFood */}
          <div className={`rounded-3xl p-6 border shadow-sm flex items-center justify-between ${themeClasses.cardBg}`}>
            <div>
              <p className={`text-sm font-bold uppercase tracking-wider ${themeClasses.textMuted} mb-1`}>Pedidos iFood</p>
              <h3 className="text-4xl font-black text-red-500">{metrics.origem.ifood}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
               <Smartphone size={28} />
            </div>
          </div>

          {/* Card Volume Telefone */}
          <div className={`rounded-3xl p-6 border shadow-sm flex items-center justify-between ${themeClasses.cardBg}`}>
            <div>
              <p className={`text-sm font-bold uppercase tracking-wider ${themeClasses.textMuted} mb-1`}>Telefone/WhatsApp</p>
              <h3 className="text-4xl font-black text-blue-500">{metrics.origem.telefone}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
               <Phone size={28} />
            </div>
          </div>

          {/* Card Volume Loja */}
          <div className={`rounded-3xl p-6 border shadow-sm flex items-center justify-between ${themeClasses.cardBg}`}>
            <div>
              <p className={`text-sm font-bold uppercase tracking-wider ${themeClasses.textMuted} mb-1`}>Salão Local</p>
              <h3 className="text-4xl font-black text-emerald-500">{metrics.origem.salao}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
               <Store size={28} />
            </div>
          </div>

          {/* Mesas Ocupadas */}
          <div className={`rounded-3xl p-6 border shadow-sm flex flex-col justify-center ${themeClasses.cardBg} relative overflow-hidden`}>
            <div className="flex justify-between items-center z-10">
              <p className={`text-sm font-bold uppercase tracking-wider ${themeClasses.textMuted} mb-1`}>Mesas Ocupadas</p>
              <Utensils size={20} className={themeClasses.textMuted} />
            </div>
            <div className="flex items-end gap-2 z-10">
               <h3 className="text-4xl font-black text-primary">{metrics.logistica.mesasOcupadas}</h3>
               <span className={`text-lg font-bold ${themeClasses.textMuted} mb-1`}>/ {metrics.logistica.totalMesas}</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary" style={{ width: `${(metrics.logistica.mesasOcupadas/metrics.logistica.totalMesas)*100}%` }}></div>
          </div>

        </div>

        {/* MIDDLE ROW: FINANCEIRO CAIXA & LOGÍSTICA CRÍTICA */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          
          {/* Caixa (Financeiro) */}
          <div className={`xl:col-span-2 rounded-3xl p-6 md:p-8 border shadow-sm flex flex-col justify-between ${themeClasses.cardBg}`}>
            <h2 className="text-lg font-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" /> Visão do Caixa
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted} mb-2`}>Entrou (Receitas)</p>
                <p className="text-2xl md:text-3xl font-black text-emerald-500">{formatCurrency(metrics.financeiro.entrou)}</p>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted} mb-2`}>Saiu (Despesas)</p>
                <p className="text-2xl md:text-3xl font-black text-red-500">{formatCurrency(metrics.financeiro.saiu)}</p>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t ${isDark ? 'border-white/10' : 'border-border/50'}`}>
               <div className="flex items-center justify-between sm:justify-start sm:gap-8 w-full sm:w-auto">
                 <div className="flex flex-col">
                   <span className={`text-[10px] font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Pedidos Pagos</span>
                   <span className="text-emerald-500 font-bold flex items-center gap-1 mt-1"><CheckCircle2 size={14}/> {metrics.financeiro.pagos}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className={`text-[10px] font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Faltam Pagar</span>
                   <span className="text-amber-500 font-bold flex items-center gap-1 mt-1"><Clock size={14}/> {metrics.financeiro.pendentes}</span>
                 </div>
               </div>
               <div className="flex flex-col sm:text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Ticket Médio</span>
                  <span className={`font-black text-lg ${themeClasses.textMain} tracking-tight mt-1`}>{formatCurrency(metrics.financeiro.ticketMedio)}</span>
               </div>
            </div>
          </div>

          {/* Status Logístico (Alertas) */}
          <div className={`rounded-3xl p-6 md:p-8 border shadow-sm flex flex-col justify-between ${themeClasses.cardBg}`}>
            <h2 className="text-lg font-black uppercase tracking-wider mb-6">Status Logístico</h2>
            
            <div className="flex flex-col gap-4">
               {/* Atrasados */}
               <div className="flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                 <div className="flex items-center gap-3">
                   <AlertTriangle size={20} className="text-red-500" />
                   <span className="font-bold text-red-500">Pedidos Atrasados</span>
                 </div>
                 <span className="text-2xl font-black text-red-500">{metrics.logistica.atrasados}</span>
               </div>
               
               {/* Entregando */}
               <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                 <div className="flex items-center gap-3">
                   <Truck size={20} className="text-sky-500" />
                   <span className="font-bold text-sky-500">Sendo Entregues</span>
                 </div>
                 <span className="text-2xl font-black text-sky-500">{metrics.logistica.entregando}</span>
               </div>

               {/* Prontos / Aguardando */}
               <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                 <div className="flex items-center gap-3">
                   <CheckCircle2 size={20} className="text-emerald-500" />
                   <span className="font-bold text-emerald-500">Prontos p/ Retirar</span>
                 </div>
                 <span className="text-2xl font-black text-emerald-500">{metrics.logistica.prontos}</span>
               </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: LISTA DETALHADA DE PEDIDOS (MOCK) */}
        <div className={`rounded-3xl border shadow-sm ${themeClasses.cardBg} overflow-hidden`}>
           <div className={`p-6 border-b ${isDark ? 'border-[#2d313a]' : 'border-border/40'} flex justify-between items-center`}>
              <h2 className="text-lg font-black uppercase tracking-wider">Lista de Pedidos Ativos</h2>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${isDark ? 'bg-[#2d313a]' : 'bg-secondary'}`}>6 encontrados</span>
           </div>

           {/* Filtros */}
           <div className="flex flex-wrap items-center gap-2 p-6 pb-2">
              {['Todos', 'iFood', 'WhatsApp', 'Salão'].map(filter => (
                 <button 
                   key={filter}
                   className={`px-4 md:px-6 py-2 rounded-full text-xs font-bold shadow-sm transition-all whitespace-nowrap
                     ${filter === 'Todos' ? 'bg-primary text-white' : `${isDark ? 'bg-[#15171c] text-white hover:bg-[#1f2229]' : 'bg-white text-muted-foreground hover:bg-black/5'} border ${isDark ? 'border-white/5' : 'border-border/50'}`}
                   `}
                 >
                   {filter}
                 </button>
              ))}
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className={`${isDark ? 'bg-[#15171c]' : 'bg-secondary/30'} text-xs uppercase tracking-wider ${themeClasses.textMuted}`}>
                   <th className="p-4 font-bold border-b border-transparent">ID</th>
                   <th className="p-4 font-bold border-b border-transparent">Origem</th>
                   <th className="p-4 font-bold border-b border-transparent">Status Operacional</th>
                   <th className="p-4 font-bold border-b border-transparent">Tempo</th>
                   <th className="p-4 font-bold border-b border-transparent">Pagamento</th>
                   <th className="p-4 font-bold border-b border-transparent text-right">Valor</th>
                 </tr>
               </thead>
               <tbody className="text-sm font-bold">
                 {activeOrders.map((order) => (
                   <tr key={order.id} className={`border-b ${isDark ? 'border-[#2d313a] hover:bg-[#2d313a]/50' : 'border-border/40 hover:bg-black/5'} transition-colors`}>
                     <td className="p-4">#{order.id}</td>
                     <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs border ${
                          order.origem === 'iFood' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          order.origem === 'Telefone' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                          {order.origem}
                        </span>
                     </td>
                     <td className="p-4">
                        <div className="flex items-center gap-2">
                           {order.status === 'Atrasado' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                           {order.status === 'Em Rota' && <div className="w-2 h-2 rounded-full bg-sky-500"></div>}
                           {order.status === 'Pronto' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                           {order.status === 'Preparando' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                           {order.status}
                        </div>
                     </td>
                     <td className={`p-4 ${order.status === 'Atrasado' ? 'text-red-500' : ''}`}>{order.tempo}</td>
                     <td className="p-4">
                        {order.pago ? (
                          <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={16}/> Pago</span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-500"><Clock size={16}/> Pendente</span>
                        )}
                     </td>
                     <td className="p-4 text-right font-black text-base">{formatCurrency(order.valor)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

      </main>
    </div>
  )
}
