"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TabletSmartphone, Save, CheckCircle2 } from "lucide-react"
import { useStore } from "@/store"

export default function TabletConfigPage() {
  const { configuracoesTablet, updateConfiguracoesTablet } = useStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(configuracoesTablet)

  const handleChange = (field: keyof typeof configuracoesTablet, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      updateConfiguracoesTablet(formData)
      toast.success("Configurações do tablet atualizadas com sucesso!")
      setLoading(false)
    }, 500)
  }

  return (
    <div className="flex flex-col gap-6 pb-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
          <TabletSmartphone size={28} className="text-primary" />
          Configurações do Tablet
        </h1>
        <p className="text-muted-foreground mt-1">
          Personalize a experiência de autoatendimento na mesa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ativação */}
        <Card className="md:col-span-2 border-primary/20">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Status do Autoatendimento</CardTitle>
              <CardDescription>Ativar ou desativar o uso de tablets nas mesas.</CardDescription>
            </div>
            <Switch 
              checked={formData.active}
              onCheckedChange={(c) => handleChange('active', c)}
            />
          </CardHeader>
          <CardContent>
            {formData.active ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <CheckCircle2 size={18} />
                O modo tablet está ATIVO e os clientes podem fazer pedidos nas mesas.
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                O modo tablet está DESATIVADO. Os clientes verão uma tela de manutenção.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visual */}
        <Card>
          <CardHeader>
            <CardTitle>Identidade Visual</CardTitle>
            <CardDescription>Cores do aplicativo no tablet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cor de Fundo / Principal</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  className="w-14 h-10 p-1"
                  value={formData.themeColor}
                  onChange={(e) => handleChange('themeColor', e.target.value)}
                />
                <Input 
                  type="text" 
                  value={formData.themeColor}
                  onChange={(e) => handleChange('themeColor', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor dos Botões</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  className="w-14 h-10 p-1"
                  value={formData.buttonColor}
                  onChange={(e) => handleChange('buttonColor', e.target.value)}
                />
                <Input 
                  type="text" 
                  value={formData.buttonColor}
                  onChange={(e) => handleChange('buttonColor', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Textos da Tela Inicial */}
        <Card>
          <CardHeader>
            <CardTitle>Tela de Boas-Vindas</CardTitle>
            <CardDescription>Textos exibidos antes de abrir o cardápio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Título Principal</Label>
              <Input 
                value={formData.welcomeTitle}
                onChange={(e) => handleChange('welcomeTitle', e.target.value)}
                placeholder="Ex: BEM-VINDO!"
              />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input 
                value={formData.welcomeSubtitle}
                onChange={(e) => handleChange('welcomeSubtitle', e.target.value)}
                placeholder="Ex: Seu próximo pedido começa aqui."
              />
            </div>
            <div className="space-y-2">
              <Label>Texto do Botão Inicial</Label>
              <Input 
                value={formData.welcomeButtonText}
                onChange={(e) => handleChange('welcomeButtonText', e.target.value)}
                placeholder="Ex: FAZER SEU PEDIDO!"
              />
            </div>
          </CardContent>
        </Card>

        {/* Funcionalidades */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Funcionalidades e Mensagens</CardTitle>
            <CardDescription>Comportamento do sistema durante o atendimento.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label className="text-base">Permitir Chamar Garçom</Label>
                  <p className="text-sm text-muted-foreground">Exibe o botão de chamar garçom no tablet.</p>
                </div>
                <Switch 
                  checked={formData.allowCallWaiter}
                  onCheckedChange={(c) => handleChange('allowCallWaiter', c)}
                />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label className="text-base">Permitir Solicitar a Conta</Label>
                  <p className="text-sm text-muted-foreground">Exibe o botão de pedir a conta no tablet.</p>
                </div>
                <Switch 
                  checked={formData.allowRequestBill}
                  onCheckedChange={(c) => handleChange('allowRequestBill', c)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Mensagem de Sucesso (Pedido)</Label>
                <Input 
                  value={formData.orderSuccessMessage}
                  onChange={(e) => handleChange('orderSuccessMessage', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Mensagem de Conta Solicitada</Label>
                <Input 
                  value={formData.billSuccessMessage}
                  onChange={(e) => handleChange('billSuccessMessage', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4 mt-4 sticky bottom-6 z-10">
        <Button size="lg" variant="outline" onClick={() => setFormData(configuracoesTablet)}>
          Cancelar
        </Button>
        <Button size="lg" onClick={handleSave} disabled={loading} className="px-8 shadow-lg">
          <Save className="mr-2 h-5 w-5" />
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  )
}
