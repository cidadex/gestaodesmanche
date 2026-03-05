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
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Building2,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';
import { SETORES } from '@/types';

export default function ConfigLocalizacoes() {
  const { localizacoes, depositos, pecas, adicionarLocalizacao, atualizarLocalizacao, removerLocalizacao } = useData();
  const [showModal, setShowModal] = useState(false);
  const [localizacaoEditando, setLocalizacaoEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    depositoId: '',
    setor: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.depositoId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (localizacaoEditando) {
      atualizarLocalizacao(localizacaoEditando, formData);
      toast.success('Localização atualizada com sucesso!');
    } else {
      adicionarLocalizacao(formData);
      toast.success('Localização cadastrada com sucesso!');
    }

    handleCloseModal();
  };

  const handleEditar = (loc: { id: string; nome: string; depositoId: string; setor: string }) => {
    setLocalizacaoEditando(loc.id);
    setFormData({
      nome: loc.nome,
      depositoId: loc.depositoId,
      setor: loc.setor,
    });
    setShowModal(true);
  };

  const handleNovo = () => {
    setLocalizacaoEditando(null);
    setFormData({
      nome: '',
      depositoId: depositos[0]?.id || '',
      setor: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLocalizacaoEditando(null);
    setFormData({ nome: '', depositoId: '', setor: '' });
  };

  const handleRemover = (id: string) => {
    const pecasNaLocalizacao = pecas.filter(p => p.localizacaoId === id).length;
    if (pecasNaLocalizacao > 0) {
      toast.error(`Não é possível remover: existem ${pecasNaLocalizacao} peças nesta localização`);
      return;
    }
    
    if (confirm('Tem certeza que deseja remover esta localização?')) {
      removerLocalizacao(id);
      toast.success('Localização removida com sucesso!');
    }
  };

  const getDepositoNome = (id: string) => depositos.find(d => d.id === id)?.nome || '-';
  const getPecasCount = (localizacaoId: string) => {
    return pecas.filter(p => p.localizacaoId === localizacaoId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Localizações</h1>
          <p className="text-slate-500">Gerencie as localizações nos depósitos</p>
        </div>
        <Button onClick={handleNovo} className="gradient-primary btn-glow">
          <Plus className="h-4 w-4 mr-2" />
          Nova Localização
        </Button>
      </div>

      {/* Resumo */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 rounded-xl">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{localizacoes.length}</p>
              <p className="text-sm text-slate-500">localizações cadastradas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-teal-500 p-2 rounded-lg">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            Todas as Localizações
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Nome</TableHead>
                <TableHead>Depósito</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Peças</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localizacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>Nenhuma localização cadastrada</p>
                  </TableCell>
                </TableRow>
              ) : (
                localizacoes.map((loc) => (
                  <TableRow key={loc.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="bg-teal-500/10 p-2 rounded-lg">
                          <MapPin className="h-4 w-4 text-teal-600" />
                        </div>
                        {loc.nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {getDepositoNome(loc.depositoId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {loc.setor && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {loc.setor}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{getPecasCount(loc.id)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditar(loc)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemover(loc.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
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
              <div className="bg-teal-500 p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              {localizacaoEditando ? 'Editar Localização' : 'Nova Localização'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Localização *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Prateleira A3, Box 12..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Depósito *
              </Label>
              <Select
                value={formData.depositoId}
                onValueChange={(value) => setFormData({ ...formData, depositoId: value })}
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
              <Label>Setor</Label>
              <Select
                value={formData.setor}
                onValueChange={(value) => setFormData({ ...formData, setor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {SETORES.map((setor) => (
                    <SelectItem key={setor} value={setor}>
                      Setor {setor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-teal-500 to-cyan-500">
                <Save className="h-4 w-4 mr-2" />
                {localizacaoEditando ? 'Salvar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
