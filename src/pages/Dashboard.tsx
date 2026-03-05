import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  ShoppingCart,
  Warehouse,
  Calendar,
  Search,
  RotateCcw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { MARCAS_POR_TIPO, type Peca, type FiltroPecas } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Dashboard() {
  const { getEstatisticas, filtrarPecas } = useData();
  const [filtro, setFiltro] = useState<FiltroPecas>({
    tipoVeiculo: 'todos',
    marca: 'todas-marcas',
    status: 'todos',
    deposito: 'todos',
    periodoInicio: '',
    periodoFim: '',
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
      marca: 'todas-marcas',
      status: 'todos',
      deposito: 'todos',
      periodoInicio: '',
      periodoFim: '',
    });
    setMostrarResultados(false);
    setPecasFiltradas([]);
  };

  const marcasDisponiveis = filtro.tipoVeiculo && filtro.tipoVeiculo !== 'todos'
    ? (MARCAS_POR_TIPO[filtro.tipoVeiculo] || [])
    : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disponivel':
        return <Badge className="bg-green-500">Disponível</Badge>;
      case 'vendido':
        return <Badge className="bg-blue-500">Vendido</Badge>;
      case 'reservado':
        return <Badge className="bg-yellow-500">Reservado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getTipoVeiculoLabel = (tipo: string) => {
    switch (tipo) {
      case 'carro': return 'Carro';
      case 'moto': return 'Moto';
      case 'bicicleta': return 'Bicicleta';
      default: return tipo;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Visão geral do estoque e peças</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total de Peças
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-slate-500">Peças cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Peças Vendidas
            </CardTitle>
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vendidas}</div>
            <p className="text-xs text-slate-500">Total de vendas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Disponíveis
            </CardTitle>
            <div className="bg-green-500/10 p-2 rounded-lg">
              <Warehouse className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.disponiveis}</div>
            <p className="text-xs text-slate-500">Em estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Taxa de Venda
            </CardTitle>
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.vendidas / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-slate-500">Conversão</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtro Avançado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtro Avançado de Peças
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Veículo</Label>
              <Select
                value={filtro.tipoVeiculo}
                onValueChange={(value) =>
                  setFiltro({ ...filtro, tipoVeiculo: value as any, marca: '' })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="carro">Carro</SelectItem>
                  <SelectItem value="moto">Moto</SelectItem>
                  <SelectItem value="bicicleta">Bicicleta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Marca</Label>
              <Select
                value={filtro.marca}
                onValueChange={(value) => setFiltro({ ...filtro, marca: value })}
                disabled={!filtro.tipoVeiculo || filtro.tipoVeiculo === 'todos'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas-marcas">Todas</SelectItem>
                  {(marcasDisponiveis || []).map((marca) => (
                    <SelectItem key={marca} value={marca || "sem-marca"}>
                      {marca}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filtro.status}
                onValueChange={(value) => setFiltro({ ...filtro, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Depósito</Label>
              <Select
                value={filtro.deposito}
                onValueChange={(value) => setFiltro({ ...filtro, deposito: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o depósito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="deposito1">Depósito 1</SelectItem>
                  <SelectItem value="deposito2">Depósito 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Período Início
              </Label>
              <Input
                type="date"
                value={filtro.periodoInicio}
                onChange={(e) => setFiltro({ ...filtro, periodoInicio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Período Fim
              </Label>
              <Input
                type="date"
                value={filtro.periodoFim}
                onChange={(e) => setFiltro({ ...filtro, periodoFim: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleFiltrar} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" onClick={handleLimparFiltro}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados do Filtro */}
      {mostrarResultados && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resultados da Busca</span>
              <Badge variant="secondary">{pecasFiltradas.length} peças encontradas</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pecasFiltradas.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Nenhuma peça encontrada com os filtros selecionados</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {pecasFiltradas.map((peca) => (
                    <div
                      key={peca.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg">
                          <Package className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{peca.descricao}</p>
                          <p className="text-sm text-slate-500">
                            {peca.codigo} • {getTipoVeiculoLabel(peca.tipoVeiculo)} • {peca.marca}
                          </p>
                          <p className="text-xs text-slate-400">
                            {peca.deposito === 'deposito1' ? 'Depósito 1' : 'Depósito 2'} • 
                            Setor {peca.setor} • {peca.localizacao}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(peca.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
