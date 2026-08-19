"use client"

import { useStore } from "@/store"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Settings, Smartphone, Printer, MonitorOff, CreditCard, Tags, Briefcase, ChevronRight, ShieldCheck, MapPin } from "lucide-react"
import { toast } from "sonner"

export default function ConfiguracoesPage() {
  const { configuracoes, updateConfiguracoes } = useStore()

  const handleAdminClick = (area: string) => {
    toast(`Abrindo configurações de ${area}...`, {
      description: "Esta funcionalidade abrirá um modal ou página dedicada em breve."
    })
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">
          Configurações
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-[1200px]">
        
        {/* PARÂMETROS DO SISTEMA */}
        <Card className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/40">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Settings size={20} />
            </div>
            <h2 className="text-xl font-bold">Parâmetros do Sistema</h2>
          </div>

          <div className="flex flex-col gap-6">
             
             {/* Opção 1 */}
             <div className="flex items-center justify-between border-b border-border/40 pb-6">
                <div className="flex gap-4 pr-4">
                   <div className="w-12 h-12 shrink-0 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                      <MonitorOff size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold text-base md:text-lg">Modo Mesa Dupla</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-sm">Ativa o layout otimizado para dois monitores (Caixa e Cozinha).</p>
                   </div>
                </div>
                <Switch 
                  checked={configuracoes.modoMesaDupla} 
                  onCheckedChange={(val) => updateConfiguracoes({ modoMesaDupla: val })}
                  className="data-[state=checked]:bg-primary shrink-0"
                />
             </div>

             {/* Opção 2 */}
             <div className="flex items-center justify-between border-b border-border/40 pb-6">
                <div className="flex gap-4 pr-4">
                   <div className="w-12 h-12 shrink-0 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                      <Smartphone size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold text-base md:text-lg">Integração iFood</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-sm">Receber pedidos e inserir na Fila de Produção automaticamente.</p>
                   </div>
                </div>
                <Switch 
                  checked={configuracoes.ifoodAtivo} 
                  onCheckedChange={(val) => updateConfiguracoes({ ifoodAtivo: val })}
                  className="data-[state=checked]:bg-primary shrink-0"
                />
             </div>

             {/* Opção 3 */}
             <div className="flex items-center justify-between">
                <div className="flex gap-4 pr-4">
                   <div className="w-12 h-12 shrink-0 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                      <Printer size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold text-base md:text-lg">Impressão Automática</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-sm">Enviar a comanda de produção direto para a impressora térmica.</p>
                   </div>
                </div>
                <Switch 
                  checked={configuracoes.impressaoAutomatica} 
                  onCheckedChange={(val) => updateConfiguracoes({ impressaoAutomatica: val })}
                  className="data-[state=checked]:bg-primary shrink-0"
                />
             </div>

          </div>
        </Card>

        {/* CADASTROS ADMINISTRATIVOS */}
        <Card className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/40">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-bold">Cadastros e Administração</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
             
             {/* Formas de Pagamento */}
             <div onClick={() => handleAdminClick('Formas de Pagamento')} className="group cursor-pointer p-4 md:p-5 rounded-2xl border border-border/50 bg-[#fcfbfb] hover:bg-white hover:shadow-md hover:border-primary/20 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard size={18} />
                   </div>
                   <div>
                      <h3 className="font-bold text-sm md:text-base text-foreground">Formas de Pagamento</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Pix, Cartões, Dinheiro</p>
                   </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
             </div>

             {/* Categorias */}
             <div onClick={() => handleAdminClick('Categorias de Produtos')} className="group cursor-pointer p-4 md:p-5 rounded-2xl border border-border/50 bg-[#fcfbfb] hover:bg-white hover:shadow-md hover:border-primary/20 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 shrink-0 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Tags size={18} />
                   </div>
                   <div>
                      <h3 className="font-bold text-sm md:text-base text-foreground">Categorias</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Grupos do cardápio</p>
                   </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
             </div>

             {/* Cargos */}
             <div onClick={() => handleAdminClick('Cargos e Funções')} className="group cursor-pointer p-4 md:p-5 rounded-2xl border border-border/50 bg-[#fcfbfb] hover:bg-white hover:shadow-md hover:border-primary/20 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Briefcase size={18} />
                   </div>
                   <div>
                      <h3 className="font-bold text-sm md:text-base text-foreground">Cargos e Funções</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Níveis de acesso do sistema</p>
                   </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
             </div>
             
             {/* Regiões de Entrega */}
             <div onClick={() => handleAdminClick('Regiões de Entrega')} className="group cursor-pointer p-4 md:p-5 rounded-2xl border border-border/50 bg-[#fcfbfb] hover:bg-white hover:shadow-md hover:border-primary/20 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 shrink-0 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MapPin size={18} />
                   </div>
                   <div>
                      <h3 className="font-bold text-sm md:text-base text-foreground">Regiões de Entrega</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Taxas e bairros atendidos</p>
                   </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
             </div>

          </div>
        </Card>

      </div>
    </div>
  )
}
