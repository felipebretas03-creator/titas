"use client"

import { useState } from "react"
import { useStore } from "@/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit2, Users } from "lucide-react"

export default function UsuariosPage() {
  const { usuarios, addUsuario, deleteUsuario } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [perfil, setPerfil] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !email || !perfil) return
    
    addUsuario({
      nome,
      email,
      perfil: perfil as "Admin" | "Gerente" | "Caixa" | "Montagem",
      status: "Ativo"
    })
    
    setNome("")
    setEmail("")
    setPerfil("")
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
          Usuários
        </h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-md text-white font-semibold" />}>
            <Plus className="mr-2 h-4 w-4" /> Novo Usuário
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6 border-border/40">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase">Adicionar Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Nome Completo</label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João Silva" className="rounded-xl border-border/60" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">E-mail</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ex: joao@titas.com" className="rounded-xl border-border/60" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Perfil de Acesso</label>
                <Select onValueChange={(val) => setPerfil(val as string)} value={perfil}>
                  <SelectTrigger className="rounded-xl border-border/60">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Administrador</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                    <SelectItem value="Caixa">Caixa</SelectItem>
                    <SelectItem value="Montagem">Montagem (Cozinha)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90 mt-2 text-white font-bold h-12">
                Salvar Usuário
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/40 min-h-[500px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-bold">Equipe Cadastrada</h2>
        </div>

        <div className="rounded-xl border border-border/40 overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-semibold text-muted-foreground">Nome</TableHead>
                <TableHead className="font-semibold text-muted-foreground">E-mail</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Perfil</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Nenhum usuário cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((usuario) => (
                  <TableRow key={usuario.id} className="hover:bg-secondary/10">
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                           {usuario.nome.substring(0,2).toUpperCase()}
                         </div>
                         {usuario.nome}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{usuario.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border-border/60 ${usuario.perfil === 'Admin' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary text-foreground'}`}>
                        {usuario.perfil}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                        {usuario.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteUsuario(usuario.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
