import { useState } from "react"
import { useStore, EstacaoMontagem } from "@/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, MonitorCheck } from "lucide-react"

export function EstacoesMontagemModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { estacoesMontagem, addEstacaoMontagem, updateEstacaoMontagem, deleteEstacaoMontagem } = useStore()
  const [nome, setNome] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome) return
    addEstacaoMontagem({
      nome,
      ativa: true,
      filtroPlataforma: []
    })
    setNome("")
  }

  const toggleAtiva = (estacao: EstacaoMontagem) => {
    updateEstacaoMontagem(estacao.id, { ativa: !estacao.ativa })
  }

  const handleFiltroChange = (id: string, plataformas: string) => {
    const list = plataformas.split(',').map(p => p.trim()).filter(Boolean)
    updateEstacaoMontagem(id, { filtroPlataforma: list })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] rounded-[1.5rem] p-6 border-border/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase flex items-center gap-2">
            <MonitorCheck className="text-primary" />
            Estações de Montagem
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            placeholder="Nome (ex: Mesa 1, Mesa 2)" 
            className="rounded-xl border-border/60"
            required
          />
          <Button type="submit" className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shrink-0">
            <Plus size={18} className="mr-1" /> Adicionar
          </Button>
        </form>

        <div className="rounded-xl border border-border/40 overflow-hidden mt-6">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-semibold text-muted-foreground">Nome</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Filtro Plataforma</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estacoesMontagem.map((estacao) => (
                <TableRow key={estacao.id} className="hover:bg-secondary/10">
                  <TableCell className="font-semibold">{estacao.nome}</TableCell>
                  <TableCell>
                    <Input 
                      placeholder="Ex: iFood, 99Food" 
                      defaultValue={estacao.filtroPlataforma?.join(', ') || ''}
                      onBlur={(e) => handleFiltroChange(estacao.id, e.target.value)}
                      className="h-8 text-xs rounded-lg"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={estacao.ativa} onCheckedChange={() => toggleAtiva(estacao)} />
                      <span className="text-xs text-muted-foreground">{estacao.ativa ? 'Ativa' : 'Inativa'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteEstacaoMontagem(estacao.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {estacoesMontagem.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhuma estação de montagem cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
