"use client"

import { useMemo } from "react"
import { useStore } from "@/store"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, TrendingUp } from "lucide-react"

export default function RelatoriosPage() {
  const { produtos } = useStore()
  
  // Simulated sales data based on products
  const simulatedSales = useMemo(() => {
    return produtos.map((p, index) => {
      const qtd = ((index * 17) % 50) + 10 * (produtos.length - index);
      return {
        ...p,
        qtdVendas: qtd,
        receitaGerada: p.preco * qtd
      }
    }).sort((a, b) => b.receitaGerada - a.receitaGerada)
  }, [produtos])

  const formatCurrency = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
          Relatórios
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary rounded-[2rem] p-8 shadow-sm border border-border/40 text-white flex flex-col justify-center">
            <div className="flex items-center gap-2 font-bold mb-2 opacity-80">
               <TrendingUp size={24} /> Produto Campeão
            </div>
            <div className="text-4xl font-black tracking-tighter truncate">
               {simulatedSales[0]?.nome || "Nenhum dado"}
            </div>
            <div className="mt-4 font-medium opacity-90">
               Gerou {formatCurrency(simulatedSales[0]?.receitaGerada || 0)} este mês.
            </div>
        </Card>
        
        <Card className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 flex flex-col justify-center">
            <div className="flex items-center gap-2 font-bold mb-2 text-muted-foreground">
               <BarChart3 size={24} className="text-primary" /> Total de Itens Vendidos
            </div>
            <div className="text-5xl font-black tracking-tighter">
               {simulatedSales.reduce((acc, curr) => acc + curr.qtdVendas, 0)}
            </div>
        </Card>
      </div>

      <Card className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 min-h-[400px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <BarChart3 size={20} />
          </div>
          <h2 className="text-xl font-bold">Ranking de Vendas por Produto</h2>
        </div>

        <div className="rounded-xl border border-border/40 overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-semibold text-muted-foreground">Posição</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Produto</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Qtd. Vendida</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">Receita Gerada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulatedSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    Sem dados suficientes para relatório. Adicione produtos.
                  </TableCell>
                </TableRow>
              ) : (
                simulatedSales.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-secondary/10">
                     <TableCell className="font-bold text-muted-foreground">#{index + 1}</TableCell>
                    <TableCell className="font-semibold">{item.nome}</TableCell>
                    <TableCell>{item.qtdVendas} un.</TableCell>
                    <TableCell className="text-right font-bold text-emerald-600">
                      {formatCurrency(item.receitaGerada)}
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
