import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Plus, Minus, Check, UtensilsCrossed, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useStore, MesaStatus, SessaoMesaStatus, generateId } from "@/store"

interface TableDetailsSheetProps {
  tableId: string | null
  isOpen: boolean
  onClose: () => void
}

export function TableDetailsSheet({ tableId, isOpen, onClose }: TableDetailsSheetProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  
  const store = useStore()
  const table = store.mesas.find(m => m.id === tableId)
  const session = store.sessoesMesa.find(s => s.table_id === tableId && s.status !== 'CLOSED')
  const requests = store.solicitacoesAtendimento.filter(s => s.tableId === tableId && s.status === 'PENDING')
  const orders = store.pedidos.filter(p => session && p.sessionId === session.id)

  if (!table) return null

  const handleUpdateStatus = (status: MesaStatus) => {
    store.updateMesa(table.id, { status })
    
    if (status === 'PREPARING') {
      const newOrders = orders.filter(o => o.status === 'CONFIRMED')
      newOrders.forEach(order => {
        store.updatePedido(order.id, { status: 'PREPARING' })
      })
      if (newOrders.length > 0) toast.success("Pedidos atualizados para Em Produção.")
    } else if (status === 'READY') {
      const prepOrders = orders.filter(o => o.status === 'PREPARING' || o.status === 'CONFIRMED')
      prepOrders.forEach(order => {
        store.updatePedido(order.id, { status: 'READY' })
      })
      if (prepOrders.length > 0) toast.success("Pedidos atualizados para Pronto.")
    }
  }

  const handleOpenTable = () => {
    store.addSessaoMesa({
      table_id: table.id,
      status: 'OPEN',
      openedAt: new Date().toISOString(),
      totalAmount: 0
    })
    handleUpdateStatus('OCCUPIED')
    toast.success(`Mesa ${table.name} aberta com sucesso!`)
  }

  const handleResolveRequests = () => {
    requests.forEach(req => {
      store.updateSolicitacaoAtendimento(req.id, { status: 'RESOLVED' })
    })
    
    // Update table status if no pending requests
    if (table.status === 'SERVICE_REQUESTED') {
      handleUpdateStatus('OCCUPIED')
    } else if (table.status === 'BILL_REQUESTED') {
      // Don't change to occupied yet if they requested the bill, wait for closure
    }
    toast.success("Solicitações resolvidas.")
  }



  const handleCloseBill = () => {
    if (session) {
      store.updateSessaoMesa(session.id, { status: 'BILL_REQUESTED', billRequestedAt: new Date().toISOString() })
    }
    handleUpdateStatus('BILL_REQUESTED')
    toast.success(`Conta da ${table.name} Fechada!`, {
      description: "Vá até a mesa realizar a cobrança."
    })
  }

  const handleReleaseTable = () => {
    if (session) {
      store.updateSessaoMesa(session.id, { status: 'CLOSED', closedAt: new Date().toISOString() })
    }
    handleUpdateStatus('AVAILABLE')
    // Reset requests
    requests.forEach(req => {
      store.updateSolicitacaoAtendimento(req.id, { status: 'RESOLVED' })
    })
    toast.success(`${table.name} liberada com sucesso!`, {
      description: "O tablet da mesa voltará à tela de boas-vindas."
    })
    onClose()
  }

  const handleAddProduct = (product: { preco: number }) => {
    if (!session) return;
    
    store.addPedido({
      channel: 'TABLE',
      tableId: table.id,
      sessionId: session.id,
      status: 'CONFIRMED',
      total: product.preco,
      items: [
        {
          id: generateId(),
          produtoId: product.id,
          nome: product.nome,
          quantidade: 1,
          precoUnitario: product.preco
        }
      ]
    })
    
    // Update session total
    store.updateSessaoMesa(session.id, { totalAmount: session.totalAmount + product.preco })
    
    if (table.status === 'AVAILABLE') {
      handleUpdateStatus('OCCUPIED')
    }
    toast.success(`${product.nome} adicionado à ${table.name}!`)
    setIsOrderModalOpen(false)
  }

  const displayStatus = {
    'AVAILABLE': 'Livre',
    'OCCUPIED': 'Ocupada',
    'NEW_ORDER': 'Novo Pedido',
    'PREPARING': 'Em Produção',
    'READY': 'Pronto',
    'SERVICE_REQUESTED': 'Garçom',
    'BILL_REQUESTED': 'Conta',
    'CLOSING': 'Fechando',
    'CLOSED': 'Fechada',
    'INACTIVE': 'Inativa'
  }[table.status] || table.status;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col h-full border-l shadow-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-3xl font-black">{table.name}</SheetTitle>
          <SheetDescription className="text-base">
            Detalhes e pedidos da mesa.
          </SheetDescription>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm font-semibold text-muted-foreground">Capacidade (Lugares):</span>
            <div className="flex items-center bg-muted/50 rounded-lg p-1 border">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-md" 
                onClick={() => store.updateMesa(table.id, { capacity: Math.max(1, table.capacity - 1) })}
                disabled={table.capacity <= 1}
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center font-bold">{table.capacity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-md" 
                onClick={() => store.updateMesa(table.id, { capacity: table.capacity + 1 })}
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </SheetHeader>
        
        <div className="py-6 flex flex-col gap-4 flex-1">
          <div className="flex justify-between items-center p-4 bg-stone-50 rounded-xl relative">
            <span className="font-medium text-muted-foreground">Status Atual</span>
            <div className="relative">
              <span className={`font-bold uppercase px-4 py-1.5 rounded-full text-sm flex items-center gap-2
                  ${table.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-800" : ""}
                  ${(table.status === "OCCUPIED" || table.status === "NEW_ORDER" || table.status === "PREPARING" || table.status === "READY") ? "bg-blue-100 text-blue-800" : ""}
                  ${(table.status === "BILL_REQUESTED" || table.status === "CLOSING") ? "bg-rose-100 text-rose-800" : ""}
                  ${table.status === "SERVICE_REQUESTED" ? "bg-amber-100 text-amber-800" : ""}
                  ${table.status === "INACTIVE" ? "bg-gray-100 text-gray-800" : ""}
              `}>
                {displayStatus}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m6 9 6 6 6-6"/></svg>
              </span>
              <select 
                value={table.status}
                onChange={(e) => handleUpdateStatus(e.target.value as MesaStatus)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                <option value="AVAILABLE">Livre</option>
                <option value="OCCUPIED">Ocupada</option>
                <option value="NEW_ORDER">Novo Pedido</option>
                <option value="PREPARING">Em Produção</option>
                <option value="READY">Pronto</option>
                <option value="SERVICE_REQUESTED">Garçom</option>
                <option value="BILL_REQUESTED">Conta</option>
                <option value="INACTIVE">Inativa</option>
                <option value="INACTIVE">Inativa</option>
              </select>
            </div>
          </div>

          {requests.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <AlertTriangle size={18} />
                Solicitações Pendentes
              </div>
              <ul className="space-y-2">
                {requests.map(req => {
                  const getRequestLabel = (type: string) => {
                    switch(type) {
                      case 'WAITER': return 'Chamou o garçom'
                      case 'CLOSE_BILL': return 'Pediu a conta'
                      case 'NAPKINS': return 'Pediu guardanapos'
                      case 'CUTLERY': return 'Pediu talheres'
                      case 'ORDER_QUESTION': return 'Dúvida no pedido'
                      case 'ORDER_PROBLEM': return 'Problema no pedido'
                      case 'OTHER': return 'Outra solicitação'
                      default: return 'Solicitação'
                    }
                  }
                  return (
                    <li key={req.id} className="text-sm font-medium text-amber-900 bg-white p-2 rounded border border-amber-100">
                      - {getRequestLabel(req.type)}
                      {req.message && <span className="block text-xs text-amber-700 mt-1">&quot;{req.message}&quot;</span>}
                    </li>
                  )
                })}
              </ul>
              <Button onClick={handleResolveRequests} size="sm" className="bg-amber-500 hover:bg-amber-600 text-white w-full">
                <Check size={16} className="mr-2" /> Marcar como Resolvidas
              </Button>
            </div>
          )}
          
          <div className="flex justify-between items-center p-4 bg-stone-100 rounded-xl">
            <span className="font-medium text-[#4a1818]">Total da Conta</span>
            <span className="font-black text-2xl text-[#4a1818]">R$ {(session?.totalAmount || 0).toFixed(2).replace('.', ',')}</span>
          </div>

          {orders.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-muted-foreground"><UtensilsCrossed size={16}/> Histórico de Pedidos</h4>
              <div className="flex flex-col gap-2">
                {orders.map((order, i) => (
                  <div key={order.id} className="p-3 border rounded-lg bg-white shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-bold text-sm text-muted-foreground">Pedido #{i+1}</span>
                      <span className="font-bold text-sm">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantidade}x {item.nome}</span>
                          <span className="text-muted-foreground">R$ {(item.quantidade * item.precoUnitario).toFixed(2).replace('.', ',')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <SheetFooter className="mt-auto pt-4 flex-col sm:flex-col gap-3 sm:space-x-0 bg-white/90 backdrop-blur pb-6 sticky bottom-0 border-t">
          
          {!session && table.status === 'AVAILABLE' && (
             <Button 
               onClick={handleOpenTable}
               className="w-full h-14 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
             >
               Abrir Mesa Manualmente
             </Button>
          )}



          {session && (session.totalAmount > 0) && table.status !== 'BILL_REQUESTED' && (
            <Button 
              onClick={handleCloseBill} 
              variant="outline"
              className="w-full h-14 rounded-xl text-lg font-bold border-pink-400 text-pink-600 hover:bg-pink-50 hover:text-pink-700"
            >
              Fechar Conta
            </Button>
          )}

          {(table.status === 'BILL_REQUESTED' || table.status === 'CLOSING') && (
            <Button 
              onClick={handleReleaseTable} 
              className="w-full h-14 rounded-xl text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
            >
              Finalizar Mesa (Pagamento Concluído)
            </Button>
          )}

          {session && table.status !== 'BILL_REQUESTED' && table.status !== 'CLOSING' && (
            <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
              <DialogTrigger 
                render={<Button className="w-full h-14 rounded-xl text-lg font-bold bg-[#5c1a1b] hover:bg-[#4a1515] text-white" />}
              >
                Adicionar Pedido Manual
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Novo Pedido - {table.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-2 max-h-[60vh] overflow-y-auto">
                  {store.produtos.map(product => (
                    <div 
                      key={product.id} 
                      className="flex justify-between items-center p-4 bg-muted/30 border rounded-xl hover:bg-muted/60 cursor-pointer transition-all active:scale-[0.98]"
                      onClick={() => handleAddProduct(product)}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold">{product.nome}</span>
                        <span className="text-sm font-semibold text-primary">R$ {product.preco.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Plus size={18} />
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Button variant="outline" onClick={onClose} className="w-full h-14 rounded-xl text-lg font-bold border-stone-200">Voltar para Mesas</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
