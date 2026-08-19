"use client"

import { useState } from "react"
import { Activity, Clock, FileWarning, TrendingUp, Filter, MoreHorizontal } from "lucide-react"
import { useStore } from "@/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function DashboardPage() {
  const { produtos, usuarios } = useStore()
  
  // Fake metrics for demonstration, combining real data length
  const totalFaturamento = "R$ 4,2k"
  const totalPedidos = 142 + produtos.length
  const rejectRate = "2,1%"
  const pendentes = 8 + usuarios.length

  const [selectedOrder, setSelectedOrder] = useState<{titulo: string, status: string, tempo: string, itens: string[]} | null>(null)

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Título e Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-2 gap-6">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">
          Visão Geral
        </h1>
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-[140px] min-w-[120px]">
            <Select defaultValue="Hoje">
              <SelectTrigger className="bg-white rounded-full border-border/50 h-11 px-4 md:px-5 shadow-sm font-bold text-foreground w-full">
                <SelectValue placeholder="Data" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="Hoje">Hoje</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 md:w-[160px] min-w-[120px]">
            <Select defaultValue="Todas">
              <SelectTrigger className="bg-white rounded-full border-border/50 h-11 px-4 md:px-5 shadow-sm font-bold text-foreground w-full">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="iFood">iFood</SelectItem>
                <SelectItem value="Salao">Salão</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
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
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground">Faturamento</span>
                <MoreHorizontal size={20} className="text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
              
              <div className="flex items-end gap-6 md:gap-10 mt-6 z-10">
                <div>
                  <div className="text-emerald-500 flex items-center mb-1 md:mb-2"><TrendingUp size={16} /></div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">{totalFaturamento}</div>
                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground mt-1">Bruto Hoje</div>
                </div>
                <div>
                  <div className="text-amber-500 flex items-center mb-1 md:mb-2"><Activity size={16} /></div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">{totalPedidos}</div>
                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground mt-1">Pedidos Totais</div>
                </div>
              </div>

              {/* Mock de Gráfico de Linha Simplificado */}
              <div className="absolute bottom-0 left-0 right-0 h-24 opacity-60">
                 <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,80 Q50,20 100,60 T200,40 T300,70 T400,30" fill="none" stroke="#955251" strokeWidth="4" />
                    <path d="M0,90 Q80,50 150,80 T250,50 T350,90 T400,60" fill="none" stroke="#eab308" strokeWidth="2" />
                 </svg>
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
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">4m 12s</div>
                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground mt-1">Tempo Médio</div>
                </div>
                <div>
                  <div className="text-destructive flex items-center mb-1 md:mb-2"><FileWarning size={16} /></div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">{rejectRate}</div>
                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground mt-1">Rejeição</div>
                </div>
              </div>

              {/* Mock de Dots */}
              <div className="mt-auto flex flex-col gap-2 pt-6">
                <div className="flex gap-2 justify-between">
                  {[...Array(12)].map((_, i) => (
                    <div key={`d1-${i}`} className={`w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-primary' : 'bg-primary/20'}`}></div>
                  ))}
                </div>
                <div className="flex gap-2 justify-between">
                  {[...Array(12)].map((_, i) => (
                    <div key={`d2-${i}`} className={`w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-amber-400' : 'bg-secondary'}`}></div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Linha Inferior (Gráfico de Barras Longo) */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/40 h-[380px] flex flex-col relative overflow-hidden">
             <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground">Fluxo de Produção</span>
                <MoreHorizontal size={20} className="text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
              
              {/* Fake Bar Chart */}
              <div className="flex-1 flex items-end justify-between gap-2 mt-8 pb-8 px-4 border-b border-border/50 relative">
                 {/* Background Lines */}
                 <div className="absolute inset-x-0 bottom-8 top-0 flex flex-col justify-between z-0">
                    <div className="border-t border-border/30 w-full"></div>
                    <div className="border-t border-border/30 w-full"></div>
                    <div className="border-t border-border/30 w-full"></div>
                    <div className="border-t border-border/30 w-full"></div>
                 </div>

                 {/* Bars */}
                 {[40, 70, 45, 80, 50, 90, 60, 40, 85].map((h, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                      <div 
                        className="w-12 bg-primary/20 group-hover:bg-primary/40 rounded-full transition-colors flex items-end justify-center pb-2" 
                        style={{ height: `${h}%` }}
                      >
                         <div className="w-8 bg-primary rounded-full" style={{ height: `${h * 0.7}%` }}></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white border border-border/50 shadow-sm flex items-center justify-center text-xs font-bold z-20 absolute -bottom-4">
                        {h}
                      </div>
                    </div>
                 ))}
              </div>
              
              {/* Legenda */}
              <div className="flex items-center justify-between mt-6 px-4">
                 <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary/20"></div> Produzidos
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-amber-400/20"></div> Pendentes
                    </div>
                 </div>
                 <div className="text-sm font-bold text-foreground">Total: <span className="text-primary">{totalPedidos * 8}</span></div>
              </div>
          </div>
          
        </div>

        {/* Coluna Direita (1/3) - Timeline */}
        <div className="xl:col-span-1 bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 min-h-[700px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fila do Caixa</span>
            <MoreHorizontal size={20} className="text-muted-foreground cursor-pointer hover:text-foreground" />
          </div>

          <div className="flex-1 relative">
             {/* Eixo Y */}
             <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] font-bold text-muted-foreground/70 pr-4 w-12 text-right z-10 bg-white">
                <span>15:30</span>
                <span>15:15</span>
                <span>15:00</span>
                <span>14:45</span>
                <span>14:30</span>
                <span>14:15</span>
             </div>

             {/* Grid and Gantt Items */}
             <div className="absolute left-12 right-0 top-0 bottom-8 border-l border-border/50 z-20 flex flex-col">
                <div className="flex-1 border-b border-border/20 border-dashed relative">
                   <div 
                     onClick={() => {
                        toast("Abrindo detalhes da Mesa 16...")
                        setSelectedOrder({ titulo: "Mesa 16", status: "Em Preparo", tempo: "15:30", itens: ["2x X-Burger Clássico", "1x Batata Frita G"] })
                     }} 
                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-700 h-10 w-[70%] rounded-full flex items-center px-4 font-bold text-xs justify-between shadow-sm border border-emerald-200 cursor-pointer hover:ring-2 ring-emerald-400 transition-all"
                   >
                     <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">D</span>
                     <span>Mesa 16</span>
                   </div>
                </div>
                <div className="flex-1 border-b border-border/20 border-dashed relative">
                   <div 
                     onClick={() => setSelectedOrder({ titulo: "iFood 29", status: "Na Fila", tempo: "15:15", itens: ["1x Combo Master", "1x Refrigerante Lata"] })} 
                     className="absolute right-10 top-1/2 -translate-y-1/2 bg-amber-100 text-amber-700 h-10 w-[60%] rounded-full flex items-center px-4 font-bold text-xs justify-between shadow-sm border border-amber-200 cursor-pointer hover:ring-2 ring-amber-400 transition-all"
                   >
                     <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">i</span>
                     <span>iFood 29</span>
                   </div>
                </div>
                <div className="flex-1 border-b border-border/20 border-dashed relative">
                   <div 
                     onClick={() => setSelectedOrder({ titulo: "Balcão 15", status: "Em Preparo", tempo: "15:00", itens: ["1x X-Salada", "1x Suco Natural"] })} 
                     className="absolute left-10 top-1/2 -translate-y-1/2 bg-white text-foreground h-10 w-[50%] rounded-full flex items-center px-4 font-bold text-xs justify-between shadow-sm border border-border cursor-pointer hover:ring-2 ring-primary/40 transition-all"
                   >
                     <div className="flex -space-x-2">
                       <div className="w-6 h-6 rounded-full bg-primary/20 border border-white z-20"></div>
                       <div className="w-6 h-6 rounded-full bg-primary/40 border border-white z-10"></div>
                     </div>
                     <span>Balcão 15</span>
                   </div>
                </div>
                <div className="flex-1 border-b border-border/20 border-dashed relative">
                   <div 
                     onClick={() => setSelectedOrder({ titulo: "Mesa 21", status: "Aguardando Retirada", tempo: "14:45", itens: ["4x Chopp Pilsen", "1x Porção de Fritas"] })} 
                     className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-700 h-10 w-[80%] rounded-full flex items-center px-4 font-bold text-xs justify-between shadow-sm border border-emerald-200 cursor-pointer hover:ring-2 ring-emerald-400 transition-all"
                   >
                     <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-primary">🍔</span>
                     <span>Mesa 21</span>
                   </div>
                </div>
                <div className="flex-1 border-b border-border/20 border-dashed relative">
                   <div 
                     onClick={() => setSelectedOrder({ titulo: "WhatsApp 10", status: "Em Trânsito (Motoboy)", tempo: "14:30", itens: ["2x X-Tudo", "1x Guaraná 2L"] })} 
                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-foreground h-10 w-[40%] rounded-full flex items-center px-4 font-bold text-xs justify-between shadow-sm border border-border cursor-pointer hover:ring-2 ring-blue-400 transition-all"
                   >
                     <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">W</span>
                     <span>WhatsApp 10</span>
                   </div>
                </div>
                <div className="flex-1 relative">
                   <div 
                     onClick={() => setSelectedOrder({ titulo: "Telefone 08", status: "Entregue", tempo: "14:15", itens: ["1x Pizza Calabresa"] })} 
                     className="absolute left-1/4 top-1/2 -translate-y-1/2 bg-white text-foreground h-10 w-[60%] rounded-full flex items-center px-4 font-bold text-xs justify-between shadow-sm border border-border cursor-pointer hover:ring-2 ring-sky-400 transition-all"
                   >
                     <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">T</span>
                     <span>Telefone 08</span>
                   </div>
                </div>
             </div>
             
             {/* Eixo X inferior */}
             <div className="absolute left-12 right-0 bottom-0 h-8 flex items-end justify-between px-4 text-[10px] font-bold text-muted-foreground/70">
                <span>0</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
                <span>25</span>
                <span>30</span>
             </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between text-xs font-bold">
            <div className="flex gap-4">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Salão</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> App</span>
            </div>
            <div className="text-foreground">Total: <span className="text-primary">{pendentes} pendentes</span></div>
          </div>

        </div>

      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-0 border-border/40 overflow-hidden">
            {/* Header da Modal */}
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
            
            {/* Itens do Pedido */}
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
