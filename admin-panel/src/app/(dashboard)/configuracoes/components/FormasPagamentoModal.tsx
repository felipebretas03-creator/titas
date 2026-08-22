"use client"

import { useState } from "react"
import { useStore } from "@/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function FormasPagamentoModal({ isOpen, onClose }: Props) {
  const { formasPagamento, addFormaPagamento, deleteFormaPagamento } = useStore()
  const [nome, setNome] = useState("")
  const [taxa, setTaxa] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome) return
    addFormaPagamento({ nome, taxa: parseFloat(taxa) || 0, status: 'Ativo' })
    setNome("")
    setTaxa("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-[1.5rem] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Formas de Pagamento</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col gap-6">
          <form onSubmit={handleAdd} className="flex gap-2 items-end bg-secondary/20 p-4 rounded-xl border border-border/50">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Nome</label>
              <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: PIX" required className="bg-white" />
            </div>
            <div className="w-24 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Taxa (%)</label>
              <Input type="number" step="0.1" value={taxa} onChange={e => setTaxa(e.target.value)} placeholder="0.0" className="bg-white" />
            </div>
            <Button type="submit" className="bg-primary text-white font-bold h-10 px-6">Adicionar</Button>
          </form>

          <div className="border border-border/50 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3 text-center">Taxa</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {formasPagamento.map(fp => (
                  <tr key={fp.id} className="bg-white hover:bg-secondary/10">
                    <td className="px-4 py-3 font-semibold text-foreground">{fp.nome}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{fp.taxa}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">{fp.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteFormaPagamento(fp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {formasPagamento.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nenhuma forma de pagamento cadastrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
