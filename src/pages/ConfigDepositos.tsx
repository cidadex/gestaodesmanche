import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Building2,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ConfigDepositos() {
  const { depositos, pecas, adicionarDeposito, atualizarDeposito, removerDeposito } = useData();
  const [showModal, setShowModal] = useState(false);
  const [depositoEditando, setDepositoEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error('Digite o nome do depósito');
      return;
    }

    if (depositoEditando) {
      atualizarDeposito(depositoEditando, formData);
      toast.success('Depósito atualizado com sucesso!');
    } else {
      adicionarDeposito(formData);
      toast.success('Depósito cadastrado com sucesso!');
    }

    handleCloseModal();
  };

  const handleEditar = (dep: { id: string; nome: string; descricao?: string }) => {
    setDepositoEditando(dep.id);
    setFormData({
      nome: dep.nome,
      descricao: dep.descricao || '',
    });
    setShowModal(true);
  };

  const handleNovo = () => {
    setDepositoEditando(null);
    setFormData({
      nome: '',
      descricao: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDepositoEditando(null);
    setFormData({ nome: '', descricao: '' });
  };

  const handleRemover = (id: string) => {
    const pecasNoDeposito = pecas.filter(p => p.depositoId === id).length;
    if (pecasNoDeposito > 0) {
      toast.error(`Não é possível remover: existem ${pecasNoDeposito} peças neste depósito`);
      return;
    }
    
    if (confirm('Tem certeza que deseja remover este depósito?')) {
      removerDeposito(id);
      toast.success('Depósito removido com sucesso!');
    }
  };

  const getPecasCount = (depositoId: string) => {
    return pecas.filter(p => p.depositoId === depositoId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Depósitos</h1>
          <p className="text-slate-500">Gerencie os depósitos do sistema</p>
        </div>
        <Button onClick={handleNovo} className="gradient-primary btn-glow">
          <Plus className="h-4 w-4 mr-2" />
          Novo Depósito
        </Button>
      </div>

      {/* Resumo */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{depositos.length}</p>
              <p className="text-sm text-slate-500">depósitos cadastrados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            Todos os Depósitos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Peças</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depositos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                    <Building2 className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>Nenhum depósito cadastrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                depositos.map((dep) => (
                  <TableRow key={dep.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="bg-indigo-500/10 p-2 rounded-lg">
                          <Building2 className="h-4 w-4 text-indigo-600" />
                        </div>
                        {dep.nome}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">{dep.descricao || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{getPecasCount(dep.id)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditar(dep)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemover(dep.id)}
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
              <div className="bg-indigo-500 p-2 rounded-lg">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              {depositoEditando ? 'Editar Depósito' : 'Novo Depósito'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Depósito *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Depósito Principal, Galpão B..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição opcional do depósito..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-500">
                <Save className="h-4 w-4 mr-2" />
                {depositoEditando ? 'Salvar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
