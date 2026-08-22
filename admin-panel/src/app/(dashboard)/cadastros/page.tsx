"use client"

import { useState } from "react"
import { useStore, generateId, OpcaoComplemento } from "@/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Edit2, Package, Boxes, ListPlus, X, Layers, Combine } from "lucide-react"

export default function CadastrosPage() {
  const { 
    produtos, addProduto, deleteProduto, categorias,
    mercadorias, addMercadoria, deleteMercadoria,
    complementos, addComplemento, deleteComplemento,
    combos, addCombo, deleteCombo
  } = useStore()
  
  // --- Produto States ---
  const [isOpenProd, setIsOpenProd] = useState(false)
  const [nomeProd, setNomeProd] = useState("")
  const [precoProd, setPrecoProd] = useState("")
  const [categoriaProd, setCategoriaProd] = useState("")
  const [isRevenda, setIsRevenda] = useState(false)
  const [estoqueAtualProd, setEstoqueAtualProd] = useState("")
  const [estoqueMinimoProd, setEstoqueMinimoProd] = useState("")
  const [receita, setReceita] = useState<{ mercadoriaId: string; quantidade: number }[]>([])
  const [complementosProd, setComplementosProd] = useState<string[]>([])
  const [mercadoriaIdTemp, setMercadoriaIdTemp] = useState("")
  const [quantidadeTemp, setQuantidadeTemp] = useState("")

  // --- Mercadoria States ---
  const [isOpenMerc, setIsOpenMerc] = useState(false)
  const [nomeMerc, setNomeMerc] = useState("")
  const [unidadeMerc, setUnidadeMerc] = useState("")
  const [custoMerc, setCustoMerc] = useState("")
  const [estoqueAtualMerc, setEstoqueAtualMerc] = useState("")
  const [estoqueMinMerc, setEstoqueMinMerc] = useState("")
  const [isTambemProduto, setIsTambemProduto] = useState(false)
  const [precoVendaMerc, setPrecoVendaMerc] = useState("")
  const [categoriaMerc, setCategoriaMerc] = useState("")

  // --- Complemento States ---
  const [isOpenComp, setIsOpenComp] = useState(false)
  const [nomeComp, setNomeComp] = useState("")
  const [obrigComp, setObrigComp] = useState(false)
  const [maxComp, setMaxComp] = useState("1")
  const [opcoesComp, setOpcoesComp] = useState<OpcaoComplemento[]>([])
  const [tempNomeOpcao, setTempNomeOpcao] = useState("")
  const [tempPrecoOpcao, setTempPrecoOpcao] = useState("")

  // --- Combo States ---
  const [isOpenCombo, setIsOpenCombo] = useState(false)
  const [nomeCombo, setNomeCombo] = useState("")
  const [precoCombo, setPrecoCombo] = useState("")
  const [itensCombo, setItensCombo] = useState<{ produtoId: string; quantidade: number }[]>([])
  const [tempProdCombo, setTempProdCombo] = useState("")
  const [tempQtdCombo, setTempQtdCombo] = useState("")

  // --- Handlers ---
  const handleSubmitProduto = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeProd || !precoProd || !categoriaProd) return
    
    addProduto({
      nome: nomeProd,
      preco: parseFloat(precoProd),
      custo: 0,
      estoqueAtual: isRevenda ? parseInt(estoqueAtualProd || "0") : 0,
      estoqueMinimo: isRevenda ? parseInt(estoqueMinimoProd || "0") : 0,
      categoria: categoriaProd,
      status: "Ativo",
      isRevenda,
      receita: isRevenda ? [] : receita,
      complementos: complementosProd
    })
    
    setNomeProd("")
    setPrecoProd("")
    setCategoriaProd("")
    setIsRevenda(false)
    setEstoqueAtualProd("")
    setEstoqueMinimoProd("")
    setReceita([])
    setComplementosProd([])
    setIsOpenProd(false)
  }

  const handleSubmitMercadoria = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeMerc || !unidadeMerc || !custoMerc) return
    if (isTambemProduto && (!precoVendaMerc || !categoriaMerc)) return
    
    const newMercId = generateId()
    
    addMercadoria({
      id: newMercId,
      nome: nomeMerc,
      unidadeMedida: unidadeMerc,
      custo: parseFloat(custoMerc),
      estoqueAtual: parseFloat(estoqueAtualMerc || "0"),
      estoqueMinimo: parseFloat(estoqueMinMerc || "0"),
      status: "Ativo"
    })

    if (isTambemProduto) {
      addProduto({
        nome: nomeMerc,
        preco: parseFloat(precoVendaMerc),
        custo: parseFloat(custoMerc),
        estoqueAtual: 0,
        estoqueMinimo: 0,
        categoria: categoriaMerc,
        status: "Ativo",
        isRevenda: false,
        receita: [{ mercadoriaId: newMercId, quantidade: 1 }],
        complementos: []
      })
    }
    
    setNomeMerc("")
    setUnidadeMerc("")
    setCustoMerc("")
    setEstoqueAtualMerc("")
    setEstoqueMinMerc("")
    setIsTambemProduto(false)
    setPrecoVendaMerc("")
    setCategoriaMerc("")
    setIsOpenMerc(false)
  }

  const handleSubmitComplemento = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeComp || opcoesComp.length === 0) return
    
    addComplemento({
      nome: nomeComp,
      obrigatorio: obrigComp,
      maximo: parseInt(maxComp || "1"),
      opcoes: opcoesComp,
      status: 'Ativo'
    })
    
    setNomeComp("")
    setObrigComp(false)
    setMaxComp("1")
    setOpcoesComp([])
    setIsOpenComp(false)
  }

  const handleSubmitCombo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeCombo || !precoCombo || itensCombo.length === 0) return
    
    addCombo({
      nome: nomeCombo,
      preco: parseFloat(precoCombo),
      itens: itensCombo,
      status: 'Ativo'
    })
    
    setNomeCombo("")
    setPrecoCombo("")
    setItensCombo([])
    setIsOpenCombo(false)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
          Cadastros
        </h1>
      </div>

      <Tabs defaultValue="produtos" className="w-full">
        <TabsList className="flex flex-wrap w-full max-w-[800px] mb-8 bg-secondary/30 h-auto sm:h-12 rounded-xl p-1 gap-1">
          <TabsTrigger value="produtos" className="flex-1 rounded-lg font-bold min-w-[120px]">Produtos</TabsTrigger>
          <TabsTrigger value="mercadorias" className="flex-1 rounded-lg font-bold min-w-[120px]">Mercadorias</TabsTrigger>
          <TabsTrigger value="complementos" className="flex-1 rounded-lg font-bold min-w-[120px]">Complementos</TabsTrigger>
          <TabsTrigger value="combos" className="flex-1 rounded-lg font-bold min-w-[120px]">Combos</TabsTrigger>
        </TabsList>

        {/* ABA PRODUTOS */}
        <TabsContent value="produtos">
          <div className="flex justify-end mb-6">
            <Dialog open={isOpenProd} onOpenChange={setIsOpenProd}>
              <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-md text-white font-semibold">
                  <Plus className="mr-2 h-4 w-4" /> Novo Produto
                </Button>} />
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[1.5rem] p-6 border-border/40">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase">Adicionar Produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitProduto} className="flex flex-col gap-6 py-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-muted-foreground">Nome do Produto</label>
                    <Input value={nomeProd} onChange={(e) => setNomeProd(e.target.value)} placeholder="Ex: Hambúrguer Duplo" className="rounded-xl border-border/60" required />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="text-sm font-semibold text-muted-foreground">Preço (R$)</label>
                      <Input type="number" step="0.01" value={precoProd} onChange={(e) => setPrecoProd(e.target.value)} placeholder="Ex: 29.90" className="rounded-xl border-border/60" required />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="text-sm font-semibold text-muted-foreground">Categoria</label>
                      <Select onValueChange={(val) => setCategoriaProd(val || "")} value={categoriaProd}>
                        <SelectTrigger className="rounded-xl border-border/60">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map(cat => (
                            <SelectItem key={cat.id} value={cat.nome}>{cat.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-muted-foreground">Complementos Disponíveis</label>
                    <div className="grid grid-cols-2 gap-2 bg-secondary/10 p-4 rounded-xl border border-border/40">
                      {complementos.map(comp => (
                        <div key={comp.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`comp-${comp.id}`} 
                            checked={complementosProd.includes(comp.id)}
                            onCheckedChange={(checked) => {
                              if (checked) setComplementosProd([...complementosProd, comp.id])
                              else setComplementosProd(complementosProd.filter(id => id !== comp.id))
                            }}
                          />
                          <label htmlFor={`comp-${comp.id}`} className="text-xs font-semibold cursor-pointer">
                            {comp.nome}
                          </label>
                        </div>
                      ))}
                      {complementos.length === 0 && <span className="text-xs text-muted-foreground">Nenhum complemento cadastrado.</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-secondary/20 p-4 rounded-xl">
                    <Switch id="revenda" checked={isRevenda} onCheckedChange={setIsRevenda} />
                    <label htmlFor="revenda" className="text-sm font-semibold cursor-pointer select-none">
                      Produto Industrializado (Revenda direto ex: Lata Refri)
                    </label>
                  </div>

                  {isRevenda ? (
                    <div className="flex gap-4 p-4 border border-border/40 rounded-xl bg-background/50">
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm font-semibold text-muted-foreground">Estoque Atual (Unidades)</label>
                        <Input type="number" value={estoqueAtualProd} onChange={(e) => setEstoqueAtualProd(e.target.value)} placeholder="Ex: 100" className="rounded-xl border-border/60" />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm font-semibold text-muted-foreground">Estoque Mínimo (Alerta)</label>
                        <Input type="number" min="0" value={estoqueMinimoProd} onChange={(e) => setEstoqueMinimoProd(e.target.value)} placeholder="Ex: 10" className="rounded-xl border-border/60" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 p-4 border border-border/40 rounded-xl bg-background/50">
                      <h4 className="font-bold flex items-center gap-2"><ListPlus size={18} /> Ficha Técnica (Receita)</h4>
                      
                      {receita.map((rec, i) => {
                        const m = mercadorias.find(x => x.id === rec.mercadoriaId)
                        return (
                          <div key={i} className="flex justify-between items-center bg-secondary/10 p-2 rounded-lg">
                            <span className="text-sm font-medium">{m?.nome} - {rec.quantidade}{m?.unidadeMedida}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => {
                              const newRec = [...receita]; newRec.splice(i, 1); setReceita(newRec);
                            }}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}

                      <div className="flex gap-2 items-end">
                        <div className="flex flex-col gap-2 flex-[2]">
                          <label className="text-xs font-semibold text-muted-foreground">Ingrediente</label>
                          <Select onValueChange={(val) => setMercadoriaIdTemp(val || "")} value={mercadoriaIdTemp}>
                            <SelectTrigger className="rounded-xl border-border/60">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                              {mercadorias.map(m => (
                                <SelectItem key={m.id} value={m.id}>{m.nome} ({m.unidadeMedida})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <label className="text-xs font-semibold text-muted-foreground">Qtd</label>
                          <Input type="number" step="0.01" value={quantidadeTemp} onChange={(e) => setQuantidadeTemp(e.target.value)} placeholder="100" className="rounded-xl border-border/60" />
                        </div>
                        <Button type="button" onClick={(e) => {
                          e.preventDefault();
                          if (!mercadoriaIdTemp || !quantidadeTemp) return;
                          setReceita([...receita, { mercadoriaId: mercadoriaIdTemp, quantidade: parseFloat(quantidadeTemp) }]);
                          setMercadoriaIdTemp("");
                          setQuantidadeTemp("");
                        }} variant="secondary" className="rounded-xl font-bold h-10 w-10 shrink-0">
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90 mt-2 text-white font-bold h-12">
                    Salvar Produto
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Package size={20} />
              </div>
              <h2 className="text-xl font-bold">Catálogo de Produtos</h2>
            </div>
            <div className="rounded-xl border border-border/40 overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/20">
                  <TableRow>
                    <TableHead className="font-semibold text-muted-foreground">Nome</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Categoria</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Tipo</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Preço</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto) => (
                    <TableRow key={produto.id} className="hover:bg-secondary/10">
                      <TableCell className="font-semibold">{produto.nome}</TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={produto.isRevenda ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-purple-50 text-purple-600 border-purple-200"}>
                          {produto.isRevenda ? "Revenda (Direto)" : "Prato (Receita)"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-emerald-600">
                        R$ {produto.preco.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteProduto(produto.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {produtos.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Nenhum produto cadastrado.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ABA MERCADORIAS */}
        <TabsContent value="mercadorias">
          <div className="flex justify-end mb-6">
            <Dialog open={isOpenMerc} onOpenChange={setIsOpenMerc}>
              <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-md text-white font-semibold">
                  <Plus className="mr-2 h-4 w-4" /> Nova Mercadoria
                </Button>} />
              <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto rounded-[1.5rem] p-6 border-border/40">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase">Adicionar Insumo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitMercadoria} className="flex flex-col gap-6 py-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-muted-foreground">Nome (Insumo)</label>
                    <Input value={nomeMerc} onChange={(e) => setNomeMerc(e.target.value)} placeholder="Ex: Carne Moída" className="rounded-xl border-border/60" required />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="text-sm font-semibold text-muted-foreground">Unidade</label>
                      <Select onValueChange={(val) => setUnidadeMerc(val || "")} value={unidadeMerc}>
                        <SelectTrigger className="rounded-xl border-border/60">
                          <SelectValue placeholder="ex: Kg, L" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="un">Unidade (un)</SelectItem>
                          <SelectItem value="g">Gramas (g)</SelectItem>
                          <SelectItem value="kg">Quilos (kg)</SelectItem>
                          <SelectItem value="ml">Mililitros (ml)</SelectItem>
                          <SelectItem value="L">Litros (L)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="text-sm font-semibold text-muted-foreground">Custo (R$)</label>
                      <Input type="number" step="0.001" value={custoMerc} onChange={(e) => setCustoMerc(e.target.value)} placeholder="Ex: 0.05" className="rounded-xl border-border/60" required />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="text-sm font-semibold text-muted-foreground">Estoque Atual</label>
                      <Input type="number" step="0.1" value={estoqueAtualMerc} onChange={(e) => setEstoqueAtualMerc(e.target.value)} placeholder="Ex: 5000" className="rounded-xl border-border/60" required />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="text-sm font-semibold text-muted-foreground">Estoque Mínimo</label>
                      <Input type="number" step="0.1" value={estoqueMinMerc} onChange={(e) => setEstoqueMinMerc(e.target.value)} placeholder="Ex: 1000" className="rounded-xl border-border/60" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-secondary/20 p-4 rounded-xl">
                    <Switch id="merc-produto" checked={isTambemProduto} onCheckedChange={setIsTambemProduto} />
                    <label htmlFor="merc-produto" className="text-sm font-semibold cursor-pointer select-none">
                      Também vender no cardápio como Produto (ex: Lata Refri)
                    </label>
                  </div>

                  {isTambemProduto && (
                    <div className="flex gap-4 p-4 border border-border/40 rounded-xl bg-background/50">
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm font-semibold text-muted-foreground">Preço de Venda (R$)</label>
                        <Input type="number" step="0.01" value={precoVendaMerc} onChange={(e) => setPrecoVendaMerc(e.target.value)} placeholder="Ex: 6.00" className="rounded-xl border-border/60" required />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm font-semibold text-muted-foreground">Categoria</label>
                        <Select onValueChange={(val) => setCategoriaMerc(val || "")} value={categoriaMerc}>
                          <SelectTrigger className="rounded-xl border-border/60">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map(cat => (
                              <SelectItem key={cat.id} value={cat.nome}>{cat.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90 mt-2 text-white font-bold h-12">
                    Salvar Mercadoria
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Boxes size={20} />
              </div>
              <h2 className="text-xl font-bold">Estoque de Mercadorias (Insumos)</h2>
            </div>
            <div className="rounded-xl border border-border/40 overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/20">
                  <TableRow>
                    <TableHead className="font-semibold text-muted-foreground">Nome</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Und.</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Custo Und.</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Estoque Atual</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mercadorias.map((merc) => (
                    <TableRow key={merc.id} className="hover:bg-secondary/10">
                      <TableCell className="font-semibold">{merc.nome}</TableCell>
                      <TableCell>{merc.unidadeMedida}</TableCell>
                      <TableCell>R$ {merc.custo.toFixed(3)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={merc.estoqueAtual <= merc.estoqueMinimo ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}>
                          {merc.estoqueAtual} {merc.unidadeMedida}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMercadoria(merc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {mercadorias.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Nenhuma mercadoria cadastrada.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ABA COMPLEMENTOS */}
        <TabsContent value="complementos">
          <div className="flex justify-end mb-6">
            <Dialog open={isOpenComp} onOpenChange={setIsOpenComp}>
              <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-md text-white font-semibold">
                  <Plus className="mr-2 h-4 w-4" /> Novo Complemento
                </Button>} />
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[1.5rem] p-6 border-border/40">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase">Grupo de Complemento</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitComplemento} className="flex flex-col gap-6 py-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-muted-foreground">Nome do Grupo (Ex: Ponto da Carne)</label>
                    <Input value={nomeComp} onChange={(e) => setNomeComp(e.target.value)} placeholder="Ex: Adicionais" className="rounded-xl border-border/60" required />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2 bg-secondary/20 px-4 py-2 rounded-xl flex-1">
                      <Switch id="comp-obrig" checked={obrigComp} onCheckedChange={setObrigComp} />
                      <label htmlFor="comp-obrig" className="text-sm font-semibold cursor-pointer select-none">
                        Obrigatório?
                      </label>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="text-xs font-semibold text-muted-foreground">Máx. Opções</label>
                      <Input type="number" min="1" value={maxComp} onChange={(e) => setMaxComp(e.target.value)} className="rounded-xl border-border/60" required />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 p-4 border border-border/40 rounded-xl bg-background/50">
                    <h4 className="font-bold flex items-center gap-2"><Layers size={18} /> Opções</h4>
                    
                    {opcoesComp.map((op, i) => (
                      <div key={i} className="flex justify-between items-center bg-secondary/10 p-2 rounded-lg">
                        <span className="text-sm font-medium">{op.nome} - R$ {op.preco.toFixed(2)}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => {
                          const n = [...opcoesComp]; n.splice(i, 1); setOpcoesComp(n);
                        }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <div className="flex gap-2 items-end">
                      <div className="flex flex-col gap-2 flex-[2]">
                        <label className="text-xs font-semibold text-muted-foreground">Nome da Opção</label>
                        <Input value={tempNomeOpcao} onChange={(e) => setTempNomeOpcao(e.target.value)} placeholder="Ex: Bacon" className="rounded-xl border-border/60" />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-xs font-semibold text-muted-foreground">Preço (+R$)</label>
                        <Input type="number" step="0.01" value={tempPrecoOpcao} onChange={(e) => setTempPrecoOpcao(e.target.value)} placeholder="4.50" className="rounded-xl border-border/60" />
                      </div>
                      <Button type="button" onClick={(e) => {
                        e.preventDefault();
                        if (!tempNomeOpcao) return;
                        setOpcoesComp([...opcoesComp, { nome: tempNomeOpcao, preco: parseFloat(tempPrecoOpcao || "0") }]);
                        setTempNomeOpcao("");
                        setTempPrecoOpcao("");
                      }} variant="secondary" className="rounded-xl font-bold h-10 w-10 shrink-0">
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90 mt-2 text-white font-bold h-12">
                    Salvar Grupo
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Layers size={20} />
              </div>
              <h2 className="text-xl font-bold">Grupos de Complementos</h2>
            </div>
            <div className="rounded-xl border border-border/40 overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/20">
                  <TableRow>
                    <TableHead className="font-semibold text-muted-foreground">Nome do Grupo</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Tipo</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Qtd. Opções</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complementos.map((comp) => (
                    <TableRow key={comp.id} className="hover:bg-secondary/10">
                      <TableCell className="font-semibold">{comp.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={comp.obrigatorio ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-stone-50 text-stone-600 border-stone-200"}>
                          {comp.obrigatorio ? "Obrigatório" : "Opcional"} (Máx: {comp.maximo})
                        </Badge>
                      </TableCell>
                      <TableCell>{comp.opcoes.length} opções</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteComplemento(comp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {complementos.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Nenhum complemento cadastrado.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ABA COMBOS */}
        <TabsContent value="combos">
          <div className="flex justify-end mb-6">
            <Dialog open={isOpenCombo} onOpenChange={setIsOpenCombo}>
              <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-md text-white font-semibold">
                  <Plus className="mr-2 h-4 w-4" /> Novo Combo
                </Button>} />
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[1.5rem] p-6 border-border/40">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase">Adicionar Combo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitCombo} className="flex flex-col gap-6 py-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-muted-foreground">Nome do Combo</label>
                    <Input value={nomeCombo} onChange={(e) => setNomeCombo(e.target.value)} placeholder="Ex: Combo Família" className="rounded-xl border-border/60" required />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-muted-foreground">Preço Total (R$)</label>
                    <Input type="number" step="0.01" value={precoCombo} onChange={(e) => setPrecoCombo(e.target.value)} placeholder="Ex: 89.90" className="rounded-xl border-border/60" required />
                  </div>

                  <div className="flex flex-col gap-4 p-4 border border-border/40 rounded-xl bg-background/50">
                    <h4 className="font-bold flex items-center gap-2"><Combine size={18} /> Produtos Inclusos</h4>
                    
                    {itensCombo.map((it, i) => {
                      const p = produtos.find(x => x.id === it.produtoId)
                      return (
                        <div key={i} className="flex justify-between items-center bg-secondary/10 p-2 rounded-lg">
                          <span className="text-sm font-medium">{it.quantidade}x {p?.nome}</span>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => {
                            const n = [...itensCombo]; n.splice(i, 1); setItensCombo(n);
                          }}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}

                    <div className="flex gap-2 items-end">
                      <div className="flex flex-col gap-2 flex-[2]">
                        <label className="text-xs font-semibold text-muted-foreground">Produto</label>
                        <Select onValueChange={(val) => setTempProdCombo(val || "")} value={tempProdCombo}>
                          <SelectTrigger className="rounded-xl border-border/60">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {produtos.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-xs font-semibold text-muted-foreground">Qtd</label>
                        <Input type="number" min="1" value={tempQtdCombo} onChange={(e) => setTempQtdCombo(e.target.value)} placeholder="1" className="rounded-xl border-border/60" />
                      </div>
                      <Button type="button" onClick={(e) => {
                        e.preventDefault();
                        if (!tempProdCombo || !tempQtdCombo) return;
                        setItensCombo([...itensCombo, { produtoId: tempProdCombo, quantidade: parseInt(tempQtdCombo) }]);
                        setTempProdCombo("");
                        setTempQtdCombo("");
                      }} variant="secondary" className="rounded-xl font-bold h-10 w-10 shrink-0">
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90 mt-2 text-white font-bold h-12">
                    Salvar Combo
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Combine size={20} />
              </div>
              <h2 className="text-xl font-bold">Catálogo de Combos</h2>
            </div>
            <div className="rounded-xl border border-border/40 overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/20">
                  <TableRow>
                    <TableHead className="font-semibold text-muted-foreground">Nome do Combo</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Itens Inclusos</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Preço</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combos.map((combo) => (
                    <TableRow key={combo.id} className="hover:bg-secondary/10">
                      <TableCell className="font-semibold">{combo.nome}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {combo.itens.map((it, idx) => {
                            const p = produtos.find(x => x.id === it.produtoId)
                            return <span key={idx} className="text-xs text-muted-foreground">{it.quantidade}x {p?.nome}</span>
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-emerald-600">
                        R$ {combo.preco.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteCombo(combo.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {combos.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Nenhum combo cadastrado.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
