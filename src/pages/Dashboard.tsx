import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  Search,
  RotateCcw,
  Car,
  Bike,
  AlertCircle,
  Warehouse,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Peca, FiltroPecas, TipoVeiculo } from '@/types';

const tipoIcons: Record<TipoVeiculo, typeof Car> = {
  carro: Car,
  moto: Bike,
  bicicleta: Bike,
};

const tipoBgColors: Record<TipoVeiculo, string> = {
  carro: 'bg-blue-500/10 text-blue-600',
  moto: 'bg-purple-500/10 text-purple-600',
  bicicleta: 'bg-emerald-500/10 text-emerald-600',
};

export default function Dashboard() {
  const { marcas, cores, depositos, localizacoes, filtrarPecas, getEstatisticas } = useData();
  const [filtro, setFiltro] = useState<FiltroPecas>({
    tipoVeiculo: 'todos',
    marcaId: '',
    corId: '',
    status: 'todos',
    depositoId: '',
    localizacaoId: '',
  });
  const [pecasFiltradas, setPecasFiltradas] = useState<Peca[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const stats = getEstatisticas();

  const handleFiltrar = () => {
    const resultado = filtrarPecas(filtro);
    setPecasFiltradas(resultado);
    setMostrarResultados(true);
  };

  const handleLimparFiltro = () => {
    setFiltro({
      tipoVeiculo: 'todos',
      marcaId: '',
      corId: '',
      status: 'todos',
      depositoId: '',
      localizacaoId: '',
    });
    setMostrarResultados(false);
    setPecasFiltradas([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disponivel':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Disponível</Badge>;
      case 'vendido':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Baixa</Badge>;
      case 'reservado':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Reservado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getMarcaNome = (id: string) => marcas.find(m => m.id === id)?.nome || '-';
  const getCorNome = (id: string) => cores.find(c => c.id === id)?.nome || '-';
  const getDepositoNome = (id: string) => depositos.find(d => d.id === id)?.nome || '-';
  const getLocalizacaoNome = (id: string) => localizacoes.find(l => l.id === id)?.nome || '-';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-slate-500">Visão geral do seu estoque</p>
        </div>
      </div>

      {/* Cards de Estatísticas - Coloridos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover border-0 shadow-lg overflow-hidden">
          <div className={`h-1 gradient-primary`} />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total de Peças
            </CardTitle>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-xs text-slate-500 mt-1">Peças cadastradas</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Disponíveis
            </CardTitle>
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{stats.disponiveis}</div>
            <p className="text-xs text-slate-500 mt-1">Em estoque</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Baixa no Estoque
            </CardTitle>
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Warehouse className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.vendidas}</div>
            <p className="text-xs text-slate-500 mt-1">Peças retiradas</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Reservadas
            </CardTitle>
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{stats.reservadas}</div>
            <p className="text-xs text-slate-500 mt-1">Aguardando retirada</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtro Avançado */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <Search className="h-4 w-4 text-white" />
            </div>
            Filtro Avançado de Peças
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Tipo de Veículo</Label>
              <Select
                value={filtro.tipoVeiculo}
                onValueChange={(value) =>
                  setFiltro({ ...filtro, tipoVeiculo: value as any, marcaId: '' })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="carro">🚗 Carro</SelectItem>
                  <SelectItem value="moto">🏍️ Moto</SelectItem>
                  <SelectItem value="bicicleta">🚲 Bicicleta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Marca</Label>
              <Select
                value={filtro.marcaId}
                onValueChange={(value) => setFiltro({ ...filtro, marcaId: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todas as marcas</SelectItem>
                  {marcas
                    .filter(m => !filtro.tipoVeiculo || filtro.tipoVeiculo === 'todos' || m.tipoVeiculo === filtro.tipoVeiculo)
                    .map((marca) => (
                      <SelectItem key={marca.id} value={marca.id}>
                        {marca.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Cor</Label>
              <Select
                value={filtro.corId}
                onValueChange={(value) => setFiltro({ ...filtro, corId: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Todas as cores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todas as cores</SelectItem>
                  {cores.map((cor) => (
                    <SelectItem key={cor.id} value={cor.id}>
                      <span className="flex items-center gap-2">
                        <span 
                          className="w-4 h-4 rounded-full border border-slate-200" 
                          style={{ backgroundColor: cor.hex || '#ccc' }}
                        />
                        {cor.nome}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Status</Label>
              <Select
                value={filtro.status}
                onValueChange={(value) => setFiltro({ ...filtro, status: value as any })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="disponivel">✅ Disponível</SelectItem>
                  <SelectItem value="vendido">📦 Baixa</SelectItem>
                  <SelectItem value="reservado">⏳ Reservado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Depósito</Label>
              <Select
                value={filtro.depositoId}
                onValueChange={(value) => setFiltro({ ...filtro, depositoId: value, localizacaoId: '' })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Todos os depósitos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todos os depósitos</SelectItem>
                  {depositos.map((dep) => (
                    <SelectItem key={dep.id} value={dep.id}>
                      {dep.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Localização</Label>
              <Select
                value={filtro.localizacaoId}
                onValueChange={(value) => setFiltro({ ...filtro, localizacaoId: value })}
                disabled={!filtro.depositoId}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Todas as localizações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todas as localizações</SelectItem>
                  {localizacoes
                    .filter(l => !filtro.depositoId || l.depositoId === filtro.depositoId)
                    .map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              onClick={handleFiltrar} 
              className="flex-1 h-11 gradient-primary btn-glow"
            >
              <Search className="h-4 w-4 mr-2" />
              Filtrar Peças
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLimparFiltro}
              className="h-11 px-6"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados do Filtro */}
      {mostrarResultados && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <Package className="h-4 w-4 text-white" />
                </div>
                Resultados da Busca
              </span>
              <Badge className="bg-emerald-500 text-white px-3 py-1">
                {pecasFiltradas.length} peças encontradas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pecasFiltradas.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">Nenhuma peça encontrada</p>
                <p className="text-sm">Tente ajustar os filtros selecionados</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-slate-100">
                  {pecasFiltradas.map((peca) => {
                    const TipoIcon = tipoIcons[peca.tipoVeiculo];
                    return (
                      <div
                        key={peca.id}
                        className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${tipoBgColors[peca.tipoVeiculo]}`}>
                            <TipoIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{peca.descricao}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                              <span className="font-medium text-blue-600">{peca.codigo}</span>
                              <span>•</span>
                              <span>{getMarcaNome(peca.marcaId)}</span>
                              <span>•</span>
                              <span>{getCorNome(peca.corId)}</span>
                              <span>•</span>
                              <span>{peca.ano}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <span>{getDepositoNome(peca.depositoId)}</span>
                              <span>•</span>
                              <span>{getLocalizacaoNome(peca.localizacaoId)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(peca.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
