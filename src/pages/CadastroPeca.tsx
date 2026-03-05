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
  Bike,
  MapPin,
  Building2
} from 'lucide-react';
import { MARCAS_POR_TIPO, SETORES, type Peca } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function CadastroPeca() {
  const { adicionarPeca } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    descricao: '',
    tipoVeiculo: 'carro' as const,
    marca: '',
    cor: '',
    ano: new Date().getFullYear(),
    deposito: 'deposito1' as const,
    setor: '',
    localizacao: '',
    observacoes: '',
    fotos: [] as string[],
  });
  
  const [pecaCadastrada, setPecaCadastrada] = useState<Peca | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrType, setQrType] = useState<'peca' | 'localizacao'>('peca');

  const marcasDisponiveis = MARCAS_POR_TIPO[formData.tipoVeiculo] || [];

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
    
    if (!formData.descricao || !formData.marca || !formData.setor || !formData.localizacao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const novaPeca = adicionarPeca({
      ...formData,
      status: 'disponivel',
    });

    setPecaCadastrada(novaPeca);
    toast.success('Peça cadastrada com sucesso!');
    
    // Reset form
    setFormData({
      descricao: '',
      tipoVeiculo: 'carro',
      marca: '',
      cor: '',
      ano: new Date().getFullYear(),
      deposito: 'deposito1',
      setor: '',
      localizacao: '',
      observacoes: '',
      fotos: [],
    });
  };

  const getQRCodeData = () => {
    if (!pecaCadastrada) return '';
    
    if (qrType === 'peca') {
      return JSON.stringify({
        tipo: 'peca',
        id: pecaCadastrada.id,
        codigo: pecaCadastrada.codigo,
        descricao: pecaCadastrada.descricao,
        deposito: pecaCadastrada.deposito,
        setor: pecaCadastrada.setor,
        localizacao: pecaCadastrada.localizacao,
      });
    } else {
      return JSON.stringify({
        tipo: 'localizacao',
        deposito: pecaCadastrada.deposito,
        setor: pecaCadastrada.setor,
        localizacao: pecaCadastrada.localizacao,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cadastrar Peça</h1>
        <p className="text-slate-500">Adicione uma nova peça ao sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Informações da Peça
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva a peça (ex: Motor 1.6, Porta dianteira esquerda...)"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Veículo *</Label>
                  <Select
                    value={formData.tipoVeiculo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tipoVeiculo: value as any, marca: '' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carro">
                        <span className="flex items-center gap-2">
                          <Car className="h-4 w-4" /> Carro
                        </span>
                      </SelectItem>
                      <SelectItem value="moto">
                        <span className="flex items-center gap-2">
                          <Bike className="h-4 w-4" /> Moto
                        </span>
                      </SelectItem>
                      <SelectItem value="bicicleta">
                        <span className="flex items-center gap-2">
                          <Bike className="h-4 w-4" /> Bicicleta
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Marca *</Label>
                  <Select
                    value={formData.marca}
                    onValueChange={(value) => setFormData({ ...formData, marca: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcasDisponiveis.map((marca) => (
                        <SelectItem key={marca} value={marca}>
                          {marca}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cor">Cor</Label>
                  <Input
                    id="cor"
                    placeholder="Ex: Prata, Preto..."
                    value={formData.cor}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ano">Ano</Label>
                  <Input
                    id="ano"
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização no Depósito
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Depósito *</Label>
                  <Select
                    value={formData.deposito}
                    onValueChange={(value) => setFormData({ ...formData, deposito: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposito1">
                        <span className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" /> Depósito 1
                        </span>
                      </SelectItem>
                      <SelectItem value="deposito2">
                        <span className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" /> Depósito 2
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Setor *</Label>
                  <Select
                    value={formData.setor}
                    onValueChange={(value) => setFormData({ ...formData, setor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {SETORES.map((setor) => (
                        <SelectItem key={setor} value={setor}>
                          Setor {setor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização Específica *</Label>
                <Input
                  id="localizacao"
                  placeholder="Ex: Prateleira A3, Box 12, Andar superior..."
                  value={formData.localizacao}
                  onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Fotos da Peça
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removerFoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-6 w-6" />
                <span className="text-xs mt-1">Adicionar</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" className="flex-1">
            <Save className="h-5 w-5 mr-2" />
            Cadastrar Peça
          </Button>
        </div>
      </form>

      {/* Modal de QR Code */}
      {pecaCadastrada && (
        <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Gerado
              </DialogTitle>
            </DialogHeader>
            
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
                      <span className="font-medium">{pecaCadastrada.codigo}</span>
                      <br />
                      {pecaCadastrada.descricao}
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Localização</span>
                      <br />
                      {pecaCadastrada.deposito === 'deposito1' ? 'Depósito 1' : 'Depósito 2'} - 
                      Setor {pecaCadastrada.setor}
                      <br />
                      {pecaCadastrada.localizacao}
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
          </DialogContent>
        </Dialog>
      )}

      {/* Botão para mostrar QR Code após cadastro */}
      {pecaCadastrada && !showQRModal && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900">
                  Peça cadastrada com sucesso!
                </h3>
                <p className="text-green-700 text-sm">
                  Código: {pecaCadastrada.codigo}
                </p>
              </div>
              <Button onClick={() => setShowQRModal(true)}>
                <QrCode className="h-4 w-4 mr-2" />
                Ver QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
