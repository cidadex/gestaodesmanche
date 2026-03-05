import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Peca, FiltroPecas } from '@/types';

interface DataContextType {
  pecas: Peca[];
  adicionarPeca: (peca: Omit<Peca, 'id' | 'codigo' | 'dataCadastro'>) => Peca;
  atualizarPeca: (id: string, peca: Partial<Peca>) => void;
  removerPeca: (id: string) => void;
  darBaixaPeca: (id: string, valor?: number) => void;
  filtrarPecas: (filtro: FiltroPecas) => Peca[];
  importarPecas: (pecas: Partial<Peca>[]) => void;
  getEstatisticas: () => { total: number; vendidas: number; disponiveis: number; reservadas: number };
  getPecaById: (id: string) => Peca | undefined;
  gerarCodigoPeca: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [contadorCodigo, setContadorCodigo] = useState(1);

  useEffect(() => {
    const pecasSalvas = localStorage.getItem('desmanche_pecas');
    const contadorSalvo = localStorage.getItem('desmanche_contador');
    
    if (pecasSalvas) {
      setPecas(JSON.parse(pecasSalvas));
    }
    
    if (contadorSalvo) {
      setContadorCodigo(parseInt(contadorSalvo, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('desmanche_pecas', JSON.stringify(pecas));
    localStorage.setItem('desmanche_contador', contadorCodigo.toString());
  }, [pecas, contadorCodigo]);

  const gerarCodigoPeca = () => {
    const codigo = `PEC-${String(contadorCodigo).padStart(6, '0')}`;
    setContadorCodigo(prev => prev + 1);
    return codigo;
  };

  const adicionarPeca = (pecaData: Omit<Peca, 'id' | 'codigo' | 'dataCadastro'>) => {
    const novaPeca: Peca = {
      ...pecaData,
      id: crypto.randomUUID(),
      codigo: gerarCodigoPeca(),
      dataCadastro: new Date().toISOString(),
    };
    
    setPecas(prev => [novaPeca, ...prev]);
    return novaPeca;
  };

  const atualizarPeca = (id: string, pecaData: Partial<Peca>) => {
    setPecas(prev =>
      prev.map(peca =>
        peca.id === id ? { ...peca, ...pecaData } : peca
      )
    );
  };

  const removerPeca = (id: string) => {
    setPecas(prev => prev.filter(peca => peca.id !== id));
  };

  const darBaixaPeca = (id: string, valor?: number) => {
    setPecas(prev =>
      prev.map(peca =>
        peca.id === id
          ? { 
              ...peca, 
              status: 'vendido' as const, 
              dataVenda: new Date().toISOString(),
              ...(valor && { valor })
            }
          : peca
      )
    );
  };

  const filtrarPecas = (filtro: FiltroPecas): Peca[] => {
    return pecas.filter(peca => {
      if (filtro.tipoVeiculo && filtro.tipoVeiculo !== 'todos' && peca.tipoVeiculo !== filtro.tipoVeiculo) {
        return false;
      }
      
      if (filtro.marca && peca.marca !== filtro.marca) {
        return false;
      }
      
      if (filtro.status && filtro.status !== 'todos' && peca.status !== filtro.status) {
        return false;
      }
      
      if (filtro.deposito && filtro.deposito !== 'todos' && peca.deposito !== filtro.deposito) {
        return false;
      }
      
      if (filtro.setor && peca.setor !== filtro.setor) {
        return false;
      }
      
      if (filtro.periodoInicio) {
        const dataInicio = new Date(filtro.periodoInicio);
        const dataPeca = new Date(peca.dataCadastro);
        if (dataPeca < dataInicio) {
          return false;
        }
      }
      
      if (filtro.periodoFim) {
        const dataFim = new Date(filtro.periodoFim);
        const dataPeca = new Date(peca.dataCadastro);
        if (dataPeca > dataFim) {
          return false;
        }
      }
      
      return true;
    });
  };

  const importarPecas = (novasPecas: Partial<Peca>[]) => {
    const pecasCompletas: Peca[] = novasPecas.map(pecaData => ({
      ...pecaData,
      id: crypto.randomUUID(),
      codigo: gerarCodigoPeca(),
      dataCadastro: new Date().toISOString(),
      tipoVeiculo: pecaData.tipoVeiculo || 'carro',
      deposito: pecaData.deposito || 'deposito1',
      status: pecaData.status || 'disponivel',
      fotos: pecaData.fotos || [],
    } as Peca));
    
    setPecas(prev => [...pecasCompletas, ...prev]);
  };

  const getEstatisticas = () => {
    return {
      total: pecas.length,
      vendidas: pecas.filter(p => p.status === 'vendido').length,
      disponiveis: pecas.filter(p => p.status === 'disponivel').length,
      reservadas: pecas.filter(p => p.status === 'reservado').length,
    };
  };

  const getPecaById = (id: string) => {
    return pecas.find(p => p.id === id);
  };

  return (
    <DataContext.Provider value={{
      pecas,
      adicionarPeca,
      atualizarPeca,
      removerPeca,
      darBaixaPeca,
      filtrarPecas,
      importarPecas,
      getEstatisticas,
      getPecaById,
      gerarCodigoPeca,
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
