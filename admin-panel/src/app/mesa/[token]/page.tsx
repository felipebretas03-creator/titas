"use client"

import { useStore, generateId } from "@/store"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const store = useStore()
  const config = store.configuracoesTablet
  const table = store.mesas.find(m => m.token_hash === token)
  
  if (!table) return null

  const handleStart = () => {
    // If the table is available, we open a session or mark it as occupied
    let session = store.sessoesMesa.find(s => s.table_id === table.id && s.status !== 'CLOSED')
    
    if (!session) {
      const sessionId = generateId()
      store.addSessaoMesa({
        id: sessionId,
        table_id: table.id,
        status: 'OPEN',
        openedAt: new Date().toISOString(),
        totalAmount: 0
      })
      store.updateMesa(table.id, { status: 'OCCUPIED' })
    }
    
    router.push(`/mesa/${token}/cardapio`)
  }

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center relative p-8 bg-stone-900"
    >
      <div className="absolute inset-0 z-0 bg-[url('/bg-tablet.png')] bg-cover bg-center bg-no-repeat" />
      
      {/* Overlay com a cor do Marsala (Tita's) */}
      <div className="absolute inset-0 z-0 bg-[#5c1a1b]/70 mix-blend-multiply" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl gap-10">
        
        <div className="mb-4 drop-shadow-2xl flex flex-col items-center gap-2">
          <img src="/logo-titas-semfundo.png" alt="Tita's Logo" className="w-48 h-auto object-contain drop-shadow-2xl" />
          <p className="text-white font-medium text-xl tracking-widest uppercase opacity-80 mt-2">
            {table.name}
          </p>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-2xl uppercase">
            {config.welcomeTitle}
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-medium drop-shadow-md">
            {config.welcomeSubtitle}
          </p>
        </div>

        <Button 
          onClick={handleStart}
          className="mt-8 bg-[#5c1a1b] hover:bg-[#4a1515] text-2xl md:text-3xl font-black px-16 py-10 h-auto rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/50 text-white uppercase tracking-wider"
        >
          {config.welcomeButtonText}
        </Button>
      </div>
    </div>
  )
}
