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

export function CategoriasModal({ isOpen, onClose }: Props) {
  const { categorias, addCategoria, deleteCategoria } = useStore()
  const [nome, setNome] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome) return
    addCategoria({ nome })
    setNome("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] rounded-[1.5rem] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Categorias do Cardápio</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col gap-6">
          <form onSubmit={handleAdd} className="flex gap-2 items-end bg-secondary/20 p-4 rounded-xl border border-border/50">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Nome da Categoria</label>
              <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Bebidas" required className="bg-white" />
            </div>
            <Button type="submit" className="bg-primary text-white font-bold h-10 px-6">Adicionar</Button>
          </form>

          <div className="border border-border/50 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase font-bold sticky top-0">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {categorias.map(cat => (
                  <tr key={cat.id} className="bg-white hover:bg-secondary/10">
                    <td className="px-4 py-3 font-semibold text-foreground">{cat.nome}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteCategoria(cat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {categorias.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">Nenhuma categoria cadastrada.</td>
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
