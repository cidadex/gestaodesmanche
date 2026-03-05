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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { SETORES, type Peca } from '@/types';

export default function QRCodes() {
  const { pecas } = useData();
  const [modo, setModo] = useState<'individual' | 'localizacao'>('individual');
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  const [busca, setBusca] = useState('');
  const [localizacaoConfig, setLocalizacaoConfig] = useState({
    deposito: 'deposito1' as const,
    setor: '',
    localizacao: '',
  });

  const pecasFiltradas = pecas.filter(
    (p) =>
      p.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busca.toLowerCase())
  );

  const getQRData = () => {
    if (modo === 'individual' && pecaSelecionada) {
      return JSON.stringify({
        tipo: 'peca',
        id: pecaSelecionada.id,
        codigo: pecaSelecionada.codigo,
        descricao: pecaSelecionada.descricao,
        deposito: pecaSelecionada.deposito,
        setor: pecaSelecionada.setor,
        localizacao: pecaSelecionada.localizacao,
      });
    } else if (modo === 'localizacao') {
      return JSON.stringify({
        tipo: 'localizacao',
        deposito: localizacaoConfig.deposito,
        setor: localizacaoConfig.setor,
        localizacao: localizacaoConfig.localizacao,
      });
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
    } else if (modo === 'localizacao') {
      return `Setor ${localizacaoConfig.setor || '?'}`;
    }
    return '';
  };

  const getQRSubtitle = () => {
    if (modo === 'individual' && pecaSelecionada) {
      return pecaSelecionada.descricao;
    } else if (modo === 'localizacao') {
      return `${localizacaoConfig.deposito === 'deposito1' ? 'Depósito 1' : 'Depósito 2'}${localizacaoConfig.localizacao ? ' - ' + localizacaoConfig.localizacao : ''}`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">QR Codes</h1>
        <p className="text-slate-500">Gere QR codes para peças ou localizações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Configuração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de QR Code</Label>
              <div className="flex gap-2">
                <Button
                  variant={modo === 'individual' ? 'default' : 'outline'}
                  onClick={() => setModo('individual')}
                  className="flex-1"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Peça Individual
                </Button>
                <Button
                  variant={modo === 'localizacao' ? 'default' : 'outline'}
                  onClick={() => setModo('localizacao')}
                  className="flex-1"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Localização
                </Button>
              </div>
            </div>

            {modo === 'individual' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Buscar Peça</Label>
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
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {pecasFiltradas.map((peca) => (
                      <button
                        key={peca.id}
                        onClick={() => {
                          setPecaSelecionada(peca);
                          setBusca('');
                        }}
                        className="w-full text-left p-3 hover:bg-slate-50 border-b last:border-b-0 transition-colors"
                      >
                        <p className="font-medium text-sm">{peca.descricao}</p>
                        <p className="text-xs text-slate-500">
                          {peca.codigo} • {peca.marca}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {pecaSelecionada && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-medium text-green-900">Peça selecionada:</p>
                    <p className="text-sm text-green-800">{pecaSelecionada.descricao}</p>
                    <p className="text-xs text-green-700">{pecaSelecionada.codigo}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-green-700"
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
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Depósito
                  </Label>
                  <Select
                    value={localizacaoConfig.deposito}
                    onValueChange={(value) =>
                      setLocalizacaoConfig({ ...localizacaoConfig, deposito: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposito1">Depósito 1</SelectItem>
                      <SelectItem value="deposito2">Depósito 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Select
                    value={localizacaoConfig.setor}
                    onValueChange={(value) =>
                      setLocalizacaoConfig({ ...localizacaoConfig, setor: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {(SETORES || []).map((setor) => (
                        <SelectItem key={setor} value={setor || "sem-setor"}>
                          Setor {setor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização Específica</Label>
                  <Input
                    id="localizacao"
                    placeholder="Ex: Prateleira A3, Box 12..."
                    value={localizacaoConfig.localizacao}
                    onChange={(e) =>
                      setLocalizacaoConfig({ ...localizacaoConfig, localizacao: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visualização do QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Gerado
              </span>
              {(pecaSelecionada || (modo === 'localizacao' && localizacaoConfig.setor)) && (
                <Badge variant="secondary">Pronto</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(modo === 'individual' && pecaSelecionada) ||
            (modo === 'localizacao' && localizacaoConfig.setor) ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg border-2 border-dashed border-slate-200">
                  <QRCodeSVG
                    value={getQRData()}
                    size={250}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="mt-4 text-center">
                    <p className="font-bold text-lg">{getQRTitle()}</p>
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
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium">Dados do QR Code:</p>
                  <p className="text-xs text-slate-400 break-all mt-1">{getQRData()}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <QrCode className="h-16 w-16 mx-auto mb-4" />
                <p>
                  {modo === 'individual'
                    ? 'Selecione uma peça para gerar o QR Code'
                    : 'Preencha os dados da localização'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* QR Codes em Massa */}
      {modo === 'individual' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              QR Codes Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pecas.slice(0, 12).map((peca) => (
                <div
                  key={peca.id}
                  onClick={() => setPecaSelecionada(peca)}
                  className="cursor-pointer p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-center"
                >
                  <QRCodeSVG
                    value={JSON.stringify({
                      tipo: 'peca',
                      id: peca.id,
                      codigo: peca.codigo,
                      descricao: peca.descricao,
                      deposito: peca.deposito,
                      setor: peca.setor,
                      localizacao: peca.localizacao,
                    })}
                    size={80}
                    level="L"
                    className="mx-auto"
                  />
                  <p className="text-xs font-medium mt-2 truncate">{peca.codigo}</p>
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
