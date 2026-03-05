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
  Search,
  Palette,
  MapPin,
  Building2,
  Tag,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { id: 'cadastro', label: 'Cadastrar Peça', icon: PlusCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { id: 'pecas', label: 'Todas as Peças', icon: Package, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { id: 'busca', label: 'Buscar Peças', icon: Search, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
  { id: 'qrcodes', label: 'QR Codes', icon: QrCode, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  { id: 'importar', label: 'Importar Planilha', icon: FileSpreadsheet, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
];

const configItems = [
  { id: 'marcas', label: 'Marcas', icon: Tag, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { id: 'cores', label: 'Cores', icon: Palette, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
  { id: 'depositos', label: 'Depósitos', icon: Building2, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
  { id: 'localizacoes', label: 'Localizações', icon: MapPin, color: 'text-teal-500', bgColor: 'bg-teal-500/10' },
];

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { usuario, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const MenuContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-50" />
            <div className="relative gradient-primary p-3 rounded-xl">
              <Car className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Desmanche Pro</h1>
            <p className="text-xs text-slate-400">Gestão de Peças</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Menu Principal
          </p>
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`${isActive ? 'bg-white/20' : item.bgColor} p-1.5 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color}`} />
                  </div>
                  {item.label}
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Configurações
          </p>
          <nav className="space-y-1">
            {configItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`${isActive ? 'bg-white/20' : item.bgColor} p-1.5 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color}`} />
                  </div>
                  {item.label}
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-white/5 rounded-xl">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {usuario?.nome}
            </p>
            <p className="text-xs text-slate-400 capitalize">
              {usuario?.perfil}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-slate-400 hover:text-white hover:bg-red-500/20"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sair do Sistema
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900 fixed h-full">
        <MenuContent />
      </aside>

      {/* Sidebar Mobile */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="default"
            size="icon"
            className="fixed top-4 left-4 z-50 gradient-primary shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 flex flex-col bg-slate-900 border-slate-800">
          <MenuContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
