import { useState, useRef } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Check,
  X,
  FileUp,
  Trash2,
  QrCode,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';

interface PreviewItem {
  descricao: string;
  tipoVeiculo: string;
  marcaId: string;
  corId: string;
  ano: string;
  depositoId: string;
  localizacaoId: string;
  observacoes: string;
  valido: boolean;
  erro?: string;
}

export default function ImportarPlanilha() {
  const { marcas, cores, depositos, localizacoes, importarPecas } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importacaoConcluida, setImportacaoConcluida] = useState(false);
  const [pecasImportadas, setPecasImportadas] = useState<any[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [pecaSelecionada, setPecaSelecionada] = useState<any>(null);

  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArquivo(file);
    setImportacaoConcluida(false);
    processarArquivo(file);
  };

  const processarArquivo = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) {
          toast.error('Arquivo vazio ou formato inválido');
          return;
        }

        const headers = jsonData[0].map((h: string) => h.toLowerCase().trim().replace(/\s+/g, ''));
        const rows = jsonData.slice(1);

        const previewItems: PreviewItem[] = rows
          .filter((row) => row.some((cell) => cell !== undefined && cell !== ''))
          .map((row) => {
            const item: any = {};
            headers.forEach((header: string, index: number) => {
              item[header] = row[index]?.toString() || '';
            });

            const valido = !!(item.descricao || item.descricao);

            return {
              descricao: item.descricao || item['descrição'] || '',
              tipoVeiculo: item.tipoveiculo || item['tipoveiculo'] || 'carro',
              marcaId: item.marcaid || item['marcaid'] || marcas[0]?.id || '',
              corId: item.corid || item['corid'] || cores[0]?.id || '',
              ano: item.ano || new Date().getFullYear().toString(),
              depositoId: item.depositoid || item['depositoid'] || depositos[0]?.id || '',
              localizacaoId: item.localizacaoid || item['localizacaoid'] || localizacoes[0]?.id || '',
              observacoes: item.observacoes || item['observações'] || '',
              valido,
              erro: valido ? undefined : 'Descrição é obrigatória',
            };
          });

        setPreview(previewItems);
        toast.success(`${previewItems.length} itens encontrados na planilha`);
      } catch (error) {
        toast.error('Erro ao processar arquivo');
        console.error(error);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleImportar = () => {
    const itensValidos = preview.filter((item) => item.valido);
    
    if (itensValidos.length === 0) {
      toast.error('Nenhum item válido para importar');
      return;
    }

    setIsProcessing(true);

    try {
      const pecasParaImportar = itensValidos.map((item) => ({
        descricao: item.descricao,
        tipoVeiculo: ['carro', 'moto', 'bicicleta'].includes(item.tipoVeiculo.toLowerCase())
          ? (item.tipoVeiculo.toLowerCase() as 'carro' | 'moto' | 'bicicleta')
          : 'carro',
        marcaId: item.marcaId,
        corId: item.corId,
        ano: parseInt(item.ano) || new Date().getFullYear(),
        depositoId: item.depositoId,
        localizacaoId: item.localizacaoId,
        observacoes: item.observacoes,
        fotos: [],
        status: 'disponivel' as const,
      }));

      importarPecas(pecasParaImportar);
      setPecasImportadas(pecasParaImportar);
      setImportacaoConcluida(true);
      toast.success(`${pecasParaImportar.length} peças importadas com sucesso!`);
    } catch (error) {
      toast.error('Erro ao importar peças');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLimpar = () => {
    setArquivo(null);
    setPreview([]);
    setImportacaoConcluida(false);
    setPecasImportadas([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadModelo = () => {
    const modelo = [
      {
        descricao: 'Motor 1.6 Flex',
        tipoVeiculo: 'carro',
        marcaId: marcas.find(m => m.tipoVeiculo === 'carro')?.id || '',
        corId: cores[0]?.id || '',
        ano: '2019',
        depositoId: depositos[0]?.id || '',
        localizacaoId: localizacoes[0]?.id || '',
        observacoes: 'Funcionando perfeitamente',
      },
      {
        descricao: 'Porta Dianteira Esquerda',
        tipoVeiculo: 'carro',
        marcaId: marcas.find(m => m.tipoVeiculo === 'carro')?.id || '',
        corId: cores[1]?.id || '',
        ano: '2020',
        depositoId: depositos[0]?.id || '',
        localizacaoId: localizacoes[1]?.id || '',
        observacoes: 'Com alguns arranhões',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(modelo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Modelo');
    XLSX.writeFile(workbook, 'modelo_importacao_pecas.xlsx');
  };

  const itensValidos = preview.filter((item) => item.valido).length;
  const itensInvalidos = preview.filter((item) => !item.valido).length;

  const getQRCodeData = () => {
    if (!pecaSelecionada) return '';
    return JSON.stringify({
      tipo: 'peca',
      codigo: pecaSelecionada.codigo,
      descricao: pecaSelecionada.descricao,
      tipoVeiculo: pecaSelecionada.tipoVeiculo,
      marca: marcas.find(m => m.id === pecaSelecionada.marcaId)?.nome || '',
      cor: cores.find(c => c.id === pecaSelecionada.corId)?.nome || '',
      ano: pecaSelecionada.ano,
      deposito: depositos.find(d => d.id === pecaSelecionada.depositoId)?.nome || '',
      localizacao: localizacoes.find(l => l.id === pecaSelecionada.localizacaoId)?.nome || '',
    }, null, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Importar Planilha</h1>
        <p className="text-slate-500">Importe peças em massa via arquivo Excel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload */}
        <Card className="border-0 shadow-lg lg:col-span-1">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-pink-500 p-2 rounded-lg">
                <FileUp className="h-4 w-4 text-white" />
              </div>
              Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleArquivoChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                arquivo
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-300 hover:border-pink-500 hover:bg-pink-50'
              }`}
            >
              {arquivo ? (
                <div className="space-y-2">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Check className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-emerald-900">{arquivo.name}</p>
                  <p className="text-sm text-emerald-700">
                    {(arquivo.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="font-semibold text-slate-700">Clique para selecionar</p>
                  <p className="text-sm text-slate-500">XLSX, XLS ou CSV</p>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={downloadModelo}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar Modelo
            </Button>

            {arquivo && (
              <Button
                variant="ghost"
                className="w-full text-red-600 hover:bg-red-50"
                onClick={handleLimpar}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover arquivo
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <FileSpreadsheet className="h-4 w-4 text-white" />
              </div>
              Instruções
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-semibold text-blue-900 mb-2">Formato esperado:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• A primeira linha deve conter os cabeçalhos</li>
                  <li>• Cada linha representa uma peça</li>
                  <li>• A coluna "descricao" é obrigatória</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-3 text-slate-700">Colunas suportadas:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['descricao', 'tipoVeiculo', 'marcaId', 'corId', 'ano', 'depositoId', 'localizacaoId', 'observacoes'].map((col) => (
                    <div key={col} className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">{col}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <FileSpreadsheet className="h-4 w-4 text-white" />
                </div>
                Preview da Importação
              </span>
              <div className="flex gap-2">
                <Badge className="bg-emerald-500 text-white">{itensValidos} válidos</Badge>
                {itensInvalidos > 0 && (
                  <Badge variant="destructive">{itensInvalidos} inválidos</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Status</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Depósito</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((item, index) => (
                    <TableRow
                      key={index}
                      className={!item.valido ? 'bg-red-50/50' : 'hover:bg-slate-50/50'}
                    >
                      <TableCell>
                        {item.valido ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <div className="flex items-center gap-1 text-red-500">
                            <X className="h-4 w-4" />
                            <span className="text-xs">{item.erro}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.descricao || '-'}</TableCell>
                      <TableCell className="capitalize">{item.tipoVeiculo}</TableCell>
                      <TableCell>{marcas.find(m => m.id === item.marcaId)?.nome || '-'}</TableCell>
                      <TableCell>{depositos.find(d => d.id === item.depositoId)?.nome || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            {!importacaoConcluida && (
              <div className="flex gap-2 p-4 border-t">
                <Button
                  onClick={handleImportar}
                  disabled={isProcessing || itensValidos === 0}
                  className="flex-1 gradient-primary btn-glow"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                      Importando...
                    </span>
                  ) : (
                    <>Importar {itensValidos} Peças</>
                  )}
                </Button>
                <Button variant="outline" onClick={handleLimpar}>
                  Cancelar
                </Button>
              </div>
            )}

            {importacaoConcluida && (
              <div className="p-4 border-t">
                <div className="p-4 bg-emerald-50 rounded-xl flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Check className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-emerald-900">Importação concluída!</p>
                    <p className="text-sm text-emerald-700">
                      {itensValidos} peças foram importadas com sucesso.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLimpar}
                  >
                    Nova Importação
                  </Button>
                </div>

                {/* Botões de QR Code para peças importadas */}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Gerar QR Codes das peças importadas:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {pecasImportadas.map((peca, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPecaSelecionada(peca);
                          setShowQRModal(true);
                        }}
                        className="justify-start"
                      >
                        <QrCode className="h-3 w-3 mr-2" />
                        <span className="truncate">{peca.descricao}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de QR Code */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <QrCode className="h-4 w-4 text-white" />
              </div>
              QR Code da Peça Importada
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
                  <p className="font-bold text-lg text-slate-900">{pecaSelecionada.descricao}</p>
                  <p className="text-sm text-slate-500">
                    {marcas.find(m => m.id === pecaSelecionada.marcaId)?.nome} • {pecaSelecionada.ano}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-2">Dados completos:</p>
                <pre className="text-xs text-slate-600 bg-white p-3 rounded-lg overflow-auto max-h-40">
                  {getQRCodeData()}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => window.print()} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button 
                  onClick={() => {
                    const blob = new Blob([getQRCodeData()], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `peca.json`;
                    a.click();
                  }} 
                  variant="outline" 
                  className="flex-1"
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
