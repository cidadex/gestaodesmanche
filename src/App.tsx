import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { Toaster } from '@/components/ui/sonner';
import Login from '@/pages/Login';
import Layout from '@/pages/Layout';
import Dashboard from '@/pages/Dashboard';
import CadastroPeca from '@/pages/CadastroPeca';
import ListagemPecas from '@/pages/ListagemPecas';
import BuscaPecas from '@/pages/BuscaPecas';
import QRCodes from '@/pages/QRCodes';
import ImportarPlanilha from '@/pages/ImportarPlanilha';

function AppContent() {
  const { usuario, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!usuario) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'cadastro':
        return <CadastroPeca />;
      case 'pecas':
        return <ListagemPecas />;
      case 'busca':
        return <BuscaPecas />;
      case 'qrcodes':
        return <QRCodes />;
      case 'importar':
        return <ImportarPlanilha />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
        <Toaster position="top-right" richColors />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
