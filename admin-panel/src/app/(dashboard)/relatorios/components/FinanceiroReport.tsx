"use client"

import { useMemo, useState } from "react"
import { useFilteredRelatorios } from "../context"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { FileDown, CreditCard, DollarSign, Wallet } from "lucide-react"
import { exportToXLSX, formatCurrency } from "./export-utils"
import { KpiCard } from "./KpiCard"

// Taxas simuladas
const TAXAS = {
  'PIX': 0, // 0%
  'Dinheiro': 0,
  'Cartão de Débito': 1.5, // 1.5%
  'Cartão de Crédito': 3.5, // 3.5%
  'Boleto': 2.0, // 2%
  'Online': 2.5 // 2.5%
}

const CORES_PAGAMENTO: Record<string, string> = {
  'PIX': '#10b981', // emerald
  'Dinheiro': '#f59e0b', // amber
  'Cartão de Débito': '#3b82f6', // blue
  'Cartão de Crédito': '#6366f1', // indigo
  'Boleto': '#8b5cf6', // violet
  'Online': '#ec4899', // pink
}

export function FinanceiroReport() {
  const { pedidos, transacoes } = useFilteredRelatorios()
  
  // DRE Simples
  const entradas = transacoes.filter(t => t.tipo === 'Entrada').reduce((acc, t) => acc + t.valor, 0)
  const saidas = transacoes.filter(t => t.tipo === 'Saida').reduce((acc, t) => acc + t.valor, 0)
  const lucroBruto = entradas
  const lucroOperacional = lucroBruto - saidas

  // Formas de Pagamento (Baseado nos pedidos)
  const pagamentosData = useMemo(() => {
    const map: Record<string, { bruto: number, taxaTotal: number, liquido: number, qtd: number }> = {}
    
    // Pegamos dos pedidos entregues/confirmados
    pedidos.forEach(p => {
      if (p.status === 'CANCELLED') return;
      const forma = p.formaPagamento || 'Não Informado'
      if (!map[forma]) map[forma] = { bruto: 0, taxaTotal: 0, liquido: 0, qtd: 0 }
      
      const taxaPct = TAXAS[forma as keyof typeof TAXAS] || 0
      const taxaValor = p.total * (taxaPct / 100)
      
      map[forma].bruto += p.total
      map[forma].taxaTotal += taxaValor
      map[forma].liquido += (p.total - taxaValor)
      map[forma].qtd += 1
    })

    return Object.entries(map).map(([forma, data]) => ({
      name: forma,
      ...data
    })).sort((a, b) => b.bruto - a.bruto)
  }, [pedidos])

  const totalBrutoPag = pagamentosData.reduce((acc, p) => acc + p.bruto, 0)
  const totalLiquidoPag = pagamentosData.reduce((acc, p) => acc + p.liquido, 0)
  const totalTaxas = totalBrutoPag - totalLiquidoPag

  // Novos KPIs:
  const custoMedioTransacao = totalBrutoPag > 0 ? (totalTaxas / totalBrutoPag) * 100 : 0
  const margemOperacional = entradas > 0 ? (lucroOperacional / entradas) * 100 : 0

  const trendLiquido = { value: 14.2, label: "vs mês anterior" }
  const trendCusto = { value: -0.3, label: "vs mês anterior" } // negativo é bom
  const trendMargem = { value: 2.5, label: "vs mês anterior" }

  const exportPagamentos = () => {
    const detailedData: any[][] = [
      ['RELATÓRIO DE DESEMPENHO FINANCEIRO'],
      [''],
      ['PERÍODO', 'DATA', '', 'FATURAMENTO BRUTO', formatCurrency(totalBrutoPag)],
      ['(Todos)', new Date().toLocaleDateString('pt-BR'), '', 'TOTAL DE TAXAS', formatCurrency(totalTaxas)],
      ['', '', '', 'FATURAMENTO LÍQUIDO', formatCurrency(totalLiquidoPag)],
      [''],
      ['FORMA DE PAGAMENTO', 'VOLUME (QTD)', 'VALOR BRUTO', 'TAXAS RETIDAS', 'VALOR LÍQUIDO']
    ];

    pagamentosData.forEach(p => {
      detailedData.push([
        p.name,
        p.qtd,
        formatCurrency(p.bruto),
        formatCurrency(p.taxaTotal),
        formatCurrency(p.liquido)
      ]);
    });

    const columnWidths = [25, 20, 20, 25, 25];

    exportToXLSX('relatorio_financeiro', [], detailedData, columnWidths)
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in-50">
      
      {/* SEÇÃO: FORMAS DE PAGAMENTO */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Wallet className="text-primary" /> Relatório de Formas de Pagamento
          </h2>
          <Button onClick={exportPagamentos} variant="outline" className="rounded-full shadow-sm">
            <FileDown className="mr-2 h-4 w-4 text-emerald-600" /> Exportar Excel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <KpiCard
            title="Faturamento Líquido Real"
            value={formatCurrency(totalLiquidoPag)}
            icon={<Wallet size={20} />}
            trend={trendLiquido}
            variant="primary"
          />
          <KpiCard
            title="Faturamento Bruto"
            value={formatCurrency(totalBrutoPag)}
            icon={<DollarSign size={20} />}
          />
          <KpiCard
            title="Custo Médio Transação"
            value={`${custoMedioTransacao.toFixed(1)}%`}
            description={`Taxas: ${formatCurrency(totalTaxas)}`}
            icon={<CreditCard size={20} />}
            trend={trendCusto}
            variant={custoMedioTransacao > 3 ? "warning" : "default"}
          />
          <KpiCard
            title="Margem Operacional"
            value={`${margemOperacional.toFixed(1)}%`}
            description={`Lucro: ${formatCurrency(lucroOperacional)}`}
            icon={<Wallet size={20} />}
            trend={trendMargem}
            variant={margemOperacional < 15 ? "warning" : "default"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 rounded-2xl border-border/40 lg:col-span-2 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Desmembramento por Método</h3>
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Pedidos</TableHead>
                  <TableHead className="text-right">Bruto</TableHead>
                  <TableHead className="text-right">Taxas</TableHead>
                  <TableHead className="text-right">Líquido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagamentosData.map(p => (
                  <TableRow key={p.name}>
                    <TableCell className="font-semibold flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CORES_PAGAMENTO[p.name] || '#ccc' }}></div>
                      {p.name}
                    </TableCell>
                    <TableCell className="text-right">{p.qtd}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(p.bruto)}</TableCell>
                    <TableCell className="text-right text-destructive text-sm">{formatCurrency(p.taxaTotal)}</TableCell>
                    <TableCell className="text-right font-bold text-emerald-600">{formatCurrency(p.liquido)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-6 rounded-2xl border-border/40 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold mb-4 w-full text-left">Representatividade</h3>
            <div className="h-[250px] w-full">
              <ChartContainer config={
                pagamentosData.reduce((acc, curr, index) => {
                  acc[curr.name] = { label: curr.name, color: CORES_PAGAMENTO[curr.name] || `hsl(var(--chart-${index + 1}))` }
                  return acc
                }, {} as any)
              } className="h-full w-full">
                <PieChart>
                  <Pie
                    data={pagamentosData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="bruto"
                    nameKey="name"
                  >
                    {pagamentosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} style={{ fill: CORES_PAGAMENTO[entry.name] }} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent formatter={(val) => formatCurrency(val as number)} />} />
                </PieChart>
              </ChartContainer>
            </div>
          </Card>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* SEÇÃO: DRE RESUMIDO */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">DRE Resumido (Fluxo de Caixa)</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold text-slate-600">(+) RECEITA OPERACIONAL (Entradas)</TableCell>
                <TableCell className="text-right font-medium text-emerald-600">{formatCurrency(entradas)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-slate-600">(-) DESPESAS E CUSTOS (Saídas)</TableCell>
                <TableCell className="text-right font-medium text-destructive">{formatCurrency(saidas)}</TableCell>
              </TableRow>
              <TableRow className="bg-slate-50">
                <TableCell className="font-bold text-slate-800">(=) RESULTADO OPERACIONAL</TableCell>
                <TableCell className="text-right font-bold text-slate-800">{formatCurrency(lucroOperacional)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

    </div>
  )
}
