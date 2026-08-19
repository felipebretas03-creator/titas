import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Produto = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  status: 'Ativo' | 'Inativo';
  descricao?: string;
  imagemUrl?: string;
}

export type Categoria = {
  id: string;
  nome: string;
}

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: 'Admin' | 'Gerente' | 'Caixa' | 'Montagem';
  status: 'Ativo' | 'Inativo';
}

export type Transacao = {
  id: string;
  tipo: 'Entrada' | 'Saida';
  valor: number;
  descricao: string;
  data: string;
}

export type Configuracoes = {
  modoMesaDupla: boolean;
  ifoodAtivo: boolean;
  impressaoAutomatica: boolean;
}

// Novos tipos do Tablet
export type MesaStatus = 'AVAILABLE' | 'OCCUPIED' | 'NEW_ORDER' | 'PREPARING' | 'READY' | 'SERVICE_REQUESTED' | 'BILL_REQUESTED' | 'CLOSING' | 'CLOSED' | 'INACTIVE';

export type Mesa = {
  id: string;
  name: string;
  capacity: number;
  token_hash: string;
  status: MesaStatus;
  active: boolean;
  createdAt: string;
}

export type SessaoMesaStatus = 'OPEN' | 'BILL_REQUESTED' | 'CLOSED';

export type SessaoMesa = {
  id: string;
  table_id: string;
  status: SessaoMesaStatus;
  openedAt: string;
  billRequestedAt?: string;
  closedAt?: string;
  totalAmount: number;
}

export type PedidoStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export type PedidoItem = {
  id: string;
  produtoId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  observacao?: string;
}

export type Pedido = {
  id: string;
  channel: 'DELIVERY' | 'PICKUP' | 'TABLE';
  tableId?: string;
  sessionId?: string;
  items: PedidoItem[];
  total: number;
  status: PedidoStatus;
  createdAt: string;
}

export type SolicitacaoAtendimento = {
  id: string;
  tableId: string;
  sessionId: string;
  type: 'WAITER' | 'NAPKINS' | 'CUTLERY' | 'ORDER_QUESTION' | 'ORDER_PROBLEM' | 'CLOSE_BILL' | 'OTHER';
  message?: string;
  status: 'PENDING' | 'VIEWED' | 'RESOLVED' | 'CANCELLED';
  createdAt: string;
}

export type ConfiguracoesTablet = {
  active: boolean;
  themeColor: string;
  buttonColor: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeButtonText: string;
  allowCallWaiter: boolean;
  allowRequestBill: boolean;
  orderSuccessMessage: string;
  billSuccessMessage: string;
}

interface AppState {
  produtos: Produto[];
  categorias: Categoria[];
  usuarios: Usuario[];
  transacoes: Transacao[];
  configuracoes: Configuracoes;
  
  // Tablet states
  mesas: Mesa[];
  sessoesMesa: SessaoMesa[];
  pedidos: Pedido[];
  solicitacoesAtendimento: SolicitacaoAtendimento[];
  configuracoesTablet: ConfiguracoesTablet;
  
  // Actions Produtos
  addProduto: (produto: Omit<Produto, 'id'>) => void;
  updateProduto: (id: string, data: Partial<Produto>) => void;
  deleteProduto: (id: string) => void;
  
  // Actions Categorias
  addCategoria: (categoria: Omit<Categoria, 'id'>) => void;
  deleteCategoria: (id: string) => void;

  // Actions Usuarios
  addUsuario: (usuario: Omit<Usuario, 'id'>) => void;
  updateUsuario: (id: string, data: Partial<Usuario>) => void;
  deleteUsuario: (id: string) => void;

  // Actions Financeiro e Config
  addTransacao: (transacao: Omit<Transacao, 'id' | 'data'>) => void;
  updateConfiguracoes: (data: Partial<Configuracoes>) => void;
  
  // Actions Tablet
  updateConfiguracoesTablet: (data: Partial<ConfiguracoesTablet>) => void;
  
  addMesa: (mesa: Omit<Mesa, 'id' | 'createdAt'>) => void;
  updateMesa: (id: string, data: Partial<Mesa>) => void;
  deleteMesa: (id: string) => void;

  addSessaoMesa: (sessao: Omit<SessaoMesa, 'id'>) => void;
  updateSessaoMesa: (id: string, data: Partial<SessaoMesa>) => void;

  addPedido: (pedido: Omit<Pedido, 'id' | 'createdAt'>) => void;
  updatePedido: (id: string, data: Partial<Pedido>) => void;

  addSolicitacaoAtendimento: (solicitacao: Omit<SolicitacaoAtendimento, 'id' | 'createdAt' | 'status'>) => void;
  updateSolicitacaoAtendimento: (id: string, data: Partial<SolicitacaoAtendimento>) => void;
}

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      produtos: [
        { id: '1', nome: 'X-Burger Clássico', categoria: 'Lanches', preco: 25.90, status: 'Ativo', descricao: 'Pão brioche, blend 160g, queijo prato e maionese da casa.' },
        { id: '2', nome: 'Batata Frita G', categoria: 'Porções', preco: 18.50, status: 'Ativo', descricao: 'Porção grande de batata palito bem sequinha.' },
        { id: '3', nome: 'Coca-Cola Lata', categoria: 'Bebidas', preco: 6.00, status: 'Ativo' },
      ],
      categorias: [
        { id: '1', nome: 'Lanches' },
        { id: '2', nome: 'Bebidas' },
        { id: '3', nome: 'Porções' },
      ],
      usuarios: [
        { id: '1', nome: 'Marcos Felipe', email: 'admin@titas.com', perfil: 'Admin', status: 'Ativo' },
        { id: '2', nome: 'João Caixa', email: 'joao@titas.com', perfil: 'Caixa', status: 'Ativo' },
      ],
      transacoes: [
        { id: '1', tipo: 'Entrada', valor: 1250.00, descricao: 'Vendas do Turno (Manhã)', data: new Date().toISOString() },
        { id: '2', tipo: 'Saida', valor: 350.00, descricao: 'Pagamento Fornecedor (Bebidas)', data: new Date().toISOString() },
      ],
      configuracoes: {
        modoMesaDupla: false,
        ifoodAtivo: true,
        impressaoAutomatica: true,
      },
      
      // Default Tablet States
      mesas: [
        { id: '1', name: 'Mesa 01', capacity: 4, token_hash: 'abc123xyz', status: 'AVAILABLE', active: true, createdAt: new Date().toISOString() },
        { id: '2', name: 'Mesa 02', capacity: 2, token_hash: 'def456xyz', status: 'OCCUPIED', active: true, createdAt: new Date().toISOString() },
        { id: '3', name: 'Balcão 01', capacity: 1, token_hash: 'ghi789xyz', status: 'AVAILABLE', active: true, createdAt: new Date().toISOString() },
      ],
      sessoesMesa: [
        { id: 's1', table_id: '2', status: 'OPEN', openedAt: new Date().toISOString(), totalAmount: 45.00 }
      ],
      pedidos: [],
      solicitacoesAtendimento: [],
      configuracoesTablet: {
        active: true,
        themeColor: '#0f172a',
        buttonColor: '#3b82f6',
        welcomeTitle: 'BEM-VINDO!',
        welcomeSubtitle: 'Seu próximo pedido inesquecível começa aqui.',
        welcomeButtonText: 'FAZER SEU PEDIDO!',
        allowCallWaiter: true,
        allowRequestBill: true,
        orderSuccessMessage: 'Pedido enviado com sucesso!',
        billSuccessMessage: 'Conta solicitada!'
      },

      addProduto: (data) => set((state) => ({ produtos: [...state.produtos, { ...data, id: generateId() }] })),
      updateProduto: (id, data) => set((state) => ({
        produtos: state.produtos.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deleteProduto: (id) => set((state) => ({ produtos: state.produtos.filter(p => p.id !== id) })),

      addCategoria: (data) => set((state) => ({ categorias: [...state.categorias, { ...data, id: generateId() }] })),
      deleteCategoria: (id) => set((state) => ({ categorias: state.categorias.filter(c => c.id !== id) })),

      addUsuario: (data) => set((state) => ({ usuarios: [...state.usuarios, { ...data, id: generateId() }] })),
      updateUsuario: (id, data) => set((state) => ({
        usuarios: state.usuarios.map(u => u.id === id ? { ...u, ...data } : u)
      })),
      deleteUsuario: (id) => set((state) => ({ usuarios: state.usuarios.filter(u => u.id !== id) })),

      addTransacao: (data) => set((state) => ({ 
        transacoes: [{ ...data, id: generateId(), data: new Date().toISOString() }, ...state.transacoes] 
      })),
      updateConfiguracoes: (data) => set((state) => ({
        configuracoes: { ...state.configuracoes, ...data }
      })),
      
      // Tablet Actions
      updateConfiguracoesTablet: (data) => set((state) => ({
        configuracoesTablet: { ...state.configuracoesTablet, ...data }
      })),
      
      addMesa: (data) => set((state) => ({ 
        mesas: [...state.mesas, { ...data, id: generateId(), createdAt: new Date().toISOString() }] 
      })),
      updateMesa: (id, data) => set((state) => ({
        mesas: state.mesas.map(m => m.id === id ? { ...m, ...data } : m)
      })),
      deleteMesa: (id) => set((state) => ({ mesas: state.mesas.filter(m => m.id !== id) })),

      addSessaoMesa: (data) => set((state) => ({ 
        sessoesMesa: [...state.sessoesMesa, { ...data, id: generateId() }] 
      })),
      updateSessaoMesa: (id, data) => set((state) => ({
        sessoesMesa: state.sessoesMesa.map(s => s.id === id ? { ...s, ...data } : s)
      })),

      addPedido: (data) => set((state) => ({ 
        pedidos: [...state.pedidos, { ...data, id: generateId(), createdAt: new Date().toISOString() }] 
      })),
      updatePedido: (id, data) => set((state) => ({
        pedidos: state.pedidos.map(p => p.id === id ? { ...p, ...data } : p)
      })),

      addSolicitacaoAtendimento: (data) => set((state) => ({ 
        solicitacoesAtendimento: [...state.solicitacoesAtendimento, { ...data, id: generateId(), status: 'PENDING', createdAt: new Date().toISOString() }] 
      })),
      updateSolicitacaoAtendimento: (id, data) => set((state) => ({
        solicitacoesAtendimento: state.solicitacoesAtendimento.map(s => s.id === id ? { ...s, ...data } : s)
      })),
      
    }),
    {
      name: 'titas-core-storage',
    }
  )
)

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'titas-core-storage') {
      useStore.persist.rehydrate();
    }
  });
}
