import { useState } from "react"
import { useStore } from "@/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock } from "lucide-react"

export function FechamentoCaixaModal({ isOpen, onClose, saldoSistema }: { isOpen: boolean, onClose: () => void, saldoSistema: number }) {
  const { fecharCaixa, usuarioLogadoId, usuarios } = useStore()
  const [saldoInformado, setSaldoInformado] = useState("")
  const [fechado, setFechado] = useState(false)
  const [diferenca, setDiferenca] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!saldoInformado) return
    const valorDigitado = parseFloat(saldoInformado)
    const dif = valorDigitado - saldoSistema
    setDiferenca(dif)
    
    const user = usuarios.find(u => u.id === usuarioLogadoId)
    fecharCaixa(valorDigitado, saldoSistema, user?.nome || "Desconhecido")
    setFechado(true)
  }

  const handleFinish = () => {
    setFechado(false)
    setSaldoInformado("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !fechado && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6 border-border/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase flex items-center gap-2">
            <Lock className="text-primary" />
            Fechamento de Caixa
          </DialogTitle>
        </DialogHeader>

        {!fechado ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm border border-amber-200">
              <p className="font-semibold mb-1">Fechamento Cego</p>
              <p>Conte o dinheiro na gaveta e digite o valor total exato. O sistema irá comparar com as vendas.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-muted-foreground">Valor em Dinheiro (Gaveta) (R$)</label>
              <Input 
                type="number" 
                step="0.01" 
                value={saldoInformado} 
                onChange={(e) => setSaldoInformado(e.target.value)} 
                placeholder="Ex: 850.00" 
                className="h-12 rounded-xl text-lg font-bold" 
                required 
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg">
              Conferir e Fechar
            </Button>
          </form>
        ) : (
          <div className="flex flex-col gap-6 py-4 items-center text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2">
              <Lock size={40} />
            </div>
            <h2 className="text-2xl font-black">Caixa Fechado!</h2>
            
            <div className="w-full bg-secondary/30 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor em Gaveta:</span>
                <span className="font-bold">R$ {parseFloat(saldoInformado).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Esperado pelo Sistema:</span>
                <span className="font-bold">R$ {saldoSistema.toFixed(2)}</span>
              </div>
              <div className="border-t border-border/40 my-1 pt-2 flex justify-between font-bold">
                <span>Diferença:</span>
                <span className={diferenca === 0 ? "text-emerald-500" : diferenca > 0 ? "text-blue-500" : "text-rose-500"}>
                  {diferenca === 0 ? "Nenhuma (Exato)" : diferenca > 0 ? `Sobrando R$ ${Math.abs(diferenca).toFixed(2)}` : `Faltando R$ ${Math.abs(diferenca).toFixed(2)}`}
                </span>
              </div>
            </div>
            
            <Button onClick={handleFinish} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg mt-2">
              Voltar ao Início
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
