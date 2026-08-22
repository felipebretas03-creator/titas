"use client"

import { useStore } from "@/store"
import { useFilteredRelatorios } from "../context"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileDown, UserCheck, Briefcase, Banknote } from "lucide-react"
import { exportToCSV, formatCurrency } from "./export-utils"

export function OperacaoReport() {
  const { usuarios } = useStore()
  const { pedidos } = useFilteredRelatorios()
  
  // Mapear atendentes para demonstração (como não há vínculo direto no pedido atual, dividimos simulações)
  const operadores = usuarios.filter(u => u.perfil === 'Garçom' || u.perfil === 'Caixa' || u.perfil === 'Motoboy')
  
  const relatorioOperadores = operadores.map((op, idx) => {
    // Simulação: distribuir pedidos entre os operadores para o relatório
    const qtd = pedidos.length > 0 ? Math.floor(pedidos.length / operadores.length) + (idx === 0 ? 1 : 0) : 0
    const vendasTotais = qtd * 45 // ticket medio simulado para a operacao
    const comissao = op.perfil === 'Garçom' ? vendasTotais * 0.1 : 0
    
    return {
      nome: op.nome,
      perfil: op.perfil,
      pedidosAtendidos: qtd,
      vendasTotais,
      comissao
    }
  }).sort((a,b) => b.vendasTotais - a.vendasTotais)

  const handleExport = () => {
    exportToCSV('relatorio_operacao', 
      ['Nome', 'Função', 'Pedidos Atendidos', 'Vendas Totais', 'Comissões'],
      relatorioOperadores.map(o => [
        o.nome,
        o.perfil,
        o.pedidosAtendidos.toString(),
        o.vendasTotais.toString(),
        o.comissao.toString()
      ])
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-black text-foreground">Relatório de Operação</h2>
        <Button onClick={handleExport} variant="outline" className="rounded-full shadow-sm">
          <FileDown className="mr-2 h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 rounded-2xl bg-primary text-primary-foreground">
          <div className="flex items-center gap-2 font-bold mb-2 opacity-80"><UserCheck size={20} /> Equipe Ativa</div>
          <div className="text-3xl font-black">{operadores.length}</div>
        </Card>
        <Card className="p-6 rounded-2xl bg-white border-border/40">
          <div className="flex items-center gap-2 font-bold mb-2 text-emerald-600"><Briefcase size={20} /> Total de Atendimentos</div>
          <div className="text-3xl font-black">{pedidos.length}</div>
        </Card>
        <Card className="p-6 rounded-2xl bg-white border-border/40">
          <div className="flex items-center gap-2 font-bold mb-2 text-amber-500"><Banknote size={20} /> Comissões Geradas</div>
          <div className="text-3xl font-black">{formatCurrency(relatorioOperadores.reduce((acc, o) => acc + o.comissao, 0))}</div>
        </Card>
      </div>

      <Card className="p-6 rounded-2xl border-border/40 mt-4">
        <h3 className="text-lg font-bold mb-4">Desempenho por Colaborador</h3>
        <div className="rounded-xl border border-border/40 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="text-center">Pedidos</TableHead>
                <TableHead className="text-right">Vendas Totais</TableHead>
                <TableHead className="text-right">Comissão Estimada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatorioOperadores.map((op, i) => (
                <TableRow key={i}>
                  <TableCell className="font-semibold">{op.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{op.perfil}</TableCell>
                  <TableCell className="text-center font-medium">{op.pedidosAtendidos}</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">{formatCurrency(op.vendasTotais)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(op.comissao)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
