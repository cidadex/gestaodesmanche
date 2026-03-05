// Tipos de Veículo
export type TipoVeiculo = 'carro' | 'moto' | 'bicicleta';

// Status da Peça
export type StatusPeca = 'disponivel' | 'vendido' | 'reservado';

// Depósito
export type Deposito = 'deposito1' | 'deposito2';

// Interfaces principais
export interface Peca {
  id: string;
  codigo: string;
  descricao: string;
  tipoVeiculo: TipoVeiculo;
  marcaId: string;
  corId: string;
  ano: number;
  depositoId: string;
  localizacaoId: string;
  fotos: string[];
  dataCadastro: string;
  dataVenda?: string;
  status: StatusPeca;
  observacoes?: string;
}

export interface Marca {
  id: string;
  nome: string;
  tipoVeiculo: TipoVeiculo;
  dataCadastro: string;
}

export interface Cor {
  id: string;
  nome: string;
  hex?: string;
  dataCadastro: string;
}

export interface Localizacao {
  id: string;
  nome: string;
  depositoId: string;
  setor: string;
  dataCadastro: string;
}

export interface DepositoConfig {
  id: string;
  nome: string;
  descricao?: string;
}

export interface FiltroPecas {
  tipoVeiculo?: TipoVeiculo | 'todos';
  marcaId?: string;
  corId?: string;
  status?: StatusPeca | 'todos';
  depositoId?: string;
  localizacaoId?: string;
  busca?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'operador';
}

// Setores disponíveis
export const SETORES = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10',
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10',
];

// Cores padrão
export const CORES_PADRAO = [
  { nome: 'Preto', hex: '#000000' },
  { nome: 'Branco', hex: '#FFFFFF' },
  { nome: 'Prata', hex: '#C0C0C0' },
  { nome: 'Cinza', hex: '#808080' },
  { nome: 'Vermelho', hex: '#FF0000' },
  { nome: 'Azul', hex: '#0000FF' },
  { nome: 'Verde', hex: '#008000' },
  { nome: 'Amarelo', hex: '#FFFF00' },
  { nome: 'Laranja', hex: '#FFA500' },
  { nome: 'Marrom', hex: '#8B4513' },
  { nome: 'Bege', hex: '#F5F5DC' },
  { nome: 'Roxo', hex: '#800080' },
  { nome: 'Rosa', hex: '#FFC0CB' },
  { nome: 'Dourado', hex: '#FFD700' },
  { nome: 'Bronze', hex: '#CD7F32' },
];

// Marcas padrão por tipo
export const MARCAS_PADRAO: Record<TipoVeiculo, string[]> = {
  carro: [
    'Chevrolet', 'Ford', 'Fiat', 'Volkswagen', 'Toyota', 'Honda', 'Hyundai', 
    'Renault', 'Nissan', 'Peugeot', 'Citroën', 'Jeep', 'BMW', 'Mercedes-Benz',
    'Audi', 'Kia', 'Volvo', 'Land Rover', 'Mitsubishi', 'Chery', 'Outros'
  ],
  moto: [
    'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'BMW', 'Ducati', 'Harley-Davidson',
    'Kasinski', 'Dafra', 'Shineray', 'Traxx', 'Motomel', 'Zanella', 'Corven',
    'Benelli', 'Royal Enfield', 'Outros'
  ],
  bicicleta: [
    'Caloi', 'Monark', 'Track & Bikes', 'Cannondale', 'Specialized', 'Trek',
    'Giant', 'Scott', 'Oggi', 'Soul', 'Sense', 'Outros'
  ]
};
