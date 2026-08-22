import { useState } from "react"
import { useStore } from "@/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LockOpen } from "lucide-react"

export function AberturaCaixaModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { abrirCaixa, usuarioLogadoId, usuarios } = useStore()
  const [saldoInicial, setSaldoInicial] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!saldoInicial) return
    const user = usuarios.find(u => u.id === usuarioLogadoId)
    abrirCaixa(parseFloat(saldoInicial), user?.nome || "Desconhecido")
    setSaldoInicial("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6 border-border/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase flex items-center gap-2">
            <LockOpen className="text-primary" />
            Abertura de Caixa
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-muted-foreground">Troco Inicial / Fundo de Caixa (R$)</label>
            <Input 
              type="number" 
              step="0.01" 
              value={saldoInicial} 
              onChange={(e) => setSaldoInicial(e.target.value)} 
              placeholder="Ex: 150.00" 
              className="h-12 rounded-xl text-lg font-bold" 
              required 
            />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg">
            Abrir Caixa Agora
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
