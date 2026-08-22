"use client"

import { useStore } from "@/store"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { ChevronLeft, Receipt, Bell, Utensils, CheckCircle2, Clock, AlertCircle, ChefHat, HelpCircle, MessageSquareWarning, Trash2, MoreHorizontal, Send } from "lucide-react"
import { useState, useEffect } from "react"

export default function MinhaMesaTablet() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const store = useStore()
  
  const table = store.mesas.find(m => m.token_hash === token)
  const session = store.sessoesMesa.find(s => s.table_id === table?.id && s.status !== 'CLOSED')
  const orders = store.pedidos.filter(p => session && p.sessionId === session.id)
  const config = store.configuracoesTablet
  
  const [isConfirmBillOpen, setIsConfirmBillOpen] = useState(false)
  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false)
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [otherMessage, setOtherMessage] = useState("")

  useEffect(() => {
    if (!table || !session) {
      router.push(`/mesa/${token}`)
    }
  }, [table, session, router, token])

  if (!table || !session) {
    return null
  }

  const handleCallWaiter = () => {
    setIsCallWaiterOpen(true)
  }

  const submitCallWaiter = (type: 'WAITER' | 'NAPKINS' | 'CUTLERY' | 'ORDER_QUESTION' | 'ORDER_PROBLEM' | 'OTHER', customMessage?: string) => {
    store.addSolicitacaoAtendimento({
      tableId: table.id,
      sessionId: session.id,
      type,
      message: customMessage
    })
    store.updateMesa(table.id, { status: 'SERVICE_REQUESTED' })
    setIsCallWaiterOpen(false)
    toast.success("Atendimento solicitado! Um atendente irá até sua mesa.")
  }

  const handleRequestBill = () => {
    store.addSolicitacaoAtendimento({
      tableId: table.id,
      sessionId: session.id,
      type: 'CLOSE_BILL'
    })
    store.updateSessaoMesa(session.id, { status: 'BILL_REQUESTED', billRequestedAt: new Date().toISOString() })
    store.updateMesa(table.id, { status: 'BILL_REQUESTED' })
    setIsConfirmBillOpen(false)
    toast.success(config.billSuccessMessage)
  }

  const isBillRequested = session.status === 'BILL_REQUESTED'

  if (isBillRequested) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('/conta.png')] bg-cover bg-center" />
        <div className="relative z-10 max-w-2xl text-center flex flex-col items-center gap-6">
          <div className="bg-amber-500/20 p-6 rounded-full border border-amber-500/50">
            <Receipt size={80} className="text-amber-400" />
          </div>
          <h1 className="text-5xl font-black text-amber-400">CONTA SOLICITADA!</h1>
          <p className="text-2xl text-stone-300">
            Um atendente irá até sua mesa para realizar o pagamento.
          </p>
          
          <Card className="mt-8 bg-white/10 border-white/20 backdrop-blur-md text-white w-full">
            <CardContent className="p-8">
              <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-4">
                <span className="text-xl">Total da Mesa</span>
                <span className="text-4xl font-black">R$ {session.totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
              <p className="text-stone-300">Novos pedidos estão temporariamente bloqueados.</p>
            </CardContent>
          </Card>

          {config.allowCallWaiter && (
            <Button 
              onClick={handleCallWaiter}
              className="mt-4 h-16 px-10 rounded-full font-bold text-stone-900 bg-amber-400 hover:bg-amber-500 border-none text-xl gap-3 shadow-lg shadow-amber-500/20"
            >
              <Bell size={24} /> Chamar Garçom
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-stone-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/mesa/${token}/cardapio`)}>
            <ChevronLeft size={28} />
          </Button>
          <div>
            <h2 className="text-2xl font-black text-primary">Minha Mesa</h2>
            <span className="text-muted-foreground font-semibold">{table.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {config.allowCallWaiter && (
            <Button onClick={handleCallWaiter} variant="outline" className="h-14 px-6 rounded-full font-bold text-amber-600 border-amber-200 hover:bg-amber-50 gap-2 text-lg">
              <Bell size={24} />
              Chamar Garçom
            </Button>
          )}
          <Button 
            onClick={() => router.push(`/mesa/${token}/cardapio`)}
            className="bg-[#5c1a1b] h-14 px-8 rounded-full font-bold text-white hover:bg-[#4a1515] gap-3 text-lg shadow-lg"
          >
            <Utensils size={24} />
            Continuar Pedindo
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          <div className="flex justify-between items-end bg-white p-8 rounded-[2rem] shadow-sm border border-border/50">
            <div>
              <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Consumido</h3>
              <p className="text-6xl font-black text-primary">R$ {session.totalAmount.toFixed(2).replace('.', ',')}</p>
            </div>
            {config.allowRequestBill && (
              <Button 
                onClick={() => setIsConfirmBillOpen(true)}
                className="h-16 px-10 rounded-full font-black text-white bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-600/20 text-xl tracking-wide uppercase gap-3"
              >
                <Receipt size={28} />
                Pedir a Conta
              </Button>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-black mb-6 text-stone-800">Histórico de Pedidos</h3>
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300">
                <Utensils size={48} className="mx-auto text-stone-300 mb-4" />
                <p className="text-xl font-medium text-stone-500">Você ainda não fez nenhum pedido.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {orders.map((order, i) => (
                  <Card key={order.id} className="border-2 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-stone-100 p-4 border-b flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">Pedido #{i + 1}</span>
                        {order.status === 'CONFIRMED' && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase flex items-center gap-1"><Clock size={12}/> Enviado</span>}
                        {order.status === 'PREPARING' && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded uppercase flex items-center gap-1"><ChefHat size={12}/> Em Produção</span>}
                        {order.status === 'READY' && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded uppercase flex items-center gap-1"><CheckCircle2 size={12}/> Pronto</span>}
                      </div>
                      <span className="font-black text-xl">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <CardContent className="p-0">
                      <ul className="divide-y">
                        {order.items.map(item => (
                          <li key={item.id} className="p-4 flex justify-between items-center hover:bg-stone-50">
                            <div className="flex items-center gap-4">
                              <span className="font-black text-xl bg-stone-100 text-stone-500 w-10 h-10 flex items-center justify-center rounded-xl">{item.quantidade}x</span>
                              <div>
                                <p className="font-bold text-lg">{item.nome}</p>
                                {item.observacao && <p className="text-sm text-amber-600 font-medium">Obs: {item.observacao}</p>}
                              </div>
                            </div>
                            <span className="font-bold text-lg text-muted-foreground">R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isConfirmBillOpen} onOpenChange={setIsConfirmBillOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
          <DialogHeader className="gap-4 text-center">
            <div className="mx-auto bg-rose-100 w-20 h-20 flex items-center justify-center rounded-full">
              <Receipt size={40} className="text-rose-600" />
            </div>
            <DialogTitle className="text-3xl font-black">Deseja pedir a conta?</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <p className="text-xl font-medium text-stone-600">
              O total consumido é de <strong className="text-primary text-2xl">R$ {session.totalAmount.toFixed(2).replace('.', ',')}</strong>.
            </p>
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex gap-3 text-left items-start">
              <AlertCircle className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">Depois dessa solicitação, novos pedidos ficarão temporariamente bloqueados até que o atendente feche a mesa.</p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button onClick={handleRequestBill} className="w-full h-14 text-lg font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white">
              Sim, Pedir a Conta
            </Button>
            <Button onClick={() => setIsConfirmBillOpen(false)} variant="ghost" className="w-full h-14 text-lg font-bold rounded-xl">
              Cancelar e Voltar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCallWaiterOpen} onOpenChange={(open) => {
        setIsCallWaiterOpen(open);
        if (!open) {
          setTimeout(() => {
            setShowOtherInput(false);
            setOtherMessage("");
          }, 300);
        }
      }}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
          <DialogHeader className="gap-2 text-center mb-4">
            <div className="mx-auto bg-amber-100 w-16 h-16 flex items-center justify-center rounded-full">
              <Bell size={32} className="text-amber-600" />
            </div>
            <DialogTitle className="text-2xl font-black">Como podemos ajudar?</DialogTitle>
          </DialogHeader>
          
          {!showOtherInput ? (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => submitCallWaiter('NAPKINS')} 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 hover:border-blue-500 hover:bg-blue-50"
              >
                <Receipt size={28} className="text-blue-600" />
                <span className="font-bold whitespace-normal text-center">Guardanapos</span>
              </Button>
              <Button 
                onClick={() => submitCallWaiter('CUTLERY')} 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 hover:border-emerald-500 hover:bg-emerald-50"
              >
                <Utensils size={28} className="text-emerald-600" />
                <span className="font-bold whitespace-normal text-center">Talheres</span>
              </Button>
              <Button 
                onClick={() => submitCallWaiter('ORDER_QUESTION')} 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 hover:border-purple-500 hover:bg-purple-50"
              >
                <HelpCircle size={28} className="text-purple-600" />
                <span className="font-bold whitespace-normal text-center">Dúvida no Pedido</span>
              </Button>
              <Button 
                onClick={() => submitCallWaiter('ORDER_PROBLEM')} 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 hover:border-rose-500 hover:bg-rose-50"
              >
                <MessageSquareWarning size={28} className="text-rose-600" />
                <span className="font-bold whitespace-normal text-center">Problema no Pedido</span>
              </Button>
              <Button 
                onClick={() => submitCallWaiter('OTHER', 'Limpar Mesa')} 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 hover:border-slate-500 hover:bg-slate-50"
              >
                <Trash2 size={28} className="text-slate-600" />
                <span className="font-bold whitespace-normal text-center">Limpar Mesa</span>
              </Button>
              <Button 
                onClick={() => setShowOtherInput(true)} 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 hover:border-amber-500 hover:bg-amber-50"
              >
                <MoreHorizontal size={28} className="text-amber-600" />
                <span className="font-bold whitespace-normal text-center">Outros...</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4">
              <p className="text-center font-medium text-muted-foreground">Digite abaixo o que você precisa:</p>
              <textarea 
                className="w-full min-h-[120px] p-4 rounded-2xl border-2 border-border resize-none focus:outline-none focus:border-primary text-lg"
                placeholder="Ex: Preciso de gelo extra..."
                value={otherMessage}
                onChange={(e) => setOtherMessage(e.target.value)}
                autoFocus
              />
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowOtherInput(false)} 
                  variant="outline" 
                  className="flex-1 h-14 rounded-xl font-bold text-lg"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={() => submitCallWaiter('OTHER', otherMessage)} 
                  disabled={!otherMessage.trim()}
                  className="flex-1 h-14 rounded-xl font-bold text-lg bg-amber-500 hover:bg-amber-600 text-white gap-2"
                >
                  <Send size={20} />
                  Enviar
                </Button>
              </div>
            </div>
          )}

          {!showOtherInput && (
            <DialogFooter className="mt-6">
              <Button onClick={() => setIsCallWaiterOpen(false)} variant="ghost" className="w-full h-14 text-lg font-bold rounded-xl">
                Cancelar
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
