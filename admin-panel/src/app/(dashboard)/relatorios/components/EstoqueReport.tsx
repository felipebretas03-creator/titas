"use client"

import { useStore } from "@/store"
import { useFilteredRelatorios } from "../context"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileDown, Package, AlertTriangle, ArrowRightLeft, Trash2, DollarSign } from "lucide-react"
import { exportToXLSX, formatCurrency } from "./export-utils"
import { KpiCard } from "./KpiCard"

export function EstoqueReport() {
  const { produtos } = useStore()
  const { movimentacoesEstoque } = useFilteredRelatorios()
  
  const estoqueBaixo = produtos.filter(p => p.estoqueAtual <= (p.estoqueMinimo || 10))
  const totalItens = produtos.reduce((acc, p) => acc + p.estoqueAtual, 0)
  
  const perdas = movimentacoesEstoque.filter(m => m.tipo === 'Perda').reduce((acc, m) => acc + m.quantidade, 0)
  
  // Novos KPIs
  const totalMovimentacoes = movimentacoesEstoque.reduce((acc, m) => acc + Math.abs(m.quantidade), 0)
  const indicePerdas = totalMovimentacoes > 0 ? (perdas / totalMovimentacoes) * 100 : 0
  
  // Simulando custo imobilizado (R$ 15 médio de custo por item)
  const capitalImobilizado = totalItens * 15

  const trendPerdas = { value: -1.2, label: "vs mês anterior" }
  const trendEstoque = { value: 5.5, label: "vs mês anterior" }
  
  const getProdutoNome = (id: string) => produtos.find(p => p.id === id)?.nome || 'Desconhecido'

  const handleExport = () => {
    const detailedData: any[][] = [
      ['RELATÓRIO DE CONTROLE DE ESTOQUE'],
      [''],
      ['PERÍODO', 'DATA', '', 'TOTAL DE ITENS NO ESTOQUE', totalItens],
      ['(Todos)', new Date().toLocaleDateString('pt-BR'), '', 'ALERTA DE ESTOQUE BAIXO', estoqueBaixo.length],
      ['', '', '', 'PERDAS REGISTRADAS', perdas],
      [''],
      ['DATA', 'Nº DO ITEM', 'NOME DO ITEM', 'TIPO DE MOVIMENTAÇÃO', 'QTD.', 'MOTIVO / OBSERVAÇÃO']
    ];

    movimentacoesEstoque.forEach(m => {
      detailedData.push([
        new Date(m.data).toLocaleDateString('pt-BR'),
        `REF-${m.produtoId}`,
        getProdutoNome(m.produtoId),
        m.tipo,
        m.quantidade,
        m.motivo || '-'
      ]);
    });

    const columnWidths = [15, 15, 30, 25, 10, 30];

    exportToXLSX('relatorio_estoque_movimentacoes', [], detailedData, columnWidths)
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-black text-foreground">Estoque e Insumos</h2>
        <Button onClick={handleExport} variant="outline" className="rounded-full shadow-sm">
          <FileDown className="mr-2 h-4 w-4" /> Exportar Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Índice de Perdas"
          value={`${indicePerdas.toFixed(1)}%`}
          icon={<Trash2 size={20} />}
          description={`${perdas} un. perdidas`}
          trend={trendPerdas}
          variant={indicePerdas > 2 ? "warning" : "primary"}
        />
        <KpiCard
          title="Capital Imobilizado"
          value={formatCurrency(capitalImobilizado)}
          icon={<DollarSign size={20} />}
          description="Estimativa de custo"
          trend={trendEstoque}
        />
        <KpiCard
          title="Total de Itens"
          value={`${totalItens} un.`}
          icon={<Package size={20} />}
          description="Estoque físico atual"
        />
        <KpiCard
          title="Estoque Baixo"
          value={estoqueBaixo.length}
          icon={<AlertTriangle size={20} />}
          description="Produtos no limite mínimo"
          variant={estoqueBaixo.length > 5 ? "warning" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <Card className="p-6 rounded-2xl border-border/40">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500" /> Alertas de Reposição</h3>
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Estoque Atual</TableHead>
                <TableHead className="text-right">Mínimo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estoqueBaixo.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Tudo OK!</TableCell></TableRow>
              ) : (
                estoqueBaixo.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold">{p.nome}</TableCell>
                    <TableCell className="text-right font-bold text-destructive">{p.estoqueAtual}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{p.estoqueMinimo}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6 rounded-2xl border-border/40">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ArrowRightLeft size={18} /> Últimas Movimentações</h3>
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Qtd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimentacoesEstoque.slice(0, 5).map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-semibold">{getProdutoNome(m.produtoId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      m.tipo === 'Entrada' ? 'text-emerald-600 border-emerald-200' : 
                      m.tipo === 'Saida' ? 'text-blue-600 border-blue-200' : 'text-red-600 border-red-200'
                    }>{m.tipo}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{m.quantidade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
