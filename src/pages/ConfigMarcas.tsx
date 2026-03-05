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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Car,
  Bike,
  Save,
  X,
} from 'lucide-react';

import { toast } from 'sonner';
import type { TipoVeiculo } from '@/types';

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

const tipoLabels: Record<TipoVeiculo, string> = {
  carro: 'Carro',
  moto: 'Moto',
  bicicleta: 'Bicicleta',
};

export default function ConfigMarcas() {
  const { marcas, adicionarMarca, atualizarMarca, removerMarca } = useData();
  const [showModal, setShowModal] = useState(false);
  const [marcaEditando, setMarcaEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipoVeiculo: 'carro' as TipoVeiculo,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error('Digite o nome da marca');
      return;
    }

    if (marcaEditando) {
      atualizarMarca(marcaEditando, formData);
      toast.success('Marca atualizada com sucesso!');
    } else {
      adicionarMarca(formData);
      toast.success('Marca cadastrada com sucesso!');
    }

    handleCloseModal();
  };

  const handleEditar = (marca: { id: string; nome: string; tipoVeiculo: TipoVeiculo }) => {
    setMarcaEditando(marca.id);
    setFormData({
      nome: marca.nome,
      tipoVeiculo: marca.tipoVeiculo,
    });
    setShowModal(true);
  };

  const handleNovo = () => {
    setMarcaEditando(null);
    setFormData({
      nome: '',
      tipoVeiculo: 'carro',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMarcaEditando(null);
    setFormData({ nome: '', tipoVeiculo: 'carro' });
  };

  const handleRemover = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta marca?')) {
      removerMarca(id);
      toast.success('Marca removida com sucesso!');
    }
  };

  // Agrupar marcas por tipo
  const marcasPorTipo = {
    carro: marcas.filter(m => m.tipoVeiculo === 'carro'),
    moto: marcas.filter(m => m.tipoVeiculo === 'moto'),
    bicicleta: marcas.filter(m => m.tipoVeiculo === 'bicicleta'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Marcas</h1>
          <p className="text-slate-500">Gerencie as marcas de veículos</p>
        </div>
        <Button onClick={handleNovo} className="gradient-primary btn-glow">
          <Plus className="h-4 w-4 mr-2" />
          Nova Marca
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4">
        {(['carro', 'moto', 'bicicleta'] as TipoVeiculo[]).map((tipo) => {
          const TipoIcon = tipoIcons[tipo];
          return (
            <Card key={tipo} className="border-0 shadow-lg">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${tipoColors[tipo]}`}>
                  <TipoIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{marcasPorTipo[tipo].length}</p>
                  <p className="text-xs text-slate-500">{tipoLabels[tipo]}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabela */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-amber-500 p-2 rounded-lg">
              <Tag className="h-4 w-4 text-white" />
            </div>
            Todas as Marcas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Nome</TableHead>
                <TableHead>Tipo de Veículo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marcas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12 text-slate-500">
                    <Tag className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>Nenhuma marca cadastrada</p>
                  </TableCell>
                </TableRow>
              ) : (
                marcas
                  .sort((a, b) => a.tipoVeiculo.localeCompare(b.tipoVeiculo))
                  .map((marca) => {
                    const TipoIcon = tipoIcons[marca.tipoVeiculo];
                    return (
                      <TableRow key={marca.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium">{marca.nome}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${tipoColors[marca.tipoVeiculo]}`}>
                            <TipoIcon className="h-3 w-3" />
                            {tipoLabels[marca.tipoVeiculo]}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditar(marca)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemover(marca.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-amber-500 p-2 rounded-lg">
                <Tag className="h-4 w-4 text-white" />
              </div>
              {marcaEditando ? 'Editar Marca' : 'Nova Marca'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Marca *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Chevrolet, Honda..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Veículo *</Label>
              <Select
                value={formData.tipoVeiculo}
                onValueChange={(value) => setFormData({ ...formData, tipoVeiculo: value as TipoVeiculo })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carro">🚗 Carro</SelectItem>
                  <SelectItem value="moto">🏍️ Moto</SelectItem>
                  <SelectItem value="bicicleta">🚲 Bicicleta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" className="gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                {marcaEditando ? 'Salvar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
