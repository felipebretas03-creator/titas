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

export function RegioesEntregaModal({ isOpen, onClose }: Props) {
  const { regioesEntrega, addRegiaoEntrega, deleteRegiaoEntrega } = useStore()
  const [cidade, setCidade] = useState("")
  const [bairro, setBairro] = useState("")
  const [taxa, setTaxa] = useState("")
  const [prazo, setPrazo] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cidade || !bairro) return
    addRegiaoEntrega({ cidade, bairro, taxa: parseFloat(taxa) || 0, prazoMins: parseInt(prazo) || 0, status: 'Ativo' })
    setCidade("")
    setBairro("")
    setTaxa("")
    setPrazo("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] rounded-[1.5rem] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Regiões de Entrega</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col gap-6">
          <form onSubmit={handleAdd} className="flex gap-2 items-end bg-secondary/20 p-4 rounded-xl border border-border/50 flex-wrap">
            <div className="flex-1 min-w-[150px] flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Cidade</label>
              <Input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Ex: São Paulo" required className="bg-white" />
            </div>
            <div className="flex-1 min-w-[150px] flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Bairro</label>
              <Input value={bairro} onChange={e => setBairro(e.target.value)} placeholder="Ex: Centro" required className="bg-white" />
            </div>
            <div className="w-24 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Taxa (R$)</label>
              <Input type="number" step="0.5" value={taxa} onChange={e => setTaxa(e.target.value)} placeholder="0.00" className="bg-white" />
            </div>
            <div className="w-24 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Prazo (m)</label>
              <Input type="number" value={prazo} onChange={e => setPrazo(e.target.value)} placeholder="30" className="bg-white" />
            </div>
            <Button type="submit" className="bg-primary text-white font-bold h-10 px-6 mt-2 w-full sm:w-auto">Adicionar</Button>
          </form>

          <div className="border border-border/50 rounded-xl overflow-hidden max-h-[350px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase font-bold sticky top-0">
                <tr>
                  <th className="px-4 py-3">Cidade</th>
                  <th className="px-4 py-3">Bairro</th>
                  <th className="px-4 py-3 text-center">Taxa</th>
                  <th className="px-4 py-3 text-center">Prazo</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {regioesEntrega.map(regiao => (
                  <tr key={regiao.id} className="bg-white hover:bg-secondary/10">
                    <td className="px-4 py-3 font-semibold text-foreground">{regiao.cidade}</td>
                    <td className="px-4 py-3 text-muted-foreground">{regiao.bairro}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">R$ {regiao.taxa.toFixed(2).replace('.', ',')}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{regiao.prazoMins} min</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">{regiao.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteRegiaoEntrega(regiao.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {regioesEntrega.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nenhuma região cadastrada.</td>
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
