"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { User, Clock, CheckCircle2, AlertCircle, LayoutGrid, BellRing, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableDetailsSheet } from "./components/table-details-sheet"
import { useStore, Mesa, SessaoMesa, SolicitacaoAtendimento, Pedido } from "@/store"

export default function MesasPage() {
  const { mesas, sessoesMesa, pedidos, solicitacoesAtendimento, updateMesa, addMesa, deleteMesa } = useStore()
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'Todas' | 'Livres' | 'Ocupadas' | 'Alertas'>('Todas')

  const selectedTable = mesas.find(m => m.id === selectedTableId) || null

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      // Keep real-time sync when other tabs modify local storage
      if (e.key === 'titas-core-storage' && e.newValue) {
        useStore.persist.rehydrate();
      }
    }
    window.addEventListener('storage', handleStorage)
    
    // Auto-generate 18 tables if not done yet
    if (mesas.length <= 3 && !localStorage.getItem('mesas_generated')) {
      mesas.forEach(m => deleteMesa(m.id))
      for (let i = 1; i <= 18; i++) {
        addMesa({
          name: `Mesa ${String(i).padStart(2, '0')}`,
          capacity: 4,
          token_hash: `mesa${i}xyz`,
          status: 'AVAILABLE',
          active: true
        })
      }
      localStorage.setItem('mesas_generated', 'true')
    }

    return () => window.removeEventListener('storage', handleStorage)
  }, [mesas, deleteMesa, addMesa])

  const getTableSession = (tableId: string): SessaoMesa | undefined => {
    return sessoesMesa.find(s => s.table_id === tableId && s.status !== 'CLOSED')
  }

  const getTablePendingAlerts = (tableId: string): SolicitacaoAtendimento[] => {
    return solicitacoesAtendimento.filter(s => s.tableId === tableId && s.status !== 'RESOLVED' && s.status !== 'CANCELLED')
  }

  const filteredTables = mesas.filter(table => {
    if (filter === 'Livres') return table.status === 'AVAILABLE'
    if (filter === 'Ocupadas') return table.status !== 'AVAILABLE'
    if (filter === 'Alertas') return table.status === 'SERVICE_REQUESTED' || table.status === 'BILL_REQUESTED'
    return true
  })

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header Area */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mt-2">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <span className="text-destructive">
              <LayoutGrid size={28} />
            </span>
            Gestão de Mesas
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Monitoramento em tempo real do salão e atendimento.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-border/40 rounded-full p-1 shadow-sm">
            <Button 
              variant="ghost" 
              onClick={() => setFilter('Todas')}
              className={`rounded-full px-5 h-9 font-medium transition-colors ${filter === 'Todas' ? 'bg-muted/50 text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Todas ({mesas.length})
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setFilter('Livres')}
              className={`rounded-full px-5 h-9 font-medium transition-colors ${filter === 'Livres' ? 'bg-muted/50 text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Livres ({mesas.filter(t => t.status === 'AVAILABLE').length})
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setFilter('Ocupadas')}
              className={`rounded-full px-5 h-9 font-medium transition-colors ${filter === 'Ocupadas' ? 'bg-muted/50 text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Ocupadas ({mesas.filter(t => t.status !== 'AVAILABLE').length})
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setFilter('Alertas')}
            className={`rounded-full font-bold gap-2 transition-colors ${filter === 'Alertas' ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 hover:text-amber-700'}`}
          >
            <AlertCircle size={16} /> Alertas ({mesas.filter(t => t.status === 'SERVICE_REQUESTED' || t.status === 'BILL_REQUESTED').length})
          </Button>
          
          <Button variant="outline" onClick={() => {
            const firstTableToken = mesas.length > 0 ? mesas[0].token_hash : 'abc123xyz';
            window.open(`/mesa/${firstTableToken}`, '_blank');
          }} className="rounded-full border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 font-bold gap-2">
            <BellRing size={16} /> Simular Tablet
          </Button>
          
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10 shrink-0 cursor-not-allowed">
            <SlidersHorizontal size={18} className="text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTables.map(table => {
          const session = getTableSession(table.id)
          const isClosing = table.status === 'BILL_REQUESTED' || table.status === 'CLOSING'
          const isCalling = table.status === 'SERVICE_REQUESTED'
          const isFree = table.status === 'AVAILABLE'
          const isPreparing = table.status === 'PREPARING'
          const isOccupied = table.status === 'OCCUPIED' || table.status === 'READY'
          const isNewOrder = table.status === 'NEW_ORDER'

          return (
            <Card 
              key={table.id}
              onClick={() => setSelectedTableId(table.id)}
              className={`
                cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] 
                border-2 rounded-[1.5rem] shadow-sm relative overflow-hidden flex flex-col min-h-[220px]
                ${isFree ? 'border-emerald-300 bg-white' : ''}
                ${(isOccupied || isNewOrder) ? 'border-blue-400 bg-white' : ''}
                ${isPreparing ? 'border-orange-400 bg-orange-50/30' : ''}
                ${isCalling ? 'border-amber-400 bg-amber-50/50' : ''}
                ${isClosing ? 'border-rose-300 bg-rose-50/50' : ''}
                ${!table.active ? 'opacity-50' : ''}
              `}
            >
              {/* Top row */}
              <div className="flex justify-between items-start p-5">
                <div className={`
                  flex items-center justify-center min-w-12 h-10 px-3 rounded-[0.6rem] text-xl font-black text-white
                  ${isFree ? 'bg-emerald-500' : ''}
                  ${(isOccupied || isNewOrder) ? 'bg-blue-500' : ''}
                  ${isPreparing ? 'bg-orange-500' : ''}
                  ${isCalling ? 'bg-amber-500' : ''}
                  ${isClosing ? 'bg-rose-500' : ''}
                `}>
                  {table.name}
                </div>
                
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/5 text-muted-foreground font-semibold text-sm">
                  <User size={14} />
                  <span>{table.capacity}</span>
                </div>
              </div>
              
              {/* Middle row */}
              <div className="px-5 flex-1 flex flex-col justify-center">
                {isFree && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold tracking-wide text-sm">
                    <CheckCircle2 size={16} /> DISPONÍVEL
                  </div>
                )}
                {isCalling && (
                  <div className="flex items-center gap-2 text-amber-600 font-bold tracking-wide text-sm">
                    <AlertCircle size={16} /> GARÇOM!
                  </div>
                )}
                {isClosing && (
                  <div className="flex items-center gap-2 text-rose-600 font-bold tracking-wide text-sm">
                    <AlertCircle size={16} /> CONTA
                  </div>
                )}
                {isOccupied && session && table.status === 'OCCUPIED' && (
                  <div className="flex items-center gap-2 text-blue-600 font-bold tracking-wide text-sm">
                    <Clock size={16} /> Ocupada
                  </div>
                )}
                {table.status === 'PREPARING' && (
                  <div className="flex items-center gap-2 text-orange-600 font-bold tracking-wide text-sm">
                    <Clock size={16} /> EM PRODUÇÃO
                  </div>
                )}
                {table.status === 'READY' && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold tracking-wide text-sm">
                    <CheckCircle2 size={16} /> PRONTO
                  </div>
                )}
                {isNewOrder && (
                  <div className="flex items-center gap-2 text-purple-600 font-bold tracking-wide text-sm">
                    <BellRing size={16} /> NOVO PEDIDO
                  </div>
                )}
              </div>
              
              {/* Bottom row */}
              <div className="px-5 pb-5 flex justify-between items-end">
                {session ? (
                  <>
                    <div className="flex flex-col items-start justify-end h-full">
                      <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase mb-1">Tempo</span>
                      <TableTimer openedAt={session.openedAt} />
                    </div>
                    <div className="flex flex-col items-end justify-end h-full">
                      <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase mb-1">Total</span>
                      <span className={`text-2xl font-black ${isClosing ? 'text-rose-600' : 'text-foreground'}`}>
                        R$ {session.totalAmount.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="h-8" />
                )}
              </div>
            </Card>
          )
        })}
      </div>

      <TableDetailsSheet 
        tableId={selectedTableId} 
        isOpen={!!selectedTableId} 
        onClose={() => setSelectedTableId(null)} 
      />
    </div>
  )
}

function TableTimer({ openedAt }: { openedAt: string }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const updateElapsed = () => {
      setElapsed(Math.floor((Date.now() - new Date(openedAt).getTime()) / 1000))
    }
    updateElapsed()
    const interval = setInterval(updateElapsed, 1000)
    return () => clearInterval(interval)
  }, [openedAt])

  const hours = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-black/5 px-2 py-1 rounded-md" suppressHydrationWarning>
      <Clock size={12} />
      {hours > 0 ? `${hours}h ` : ''}{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  )
}
