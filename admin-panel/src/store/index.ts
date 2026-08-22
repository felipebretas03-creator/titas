import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Produto = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  custo: number; // Novo
  estoqueAtual: number; // Novo
  estoqueMinimo?: number; // Novo
  status: 'Ativo' | 'Inativo';
  descricao?: string;
  imagemUrl?: string;
}

export type Categoria = {
  id: string;
  nome: string;
}

export type Cargo = {
  id: string;
  nome: string;
  status: 'Ativo' | 'Inativo';
}

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: string; // Updated to be dynamic based on Cargos
  status: 'Ativo' | 'Inativo';
}

export type Transacao = {
  id: string;
  tipo: 'Entrada' | 'Saida';
  valor: number;
  descricao: string;
  categoria?: string;
  formaPagamento?: string; // Novo para relatórios
  data: string;
}

export type Conta = {
  id: string;
  tipo: 'Pagar' | 'Receber';
  descricao: string;
  valor: number;
  vencimento: string;
  status: 'Pendente' | 'Pago';
}

export type FormaPagamento = {
  id: string;
  nome: string;
  taxa: number; // Porcentagem de taxa
  status: 'Ativo' | 'Inativo';
}

export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  endereco?: string;
  cep?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  frequencia: number;
  totalGasto: number;
  ultimaCompra: string;
}

export type RegiaoEntrega = {
  id: string;
  nome: string;
  taxa: number;
  prazoMins: number;
  status: 'Ativo' | 'Inativo';
}

export type MovimentacaoEstoque = {
  id: string;
  produtoId: string;
  tipo: 'Entrada' | 'Saida' | 'Perda';
  quantidade: number;
  motivo?: string;
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
  clienteId?: string; // Novo
  enderecoEntrega?: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    numero: string;
  };
  items: PedidoItem[];
  total: number;
  status: PedidoStatus;
  formaPagamento?: string; // Novo
  createdAt: string;
  tempoEntregaMins?: number; // Novo
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
  cargos: Cargo[];
  transacoes: Transacao[];
  contas: Conta[];
  formasPagamento: FormaPagamento[];
  clientes: Cliente[];
  regioesEntrega: RegiaoEntrega[];
  movimentacoesEstoque: MovimentacaoEstoque[];
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

  // Actions Usuarios & Cargos
  addUsuario: (usuario: Omit<Usuario, 'id'>) => void;
  updateUsuario: (id: string, data: Partial<Usuario>) => void;
  deleteUsuario: (id: string) => void;
  
  addCargo: (cargo: Omit<Cargo, 'id'>) => void;
  deleteCargo: (id: string) => void;

  // Actions Financeiro e Config
  addTransacao: (transacao: Omit<Transacao, 'id' | 'data'>) => void;
  updateConfiguracoes: (data: Partial<Configuracoes>) => void;
  
  addFormaPagamento: (data: Omit<FormaPagamento, 'id'>) => void;
  deleteFormaPagamento: (id: string) => void;

  addRegiaoEntrega: (data: Omit<RegiaoEntrega, 'id'>) => void;
  deleteRegiaoEntrega: (id: string) => void;
  
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
        { id: '1', nome: 'X-Burger Clássico', categoria: 'Lanches', preco: 25.90, custo: 10.50, estoqueAtual: 50, estoqueMinimo: 20, status: 'Ativo', descricao: 'Pão brioche, blend 160g, queijo prato e maionese da casa.' },
        { id: '2', nome: 'Batata Frita G', categoria: 'Porções', preco: 18.50, custo: 5.00, estoqueAtual: 100, estoqueMinimo: 30, status: 'Ativo', descricao: 'Porção grande de batata palito bem sequinha.' },
        { id: '3', nome: 'Coca-Cola Lata', categoria: 'Bebidas', preco: 6.00, custo: 2.50, estoqueAtual: 5, estoqueMinimo: 48, status: 'Ativo' }, // Estoque baixo de propósito
        { id: '4', nome: 'X-Bacon Supremo', categoria: 'Lanches', preco: 32.90, custo: 14.00, estoqueAtual: 30, estoqueMinimo: 15, status: 'Ativo', descricao: 'Blend 160g, muito bacon, cheddar e molho barbecue.' },
        { id: '5', nome: 'Onion Rings', categoria: 'Porções', preco: 22.00, custo: 6.50, estoqueAtual: 40, estoqueMinimo: 20, status: 'Ativo' },
        { id: '6', nome: 'Guaraná Lata', categoria: 'Bebidas', preco: 6.00, custo: 2.50, estoqueAtual: 60, estoqueMinimo: 24, status: 'Ativo' },
        { id: '7', nome: 'Combo Casal', categoria: 'Combos', preco: 75.00, custo: 30.00, estoqueAtual: 20, estoqueMinimo: 10, status: 'Ativo', descricao: '2 Lanches + 1 Frita G + 2 Refris' },
      ],
      categorias: [
        { id: '1', nome: 'Lanches' },
        { id: '2', nome: 'Bebidas' },
        { id: '3', nome: 'Porções' },
        { id: '4', nome: 'Combos' },
      ],
      cargos: [
        { id: '1', nome: 'Admin', status: 'Ativo' },
        { id: '2', nome: 'Gerente', status: 'Ativo' },
        { id: '3', nome: 'Caixa', status: 'Ativo' },
        { id: '4', nome: 'Montagem', status: 'Ativo' },
        { id: '5', nome: 'Garçom', status: 'Ativo' },
        { id: '6', nome: 'Motoboy', status: 'Ativo' },
      ],
      usuarios: [
        { id: '1', nome: 'Marcos Felipe', email: 'admin@titas.com', perfil: 'Admin', status: 'Ativo' },
        { id: '2', nome: 'João Caixa', email: 'joao@titas.com', perfil: 'Caixa', status: 'Ativo' },
        { id: '3', nome: 'Carlos', email: 'carlos@titas.com', perfil: 'Garçom', status: 'Ativo' },
        { id: '4', nome: 'Roberto', email: 'roberto@titas.com', perfil: 'Motoboy', status: 'Ativo' },
      ],
      transacoes: [
        { id: '1', tipo: 'Entrada', valor: 1250.00, descricao: 'Vendas do Turno (Manhã)', categoria: 'Vendas', formaPagamento: 'Cartão de Crédito', data: new Date().toISOString() },
        { id: '2', tipo: 'Saida', valor: 350.00, descricao: 'Pagamento Fornecedor (Bebidas)', categoria: 'Fornecedores', data: new Date().toISOString() },
        { id: '3', tipo: 'Saida', valor: 120.00, descricao: 'Conta de Luz', categoria: 'Contas Fixas', data: new Date(Date.now() - 86400000).toISOString() },
        { id: '4', tipo: 'Entrada', valor: 850.00, descricao: 'Vendas do Turno (Noite)', categoria: 'Vendas', formaPagamento: 'PIX', data: new Date(Date.now() - 86400000).toISOString() },
        { id: '5', tipo: 'Entrada', valor: 450.00, descricao: 'Vendas Ifood', categoria: 'Delivery', formaPagamento: 'Online', data: new Date(Date.now() - 172800000).toISOString() },
        { id: '6', tipo: 'Saida', valor: 1500.00, descricao: 'Folha de Pagamento', categoria: 'Funcionários', data: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: '7', tipo: 'Saida', valor: 250.00, descricao: 'Marketing Facebook', categoria: 'Marketing', data: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: '8', tipo: 'Entrada', valor: 1950.00, descricao: 'Vendas Fim de Semana', categoria: 'Vendas', formaPagamento: 'Cartão de Débito', data: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: '9', tipo: 'Saida', valor: 85.00, descricao: 'Material de Limpeza', categoria: 'Manutenção', data: new Date(Date.now() - 86400000 * 1).toISOString() },
        { id: '10', tipo: 'Entrada', valor: 650.00, descricao: 'Vendas Salão', categoria: 'Vendas', formaPagamento: 'Dinheiro', data: new Date(Date.now() - 86400000 * 7).toISOString() },
      ],
      contas: [
        { id: '1', tipo: 'Pagar', descricao: 'Aluguel', valor: 2500, vencimento: new Date(Date.now() + 864000000).toISOString(), status: 'Pendente' },
        { id: '2', tipo: 'Receber', descricao: 'Acerto Ifood', valor: 1800, vencimento: new Date(Date.now() + 172800000).toISOString(), status: 'Pendente' },
        { id: '3', tipo: 'Pagar', descricao: 'Fornecedor Carnes', valor: 1200, vencimento: new Date(Date.now() - 86400000).toISOString(), status: 'Pago' },
        { id: '4', tipo: 'Pagar', descricao: 'Internet', valor: 150, vencimento: new Date(Date.now() + 86400000 * 5).toISOString(), status: 'Pendente' },
        { id: '5', tipo: 'Receber', descricao: 'Vendas Cartão (Cielo)', valor: 3200, vencimento: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'Pendente' },
      ],
      formasPagamento: [
        { id: '1', nome: 'PIX', taxa: 0, status: 'Ativo' },
        { id: '2', nome: 'Cartão de Crédito', taxa: 2.5, status: 'Ativo' },
        { id: '3', nome: 'Cartão de Débito', taxa: 1.2, status: 'Ativo' },
        { id: '4', nome: 'Dinheiro', taxa: 0, status: 'Ativo' },
      ],
      clientes: [
        { id: '1', nome: 'Ana Souza', telefone: '11999999999', cep: '01001-000', estado: 'SP', cidade: 'São Paulo', bairro: 'Sé', logradouro: 'Praça da Sé', numero: '1', frequencia: 12, totalGasto: 450.50, ultimaCompra: new Date().toISOString() },
        { id: '2', nome: 'Pedro Henrique', telefone: '11988888888', cep: '20040-020', estado: 'RJ', cidade: 'Rio de Janeiro', bairro: 'Centro', logradouro: 'Avenida Rio Branco', numero: '156', frequencia: 3, totalGasto: 85.00, ultimaCompra: new Date(Date.now() - 500000000).toISOString() },
        { id: '3', nome: 'Maria Clara', telefone: '11977777777', cep: '30140-071', estado: 'MG', cidade: 'Belo Horizonte', bairro: 'Savassi', logradouro: 'Avenida Getúlio Vargas', numero: '123', frequencia: 1, totalGasto: 35.00, ultimaCompra: new Date().toISOString() },
        { id: '4', nome: 'Lucas Faria', telefone: '11966666666', cep: '04538-132', estado: 'SP', cidade: 'São Paulo', bairro: 'Itaim Bibi', logradouro: 'Av Faria Lima', numero: '1000', frequencia: 5, totalGasto: 350.00, ultimaCompra: new Date(Date.now() - 86400000 * 12).toISOString() },
        { id: '5', nome: 'Roberto Alves', telefone: '11955555555', cep: '05407-002', estado: 'SP', cidade: 'São Paulo', bairro: 'Pinheiros', logradouro: 'Rua Teodoro Sampaio', numero: '2500', frequencia: 8, totalGasto: 620.00, ultimaCompra: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: '6', nome: 'Juliana Costa', telefone: '11944444444', cep: '04001-001', estado: 'SP', cidade: 'São Paulo', bairro: 'Paraíso', logradouro: 'Rua Vergueiro', numero: '100', frequencia: 2, totalGasto: 95.00, ultimaCompra: new Date(Date.now() - 86400000 * 20).toISOString() },
      ],
      regioesEntrega: [
        { id: '1', nome: 'Centro', taxa: 5.0, prazoMins: 30, status: 'Ativo' },
        { id: '2', nome: 'Zona Sul', taxa: 8.5, prazoMins: 45, status: 'Ativo' },
        { id: '3', nome: 'Zona Norte', taxa: 10.0, prazoMins: 50, status: 'Ativo' },
        { id: '4', nome: 'Zona Leste', taxa: 12.0, prazoMins: 60, status: 'Ativo' },
      ],
      movimentacoesEstoque: [
        { id: '1', produtoId: '1', tipo: 'Saida', quantidade: 5, motivo: 'Venda', data: new Date().toISOString() },
        { id: '2', produtoId: '3', tipo: 'Perda', quantidade: 2, motivo: 'Lata Amassada', data: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', produtoId: '2', tipo: 'Entrada', quantidade: 50, motivo: 'Compra Fornecedor', data: new Date(Date.now() - 172800000).toISOString() },
        { id: '4', produtoId: '4', tipo: 'Saida', quantidade: 10, motivo: 'Venda FDS', data: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: '5', produtoId: '6', tipo: 'Entrada', quantidade: 120, motivo: 'Compra Fornecedor (Ambev)', data: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: '6', produtoId: '1', tipo: 'Perda', quantidade: 1, motivo: 'Lanche queimado', data: new Date(Date.now() - 86400000 * 1).toISOString() },
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
      pedidos: [
        { id: 'p1', channel: 'DELIVERY', clienteId: '1', enderecoEntrega: { cep: '01001-000', estado: 'SP', cidade: 'São Paulo', bairro: 'Sé', logradouro: 'Praça da Sé', numero: '1' }, items: [{ id: 'i1', produtoId: '1', nome: 'X-Burger Clássico', quantidade: 2, precoUnitario: 25.90 }], total: 51.80, status: 'DELIVERED', formaPagamento: 'PIX', tempoEntregaMins: 35, createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString() },
        { id: 'p2', channel: 'DELIVERY', clienteId: '2', enderecoEntrega: { cep: '20040-020', estado: 'RJ', cidade: 'Rio de Janeiro', bairro: 'Centro', logradouro: 'Avenida Rio Branco', numero: '156' }, items: [{ id: 'i2', produtoId: '2', nome: 'Batata Frita G', quantidade: 1, precoUnitario: 18.50 }, { id: 'iX', produtoId: '3', nome: 'Coca-Cola Lata', quantidade: 2, precoUnitario: 6.00 }], total: 30.50, status: 'DELIVERED', formaPagamento: 'Cartão de Crédito', tempoEntregaMins: 45, createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString() },
        { id: 'p3', channel: 'TABLE', tableId: '2', items: [{ id: 'i3', produtoId: '4', nome: 'X-Bacon Supremo', quantidade: 2, precoUnitario: 32.90 }, { id: 'iy', produtoId: '5', nome: 'Onion Rings', quantidade: 1, precoUnitario: 22.00 }], total: 87.80, status: 'CONFIRMED', formaPagamento: 'Dinheiro', createdAt: new Date().toISOString() },
        { id: 'p4', channel: 'DELIVERY', clienteId: '3', enderecoEntrega: { cep: '30140-071', estado: 'MG', cidade: 'Belo Horizonte', bairro: 'Savassi', logradouro: 'Avenida Getúlio Vargas', numero: '123' }, items: [{ id: 'i4', produtoId: '7', nome: 'Combo Casal', quantidade: 1, precoUnitario: 75.00 }], total: 75.00, status: 'DELIVERED', formaPagamento: 'PIX', tempoEntregaMins: 25, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'p5', channel: 'PICKUP', items: [{ id: 'i6', produtoId: '2', nome: 'Batata Frita G', quantidade: 2, precoUnitario: 18.50 }], total: 37.00, status: 'DELIVERED', formaPagamento: 'Cartão de Débito', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: 'p6', channel: 'TABLE', tableId: '1', items: [{ id: 'i7', produtoId: '1', nome: 'X-Burger Clássico', quantidade: 3, precoUnitario: 25.90 }], total: 77.70, status: 'DELIVERED', formaPagamento: 'Cartão de Crédito', createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
        { id: 'p7', channel: 'DELIVERY', clienteId: '4', enderecoEntrega: { cep: '04538-132', estado: 'SP', cidade: 'São Paulo', bairro: 'Itaim Bibi', logradouro: 'Av Faria Lima', numero: '1000' }, items: [{ id: 'i8', produtoId: '7', nome: 'Combo Casal', quantidade: 2, precoUnitario: 75.00 }], total: 150.00, status: 'DELIVERED', formaPagamento: 'Cartão de Crédito', tempoEntregaMins: 55, createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
        { id: 'p8', channel: 'DELIVERY', clienteId: '1', enderecoEntrega: { cep: '01001-000', estado: 'SP', cidade: 'São Paulo', bairro: 'Sé', logradouro: 'Praça da Sé', numero: '1' }, items: [{ id: 'i9', produtoId: '4', nome: 'X-Bacon Supremo', quantidade: 1, precoUnitario: 32.90 }], total: 32.90, status: 'CANCELLED', formaPagamento: 'PIX', tempoEntregaMins: undefined, createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
        { id: 'p9', channel: 'TABLE', tableId: '3', items: [{ id: 'i10', produtoId: '6', nome: 'Guaraná Lata', quantidade: 3, precoUnitario: 6.00 }], total: 18.00, status: 'DELIVERED', formaPagamento: 'Boleto', createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
        { id: 'p10', channel: 'PICKUP', items: [{ id: 'i11', produtoId: '1', nome: 'X-Burger Clássico', quantidade: 5, precoUnitario: 25.90 }], total: 129.50, status: 'DELIVERED', formaPagamento: 'Dinheiro', createdAt: new Date(Date.now() - 86400000 * 25).toISOString() },
        { id: 'p11', channel: 'DELIVERY', clienteId: '2', enderecoEntrega: { cep: '20040-020', estado: 'RJ', cidade: 'Rio de Janeiro', bairro: 'Centro', logradouro: 'Avenida Rio Branco', numero: '156' }, items: [{ id: 'i12', produtoId: '5', nome: 'Onion Rings', quantidade: 2, precoUnitario: 22.00 }], total: 44.00, status: 'DELIVERED', formaPagamento: 'Online', tempoEntregaMins: 20, createdAt: new Date(Date.now() - 86400000 * 28).toISOString() },
        { id: 'p12', channel: 'TABLE', tableId: '1', items: [{ id: 'i13', produtoId: '7', nome: 'Combo Casal', quantidade: 1, precoUnitario: 75.00 }, { id: 'i14', produtoId: '4', nome: 'X-Bacon Supremo', quantidade: 1, precoUnitario: 32.90 }], total: 107.90, status: 'DELIVERED', formaPagamento: 'Cartão de Débito', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        // --- 1 DIA DE TRABALHO INTENSO (HOJE) ---
        { id: 't1', channel: 'DELIVERY', clienteId: '1', enderecoEntrega: { cep: '01001-000', estado: 'SP', cidade: 'São Paulo', bairro: 'Sé', logradouro: 'Praça da Sé', numero: '1' }, items: [{ id: 'i1', produtoId: '1', nome: 'X-Burger Clássico', quantidade: 2, precoUnitario: 25.90 }], total: 51.80, status: 'DELIVERED', formaPagamento: 'PIX', tempoEntregaMins: 25, createdAt: new Date(Date.now() - 3600000 * 1).toISOString() },
        { id: 't2', channel: 'TABLE', tableId: '1', items: [{ id: 'i2', produtoId: '4', nome: 'X-Bacon Supremo', quantidade: 1, precoUnitario: 32.90 }, { id: 'i3', produtoId: '3', nome: 'Coca-Cola Lata', quantidade: 2, precoUnitario: 6.00 }], total: 44.90, status: 'DELIVERED', formaPagamento: 'Cartão de Crédito', createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString() },
        { id: 't3', channel: 'PICKUP', items: [{ id: 'i4', produtoId: '7', nome: 'Combo Casal', quantidade: 1, precoUnitario: 75.00 }], total: 75.00, status: 'DELIVERED', formaPagamento: 'Dinheiro', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: 't4', channel: 'DELIVERY', clienteId: '2', enderecoEntrega: { cep: '20040-020', estado: 'RJ', cidade: 'Rio de Janeiro', bairro: 'Centro', logradouro: 'Avenida Rio Branco', numero: '156' }, items: [{ id: 'i5', produtoId: '2', nome: 'Batata Frita G', quantidade: 3, precoUnitario: 18.50 }], total: 55.50, status: 'DELIVERED', formaPagamento: 'Online', tempoEntregaMins: 40, createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString() },
        { id: 't5', channel: 'TABLE', tableId: '2', items: [{ id: 'i6', produtoId: '1', nome: 'X-Burger Clássico', quantidade: 4, precoUnitario: 25.90 }, { id: 'i7', produtoId: '5', nome: 'Onion Rings', quantidade: 2, precoUnitario: 22.00 }], total: 147.60, status: 'DELIVERED', formaPagamento: 'PIX', createdAt: new Date(Date.now() - 3600000 * 3).toISOString() },
        { id: 't6', channel: 'DELIVERY', clienteId: '3', enderecoEntrega: { cep: '30140-071', estado: 'MG', cidade: 'Belo Horizonte', bairro: 'Savassi', logradouro: 'Avenida Getúlio Vargas', numero: '123' }, items: [{ id: 'i8', produtoId: '4', nome: 'X-Bacon Supremo', quantidade: 2, precoUnitario: 32.90 }], total: 65.80, status: 'DELIVERED', formaPagamento: 'Cartão de Débito', tempoEntregaMins: 30, createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString() },
        { id: 't7', channel: 'TABLE', tableId: '3', items: [{ id: 'i9', produtoId: '6', nome: 'Guaraná Lata', quantidade: 5, precoUnitario: 6.00 }], total: 30.00, status: 'CONFIRMED', formaPagamento: 'Dinheiro', createdAt: new Date(Date.now() - 3600000 * 4).toISOString() },
        { id: 't8', channel: 'PICKUP', items: [{ id: 'i10', produtoId: '7', nome: 'Combo Casal', quantidade: 2, precoUnitario: 75.00 }], total: 150.00, status: 'DELIVERED', formaPagamento: 'Cartão de Crédito', createdAt: new Date(Date.now() - 3600000 * 4.5).toISOString() },
        { id: 't9', channel: 'DELIVERY', clienteId: '4', enderecoEntrega: { cep: '04538-132', estado: 'SP', cidade: 'São Paulo', bairro: 'Itaim Bibi', logradouro: 'Av Faria Lima', numero: '1000' }, items: [{ id: 'i11', produtoId: '1', nome: 'X-Burger Clássico', quantidade: 1, precoUnitario: 25.90 }], total: 25.90, status: 'CANCELLED', formaPagamento: 'Online', tempoEntregaMins: undefined, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
        { id: 't10', channel: 'TABLE', tableId: '1', items: [{ id: 'i12', produtoId: '4', nome: 'X-Bacon Supremo', quantidade: 1, precoUnitario: 32.90 }, { id: 'i13', produtoId: '2', nome: 'Batata Frita G', quantidade: 1, precoUnitario: 18.50 }], total: 51.40, status: 'DELIVERED', formaPagamento: 'PIX', createdAt: new Date(Date.now() - 3600000 * 5.5).toISOString() },
        { id: 't11', channel: 'DELIVERY', clienteId: '5', enderecoEntrega: { cep: '05407-002', estado: 'SP', cidade: 'São Paulo', bairro: 'Pinheiros', logradouro: 'Rua Teodoro Sampaio', numero: '2500' }, items: [{ id: 'i14', produtoId: '5', nome: 'Onion Rings', quantidade: 1, precoUnitario: 22.00 }, { id: 'i15', produtoId: '6', nome: 'Guaraná Lata', quantidade: 2, precoUnitario: 6.00 }], total: 34.00, status: 'DELIVERED', formaPagamento: 'Cartão de Crédito', tempoEntregaMins: 20, createdAt: new Date(Date.now() - 3600000 * 6).toISOString() },
        { id: 't12', channel: 'PICKUP', items: [{ id: 'i16', produtoId: '7', nome: 'Combo Casal', quantidade: 1, precoUnitario: 75.00 }, { id: 'i17', produtoId: '1', nome: 'X-Burger Clássico', quantidade: 1, precoUnitario: 25.90 }], total: 100.90, status: 'DELIVERED', formaPagamento: 'Dinheiro', createdAt: new Date(Date.now() - 3600000 * 6.5).toISOString() },
        { id: 't13', channel: 'TABLE', tableId: '2', items: [{ id: 'i18', produtoId: '4', nome: 'X-Bacon Supremo', quantidade: 3, precoUnitario: 32.90 }], total: 98.70, status: 'DELIVERED', formaPagamento: 'Cartão de Débito', createdAt: new Date(Date.now() - 3600000 * 7).toISOString() },
        { id: 't14', channel: 'DELIVERY', clienteId: '6', enderecoEntrega: { cep: '04001-001', estado: 'SP', cidade: 'São Paulo', bairro: 'Paraíso', logradouro: 'Rua Vergueiro', numero: '100' }, items: [{ id: 'i19', produtoId: '2', nome: 'Batata Frita G', quantidade: 2, precoUnitario: 18.50 }, { id: 'i20', produtoId: '3', nome: 'Coca-Cola Lata', quantidade: 1, precoUnitario: 6.00 }], total: 43.00, status: 'DELIVERED', formaPagamento: 'PIX', tempoEntregaMins: 35, createdAt: new Date(Date.now() - 3600000 * 7.5).toISOString() },
        { id: 't15', channel: 'DELIVERY', clienteId: '1', enderecoEntrega: { cep: '01001-000', estado: 'SP', cidade: 'São Paulo', bairro: 'Sé', logradouro: 'Praça da Sé', numero: '1' }, items: [{ id: 'i21', produtoId: '7', nome: 'Combo Casal', quantidade: 1, precoUnitario: 75.00 }], total: 75.00, status: 'DELIVERED', formaPagamento: 'Online', tempoEntregaMins: 50, createdAt: new Date(Date.now() - 3600000 * 8).toISOString() },
      ],
      solicitacoesAtendimento: [
        { id: 'sa1', tableId: '1', sessionId: 's1', type: 'WAITER', message: 'Por favor, pode vir à mesa?', status: 'RESOLVED', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'sa2', tableId: '2', sessionId: 's2', type: 'CLOSE_BILL', message: '', status: 'PENDING', createdAt: new Date().toISOString() },
        { id: 'sa3', tableId: '3', sessionId: 's3', type: 'NAPKINS', message: 'Mais guardanapos', status: 'RESOLVED', createdAt: new Date(Date.now() - 7200000).toISOString() },
        { id: 'sa4', tableId: '1', sessionId: 's1', type: 'ORDER_QUESTION', message: 'Dúvida no cardápio', status: 'RESOLVED', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'sa5', tableId: '2', sessionId: 's4', type: 'CUTLERY', message: 'Talheres caíram', status: 'RESOLVED', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      ],
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

      addCargo: (data) => set((state) => ({ cargos: [...state.cargos, { ...data, id: generateId() }] })),
      deleteCargo: (id) => set((state) => ({ cargos: state.cargos.filter(c => c.id !== id) })),

      addFormaPagamento: (data) => set((state) => ({ formasPagamento: [...state.formasPagamento, { ...data, id: generateId() }] })),
      deleteFormaPagamento: (id) => set((state) => ({ formasPagamento: state.formasPagamento.filter(f => f.id !== id) })),

      addRegiaoEntrega: (data) => set((state) => ({ regioesEntrega: [...state.regioesEntrega, { ...data, id: generateId() }] })),
      deleteRegiaoEntrega: (id) => set((state) => ({ regioesEntrega: state.regioesEntrega.filter(r => r.id !== id) })),
      
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
      name: 'titas-core-storage-v2',
    }
  )
)

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'titas-core-storage-v2') {
      useStore.persist.rehydrate();
    }
  });
}
