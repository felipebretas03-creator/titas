"use client"

import { useState } from "react"
import { useStore, Permissao } from "@/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_PERMISSIONS: { id: Permissao, label: string }[] = [
  { id: 'DASHBOARD', label: 'Dashboard' },
  { id: 'PDV', label: 'PDV / Frente de Caixa' },
  { id: 'PEDIDOS', label: 'Gestão de Pedidos' },
  { id: 'FINANCEIRO', label: 'Financeiro' },
  { id: 'CONFIGURACOES', label: 'Configurações' },
  { id: 'CADASTROS', label: 'Cadastros (Cardápio)' },
  { id: 'RELATORIOS', label: 'Relatórios' },
  { id: 'MESAS', label: 'Gestão de Mesas' },
]

export function CargosModal({ isOpen, onClose }: Props) {
  const { cargos, addCargo, deleteCargo } = useStore()
  const [nome, setNome] = useState("")
  const [permissoes, setPermissoes] = useState<Permissao[]>([])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome) return
    addCargo({ nome, permissoes, status: 'Ativo' })
    setNome("")
    setPermissoes([])
  }

  const togglePermission = (perm: Permissao) => {
    setPermissoes(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto rounded-[1.5rem] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Cargos e Funções</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col gap-6">
          <form onSubmit={handleAdd} className="flex flex-col gap-4 bg-secondary/20 p-4 rounded-xl border border-border/50">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Nome do Cargo</label>
              <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Gerente" required className="bg-white" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Permissões de Acesso</label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_PERMISSIONS.map(perm => (
                  <div key={perm.id} className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-border/50">
                    <Checkbox 
                      id={`perm-${perm.id}`} 
                      checked={permissoes.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                    />
                    <label htmlFor={`perm-${perm.id}`} className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                      {perm.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="bg-primary text-white font-bold h-10 w-full mt-2">Adicionar Cargo</Button>
          </form>

          <div className="border border-border/50 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase font-bold sticky top-0">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Permissões</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {cargos.map(cargo => (
                  <tr key={cargo.id} className="bg-white hover:bg-secondary/10">
                    <td className="px-4 py-3 font-semibold text-foreground">{cargo.nome}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {cargo.permissoes?.map(p => (
                          <span key={p} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteCargo(cargo.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {cargos.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Nenhum cargo cadastrado.</td>
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
