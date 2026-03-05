import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario } from '@/types';

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('desmanche_usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    if (email === 'admin@desmanche.com' && senha === 'admin123') {
      const usuario: Usuario = {
        id: '1',
        nome: 'Administrador',
        email: 'admin@desmanche.com',
        perfil: 'admin'
      };
      setUsuario(usuario);
      localStorage.setItem('desmanche_usuario', JSON.stringify(usuario));
      return true;
    }
    
    if (email === 'operador@desmanche.com' && senha === 'operador123') {
      const usuario: Usuario = {
        id: '2',
        nome: 'Operador',
        email: 'operador@desmanche.com',
        perfil: 'operador'
      };
      setUsuario(usuario);
      localStorage.setItem('desmanche_usuario', JSON.stringify(usuario));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('desmanche_usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
