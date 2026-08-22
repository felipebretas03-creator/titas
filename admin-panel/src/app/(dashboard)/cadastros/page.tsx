"use client"

import { useState } from "react"
import { useStore } from "@/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit2, Package } from "lucide-react"

export default function CadastrosPage() {
  const { produtos, addProduto, deleteProduto, categorias } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [preco, setPreco] = useState("")
  const [categoria, setCategoria] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !preco || !categoria) return
    
    addProduto({
      nome,
      preco: parseFloat(preco),
      custo: 0,
      estoqueAtual: 0,
      categoria,
      status: "Ativo"
    })
    
    setNome("")
    setPreco("")
    setCategoria("")
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
          Cadastros
        </h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-md text-white font-semibold" />}>
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6 border-border/40">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase">Adicionar Produto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Nome do Produto</label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Hambúrguer Duplo" className="rounded-xl border-border/60" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Preço (R$)</label>
                <Input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Ex: 29.90" className="rounded-xl border-border/60" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Categoria</label>
                <Select onValueChange={(val) => setCategoria(val || "")} value={categoria}>
                  <SelectTrigger className="rounded-xl border-border/60">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(cat => (
                      <SelectItem key={cat.id} value={cat.nome}>{cat.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90 mt-2 text-white font-bold h-12">
                Salvar Produto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 min-h-[500px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Package size={20} />
          </div>
          <h2 className="text-xl font-bold">Catálogo de Produtos</h2>
        </div>

        <div className="rounded-xl border border-border/40 overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-semibold text-muted-foreground">Nome</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Categoria</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Preço</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Nenhum produto cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                produtos.map((produto) => (
                  <TableRow key={produto.id} className="hover:bg-secondary/10">
                    <TableCell className="font-semibold">{produto.nome}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell className="font-medium text-emerald-600">
                      R$ {produto.preco.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                        {produto.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteProduto(produto.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
