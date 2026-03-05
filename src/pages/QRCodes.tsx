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
  QrCode,
  Search,
  Package,
  MapPin,
  Building2,
  Download,
  Printer,
  Copy,
  Car,
  Bike,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

export default function QRCodes() {
  const { pecas, marcas, cores, depositos, localizacoes } = useData();
  const [modo, setModo] = useState<'individual' | 'localizacao'>('individual');
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  const [busca, setBusca] = useState('');
  const [localizacaoConfig, setLocalizacaoConfig] = useState({
    depositoId: '',
    localizacaoId: '',
  });

  const pecasFiltradas = pecas.filter(
    (p) =>
      p.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busca.toLowerCase())
  );

  const getQRData = () => {
    if (modo === 'individual' && pecaSelecionada) {
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
    } else if (modo === 'localizacao' && localizacaoConfig.localizacaoId) {
      const deposito = depositos.find(d => d.id === localizacaoConfig.depositoId)?.nome || '';
      const localizacao = localizacoes.find(l => l.id === localizacaoConfig.localizacaoId)?.nome || '';
      
      return JSON.stringify({
        tipo: 'localizacao',
        deposito,
        localizacao,
      }, null, 2);
    }
    return '';
  };

  const handleCopiar = () => {
    navigator.clipboard.writeText(getQRData());
    toast.success('Dados copiados para a área de transferência!');
  };

  const handleImprimir = () => {
    window.print();
  };

  const getQRTitle = () => {
    if (modo === 'individual' && pecaSelecionada) {
      return pecaSelecionada.codigo;
    } else if (modo === 'localizacao' && localizacaoConfig.localizacaoId) {
      const loc = localizacoes.find(l => l.id === localizacaoConfig.localizacaoId);
      return loc?.nome || 'Localização';
    }
    return '';
  };

  const getQRSubtitle = () => {
    if (modo === 'individual' && pecaSelecionada) {
      return pecaSelecionada.descricao;
    } else if (modo === 'localizacao' && localizacaoConfig.localizacaoId) {
      const dep = depositos.find(d => d.id === localizacaoConfig.depositoId);
      return dep?.nome || '';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient">QR Codes</h1>
        <p className="text-slate-500">Gere QR codes para peças ou localizações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-orange-500 p-2 rounded-lg">
                <QrCode className="h-4 w-4 text-white" />
              </div>
              Configuração
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Tipo de QR Code</Label>
              <div className="flex gap-2">
                <Button
                  variant={modo === 'individual' ? 'default' : 'outline'}
                  onClick={() => setModo('individual')}
                  className={`flex-1 ${modo === 'individual' ? 'gradient-primary' : ''}`}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Peça Individual
                </Button>
                <Button
                  variant={modo === 'localizacao' ? 'default' : 'outline'}
                  onClick={() => setModo('localizacao')}
                  className={`flex-1 ${modo === 'localizacao' ? 'gradient-primary' : ''}`}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Localização
                </Button>
              </div>
            </div>

            {modo === 'individual' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Buscar Peça</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Digite código ou descrição..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {busca && pecasFiltradas.length > 0 && (
                  <div className="border rounded-xl max-h-48 overflow-y-auto">
                    {pecasFiltradas.map((peca) => {
                      const TipoIcon = tipoIcons[peca.tipoVeiculo];
                      return (
                        <button
                          key={peca.id}
                          onClick={() => {
                            setPecaSelecionada(peca);
                            setBusca('');
                          }}
                          className="w-full text-left p-3 hover:bg-slate-50 border-b last:border-b-0 transition-colors flex items-center gap-3"
                        >
                          <div className={`p-2 rounded-lg ${tipoColors[peca.tipoVeiculo]}`}>
                            <TipoIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{peca.descricao}</p>
                            <p className="text-xs text-slate-500">{peca.codigo}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {pecaSelecionada && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <p className="font-semibold text-emerald-900">Peça selecionada:</p>
                    <p className="text-sm text-emerald-800">{pecaSelecionada.descricao}</p>
                    <p className="text-xs text-emerald-700">{pecaSelecionada.codigo}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-emerald-700 hover:text-emerald-900"
                      onClick={() => setPecaSelecionada(null)}
                    >
                      Remover seleção
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Depósito
                  </Label>
                  <Select
                    value={localizacaoConfig.depositoId}
                    onValueChange={(value) =>
                      setLocalizacaoConfig({ depositoId: value, localizacaoId: '' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o depósito" />
                    </SelectTrigger>
                    <SelectContent>
                      {depositos.map((dep) => (
                        <SelectItem key={dep.id} value={dep.id}>
                          {dep.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização
                  </Label>
                  <Select
                    value={localizacaoConfig.localizacaoId}
                    onValueChange={(value) =>
                      setLocalizacaoConfig({ ...localizacaoConfig, localizacaoId: value })
                    }
                    disabled={!localizacaoConfig.depositoId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a localização" />
                    </SelectTrigger>
                    <SelectContent>
                      {localizacoes
                        .filter(l => l.depositoId === localizacaoConfig.depositoId)
                        .map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visualização do QR Code */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <QrCode className="h-4 w-4 text-white" />
                </div>
                QR Code Gerado
              </span>
              {(pecaSelecionada || (modo === 'localizacao' && localizacaoConfig.localizacaoId)) && (
                <Badge className="bg-emerald-500 text-white">Pronto</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {(modo === 'individual' && pecaSelecionada) ||
            (modo === 'localizacao' && localizacaoConfig.localizacaoId) ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-200">
                  <QRCodeSVG
                    value={getQRData()}
                    size={250}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="mt-4 text-center">
                    <p className="font-bold text-xl text-slate-900">{getQRTitle()}</p>
                    <p className="text-sm text-slate-500">{getQRSubtitle()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" onClick={handleCopiar}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                  <Button variant="outline" onClick={handleImprimir}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([getQRData()], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${getQRTitle()}.json`;
                      a.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium">Dados do QR Code:</p>
                  <pre className="text-xs text-slate-400 break-all mt-1 max-h-32 overflow-auto">
                    {getQRData()}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <QrCode className="h-20 w-20 mx-auto mb-4 opacity-50" />
                <p className="text-lg">
                  {modo === 'individual'
                    ? 'Selecione uma peça para gerar o QR Code'
                    : 'Preencha os dados da localização'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* QR Codes Recentes */}
      {modo === 'individual' && pecas.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Package className="h-4 w-4 text-white" />
              </div>
              QR Codes Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pecas.slice(0, 12).map((peca) => (
                <div
                  key={peca.id}
                  onClick={() => setPecaSelecionada(peca)}
                  className="cursor-pointer p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all hover:shadow-lg text-center"
                >
                  <QRCodeSVG
                    value={JSON.stringify({
                      tipo: 'peca',
                      id: peca.id,
                      codigo: peca.codigo,
                      descricao: peca.descricao,
                    })}
                    size={80}
                    level="L"
                    className="mx-auto"
                  />
                  <p className="text-xs font-semibold mt-2 truncate text-slate-700">{peca.codigo}</p>
                  <p className="text-xs text-slate-500 truncate">{peca.descricao}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
