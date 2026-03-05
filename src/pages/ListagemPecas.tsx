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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Package,
  Search,
  QrCode,
  DollarSign,
  Trash2,
  Eye,
  ShoppingCart,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import type { Peca } from '@/types';

export default function ListagemPecas() {
  const { pecas, darBaixaPeca, removerPeca } = useData();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBaixaModal, setShowBaixaModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [valorVenda, setValorVenda] = useState('');
  const [qrType, setQrType] = useState<'peca' | 'localizacao'>('peca');

  const pecasFiltradas = pecas.filter((peca) => {
    const matchBusca =
      peca.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      peca.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      peca.marca.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || peca.status === filtroStatus;
    
    return matchBusca && matchStatus;
  });

  const handleDarBaixa = () => {
    if (!pecaSelecionada) return;
    
    const valor = valorVenda ? parseFloat(valorVenda) : undefined;
    darBaixaPeca(pecaSelecionada.id, valor);
    toast.success('Peça marcada como vendida!');
    setShowBaixaModal(false);
    setValorVenda('');
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
        <h1 className="text-2xl font-bold text-slate-900">Todas as Peças</h1>
        <p className="text-slate-500">Gerencie o estoque de peças</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por código, descrição ou marca..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Peças Cadastradas
            </span>
            <Badge variant="secondary">{pecasFiltradas.length} peças</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
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
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Nenhuma peça encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  pecasFiltradas.map((peca) => (
                    <TableRow key={peca.id}>
                      <TableCell className="font-medium">{peca.codigo}</TableCell>
                      <TableCell>{peca.descricao}</TableCell>
                      <TableCell>{peca.marca}</TableCell>
                      <TableCell>
                        <span className="text-xs">
                          {peca.deposito === 'deposito1' ? 'Dep 1' : 'Dep 2'} - 
                          {peca.setor}
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
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {peca.status === 'disponivel' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setPecaSelecionada(peca);
                                setShowBaixaModal(true);
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Detalhes da Peça</span>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Código</p>
                  <p className="font-medium">{pecaSelecionada.codigo}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Data de Cadastro</p>
                  <p className="font-medium">
                    {new Date(pecaSelecionada.dataCadastro).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">Descrição</p>
                  <p className="font-medium">{pecaSelecionada.descricao}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tipo de Veículo</p>
                  <p className="font-medium capitalize">{pecaSelecionada.tipoVeiculo}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Marca</p>
                  <p className="font-medium">{pecaSelecionada.marca}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Cor</p>
                  <p className="font-medium">{pecaSelecionada.cor || 'Não informada'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Ano</p>
                  <p className="font-medium">{pecaSelecionada.ano}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Depósito</p>
                  <p className="font-medium">
                    {pecaSelecionada.deposito === 'deposito1' ? 'Depósito 1' : 'Depósito 2'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Setor</p>
                  <p className="font-medium">{pecaSelecionada.setor}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">Localização</p>
                  <p className="font-medium">{pecaSelecionada.localizacao}</p>
                </div>
                {pecaSelecionada.valor && (
                  <div>
                    <p className="text-sm text-slate-500">Valor de Venda</p>
                    <p className="font-medium text-green-600">
                      R$ {pecaSelecionada.valor.toFixed(2)}
                    </p>
                  </div>
                )}
                {pecaSelecionada.dataVenda && (
                  <div>
                    <p className="text-sm text-slate-500">Data da Venda</p>
                    <p className="font-medium">
                      {new Date(pecaSelecionada.dataVenda).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                {pecaSelecionada.observacoes && (
                  <div className="col-span-2">
                    <p className="text-sm text-slate-500">Observações</p>
                    <p className="font-medium">{pecaSelecionada.observacoes}</p>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowQRModal(true);
                  }}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Ver QR Code
                </Button>
                {pecaSelecionada.status === 'disponivel' && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowBaixaModal(true);
                    }}
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

      {/* Modal de Baixa */}
      <Dialog open={showBaixaModal} onOpenChange={setShowBaixaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Dar Baixa no Estoque
            </DialogTitle>
            <DialogDescription>
              Marque a peça como vendida. Informe o valor da venda (opcional).
            </DialogDescription>
          </DialogHeader>
          
          {pecaSelecionada && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="font-medium">{pecaSelecionada.descricao}</p>
                <p className="text-sm text-slate-500">{pecaSelecionada.codigo}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valor">Valor da Venda (opcional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={valorVenda}
                    onChange={(e) => setValorVenda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBaixaModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleDarBaixa}>
                  Confirmar Venda
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                  Peça
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
