import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Palette,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ConfigCores() {
  const { cores, adicionarCor, atualizarCor, removerCor } = useData();
  const [showModal, setShowModal] = useState(false);
  const [corEditando, setCorEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    hex: '#000000',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error('Digite o nome da cor');
      return;
    }

    if (corEditando) {
      atualizarCor(corEditando, formData);
      toast.success('Cor atualizada com sucesso!');
    } else {
      adicionarCor(formData);
      toast.success('Cor cadastrada com sucesso!');
    }

    handleCloseModal();
  };

  const handleEditar = (cor: { id: string; nome: string; hex?: string }) => {
    setCorEditando(cor.id);
    setFormData({
      nome: cor.nome,
      hex: cor.hex || '#000000',
    });
    setShowModal(true);
  };

  const handleNovo = () => {
    setCorEditando(null);
    setFormData({
      nome: '',
      hex: '#000000',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCorEditando(null);
    setFormData({ nome: '', hex: '#000000' });
  };

  const handleRemover = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta cor?')) {
      removerCor(id);
      toast.success('Cor removida com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Cores</h1>
          <p className="text-sm text-slate-500">Gerencie as cores das peças</p>
        </div>
        <Button onClick={handleNovo} className="gradient-primary btn-glow">
          <Plus className="h-4 w-4 mr-2" />
          Nova Cor
        </Button>
      </div>

      {/* Resumo */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 rounded-xl">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{cores.length}</p>
              <p className="text-sm text-slate-500">cores cadastradas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Cores */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-rose-500 p-2 rounded-lg">
              <Palette className="h-4 w-4 text-white" />
            </div>
            Todas as Cores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {cores.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Palette className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>Nenhuma cor cadastrada</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cores.map((cor) => (
                <div
                  key={cor.id}
                  className="group relative p-4 rounded-xl border-2 border-slate-100 hover:border-rose-300 transition-all hover:shadow-lg"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                      style={{ backgroundColor: cor.hex || '#ccc' }}
                    />
                    <p className="font-medium text-slate-700 text-center">{cor.nome}</p>
                  </div>
                  
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-white shadow-sm hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => handleEditar(cor)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-white shadow-sm hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleRemover(cor.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-rose-500 p-2 rounded-lg">
                <Palette className="h-4 w-4 text-white" />
              </div>
              {corEditando ? 'Editar Cor' : 'Nova Cor'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Cor *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Preto, Prata..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Cor (Hexadecimal)</Label>
              <div className="flex gap-3">
                <Input
                  type="color"
                  value={formData.hex}
                  onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                  className="w-16 h-11 p-1"
                />
                <Input
                  value={formData.hex}
                  onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4">
              <span className="text-sm text-slate-500">Preview:</span>
              <div
                className="w-12 h-12 rounded-full border-2 border-slate-200"
                style={{ backgroundColor: formData.hex }}
              />
              <span className="font-medium">{formData.nome || 'Nome da cor'}</span>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-rose-500 to-pink-500">
                <Save className="h-4 w-4 mr-2" />
                {corEditando ? 'Salvar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
