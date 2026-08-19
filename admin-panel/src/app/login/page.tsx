"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChefHat, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulação de login de 1 segundo
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen w-full flex bg-[#f0e9e8] font-sans">
      
      {/* Lado Esquerdo - Branding (Visível apenas em Desktop) */}
      <div className="hidden lg:flex flex-1 relative bg-primary overflow-hidden items-center justify-center">
        {/* Imagem de Fundo com overlay da cor primária */}
        <Image src="/login-bg.png" alt="Background" fill priority className="object-cover object-[center_75%]" />
        <div className="absolute inset-0 bg-primary/70 mix-blend-multiply"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-10 text-white">
          <div className="relative w-48 h-48 mb-8 hover:scale-105 transition-transform duration-500">
            <Image src="/logo.png" alt="Tita's Logo" fill className="object-contain brightness-0 invert" />
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">Tita&apos;s Core</h1>
          <p className="text-lg text-white/90 max-w-md font-medium shadow-sm">
            O coração inteligente da sua operação. Controle o salão, delivery e financeiro em um só lugar.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 relative overflow-hidden">
        
        {/* Círculos decorativos no mobile */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="lg:hidden absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md relative z-10">
          
          {/* Logo Mobile */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="relative w-36 h-36 mb-6">
              <Image src="/logo.png" alt="Tita's Logo" fill className="object-contain brightness-0" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Tita&apos;s Core</h1>
          </div>

          {/* Cartão de Login */}
          <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-xl border border-white">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Bem-vindo de volta! 👋</h2>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Insira suas credenciais para acessar o painel.</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              
              {/* Campo Email */}
              <div className="group">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@titas.com.br"
                    className="w-full h-14 pl-12 pr-4 bg-[#fcfbfb] border border-border/60 rounded-2xl text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Senha
                  </label>
                  <a href="#" className="text-xs font-bold text-primary hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-4 bg-[#fcfbfb] border border-border/60 rounded-2xl text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
              Ambiente restrito a funcionários autorizados.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
