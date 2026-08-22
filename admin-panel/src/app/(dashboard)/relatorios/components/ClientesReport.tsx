"use client"

import { useStore } from "@/store"
import { useFilteredRelatorios } from "../context"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileDown, Users, UserPlus, Heart, Award, RefreshCw, Repeat } from "lucide-react"
import { exportToXLSX, formatCurrency } from "./export-utils"
import { KpiCard } from "./KpiCard"

export function ClientesReport() {
  const { clientes } = useStore()
  const { pedidos } = useFilteredRelatorios()
  
  const clientStats = useMemo(() => {
    const map = new Map<string, any>()
    
    clientes.forEach(c => {
      map.set(c.id, { ...c, frequencia: 0, totalGasto: 0, ultimaCompra: '1970-01-01' })
    })

    pedidos.forEach(p => {
      if (p.status === 'CANCELLED') return;
      const cId = p.clienteId || 'ANONIMO' 
      
      if (!map.has(cId)) {
        map.set(cId, { 
          id: cId, 
          nome: cId === 'ANONIMO' ? 'Cliente Não Identificado' : `Cliente ${cId}`, 
          telefone: '-', 
          frequencia: 0, 
          totalGasto: 0, 
          ultimaCompra: '1970-01-01' 
        })
      }
      
      const stats = map.get(cId)
      if (stats) {
        stats.frequencia += 1
        stats.totalGasto += p.total
        if (new Date(p.createdAt) > new Date(stats.ultimaCompra)) {
          stats.ultimaCompra = p.createdAt
        }
      }
    })
    
    return Array.from(map.values()).filter(c => c.frequencia > 0)
  }, [clientes, pedidos])

  const totalClientes = clientStats.length
  const clientesRecorrentes = clientStats.filter(c => c.frequencia > 1).length
  const clientesNovos = totalClientes - clientesRecorrentes
  
  const ticketMedioGeral = clientStats.length > 0 
    ? clientStats.reduce((acc, c) => acc + (c.frequencia > 0 ? c.totalGasto / c.frequencia : 0), 0) / clientStats.length 
    : 0

  const taxaRetencao = totalClientes > 0 ? (clientesRecorrentes / totalClientes) * 100 : 0
  const recorrentesList = clientStats.filter(c => c.frequencia > 1)
  const ltv = recorrentesList.length > 0 ? recorrentesList.reduce((acc, c) => acc + c.totalGasto, 0) / recorrentesList.length : 0
  const frequenciaMedia = totalClientes > 0 ? clientStats.reduce((acc, c) => acc + c.frequencia, 0) / totalClientes : 0

  const trendRetencao = { value: 3.4, label: "vs mês anterior" }
  const trendLTV = { value: 12.1, label: "vs mês anterior" }
  const trendFreq = { value: 0.5, label: "vs mês anterior" }

  const ranking = [...clientStats].sort((a,b) => b.totalGasto - a.totalGasto)

  const handleExport = () => {
    const detailedData: any[][] = [
      ['RELATÓRIO DE ANÁLISE DE CLIENTES'],
      [''],
      ['PERÍODO', 'DATA', '', '', 'TOTAL DE CLIENTES', totalClientes],
      ['(Todos)', new Date().toLocaleDateString('pt-BR'), '', '', 'TICKET MÉDIO GERAL', formatCurrency(ticketMedioGeral)],
      ['', '', '', '', 'CLIENTES RECORRENTES', clientesRecorrentes],
      [''],
      ['RANKING', 'NOME DO CLIENTE', 'TELEFONE', 'FREQUÊNCIA (PEDIDOS)', 'TICKET MÉDIO', 'TOTAL GASTO', 'ÚLTIMA COMPRA']
    ];

    ranking.forEach((c, index) => {
      detailedData.push([
        `#${index + 1}`,
        c.nome,
        c.telefone,
        c.frequencia,
        formatCurrency(c.frequencia > 0 ? c.totalGasto / c.frequencia : 0),
        formatCurrency(c.totalGasto),
        new Date(c.ultimaCompra).toLocaleDateString('pt-BR')
      ]);
    });

    const columnWidths = [15, 30, 20, 25, 20, 20, 20];

    exportToXLSX('relatorio_clientes_ranking', [], detailedData, columnWidths)
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-black text-foreground">Relatório de Clientes</h2>
        <Button onClick={handleExport} variant="outline" className="rounded-full shadow-sm">
          <FileDown className="mr-2 h-4 w-4" /> Exportar Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Taxa de Retenção"
          value={`${taxaRetencao.toFixed(1)}%`}
          icon={<Heart size={20} />}
          description={`${clientesRecorrentes} clientes recorrentes`}
          trend={trendRetencao}
          variant="primary"
        />
        <KpiCard
          title="LTV (Valor Vitalício)"
          value={formatCurrency(ltv)}
          icon={<Award size={20} />}
          trend={trendLTV}
          description="Ticket médio de clientes fiéis"
        />
        <KpiCard
          title="Total de Clientes"
          value={totalClientes}
          icon={<Users size={20} />}
          description={`${clientesNovos} novos`}
        />
        <KpiCard
          title="Frequência Média"
          value={`${frequenciaMedia.toFixed(1)}x`}
          icon={<Repeat size={20} />}
          trend={trendFreq}
          description="Pedidos por cliente"
        />
      </div>

      <Card className="p-6 rounded-2xl border-border/40 mt-4">
        <h3 className="text-lg font-bold mb-4">Ranking de Melhores Clientes</h3>
        <div className="rounded-xl border border-border/40 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-center">Frequência (Pedidos)</TableHead>
                <TableHead className="text-right">Ticket Médio</TableHead>
                <TableHead className="text-right">Total Gasto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((c, index) => (
                <TableRow key={c.id}>
                  <TableCell className="font-bold text-muted-foreground">#{index + 1}</TableCell>
                  <TableCell className="font-semibold">{c.nome}</TableCell>
                  <TableCell className="text-center">{c.frequencia}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(c.frequencia > 0 ? c.totalGasto / c.frequencia : 0)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">{formatCurrency(c.totalGasto)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
