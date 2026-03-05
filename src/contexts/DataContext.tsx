import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CORES_PADRAO, 
  MARCAS_PADRAO, 
  SETORES,
  type Peca, 
  type Marca, 
  type Cor, 
  type Localizacao, 
  type DepositoConfig,
  type FiltroPecas,
  type TipoVeiculo,
  type StatusPeca
} from '@/types';

interface DataContextType {
  // Peças
  pecas: Peca[];
  adicionarPeca: (peca: Omit<Peca, 'id' | 'codigo' | 'dataCadastro'>) => Peca;
  atualizarPeca: (id: string, peca: Partial<Peca>) => void;
  removerPeca: (id: string) => void;
  darBaixaPeca: (id: string) => void;
  filtrarPecas: (filtro: FiltroPecas) => Peca[];
  getPecaById: (id: string) => Peca | undefined;
  importarPecas: (pecas: Partial<Peca>[]) => void;
  
  // Marcas
  marcas: Marca[];
  adicionarMarca: (marca: Omit<Marca, 'id' | 'dataCadastro'>) => Marca;
  atualizarMarca: (id: string, marca: Partial<Marca>) => void;
  removerMarca: (id: string) => void;
  getMarcasPorTipo: (tipo: TipoVeiculo) => Marca[];
  
  // Cores
  cores: Cor[];
  adicionarCor: (cor: Omit<Cor, 'id' | 'dataCadastro'>) => Cor;
  atualizarCor: (id: string, cor: Partial<Cor>) => void;
  removerCor: (id: string) => void;
  
  // Localizações
  localizacoes: Localizacao[];
  adicionarLocalizacao: (loc: Omit<Localizacao, 'id' | 'dataCadastro'>) => Localizacao;
  atualizarLocalizacao: (id: string, loc: Partial<Localizacao>) => void;
  removerLocalizacao: (id: string) => void;
  getLocalizacoesPorDeposito: (depositoId: string) => Localizacao[];
  
  // Depósitos
  depositos: DepositoConfig[];
  adicionarDeposito: (dep: Omit<DepositoConfig, 'id'>) => DepositoConfig;
  atualizarDeposito: (id: string, dep: Partial<DepositoConfig>) => void;
  removerDeposito: (id: string) => void;
  
  // Estatísticas
  getEstatisticas: () => { total: number; vendidas: number; disponiveis: number; reservadas: number };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Inicializar dados padrão
function inicializarDadosPadrao() {
  const depositosPadrao: DepositoConfig[] = [
    { id: 'dep1', nome: 'Depósito 1', descricao: 'Depósito principal' },
    { id: 'dep2', nome: 'Depósito 2', descricao: 'Depósito secundário' },
  ];

  const coresPadrao: Cor[] = CORES_PADRAO.map((cor, index) => ({
    id: `cor-${index}`,
    nome: cor.nome,
    hex: cor.hex,
    dataCadastro: new Date().toISOString(),
  }));

  const marcasPadrao: Marca[] = [];
  Object.entries(MARCAS_PADRAO).forEach(([tipo, nomes]) => {
    nomes.forEach((nome, index) => {
      marcasPadrao.push({
        id: `marca-${tipo}-${index}`,
        nome,
        tipoVeiculo: tipo as TipoVeiculo,
        dataCadastro: new Date().toISOString(),
      });
    });
  });

  const localizacoesPadrao: Localizacao[] = [];
  depositosPadrao.forEach((dep) => {
    SETORES.slice(0, 10).forEach((setor, index) => {
      localizacoesPadrao.push({
        id: `loc-${dep.id}-${index}`,
        nome: `Setor ${setor}`,
        depositoId: dep.id,
        setor,
        dataCadastro: new Date().toISOString(),
      });
    });
  });

  return { depositosPadrao, coresPadrao, marcasPadrao, localizacoesPadrao };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [cores, setCores] = useState<Cor[]>([]);
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [depositos, setDepositos] = useState<DepositoConfig[]>([]);
  const [contadorCodigo, setContadorCodigo] = useState(1);

  // Carregar dados do localStorage
  useEffect(() => {
    const dadosPadrao = inicializarDadosPadrao();
    
    const pecasSalvas = localStorage.getItem('desmanche_pecas');
    const marcasSalvas = localStorage.getItem('desmanche_marcas');
    const coresSalvas = localStorage.getItem('desmanche_cores');
    const localizacoesSalvas = localStorage.getItem('desmanche_localizacoes');
    const depositosSalvos = localStorage.getItem('desmanche_depositos');
    const contadorSalvo = localStorage.getItem('desmanche_contador');

    setPecas(pecasSalvas ? JSON.parse(pecasSalvas) : []);
    setMarcas(marcasSalvas ? JSON.parse(marcasSalvas) : dadosPadrao.marcasPadrao);
    setCores(coresSalvas ? JSON.parse(coresSalvas) : dadosPadrao.coresPadrao);
    setLocalizacoes(localizacoesSalvas ? JSON.parse(localizacoesSalvas) : dadosPadrao.localizacoesPadrao);
    setDepositos(depositosSalvos ? JSON.parse(depositosSalvos) : dadosPadrao.depositosPadrao);
    setContadorCodigo(contadorSalvo ? parseInt(contadorSalvo, 10) : 1);
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('desmanche_pecas', JSON.stringify(pecas));
    localStorage.setItem('desmanche_marcas', JSON.stringify(marcas));
    localStorage.setItem('desmanche_cores', JSON.stringify(cores));
    localStorage.setItem('desmanche_localizacoes', JSON.stringify(localizacoes));
    localStorage.setItem('desmanche_depositos', JSON.stringify(depositos));
    localStorage.setItem('desmanche_contador', contadorCodigo.toString());
  }, [pecas, marcas, cores, localizacoes, depositos, contadorCodigo]);

  // Gerar código da peça
  const gerarCodigo = () => {
    const codigo = `PEC-${String(contadorCodigo).padStart(6, '0')}`;
    setContadorCodigo(prev => prev + 1);
    return codigo;
  };

  // === PEÇAS ===
  const adicionarPeca = (pecaData: Omit<Peca, 'id' | 'codigo' | 'dataCadastro'>) => {
    const novaPeca: Peca = {
      ...pecaData,
      id: crypto.randomUUID(),
      codigo: gerarCodigo(),
      dataCadastro: new Date().toISOString(),
    };
    setPecas(prev => [novaPeca, ...prev]);
    return novaPeca;
  };

  const atualizarPeca = (id: string, pecaData: Partial<Peca>) => {
    setPecas(prev => prev.map(p => p.id === id ? { ...p, ...pecaData } : p));
  };

  const removerPeca = (id: string) => {
    setPecas(prev => prev.filter(p => p.id !== id));
  };

  const darBaixaPeca = (id: string) => {
    setPecas(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: 'vendido' as StatusPeca, dataVenda: new Date().toISOString() }
          : p
      )
    );
  };

  const filtrarPecas = (filtro: FiltroPecas): Peca[] => {
    return pecas.filter(peca => {
      if (filtro.tipoVeiculo && filtro.tipoVeiculo !== 'todos' && peca.tipoVeiculo !== filtro.tipoVeiculo) return false;
      if (filtro.marcaId && peca.marcaId !== filtro.marcaId) return false;
      if (filtro.corId && peca.corId !== filtro.corId) return false;
      if (filtro.status && filtro.status !== 'todos' && peca.status !== filtro.status) return false;
      if (filtro.depositoId && peca.depositoId !== filtro.depositoId) return false;
      if (filtro.localizacaoId && peca.localizacaoId !== filtro.localizacaoId) return false;
      if (filtro.busca) {
        const busca = filtro.busca.toLowerCase();
        const match = 
          peca.descricao.toLowerCase().includes(busca) ||
          peca.codigo.toLowerCase().includes(busca);
        if (!match) return false;
      }
      return true;
    });
  };

  const getPecaById = (id: string) => pecas.find(p => p.id === id);

  const importarPecas = (novasPecas: Partial<Peca>[]) => {
    const pecasCompletas: Peca[] = novasPecas.map(p => ({
      ...p,
      id: crypto.randomUUID(),
      codigo: gerarCodigo(),
      dataCadastro: new Date().toISOString(),
      tipoVeiculo: p.tipoVeiculo || 'carro',
      marcaId: p.marcaId || marcas[0]?.id || '',
      corId: p.corId || cores[0]?.id || '',
      depositoId: p.depositoId || depositos[0]?.id || '',
      localizacaoId: p.localizacaoId || localizacoes[0]?.id || '',
      fotos: p.fotos || [],
      status: p.status || 'disponivel',
      ano: p.ano || new Date().getFullYear(),
    } as Peca));
    
    setPecas(prev => [...pecasCompletas, ...prev]);
  };

  // === MARCAS ===
  const adicionarMarca = (marcaData: Omit<Marca, 'id' | 'dataCadastro'>) => {
    const novaMarca: Marca = {
      ...marcaData,
      id: crypto.randomUUID(),
      dataCadastro: new Date().toISOString(),
    };
    setMarcas(prev => [...prev, novaMarca]);
    return novaMarca;
  };

  const atualizarMarca = (id: string, marcaData: Partial<Marca>) => {
    setMarcas(prev => prev.map(m => m.id === id ? { ...m, ...marcaData } : m));
  };

  const removerMarca = (id: string) => {
    setMarcas(prev => prev.filter(m => m.id !== id));
  };

  const getMarcasPorTipo = (tipo: TipoVeiculo) => {
    return marcas.filter(m => m.tipoVeiculo === tipo);
  };

  // === CORES ===
  const adicionarCor = (corData: Omit<Cor, 'id' | 'dataCadastro'>) => {
    const novaCor: Cor = {
      ...corData,
      id: crypto.randomUUID(),
      dataCadastro: new Date().toISOString(),
    };
    setCores(prev => [...prev, novaCor]);
    return novaCor;
  };

  const atualizarCor = (id: string, corData: Partial<Cor>) => {
    setCores(prev => prev.map(c => c.id === id ? { ...c, ...corData } : c));
  };

  const removerCor = (id: string) => {
    setCores(prev => prev.filter(c => c.id !== id));
  };

  // === LOCALIZAÇÕES ===
  const adicionarLocalizacao = (locData: Omit<Localizacao, 'id' | 'dataCadastro'>) => {
    const novaLoc: Localizacao = {
      ...locData,
      id: crypto.randomUUID(),
      dataCadastro: new Date().toISOString(),
    };
    setLocalizacoes(prev => [...prev, novaLoc]);
    return novaLoc;
  };

  const atualizarLocalizacao = (id: string, locData: Partial<Localizacao>) => {
    setLocalizacoes(prev => prev.map(l => l.id === id ? { ...l, ...locData } : l));
  };

  const removerLocalizacao = (id: string) => {
    setLocalizacoes(prev => prev.filter(l => l.id !== id));
  };

  const getLocalizacoesPorDeposito = (depositoId: string) => {
    return localizacoes.filter(l => l.depositoId === depositoId);
  };

  // === DEPÓSITOS ===
  const adicionarDeposito = (depData: Omit<DepositoConfig, 'id'>) => {
    const novoDep: DepositoConfig = {
      ...depData,
      id: crypto.randomUUID(),
    };
    setDepositos(prev => [...prev, novoDep]);
    return novoDep;
  };

  const atualizarDeposito = (id: string, depData: Partial<DepositoConfig>) => {
    setDepositos(prev => prev.map(d => d.id === id ? { ...d, ...depData } : d));
  };

  const removerDeposito = (id: string) => {
    setDepositos(prev => prev.filter(d => d.id !== id));
  };

  // === ESTATÍSTICAS ===
  const getEstatisticas = () => ({
    total: pecas.length,
    vendidas: pecas.filter(p => p.status === 'vendido').length,
    disponiveis: pecas.filter(p => p.status === 'disponivel').length,
    reservadas: pecas.filter(p => p.status === 'reservado').length,
  });

  return (
    <DataContext.Provider value={{
      pecas, adicionarPeca, atualizarPeca, removerPeca, darBaixaPeca, filtrarPecas, getPecaById, importarPecas,
      marcas, adicionarMarca, atualizarMarca, removerMarca, getMarcasPorTipo,
      cores, adicionarCor, atualizarCor, removerCor,
      localizacoes, adicionarLocalizacao, atualizarLocalizacao, removerLocalizacao, getLocalizacoesPorDeposito,
      depositos, adicionarDeposito, atualizarDeposito, removerDeposito,
      getEstatisticas,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
}
