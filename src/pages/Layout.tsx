import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  QrCode,
  LogOut,
  Menu,
  User,
  ChevronRight,
  Car,
  FileSpreadsheet,
  Search
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cadastro', label: 'Cadastrar Peça', icon: PlusCircle },
  { id: 'pecas', label: 'Todas as Peças', icon: Package },
  { id: 'busca', label: 'Buscar Peças', icon: Search },
  { id: 'qrcodes', label: 'QR Codes', icon: QrCode },
  { id: 'importar', label: 'Importar Planilha', icon: FileSpreadsheet },
];

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { usuario, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const MenuContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900">Desmanche</h1>
            <p className="text-xs text-slate-500">Sistema de Catalogação</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <div className="bg-slate-100 p-2 rounded-full">
            <User className="h-4 w-4 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {usuario?.nome}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {usuario?.perfil}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 fixed h-full">
        <MenuContent />
      </aside>

      {/* Sidebar Mobile */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-white shadow-md"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <MenuContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
