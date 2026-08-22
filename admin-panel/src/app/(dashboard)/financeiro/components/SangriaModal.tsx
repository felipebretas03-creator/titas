import { useState } from "react"
import { useStore } from "@/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDownCircle } from "lucide-react"

export function SangriaModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { registrarSangria, addTransacao, usuarioLogadoId, usuarios } = useStore()
  const [valor, setValor] = useState("")
  const [descricao, setDescricao] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valor || !descricao) return
    const user = usuarios.find(u => u.id === usuarioLogadoId)
    
    // Registrar na sessão de caixa
    registrarSangria({
      valor: parseFloat(valor),
      descricao,
      realizadaPor: user?.nome || "Desconhecido"
    })

    // Adicionar também ao fluxo financeiro geral como saída
    addTransacao({
      tipo: 'Saida',
      valor: parseFloat(valor),
      descricao: `Sangria: ${descricao}`,
      categoria: 'Sangria de Caixa'
    })

    setValor("")
    setDescricao("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6 border-border/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase flex items-center gap-2">
            <ArrowDownCircle className="text-rose-500" />
            Realizar Sangria
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-muted-foreground">Valor da Retirada (R$)</label>
            <Input 
              type="number" 
              step="0.01" 
              value={valor} 
              onChange={(e) => setValor(e.target.value)} 
              placeholder="Ex: 50.00" 
              className="h-12 rounded-xl text-lg font-bold" 
              required 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-muted-foreground">Motivo / Descrição</label>
            <Input 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              placeholder="Ex: Pagamento fornecedor de gelo" 
              className="h-12 rounded-xl" 
              required 
            />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg">
            Confirmar Sangria
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
