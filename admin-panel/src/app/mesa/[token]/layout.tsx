"use client"

import { useStore } from "@/store"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function TabletLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const store = useStore()
  
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  const table = store.mesas.find(m => m.token_hash === token)
  
  if (!table) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-white p-6">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-3xl font-black text-rose-500">Mesa Inválida</h1>
          <p className="text-xl">Este link de acesso não é válido ou foi revogado.</p>
          <p className="text-muted-foreground">Por favor, chame um atendente.</p>
        </div>
      </div>
    )
  }
  
  if (!table.active || !store.configuracoesTablet.active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-white p-6">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-3xl font-black text-amber-500">Temporariamente Indisponível</h1>
          <p className="text-xl">Este tablet está temporariamente indisponível.</p>
          <p className="text-muted-foreground">Por favor, chame um atendente.</p>
        </div>
      </div>
    )
  }

  // Set CSS Variables for Theme
  const themeStyle = {
    '--primary-tablet': store.configuracoesTablet.themeColor,
    '--btn-tablet': store.configuracoesTablet.buttonColor,
  } as React.CSSProperties

  return (
    <div 
      className="min-h-screen w-full flex flex-col font-sans select-none overflow-hidden" 
      style={themeStyle}
    >
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-stone-50">
        {children}
      </main>
    </div>
  )
}
