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
  Search,
  Package,
  MapPin,
  Building2,
  RotateCcw,
  QrCode,
  ShoppingCart,
  Car,
  Bike,
  Download,
  Printer,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import type { Peca, FiltroPecas, TipoVeiculo } from '@/types';

const tipoIcons: Record<TipoVeiculo, typeof Car> = {
  carro: Car,
  moto: Bike,
  bicicleta: Bike,
};

const tipoColors: Record<TipoVeiculo, string> = {
  carro: 'bg-blue-500/10 text-blue-600',
  moto: 'bg-purple-500/10 text-purple-600',
  bicicleta: 'bg-emerald-500/10 text-emerald-600',
};

export default function BuscaPecas() {
  const { marcas, cores, depositos, localizacoes, filtrarPecas, darBaixaPeca } = useData();
  const [filtro, setFiltro] = useState<FiltroPecas>({
    tipoVeiculo: 'todos',
    marcaId: '',
    corId: '',
    status: 'todos',
    depositoId: '',
    localizacaoId: '',
    busca: '',
  });
  const [pecasFiltradas, setPecasFiltradas] = useState<Peca[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const handleBuscar = () => {
    const resultado = filtrarPecas(filtro);
    setPecasFiltradas(resultado);
    setMostrarResultados(true);
  };

  const handleLimpar = () => {
    setFiltro({
      tipoVeiculo: 'todos',
      marcaId: '',
      corId: '',
      status: 'todos',
      depositoId: '',
      localizacaoId: '',
      busca: '',
    });
    setMostrarResultados(false);
    setPecasFiltradas([]);
  };

  const handleDarBaixa = (peca: Peca) => {
    if (confirm('Deseja marcar esta peça com baixa no estoque?')) {
      darBaixaPeca(peca.id);
      const resultado = filtrarPecas(filtro);
      setPecasFiltradas(resultado);
    }
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

  const getQRCodeData = () => {
    if (!pecaSelecionada) return '';
    
    const marca = marcas.find(m => m.id === pecaSelecionada.marcaId)?.nome || '';
    const cor = cores.find(c => c.id === pecaSelecionada.corId)?.nome || '';
    const deposito = depositos.find(d => d.id === pecaSelecionada.depositoId)?.nome || '';
    const localizacao = localizacoes.find(l => l.id === pecaSelecionada.localizacaoId)?.nome || '';
    
    return JSON.stringify({
      tipo: 'peca',
      id: pecaSelecionada.id,
      codigo: pecaSelecionada.codigo,
      descricao: pecaSelecionada.descricao,
      tipoVeiculo: pecaSelecionada.tipoVeiculo,
      marca,
      cor,
      ano: pecaSelecionada.ano,
      deposito,
      localizacao,
      observacoes: pecaSelecionada.observacoes,
      dataCadastro: pecaSelecionada.dataCadastro,
      status: pecaSelecionada.status,
    }, null, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Buscar Peças</h1>
        <p className="text-sm text-slate-500">Pesquise peças por diversos critérios</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="bg-cyan-500 p-2 rounded-lg">
              <Search className="h-4 w-4 text-white" />
            </div>
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Busca Rápida</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Código ou descrição..."
                  value={filtro.busca}
                  onChange={(e) => setFiltro({ ...filtro, busca: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Tipo de Veículo</Label>
              <Select
                value={filtro.tipoVeiculo}
                onValueChange={(value) =>
                  setFiltro({ ...filtro, tipoVeiculo: value as any, marcaId: '' })
                }
              >
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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
              <Label className="text-slate-700 font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Depósito
              </Label>
              <Select
                value={filtro.depositoId}
                onValueChange={(value) => setFiltro({ ...filtro, depositoId: value, localizacaoId: '' })}
              >
                <SelectTrigger>
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
          </div>

          <div className="flex gap-3">
            <Button onClick={handleBuscar} className="flex-1 gradient-primary btn-glow">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" onClick={handleLimpar}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {mostrarResultados && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <Package className="h-4 w-4 text-white" />
                </div>
                Resultados
              </span>
              <Badge className="bg-emerald-500 text-white px-3 py-1">
                {pecasFiltradas.length} encontradas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pecasFiltradas.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Search className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">Nenhuma peça encontrada</p>
                <p className="text-sm">Tente ajustar os filtros selecionados</p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-slate-100">
                  {pecasFiltradas.map((peca) => {
                    const TipoIcon = tipoIcons[peca.tipoVeiculo];
                    return (
                      <div
                        key={peca.id}
                        className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          {peca.fotos.length > 0 ? (
                            <img
                              src={peca.fotos[0]}
                              alt={peca.descricao}
                              className="w-16 h-16 object-cover rounded-xl"
                            />
                          ) : (
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${tipoColors[peca.tipoVeiculo]}`}>
                              <TipoIcon className="h-6 w-6" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{peca.descricao}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                              <span className="font-medium text-blue-600">{peca.codigo}</span>
                              <span>•</span>
                              <span>{getMarcaNome(peca.marcaId)}</span>
                              <span>•</span>
                              <span>{getCorNome(peca.corId)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <Building2 className="h-3 w-3" />
                              {getDepositoNome(peca.depositoId)}
                              <span>•</span>
                              <MapPin className="h-3 w-3" />
                              {getLocalizacaoNome(peca.localizacaoId)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(peca.status)}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPecaSelecionada(peca);
                              setShowQRModal(true);
                            }}
                            className="hover:bg-purple-50 hover:text-purple-600"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          {peca.status === 'disponivel' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDarBaixa(peca)}
                              className="hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* Modal de QR Code */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <QrCode className="h-4 w-4 text-white" />
              </div>
              QR Code da Peça
            </DialogTitle>
          </DialogHeader>
          
          {pecaSelecionada && (
            <div className="space-y-4">
              <div className="flex flex-col items-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                <QRCodeSVG
                  value={getQRCodeData()}
                  size={220}
                  level="H"
                  includeMargin={true}
                />
                <div className="mt-4 text-center">
                  <p className="font-bold text-lg text-slate-900">{pecaSelecionada.codigo}</p>
                  <p className="text-sm text-slate-500">{pecaSelecionada.descricao}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-2">Dados completos:</p>
                <pre className="text-xs text-slate-600 bg-white p-3 rounded-lg overflow-auto max-h-40">
                  {getQRCodeData()}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => window.print()} 
                  variant="outline" 
                  className="flex-1 h-11"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button 
                  onClick={() => {
                    const blob = new Blob([getQRCodeData()], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${pecaSelecionada.codigo}.json`;
                    a.click();
                  }} 
                  variant="outline" 
                  className="flex-1 h-11"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Salvar JSON
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
