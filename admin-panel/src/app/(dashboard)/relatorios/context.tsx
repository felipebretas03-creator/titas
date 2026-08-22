"use client"

import { createContext, useContext } from "react"
import { Pedido, Transacao, MovimentacaoEstoque } from "@/store"

export type FilteredData = {
  pedidos: Pedido[];
  transacoes: Transacao[];
  movimentacoesEstoque: MovimentacaoEstoque[];
  startDate: string;
  endDate: string;
  turno: string;
}

export const RelatoriosContext = createContext<FilteredData | null>(null);

export const useFilteredRelatorios = () => {
  const context = useContext(RelatoriosContext);
  if (!context) throw new Error("useFilteredRelatorios must be used within RelatoriosContext.Provider");
  return context;
}
