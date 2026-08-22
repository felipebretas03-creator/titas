"use client"

import { useMemo, useState } from "react"
import { useStore } from "@/store"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { FileDown, DollarSign, TrendingUp, ShoppingBag, Calendar, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFilteredRelatorios } from "../context"
import { exportToXLSX, formatCurrency } from "./export-utils"
import { KpiCard } from "./KpiCard"

export function VendasReport() {
  const { pedidos } = useFilteredRelatorios()
  const [canalFiltro, setCanalFiltro] = useState<string>("todos")
  const [statusFiltro, setStatusFiltro] = useState<string>("todos")

  // Filter logic
  const filteredPedidos = useMemo(() => {
    return pedidos.filter(p => {
      // Filtro de Status
      if (statusFiltro !== "todos" && p.status !== statusFiltro) return false;
      // Filtro de Canal
      if (canalFiltro !== "todos" && p.channel !== canalFiltro) return false;
      return true
    })
  }, [pedidos, canalFiltro, statusFiltro])
  
  const faturamentoBruto = filteredPedidos.reduce((acc, p) => acc + p.total, 0)
  // Simulando taxa média de 2% para faturamento líquido
  const faturamentoLiquido = faturamentoBruto * 0.98
  const qtdPedidos = filteredPedidos.length
  const ticketMedio = qtdPedidos > 0 ? faturamentoBruto / qtdPedidos : 0
  const cancelamentos = filteredPedidos.filter(p => p.status === 'CANCELLED').length
  const taxaCancelamento = qtdPedidos > 0 ? (cancelamentos / qtdPedidos) * 100 : 0
  
  // Mocks de tendência para visualização do design de KPIs
  const trendFaturamento = { value: 12.5, label: "vs mês anterior" }
  const trendTicket = { value: 5.2, label: "vs mês anterior" }
  const trendPedidos = { value: 8.4, label: "vs mês anterior" }
  const trendCancelamento = { value: -1.2, label: "vs mês anterior" }
  
  // Dados para o Gráfico de Tendência (Evolução Diária)
  const tendenciaData = useMemo(() => {
    const map: Record<string, { faturamento: number, pedidos: number }> = {}
    filteredPedidos.forEach(p => {
      const dateStr = new Date(p.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      if (!map[dateStr]) map[dateStr] = { faturamento: 0, pedidos: 0 }
      map[dateStr].faturamento += p.total
      map[dateStr].pedidos += 1
    })
    return Object.entries(map).map(([date, data]) => ({ date, ...data })).reverse()
  }, [filteredPedidos])

  // Vendas por Canal (Delivery, Pickup, Table)
  const porCanal = useMemo(() => {
    const map: Record<string, number> = {}
    filteredPedidos.forEach(p => {
      const canal = p.channel
      map[canal] = (map[canal] || 0) + p.total
    })
    return Object.entries(map).map(([name, valor]) => ({ name, valor })).sort((a,b) => b.valor - a.valor)
  }, [filteredPedidos])

  const exportData = () => {
    // Agrupar os itens vendidos no período por produto e por canal/plataforma
    const itemMap: Record<string, { nome: string, preco: number, qtd: number, plataforma: string }> = {}
    filteredPedidos.forEach(p => {
      p.items.forEach(i => {
        const key = `${i.produtoId}_${p.channel}`
        if (!itemMap[key]) {
          itemMap[key] = { nome: i.nome, preco: i.precoUnitario, qtd: 0, plataforma: p.channel }
        }
        itemMap[key].qtd += i.quantidade
      })
    })

    const detailedData: any[][] = [
      ['RELATÓRIO DIÁRIO DE VENDAS'],
      [''],
      ['PERÍODO', 'DATA', '', '', '', '', 'VALOR DA VENDA', formatCurrency(faturamentoBruto)],
      ['(Filtrado)', new Date().toLocaleDateString('pt-BR'), '', '', '', '', 'TOTAL DE VENDAS', formatCurrency(faturamentoBruto)],
      [''],
      ['Nº DO ITEM', 'NOME DO ITEM', 'DESCRIÇÃO DO ITEM', 'PREÇO', 'QTD.', 'VALOR', 'PLATAFORMA', 'TOTAL']
    ];

    Object.entries(itemMap).forEach(([key, data]) => {
      const id = key.split('_')[0]
      const valorTotal = data.preco * data.qtd;
      detailedData.push([
        `REF-${id}`, 
        data.nome, 
        'Item do Cardápio', 
        formatCurrency(data.preco), 
        data.qtd, 
        formatCurrency(valorTotal), 
        data.plataforma,
        formatCurrency(valorTotal)
      ]);
    });

    const columnWidths = [15, 30, 25, 15, 10, 15, 20, 15];

    exportToXLSX('relatorio_vendas_modelo', [], detailedData, columnWidths)
  }

  const chartConfig = {
    faturamento: { label: "Faturamento", color: "hsl(var(--primary))" }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-4">
        <h2 className="text-2xl font-black text-foreground">Vendas por Período e Canal</h2>
        
        <div className="flex items-center gap-3 flex-wrap">

          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground w-5 h-5" />
            <Select value={canalFiltro} onValueChange={(val) => setCanalFiltro(val as any)}>
              <SelectTrigger className="w-[140px] rounded-full border-border/60 bg-white shadow-sm font-medium">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Canais</SelectItem>
                <SelectItem value="DELIVERY">Delivery</SelectItem>
                <SelectItem value="PICKUP">Retirada</SelectItem>
                <SelectItem value="TABLE">Mesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={statusFiltro} onValueChange={(val) => setStatusFiltro(val as any)}>
            <SelectTrigger className="w-[140px] rounded-full border-border/60 bg-white shadow-sm font-medium">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="CONFIRMED">Confirmado</SelectItem>
              <SelectItem value="DELIVERED">Entregue / Faturado</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={exportData} variant="outline" className="rounded-full shadow-sm ml-2">
            <FileDown className="mr-2 h-4 w-4 text-emerald-600" /> Exportar Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard 
          title="Faturamento Líquido"
          value={formatCurrency(faturamentoLiquido)}
          icon={<DollarSign size={20} />}
          description={`Bruto: ${formatCurrency(faturamentoBruto)}`}
          trend={trendFaturamento}
          variant="primary"
        />
        <KpiCard 
          title="Ticket Médio"
          value={formatCurrency(ticketMedio)}
          icon={<TrendingUp size={20} />}
          trend={trendTicket}
        />
        <KpiCard 
          title="Volume de Pedidos"
          value={qtdPedidos}
          icon={<ShoppingBag size={20} />}
          trend={trendPedidos}
        />
        <KpiCard 
          title="Taxa de Cancelamento"
          value={`${taxaCancelamento.toFixed(1)}%`}
          icon={<FileDown size={20} />}
          trend={trendCancelamento}
          variant={taxaCancelamento > 5 ? "destructive" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <Card className="p-6 rounded-2xl border-border/40 lg:col-span-2 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} /> Tendência de Faturamento</h3>
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={tendenciaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-faturamento)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-faturamento)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${val}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="faturamento" stroke="var(--color-faturamento)" strokeWidth={3} fillOpacity={1} fill="url(#colorFaturamento)" />
              </AreaChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-border/40 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Filter size={18} /> Vendas por Canal</h3>
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead className="text-right">Total Gerado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {porCanal.map(c => (
                <TableRow key={c.name}>
                  <TableCell className="font-semibold">{c.name}</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">{formatCurrency(c.valor)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
