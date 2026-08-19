"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShoppingBag, Plus, Minus, ChevronRight, CheckCircle2, Clock, ChefHat, Check, Menu, FileText, X, AlertCircle } from "lucide-react"
import Image from "next/image"

type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

type CartItem = {
  id: string
  product: Product
  quantity: number
  notes: string
  options: { name: string, price: number }[]
}

const PRODUCTS: Product[] = [
  { id: "1", name: "Tita's Classic Burger", description: "Blend 180g, queijo cheddar derretido, alface fresca, tomate e maionese da casa no pão brioche artesanal.", price: 35.90, image: "/burger.png", category: "Lanches" },
  { id: "2", name: "Fritas Rústicas", description: "Porção de batatas fritas rústicas crocantes por fora e macias por dentro, com alecrim e sal grosso.", price: 22.50, image: "/fries.png", category: "Porções" },
  { id: "3", name: "Craft Beer Premium", description: "Cerveja artesanal âmbar, gelada, com espuma rica e sabor encorpado. 600ml.", price: 16.50, image: "/beer.png", category: "Bebidas" },
]

const CATEGORIES = ["Todos", "Lanches", "Porções", "Bebidas", "Sobremesas"]

export default function CardapioPage() {
  const [activeTab, setActiveTab] = useState<"cardapio" | "conta">("cardapio")
  const [activeCategory, setActiveCategory] = useState("Todos")
  
  // Estado do Carrinho e Conta da Mesa
  const [cart, setCart] = useState<CartItem[]>([]) // Itens sendo pedidos agora
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]) // Itens já enviados para a cozinha
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Estado do modal de produto
  const [productQuantity, setProductQuantity] = useState(1)
  const [productNotes, setProductNotes] = useState("")
  const [meatDoneness, setMeatDoneness] = useState("Ao Ponto")
  const [selectedExtras, setSelectedExtras] = useState<{name: string, price: number}[]>([])

  const [accountClosed, setAccountClosed] = useState(false)

  const filteredProducts = activeCategory === "Todos" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory)

  const cartTotal = cart.reduce((acc, item) => acc + ((item.product.price + item.options.reduce((s, o) => s + o.price, 0)) * item.quantity), 0)
  const orderedTotal = orderedItems.reduce((acc, item) => acc + ((item.product.price + item.options.reduce((s, o) => s + o.price, 0)) * item.quantity), 0)
  const grandTotal = cartTotal + orderedTotal

  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setProductQuantity(1)
    setProductNotes("")
    setMeatDoneness("Ao Ponto")
    setSelectedExtras([])
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      product: selectedProduct,
      quantity: productQuantity,
      notes: productNotes,
      options: selectedProduct.category === "Lanches" ? [{ name: meatDoneness, price: 0 }, ...selectedExtras] : selectedExtras
    }
    setCart(prev => [...prev, newItem])
    setSelectedProduct(null)
  }

  const handleSendOrder = () => {
    setOrderedItems(prev => [...prev, ...cart])
    setCart([])
    setActiveTab("conta")
    
    // Simular evento local storage para o painel (opcional, só pra garantir que o painel saiba que houve movimento se quisermos)
    localStorage.setItem('table_alert', JSON.stringify({ action: 'NEW_ORDER', table: 8, timestamp: Date.now() }))
  }

  const handleCloseAccount = () => {
    setAccountClosed(true)
    // Dispara evento para o painel admin (mesas/page.tsx)
    localStorage.setItem('table_alert', JSON.stringify({ action: 'FECHAR_CONTA', table: 8, timestamp: Date.now() }))
  }

  // Escutar quando o garçom liberar a mesa no painel
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'table_alert' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue)
          if (data.action === 'LIBERAR_MESA' && data.table === 8) {
            // Resetar TODO o tablet para o próximo cliente
            setCart([])
            setOrderedItems([])
            setAccountClosed(false)
            setActiveTab("cardapio")
            setActiveCategory("Todos")
          }
        } catch(err) {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  if (accountClosed) {
    return (
      <div className="flex flex-col h-screen bg-[#5c1a1b] relative items-center justify-center p-6 text-center text-white">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
          <Clock size={48} className="text-amber-300 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black mb-4">Conta Solicitada!</h1>
        <p className="text-lg text-white/80 max-w-sm mb-8">
          Por favor, aguarde um instante. Um de nossos garçons já foi avisado e está a caminho com a sua conta e a maquininha.
        </p>
        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 w-full max-w-sm flex justify-between items-center">
          <span className="font-medium text-white/80">Total consumido:</span>
          <span className="font-black text-2xl">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#FDFBF7] relative pb-20">
      {/* Header Fixo - Contexto da Mesa */}
      <header className="px-6 py-4 flex justify-between items-center bg-white border-b border-stone-100 sticky top-0 z-40 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Você está na</span>
          <h1 className="text-2xl font-black text-[#5c1a1b] leading-none mt-1">Mesa 08</h1>
        </div>
        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-2 text-sm font-bold border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Aberta
        </div>
      </header>

      {/* View Cardápio */}
      {activeTab === "cardapio" && (
        <main className="flex-1 overflow-y-auto pb-6">
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-3xl font-black text-stone-800">O que vamos<br/>pedir hoje?</h2>
          </div>

          {/* Categorias Slider */}
          <div className="px-6 pb-4 overflow-x-auto hide-scrollbar">
            <div className="flex gap-3 min-w-max">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeCategory === cat 
                      ? "bg-[#5c1a1b] text-white shadow-md scale-105" 
                      : "bg-white text-stone-500 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Produtos */}
          <div className="px-6 flex flex-col gap-5">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => openProductModal(product)}
                className="bg-white rounded-3xl p-4 shadow-sm border border-stone-100 flex gap-4 items-center group cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1 py-1 h-full justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-stone-800 leading-tight mb-1">{product.name}</h4>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-lg text-[#5c1a1b]">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    <button className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center group-hover:bg-[#5c1a1b] group-hover:text-white transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* View Minha Conta */}
      {activeTab === "conta" && (
        <main className="flex-1 overflow-y-auto pb-6 bg-stone-50">
          <div className="p-6 bg-white border-b border-stone-100 shadow-sm flex flex-col items-center justify-center gap-2">
            <span className="text-stone-500 font-medium">Total da sua mesa</span>
            <span className="text-4xl font-black text-[#5c1a1b]">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="p-6 flex flex-col gap-8">
            
            {/* Itens no Carrinho (Não enviados) */}
            {cart.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-amber-600 flex items-center gap-2"><Clock size={18}/> Na Bandeja (Não Enviado)</h3>
                  <span className="text-sm font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-sm">
                  {cart.map((item, idx) => (
                    <div key={item.id} className={`p-4 flex gap-4 ${idx !== cart.length - 1 ? 'border-b border-stone-100' : ''}`}>
                      <div className="font-black text-lg text-stone-400 w-6">{item.quantity}x</div>
                      <div className="flex flex-col flex-1">
                        <span className="font-bold text-stone-800">{item.product.name}</span>
                        {item.options.map(opt => <span key={opt.name} className="text-xs text-stone-500">+ {opt.name}</span>)}
                        {item.notes && <span className="text-xs text-amber-600 italic mt-1">Obs: {item.notes}</span>}
                      </div>
                      <div className="font-black text-stone-800">
                        R$ {((item.product.price + item.options.reduce((s,o)=>s+o.price,0)) * item.quantity).toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-amber-50">
                    <button onClick={handleSendOrder} className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg shadow-md transition-colors">
                      Enviar para a Cozinha
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Itens já pedidos */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-stone-800 flex items-center gap-2"><CheckCircle2 size={18}/> Itens Pedidos</h3>
                <span className="text-sm font-bold text-stone-600">R$ {orderedTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              
              {orderedItems.length === 0 ? (
                <div className="bg-white rounded-3xl border border-stone-100 p-8 flex flex-col items-center justify-center text-center gap-3">
                  <ShoppingBag size={48} className="text-stone-300" />
                  <p className="text-stone-500 font-medium">Você ainda não enviou nenhum pedido para a cozinha.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
                  {orderedItems.map((item, idx) => (
                    <div key={item.id} className={`p-4 flex gap-4 ${idx !== orderedItems.length - 1 ? 'border-b border-stone-100' : ''}`}>
                      <div className="font-black text-lg text-stone-400 w-6">{item.quantity}x</div>
                      <div className="flex flex-col flex-1">
                        <span className="font-bold text-stone-800">{item.product.name}</span>
                        {item.options.map(opt => <span key={opt.name} className="text-xs text-stone-500">+ {opt.name}</span>)}
                      </div>
                      <div className="font-black text-stone-800">
                        R$ {((item.product.price + item.options.reduce((s,o)=>s+o.price,0)) * item.quantity).toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Fechar Conta Button */}
            {grandTotal > 0 && cart.length === 0 && (
               <button onClick={handleCloseAccount} className="mt-4 w-full py-5 rounded-2xl border-2 border-rose-500 text-rose-600 font-black text-xl hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
                 <FileText size={24} /> Pedir a Conta
               </button>
            )}
            
          </div>
        </main>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-stone-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 flex px-6">
        <button 
          onClick={() => setActiveTab("cardapio")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === "cardapio" ? "text-[#5c1a1b]" : "text-stone-400 hover:text-stone-600"}`}
        >
          <Menu size={24} strokeWidth={activeTab === "cardapio" ? 3 : 2} />
          <span className="text-xs font-bold">Cardápio</span>
        </button>
        <button 
          onClick={() => setActiveTab("conta")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 relative transition-colors ${activeTab === "conta" ? "text-[#5c1a1b]" : "text-stone-400 hover:text-stone-600"}`}
        >
          <div className="relative">
            <FileText size={24} strokeWidth={activeTab === "conta" ? 3 : 2} />
            {cart.length > 0 && (
              <div className="absolute -top-1 -right-2 w-4 h-4 bg-amber-500 rounded-full border-2 border-white" />
            )}
          </div>
          <span className="text-xs font-bold">Minha Conta</span>
        </button>
      </nav>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden"
          >
            <div className="relative w-full h-72 shrink-0 bg-stone-100">
              <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pb-32">
              <div className="p-6 bg-white border-b border-stone-100">
                <h2 className="text-2xl font-black text-stone-800 mb-2">{selectedProduct.name}</h2>
                <p className="text-stone-500 leading-relaxed mb-4">{selectedProduct.description}</p>
                <span className="text-3xl font-black text-[#5c1a1b]">R$ {selectedProduct.price.toFixed(2).replace('.', ',')}</span>
              </div>

              {selectedProduct.category === "Lanches" && (
                <>
                  <div className="p-6 border-b border-stone-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-stone-800">Ponto da Carne</h3>
                      <span className="text-xs font-bold bg-stone-200 text-stone-600 px-2 py-1 rounded">OBRIGATÓRIO</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {["Mal Passado", "Ao Ponto", "Bem Passado"].map(ponto => (
                        <label key={ponto} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50">
                          <span className="font-medium text-stone-700">{ponto}</span>
                          <input type="radio" name="ponto" checked={meatDoneness === ponto} onChange={() => setMeatDoneness(ponto)} className="w-5 h-5 accent-[#5c1a1b]" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 border-b border-stone-100">
                    <h3 className="font-bold text-lg text-stone-800 mb-1">Turbinar Lanche</h3>
                    <p className="text-sm text-stone-500 mb-4">Escolha os adicionais que quiser.</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { name: "Bacon Crocante", price: 4.50 },
                        { name: "Extra Cheddar", price: 3.00 },
                        { name: "Ovo Frito", price: 2.00 }
                      ].map(extra => {
                        const isSelected = selectedExtras.some(e => e.name === extra.name)
                        return (
                          <label key={extra.name} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50">
                            <div className="flex flex-col">
                              <span className="font-medium text-stone-700">{extra.name}</span>
                              <span className="text-sm font-bold text-amber-600">+ R$ {extra.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedExtras(prev => [...prev, extra])
                                else setSelectedExtras(prev => prev.filter(p => p.name !== extra.name))
                              }}
                              className="w-5 h-5 accent-[#5c1a1b] rounded" 
                            />
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              <div className="p-6">
                <h3 className="font-bold text-lg text-stone-800 mb-2">Alguma observação?</h3>
                <textarea 
                  value={productNotes}
                  onChange={e => setProductNotes(e.target.value)}
                  placeholder="Ex: Tirar cebola, maionese à parte..."
                  className="w-full border border-stone-200 rounded-xl p-4 text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-[#5c1a1b] focus:ring-1 focus:ring-[#5c1a1b] resize-none h-24"
                />
              </div>
            </div>

            {/* Bottom Add Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex gap-4">
              <div className="flex items-center justify-between bg-stone-100 rounded-2xl px-2 w-1/3">
                <button onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))} className="w-12 h-12 flex items-center justify-center text-stone-600 font-bold active:scale-95"><Minus size={20}/></button>
                <span className="font-black text-xl text-stone-800">{productQuantity}</span>
                <button onClick={() => setProductQuantity(productQuantity + 1)} className="w-12 h-12 flex items-center justify-center text-stone-600 font-bold active:scale-95"><Plus size={20}/></button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#5c1a1b] hover:bg-[#4a1515] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-xl active:scale-95 transition-all"
              >
                Adicionar <span className="font-black">R$ {((selectedProduct.price + selectedExtras.reduce((s,o)=>s+o.price,0)) * productQuantity).toFixed(2).replace('.', ',')}</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
