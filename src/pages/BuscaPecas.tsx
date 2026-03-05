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
  Calendar,
  RotateCcw,
  QrCode,
  ShoppingCart,
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
import { MARCAS_POR_TIPO, type Peca, type FiltroPecas } from '@/types';

export default function BuscaPecas() {
  const { filtrarPecas, darBaixaPeca } = useData();
  const [filtro, setFiltro] = useState<FiltroPecas>({
    tipoVeiculo: 'todos',
    marca: 'todas-marcas',
    status: 'todos',
    deposito: 'todos',
    setor: '',
    periodoInicio: '',
    periodoFim: '',
  });
  const [pecasFiltradas, setPecasFiltradas] = useState<Peca[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrType, setQrType] = useState<'peca' | 'localizacao'>('peca');

  const marcasDisponiveis = filtro.tipoVeiculo && filtro.tipoVeiculo !== 'todos'
    ? (MARCAS_POR_TIPO[filtro.tipoVeiculo] || [])
    : [];

  const handleBuscar = () => {
    const resultado = filtrarPecas(filtro);
    setPecasFiltradas(resultado);
    setMostrarResultados(true);
  };

  const handleLimpar = () => {
    setFiltro({
      tipoVeiculo: 'todos',
      marca: 'todas-marcas',
      status: 'todos',
      deposito: 'todos',
      setor: '',
      periodoInicio: '',
      periodoFim: '',
    });
    setMostrarResultados(false);
    setPecasFiltradas([]);
  };

  const handleDarBaixa = (peca: Peca) => {
    if (confirm('Deseja marcar esta peça como vendida?')) {
      darBaixaPeca(peca.id);
      // Atualiza a lista
      const resultado = filtrarPecas(filtro);
      setPecasFiltradas(resultado);
    }
  };

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

  const getQRCodeData = () => {
    if (!pecaSelecionada) return '';
    
    if (qrType === 'peca') {
      return JSON.stringify({
        tipo: 'peca',
        id: pecaSelecionada.id,
        codigo: pecaSelecionada.codigo,
        descricao: pecaSelecionada.descricao,
        deposito: pecaSelecionada.deposito,
        setor: pecaSelecionada.setor,
        localizacao: pecaSelecionada.localizacao,
      });
    } else {
      return JSON.stringify({
        tipo: 'localizacao',
        deposito: pecaSelecionada.deposito,
        setor: pecaSelecionada.setor,
        localizacao: pecaSelecionada.localizacao,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Buscar Peças</h1>
        <p className="text-slate-500">Pesquise peças por diversos critérios</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  <SelectValue placeholder="Todos" />
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
                  <SelectValue placeholder="Todas" />
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
                  <SelectValue placeholder="Todos" />
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
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Depósito
              </Label>
              <Select
                value={filtro.deposito}
                onValueChange={(value) => setFiltro({ ...filtro, deposito: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
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
                Data Início
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
                Data Fim
              </Label>
              <Input
                type="date"
                value={filtro.periodoFim}
                onChange={(e) => setFiltro({ ...filtro, periodoFim: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleBuscar} className="flex-1">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Resultados
              </span>
              <Badge variant="secondary">{pecasFiltradas.length} encontradas</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pecasFiltradas.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Search className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Nenhuma peça encontrada com os filtros selecionados</p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {pecasFiltradas.map((peca) => (
                    <div
                      key={peca.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {peca.fotos.length > 0 ? (
                          <img
                            src={peca.fotos[0]}
                            alt={peca.descricao}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{peca.descricao}</p>
                          <p className="text-sm text-slate-500">
                            {peca.codigo} • {peca.marca} • {peca.ano}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <Building2 className="h-3 w-3" />
                            {peca.deposito === 'deposito1' ? 'Depósito 1' : 'Depósito 2'}
                            <span className="mx-1">•</span>
                            <MapPin className="h-3 w-3" />
                            Setor {peca.setor}
                          </p>
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
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        {peca.status === 'disponivel' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDarBaixa(peca)}
                          >
                            <ShoppingCart className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
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
              <QrCode className="h-5 w-5" />
              QR Code
            </DialogTitle>
          </DialogHeader>
          
          {pecaSelecionada && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={qrType === 'peca' ? 'default' : 'outline'}
                  onClick={() => setQrType('peca')}
                  className="flex-1"
                >
                  Peça Individual
                </Button>
                <Button
                  variant={qrType === 'localizacao' ? 'default' : 'outline'}
                  onClick={() => setQrType('localizacao')}
                  className="flex-1"
                >
                  Localização
                </Button>
              </div>

              <div className="flex flex-col items-center p-6 bg-white rounded-lg">
                <QRCodeSVG
                  value={getQRCodeData()}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <p className="mt-4 text-sm text-slate-500 text-center">
                  {qrType === 'peca' ? (
                    <>
                      <span className="font-medium">{pecaSelecionada.codigo}</span>
                      <br />
                      {pecaSelecionada.descricao}
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Localização</span>
                      <br />
                      {pecaSelecionada.deposito === 'deposito1' ? 'Depósito 1' : 'Depósito 2'} - 
                      Setor {pecaSelecionada.setor}
                      <br />
                      {pecaSelecionada.localizacao}
                    </>
                  )}
                </p>
              </div>

              <Button
                onClick={() => window.print()}
                variant="outline"
                className="w-full"
              >
                Imprimir QR Code
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
