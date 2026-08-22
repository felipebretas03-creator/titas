"use client"

import { useMemo } from "react"
import { useFilteredRelatorios } from "../context"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileDown, MapPin, Truck, DollarSign, Navigation, Activity } from "lucide-react"
import { exportToXLSX, formatCurrency } from "./export-utils"

export function DeliveryReport() {
  const { pedidos } = useFilteredRelatorios()
  
  const deliveryPedidos = useMemo(() => pedidos.filter(p => p.channel === 'DELIVERY' && p.status !== 'CANCELLED'), [pedidos])
  
  const faturamentoDelivery = deliveryPedidos.reduce((acc, p) => acc + p.total, 0)

  // Agrupamento por Bairro
  const rankingBairros = useMemo(() => {
    const map: Record<string, { faturamento: number, qtd: number, custoFreteTotal: number }> = {}
    
    deliveryPedidos.forEach(p => {
      // Simulação: se não tiver bairro, cai em "Não Informado"
      const bairro = p.enderecoEntrega?.bairro || 'Não Informado'
      const cidade = p.enderecoEntrega?.cidade || ''
      const uf = p.enderecoEntrega?.estado || ''
      const key = bairro !== 'Não Informado' ? `${bairro} - ${cidade}/${uf}` : 'Não Informado'
      
      if (!map[key]) map[key] = { faturamento: 0, qtd: 0, custoFreteTotal: 0 }
      
      map[key].faturamento += p.total
      map[key].qtd += 1
      // Simulando custo de frete (ex: R$ 5 a R$ 15 baseado no total)
      map[key].custoFreteTotal += 5 + (p.total * 0.05) 
    })

    return Object.entries(map).map(([regiao, data]) => ({
      regiao,
      ...data,
      representatividade: (data.faturamento / faturamentoDelivery) * 100,
      freteMedio: data.custoFreteTotal / data.qtd
    })).sort((a, b) => b.qtd - a.qtd) // Ordena por volume de pedidos
  }, [deliveryPedidos, faturamentoDelivery])

  const handleExport = () => {
    exportToXLSX('logistica_areas_cobertura', 
      ['Região (Bairro/Cidade)', 'Volume de Pedidos', 'Faturamento Gerado', 'Representatividade (%)', 'Custo Médio Frete'],
      rankingBairros.map(r => [
        r.regiao, 
        r.qtd, 
        r.faturamento, 
        r.representatividade.toFixed(2), 
        r.freteMedio.toFixed(2)
      ])
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
          <Truck className="text-primary" /> Logística e Área de Cobertura
        </h2>
        <Button onClick={handleExport} variant="outline" className="rounded-full shadow-sm">
          <FileDown className="mr-2 h-4 w-4 text-emerald-600" /> Exportar Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="p-6 rounded-2xl bg-white border-border/40 shadow-sm">
          <div className="flex items-center gap-2 font-bold mb-2 text-slate-500"><MapPin size={20} /> Total de Regiões Atendidas</div>
          <div className="text-3xl font-black text-slate-800">{rankingBairros.length}</div>
        </Card>
        <Card className="p-6 rounded-2xl bg-white border-border/40 shadow-sm">
          <div className="flex items-center gap-2 font-bold mb-2 text-emerald-600"><DollarSign size={20} /> Faturamento Delivery</div>
          <div className="text-3xl font-black">{formatCurrency(faturamentoDelivery)}</div>
        </Card>
        <Card className="p-6 rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <div className="flex items-center gap-2 font-bold mb-2 opacity-80"><Navigation size={20} /> Bairro Mais Quente</div>
          <div className="text-xl font-black truncate">{rankingBairros[0]?.regiao.split(' - ')[0] || '-'}</div>
          <div className="text-sm opacity-80">{rankingBairros[0]?.qtd || 0} pedidos</div>
        </Card>
      </div>

      <Card className="p-6 rounded-2xl border-border/40 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity size={18} className="text-muted-foreground" /> Ranking de Áreas (Mapa de Calor Lógico)
        </h3>
        <div className="rounded-xl border border-border/40 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead>Região (Bairro / Cidade)</TableHead>
                <TableHead className="text-right">Volume (Pedidos)</TableHead>
                <TableHead className="text-right">Faturamento</TableHead>
                <TableHead className="text-center">Representatividade</TableHead>
                <TableHead className="text-right">Custo Médio Frete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankingBairros.map((r, index) => (
                <TableRow key={r.regiao}>
                  <TableCell className="font-semibold flex items-center gap-2">
                    {/* Indicador visual de intensidade (Top 3 ficam vermelhos/laranjas) */}
                    <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : index === 2 ? 'bg-amber-500' : 'bg-slate-300'}`} />
                    {r.regiao}
                  </TableCell>
                  <TableCell className="text-right font-medium">{r.qtd}</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">{formatCurrency(r.faturamento)}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {r.representatividade.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(r.freteMedio)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
