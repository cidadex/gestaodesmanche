export interface Peca {
  id: string;
  codigo: string;
  descricao: string;
  tipoVeiculo: 'carro' | 'moto' | 'bicicleta';
  marca: string;
  cor: string;
  ano: number;
  fotos: string[];
  deposito: 'deposito1' | 'deposito2';
  setor: string;
  localizacao: string;
  dataCadastro: string;
  dataVenda?: string;
  status: 'disponivel' | 'vendido' | 'reservado';
  valor?: number;
  observacoes?: string;
}

export interface FiltroPecas {
  tipoVeiculo?: 'carro' | 'moto' | 'bicicleta' | 'todos';
  marca?: string;
  periodoInicio?: string;
  periodoFim?: string;
  status?: 'disponivel' | 'vendido' | 'reservado' | 'todos';
  deposito?: 'deposito1' | 'deposito2' | 'todos';
  setor?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'operador';
}

export interface QRCodeInfo {
  tipo: 'peca' | 'localizacao';
  id?: string;
  codigo?: string;
  descricao?: string;
  deposito?: string;
  setor?: string;
  localizacao?: string;
}

export const MARCAS_POR_TIPO: Record<string, string[]> = {
  carro: [
    'Chevrolet', 'Ford', 'Fiat', 'Volkswagen', 'Toyota', 'Honda', 'Hyundai', 
    'Renault', 'Nissan', 'Peugeot', 'Citroën', 'Mitsubishi', 'Jeep', 'BMW',
    'Mercedes-Benz', 'Audi', 'Kia', 'Volvo', 'Land Rover', 'Outros'
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

export const SETORES = [
  'A1', 'A2', 'A3', 'A4', 'A5',
  'B1', 'B2', 'B3', 'B4', 'B5',
  'C1', 'C2', 'C3', 'C4', 'C5',
  'D1', 'D2', 'D3', 'D4', 'D5',
  'E1', 'E2', 'E3', 'E4', 'E5'
];
