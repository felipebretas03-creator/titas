"use client"

import { useStore, Produto, PedidoItem, generateId } from "@/store"
import { useParams, useRouter } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { toast } from "sonner"
import { Search, ShoppingCart, Bell, FileText, ChevronLeft, Plus, Minus, ArrowRight, UtensilsCrossed } from "lucide-react"

export default function CardapioTablet() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const store = useStore()
  
  const table = store.mesas.find(m => m.token_hash === token)
  const session = store.sessoesMesa.find(s => s.table_id === table?.id && s.status !== 'CLOSED')
  
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const [cart, setCart] = useState<PedidoItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [obs, setObs] = useState("")
  
  useEffect(() => {
    if (!table || !session) {
      router.push(`/mesa/${token}`)
    }
  }, [table, session, router, token])

  if (!table || !session) {
    return null
  }

  const filteredProducts = store.produtos.filter(p => {
    if (p.status !== 'Ativo') return false;
    if (selectedCategory && p.categoria !== selectedCategory) return false;
    if (search && !p.nome.toLowerCase().includes(search.toLowerCase()) && !p.descricao?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  })

  const cartTotal = cart.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0)

  const handleAddToCart = () => {
    if (!selectedProduct) return
    
    setCart(prev => [
      ...prev,
      {
        id: generateId(),
        produtoId: selectedProduct.id,
        nome: selectedProduct.nome,
        quantidade: quantity,
        precoUnitario: selectedProduct.preco,
        observacao: obs
      }
    ])
    
    setSelectedProduct(null)
    setQuantity(1)
    setObs("")
    toast.success(`${selectedProduct.nome} adicionado ao carrinho!`)
  }

  const handleSendOrder = () => {
    if (cart.length === 0) return
    
    store.addPedido({
      channel: 'TABLE',
      tableId: table.id,
      sessionId: session.id,
      status: 'CONFIRMED',
      items: cart,
      total: cartTotal
    })
    
    store.updateSessaoMesa(session.id, { totalAmount: session.totalAmount + cartTotal })
    if (table.status !== 'NEW_ORDER' && table.status !== 'BILL_REQUESTED') {
      store.updateMesa(table.id, { status: 'NEW_ORDER' })
    }
    
    setCart([])
    setIsCartOpen(false)
    toast.success(store.configuracoesTablet.orderSuccessMessage)
  }

  const callWaiter = () => {
    store.addSolicitacaoAtendimento({
      tableId: table.id,
      sessionId: session.id,
      type: 'WAITER'
    })
    store.updateMesa(table.id, { status: 'SERVICE_REQUESTED' })
    toast.success("Atendimento solicitado! Um atendente irá até sua mesa.")
  }

  return (
    <div className="flex flex-col h-full bg-stone-100">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/mesa/${token}`)}>
            <ChevronLeft size={28} />
          </Button>
          <div>
            <h2 className="text-2xl font-black text-primary">Tita&apos;s</h2>
            <span className="text-muted-foreground font-semibold">{table.name}</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
            <Input 
              placeholder="O que você deseja pedir?"
              className="pl-12 h-14 text-lg rounded-full border-2 bg-stone-50"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {store.configuracoesTablet.allowCallWaiter && (
            <Button onClick={callWaiter} variant="outline" className="h-14 px-6 rounded-full font-bold text-amber-600 border-amber-200 hover:bg-amber-50 gap-2 text-lg">
              <Bell size={24} />
              Chamar Garçom
            </Button>
          )}
          <Button 
            onClick={() => router.push(`/mesa/${token}/minha-mesa`)}
            variant="outline" 
            className="h-14 px-6 rounded-full font-bold text-blue-600 border-blue-200 hover:bg-blue-50 gap-2 text-lg"
          >
            <FileText size={24} />
            Minha Mesa
          </Button>
          <Button 
            onClick={() => setIsCartOpen(true)}
            className="bg-[#5c1a1b] h-14 px-6 rounded-full font-bold text-white hover:bg-[#4a1515] gap-3 text-lg shadow-lg relative"
          >
            <ShoppingCart size={24} />
            Carrinho
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-white">
                {cart.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Categories */}
        <div className="w-64 bg-white border-r overflow-y-auto p-4 shrink-0">
          <h3 className="font-bold text-muted-foreground mb-4 uppercase tracking-wider px-4">Categorias</h3>
          <div className="flex flex-col gap-2">
            <Button 
              variant={selectedCategory === null ? 'default' : 'ghost'}
              className="justify-start h-14 text-lg rounded-xl"
              onClick={() => setSelectedCategory(null)}
              style={selectedCategory === null ? { backgroundColor: 'var(--primary-tablet)' } : {}}
            >
              Todos os Produtos
            </Button>
            {store.categorias.map(cat => (
              <Button 
                key={cat.id}
                variant={selectedCategory === cat.nome ? 'default' : 'ghost'}
                className="justify-start h-14 text-lg rounded-xl"
                onClick={() => setSelectedCategory(cat.nome)}
                style={selectedCategory === cat.nome ? { backgroundColor: 'var(--primary-tablet)' } : {}}
              >
                {cat.nome}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all border-2 border-transparent hover:border-primary/20 rounded-2xl overflow-hidden shadow-sm flex flex-col"
                onClick={() => {
                  setSelectedProduct(product)
                  setQuantity(1)
                  setObs("")
                }}
              >
                <div className="aspect-video bg-stone-100 flex items-center justify-center text-stone-300 relative">
                  {product.imagemUrl ? (
                     <img src={product.imagemUrl} alt={product.nome} className="object-cover w-full h-full" />
                  ) : (
                     <UtensilsCrossed size={48} />
                  )}
                  {product.categoria === 'Lanches' && (
                    <span className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Mais Pedido
                    </span>
                  )}
                </div>
                <CardContent className="p-5 flex flex-col flex-1">
                  <h4 className="font-bold text-xl mb-1 line-clamp-1">{product.nome}</h4>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">{product.descricao || "Sem descrição."}</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t">
                    <span className="font-black text-2xl text-primary">R$ {product.preco.toFixed(2).replace('.', ',')}</span>
                    <div className="bg-stone-100 w-10 h-10 rounded-full flex items-center justify-center text-primary">
                      <Plus size={20} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <UtensilsCrossed size={64} className="mb-4 opacity-20" />
                <h3 className="text-2xl font-bold">Nenhum produto encontrado</h3>
                <p>Tente buscar por outro termo.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-[2rem]">
          {selectedProduct && (
            <div className="flex flex-col">
              <div className="aspect-video bg-stone-100 flex items-center justify-center text-stone-300 w-full relative">
                 {selectedProduct.imagemUrl ? (
                    <img src={selectedProduct.imagemUrl} alt={selectedProduct.nome} className="object-cover w-full h-full" />
                 ) : (
                    <UtensilsCrossed size={80} />
                 )}
              </div>
              <div className="p-8 flex flex-col gap-6">
                <div>
                  <h2 className="text-3xl font-black">{selectedProduct.nome}</h2>
                  <p className="text-lg text-muted-foreground mt-2">{selectedProduct.descricao}</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-bold text-lg">Alguma observação?</h4>
                  <Input 
                    placeholder="Ex: Tirar cebola, ponto da carne mal passado..."
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                    className="h-14 text-lg rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <div className="flex items-center gap-4 bg-stone-100 p-2 rounded-2xl">
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus size={24} />
                    </Button>
                    <span className="text-2xl font-black w-8 text-center">{quantity}</span>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl" onClick={() => setQuantity(quantity + 1)}>
                      <Plus size={24} />
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart}
                    className="bg-[#5c1a1b] h-16 px-8 rounded-2xl text-xl font-bold text-white hover:bg-[#4a1515] shadow-lg"
                  >
                    Adicionar - R$ {(selectedProduct.preco * quantity).toFixed(2).replace('.', ',')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-[450px] sm:w-[540px] flex flex-col p-0 border-l">
          <SheetHeader className="p-6 border-b bg-stone-50">
            <SheetTitle className="text-2xl font-black flex items-center gap-3">
              <ShoppingCart size={28} />
              Seu Pedido
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <ShoppingCart size={80} className="mb-4" />
                <p className="text-xl font-medium">Seu carrinho está vazio.</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-2 p-4 bg-stone-50 border rounded-2xl">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <span className="font-black text-lg bg-stone-200 px-2 rounded-lg text-stone-700 h-8 flex items-center">{item.quantidade}x</span>
                      <div>
                        <h4 className="font-bold text-lg">{item.nome}</h4>
                        {item.observacao && <p className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded mt-1">Obs: {item.observacao}</p>}
                      </div>
                    </div>
                    <span className="font-black text-lg">R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-8 px-3"
                      onClick={() => setCart(prev => prev.filter((_, i) => i !== index))}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <SheetFooter className="p-6 border-t bg-stone-50 flex-col gap-4">
            <div className="flex justify-between items-center text-xl">
              <span className="font-bold text-muted-foreground">Total do Pedido:</span>
              <span className="font-black text-3xl text-primary">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <Button 
              onClick={handleSendOrder}
              disabled={cart.length === 0}
              className={`${cart.length > 0 ? 'bg-[#5c1a1b] hover:bg-[#4a1515]' : 'bg-stone-300'} w-full h-16 rounded-2xl text-xl font-black text-white uppercase tracking-wider shadow-lg transition-colors`}
            >
              Confirmar e Enviar <ArrowRight className="ml-2" />
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
