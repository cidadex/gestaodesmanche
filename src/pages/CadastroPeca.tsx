import { useState, useRef } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Camera,
  Plus,
  X,
  Save,
  QrCode,
  Car,
  Download,
  Printer,
  MapPin,
  Building2,
  Palette,
  Tag,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Peca, TipoVeiculo } from '@/types';

export default function CadastroPeca() {
  const { adicionarPeca, marcas, cores, depositos, localizacoes, getMarcasPorTipo, getLocalizacoesPorDeposito } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    descricao: '',
    tipoVeiculo: 'carro' as TipoVeiculo,
    marcaId: '',
    corId: '',
    ano: new Date().getFullYear(),
    depositoId: '',
    localizacaoId: '',
    observacoes: '',
    fotos: [] as string[],
  });
  
  const [pecaCadastrada, setPecaCadastrada] = useState<Peca | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const marcasDisponiveis = getMarcasPorTipo(formData.tipoVeiculo);
  const localizacoesDisponiveis = formData.depositoId 
    ? getLocalizacoesPorDeposito(formData.depositoId)
    : [];

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          fotos: [...prev.fotos, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removerFoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.marcaId || !formData.depositoId || !formData.localizacaoId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const novaPeca = adicionarPeca({
      ...formData,
      status: 'disponivel',
    });

    setPecaCadastrada(novaPeca);
    toast.success('Peça cadastrada com sucesso!');
    
    // Mostrar QR Code automaticamente
    setShowQRModal(true);
    
    // Reset form
    setFormData({
      descricao: '',
      tipoVeiculo: 'carro',
      marcaId: '',
      corId: '',
      ano: new Date().getFullYear(),
      depositoId: '',
      localizacaoId: '',
      observacoes: '',
      fotos: [],
    });
  };

  const getQRCodeData = () => {
    if (!pecaCadastrada) return '';
    
    const marca = marcas.find(m => m.id === pecaCadastrada.marcaId)?.nome || '';
    const cor = cores.find(c => c.id === pecaCadastrada.corId)?.nome || '';
    const deposito = depositos.find(d => d.id === pecaCadastrada.depositoId)?.nome || '';
    const localizacao = localizacoes.find(l => l.id === pecaCadastrada.localizacaoId)?.nome || '';
    
    return JSON.stringify({
      tipo: 'peca',
      id: pecaCadastrada.id,
      codigo: pecaCadastrada.codigo,
      descricao: pecaCadastrada.descricao,
      tipoVeiculo: pecaCadastrada.tipoVeiculo,
      marca,
      cor,
      ano: pecaCadastrada.ano,
      deposito,
      localizacao,
      observacoes: pecaCadastrada.observacoes,
      dataCadastro: pecaCadastrada.dataCadastro,
    }, null, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Cadastrar Peça</h1>
        <p className="text-sm text-slate-500">Adicione uma nova peça ao sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Car className="h-4 w-4 text-white" />
                </div>
                Informações da Peça
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-slate-700 font-medium">
                  Descrição *
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva a peça (ex: Motor 1.6, Porta dianteira esquerda...)"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="min-h-[80px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Tipo *</Label>
                  <Select
                    value={formData.tipoVeiculo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tipoVeiculo: value as TipoVeiculo, marcaId: '' })
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carro">🚗 Carro</SelectItem>
                      <SelectItem value="moto">🏍️ Moto</SelectItem>
                      <SelectItem value="bicicleta">🚲 Bicicleta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Ano</Label>
                  <Input
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Marca *
                  </Label>
                  <Select
                    value={formData.marcaId}
                    onValueChange={(value) => setFormData({ ...formData, marcaId: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcasDisponiveis.map((marca) => (
                        <SelectItem key={marca.id} value={marca.id}>
                          {marca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Cor
                  </Label>
                  <Select
                    value={formData.corId}
                    onValueChange={(value) => setFormData({ ...formData, corId: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
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
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                Localização no Depósito
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Depósito *
                </Label>
                <Select
                  value={formData.depositoId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, depositoId: value, localizacaoId: '' })
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
                  Localização *
                </Label>
                <Select
                  value={formData.localizacaoId}
                  onValueChange={(value) => setFormData({ ...formData, localizacaoId: value })}
                  disabled={!formData.depositoId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a localização" />
                  </SelectTrigger>
                  <SelectContent>
                    {localizacoesDisponiveis.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-slate-700 font-medium">
                  Observações
                </Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre a peça..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fotos */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Camera className="h-4 w-4 text-white" />
              </div>
              Fotos da Peça
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFotoChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            
            <div className="flex flex-wrap gap-4">
              {formData.fotos.map((foto, index) => (
                <div key={index} className="relative group">
                  <img
                    src={foto}
                    alt={`Foto ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-xl border-2 border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => removerFoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-purple-500 hover:text-purple-500 transition-colors"
              >
                <Plus className="h-6 w-6" />
                <span className="text-xs mt-1">Adicionar</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Botão Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-14 gradient-primary btn-glow text-lg font-semibold"
        >
          <Save className="h-5 w-5 mr-2" />
          Cadastrar Peça
        </Button>
      </form>

      {/* Modal de QR Code - Aparece automaticamente após cadastro */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              QR Code Gerado
            </DialogTitle>
          </DialogHeader>
          
          {pecaCadastrada && (
            <div className="space-y-4">
              <div className="flex flex-col items-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                <QRCodeSVG
                  value={getQRCodeData()}
                  size={220}
                  level="H"
                  includeMargin={true}
                />
                <div className="mt-4 text-center">
                  <p className="font-bold text-lg text-slate-900">{pecaCadastrada.codigo}</p>
                  <p className="text-sm text-slate-500">{pecaCadastrada.descricao}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-2">Dados do QR Code:</p>
                <pre className="text-xs text-slate-600 bg-white p-3 rounded-lg overflow-auto max-h-32">
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
                    a.download = `${pecaCadastrada.codigo}.json`;
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
