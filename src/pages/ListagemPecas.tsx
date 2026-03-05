import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Package,
  Search,
  QrCode,
  Trash2,
  Eye,
  ShoppingCart,
  Car,
  Bike,
  Download,
  Printer,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import type { Peca, TipoVeiculo } from '@/types';

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

export default function ListagemPecas() {
  const { pecas, marcas, cores, depositos, localizacoes, darBaixaPeca, removerPeca } = useData();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const pecasFiltradas = pecas.filter((peca) => {
    const matchBusca =
      peca.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      peca.codigo.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || peca.status === filtroStatus;
    
    return matchBusca && matchStatus;
  });

  const handleDarBaixa = () => {
    if (!pecaSelecionada) return;
    darBaixaPeca(pecaSelecionada.id);
    toast.success('Peça marcada com baixa no estoque!');
    setShowDetailModal(false);
    setPecaSelecionada(null);
  };

  const handleRemover = () => {
    if (!pecaSelecionada) return;
    
    if (confirm('Tem certeza que deseja remover esta peça?')) {
      removerPeca(pecaSelecionada.id);
      toast.success('Peça removida com sucesso!');
      setShowDetailModal(false);
      setPecaSelecionada(null);
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Todas as Peças</h1>
        <p className="text-sm text-slate-500">Gerencie o estoque de peças</p>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por código, descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-48 h-11">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="disponivel">✅ Disponível</SelectItem>
                <SelectItem value="vendido">📦 Baixa</SelectItem>
                <SelectItem value="reservado">⏳ Reservado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Package className="h-4 w-4 text-white" />
              </div>
              Peças Cadastradas
            </span>
            <Badge className="bg-purple-500 text-white px-3 py-1">
              {pecasFiltradas.length} peças
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] w-full">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pecasFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                        <Package className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                        <p>Nenhuma peça encontrada</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    pecasFiltradas.map((peca) => {
                      const TipoIcon = tipoIcons[peca.tipoVeiculo];
                      return (
                        <TableRow key={peca.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${tipoColors[peca.tipoVeiculo]}`}>
                                <TipoIcon className="h-3.5 w-3.5" />
                              </div>
                              {peca.codigo}
                            </div>
                          </TableCell>
                          <TableCell>{peca.descricao}</TableCell>
                          <TableCell>{getMarcaNome(peca.marcaId)}</TableCell>
                          <TableCell>
                            <span className="text-xs text-slate-500">
                              {getDepositoNome(peca.depositoId)} • {getLocalizacaoNome(peca.localizacaoId)}
                            </span>
                          </TableCell>
                          <TableCell>{getStatusBadge(peca.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setPecaSelecionada(peca);
                                  setShowDetailModal(true);
                                }}
                                className="hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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
                                  onClick={() => {
                                    setPecaSelecionada(peca);
                                    setShowDetailModal(true);
                                  }}
                                  className="hover:bg-emerald-50 hover:text-emerald-600"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                Detalhes da Peça
              </span>
              {pecaSelecionada && getStatusBadge(pecaSelecionada.status)}
            </DialogTitle>
          </DialogHeader>
          
          {pecaSelecionada && (
            <div className="space-y-6">
              {/* Fotos */}
              {pecaSelecionada.fotos.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">Fotos</h4>
                  <div className="flex flex-wrap gap-2">
                    {pecaSelecionada.fotos.map((foto, index) => (
                      <img
                        key={index}
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Informações */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Código</p>
                  <p className="font-semibold text-slate-900">{pecaSelecionada.codigo}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Data de Cadastro</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(pecaSelecionada.dataCadastro).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Descrição</p>
                  <p className="font-semibold text-slate-900">{pecaSelecionada.descricao}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Tipo de Veículo</p>
                  <p className="font-semibold text-slate-900 capitalize">{pecaSelecionada.tipoVeiculo}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Marca</p>
                  <p className="font-semibold text-slate-900">{getMarcaNome(pecaSelecionada.marcaId)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Cor</p>
                  <p className="font-semibold text-slate-900">{getCorNome(pecaSelecionada.corId)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Ano</p>
                  <p className="font-semibold text-slate-900">{pecaSelecionada.ano}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Depósito</p>
                  <p className="font-semibold text-slate-900">{getDepositoNome(pecaSelecionada.depositoId)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Localização</p>
                  <p className="font-semibold text-slate-900">{getLocalizacaoNome(pecaSelecionada.localizacaoId)}</p>
                </div>
                {pecaSelecionada.dataVenda && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">Data da Baixa</p>
                    <p className="font-semibold text-blue-900">
                      {new Date(pecaSelecionada.dataVenda).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                {pecaSelecionada.observacoes && (
                  <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Observações</p>
                    <p className="font-semibold text-slate-900">{pecaSelecionada.observacoes}</p>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowQRModal(true);
                  }}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Gerar QR Code
                </Button>
                {pecaSelecionada.status === 'disponivel' && (
                  <Button
                    className="flex-1 gradient-success"
                    onClick={handleDarBaixa}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Dar Baixa
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleRemover}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
