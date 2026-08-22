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
import { Plus, ArrowUpCircle, ArrowDownCircle, DollarSign, Wallet } from "lucide-react"

export default function FinanceiroPage() {
  const { transacoes, addTransacao } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  
  const [tipo, setTipo] = useState<"Entrada" | "Saida">("Entrada")
  const [valor, setValor] = useState("")
  const [descricao, setDescricao] = useState("")
  const [categoria, setCategoria] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valor || !descricao || !tipo) return
    
    addTransacao({
      tipo,
      valor: parseFloat(valor),
      descricao,
      categoria: categoria || 'Outros',
    })
    
    setValor("")
    setDescricao("")
    setCategoria("")
    setIsOpen(false)
  }

  const receitas = transacoes.filter(t => t.tipo === 'Entrada').reduce((acc, t) => acc + t.valor, 0)
  const despesas = transacoes.filter(t => t.tipo === 'Saida').reduce((acc, t) => acc + t.valor, 0)
  const saldo = receitas - despesas

  const formatCurrency = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
          Financeiro
        </h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-md text-white font-semibold" />}>
            <Plus className="mr-2 h-4 w-4" /> Nova Transação
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6 border-border/40">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase">Lançamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Tipo de Transação</label>
                <Select onValueChange={(val) => setTipo(val as "Entrada" | "Saida")} value={tipo}>
                  <SelectTrigger className="rounded-xl border-border/60">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada (Receita)</SelectItem>
                    <SelectItem value="Saida">Saída (Despesa)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Descrição</label>
                <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Pagamento Fornecedor" className="rounded-xl border-border/60" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Categoria</label>
                <Input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ex: Vendas, Contas Fixas..." className="rounded-xl border-border/60" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Valor (R$)</label>
                <Input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex: 150.00" className="rounded-xl border-border/60" required />
              </div>
              <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90 mt-2 text-white font-bold h-12">
                Registrar Transação
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white rounded-[2rem] p-6 shadow-sm border border-border/40 relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-500 font-bold mb-4">
             <ArrowUpCircle size={20} /> Entradas
          </div>
          <div className="text-3xl font-black tracking-tighter">{formatCurrency(receitas)}</div>
        </Card>
        <Card className="bg-white rounded-[2rem] p-6 shadow-sm border border-border/40 relative overflow-hidden">
          <div className="flex items-center gap-2 text-destructive font-bold mb-4">
             <ArrowDownCircle size={20} /> Saídas
          </div>
          <div className="text-3xl font-black tracking-tighter">{formatCurrency(despesas)}</div>
        </Card>
        <Card className={`rounded-[2rem] p-6 shadow-sm border border-border/40 relative overflow-hidden ${saldo >= 0 ? 'bg-primary text-white' : 'bg-destructive text-white'}`}>
          <div className="flex items-center gap-2 font-bold mb-4 opacity-80">
             <Wallet size={20} /> Saldo Total
          </div>
          <div className="text-4xl font-black tracking-tighter">{formatCurrency(saldo)}</div>
        </Card>
      </div>

      <Card className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 min-h-[500px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <DollarSign size={20} />
          </div>
          <h2 className="text-xl font-bold">Histórico de Movimentações</h2>
        </div>

        <div className="rounded-xl border border-border/40 overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-semibold text-muted-foreground">Data/Hora</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Descrição</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Categoria</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Tipo</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Nenhuma transação registrada.
                  </TableCell>
                </TableRow>
              ) : (
                transacoes.map((transacao) => (
                  <TableRow key={transacao.id} className="hover:bg-secondary/10">
                    <TableCell className="text-muted-foreground" suppressHydrationWarning>
                      {new Date(transacao.data).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-semibold">{transacao.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary/40 text-foreground/70 border-none font-medium">
                        {transacao.categoria || 'Outros'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border-border/60 ${transacao.tipo === 'Entrada' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        {transacao.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-bold ${transacao.tipo === 'Entrada' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transacao.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(transacao.valor)}
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
