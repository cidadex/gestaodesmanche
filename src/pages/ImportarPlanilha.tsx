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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface PreviewItem {
  descricao: string;
  tipoVeiculo: string;
  marca: string;
  cor: string;
  ano: string;
  deposito: string;
  setor: string;
  localizacao: string;
  observacoes: string;
  valido: boolean;
  erro?: string;
}

export default function ImportarPlanilha() {
  const { importarPecas } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importacaoConcluida, setImportacaoConcluida] = useState(false);

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

        // Assume que a primeira linha é o cabeçalho
        const headers = jsonData[0].map((h: string) => h.toLowerCase().trim());
        const rows = jsonData.slice(1);

        const previewItems: PreviewItem[] = rows
          .filter((row) => row.some((cell) => cell !== undefined && cell !== ''))
          .map((row) => {
            const item: any = {};
            headers.forEach((header: string, index: number) => {
              item[header] = row[index]?.toString() || '';
            });

            const valido = !!(
              item.descricao ||
              item.descricao ||
              item['descrição']
            );

            return {
              descricao: item.descricao || item['descrição'] || '',
              tipoVeiculo: item.tipoveiculo || item['tipo veiculo'] || item['tipo_veiculo'] || 'carro',
              marca: item.marca || '',
              cor: item.cor || '',
              ano: item.ano || new Date().getFullYear().toString(),
              deposito: item.deposito || 'deposito1',
              setor: item.setor || '',
              localizacao: item.localizacao || item['localização'] || '',
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
        marca: item.marca,
        cor: item.cor,
        ano: parseInt(item.ano) || new Date().getFullYear(),
        deposito: ['deposito1', 'deposito2'].includes(item.deposito.toLowerCase())
          ? (item.deposito.toLowerCase() as 'deposito1' | 'deposito2')
          : 'deposito1',
        setor: item.setor,
        localizacao: item.localizacao,
        observacoes: item.observacoes,
        fotos: [],
        status: 'disponivel' as const,
      }));

      importarPecas(pecasParaImportar);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadModelo = () => {
    const modelo = [
      {
        descricao: 'Motor 1.6 Flex',
        tipoVeiculo: 'carro',
        marca: 'Chevrolet',
        cor: 'Prata',
        ano: '2019',
        deposito: 'deposito1',
        setor: 'A1',
        localizacao: 'Prateleira 3',
        observacoes: 'Funcionando perfeitamente',
      },
      {
        descricao: 'Porta Dianteira Esquerda',
        tipoVeiculo: 'carro',
        marca: 'Volkswagen',
        cor: 'Preto',
        ano: '2020',
        deposito: 'deposito1',
        setor: 'B2',
        localizacao: 'Box 12',
        observacoes: 'Com alguns arranhões',
      },
      {
        descricao: 'Capacete',
        tipoVeiculo: 'moto',
        marca: 'Honda',
        cor: 'Vermelho',
        ano: '2023',
        deposito: 'deposito2',
        setor: 'C1',
        localizacao: 'Gaveta 5',
        observacoes: 'Tamanho M',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(modelo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Modelo');
    XLSX.writeFile(workbook, 'modelo_importacao_pecas.xlsx');
  };

  const itensValidos = preview.filter((item) => item.valido).length;
  const itensInvalidos = preview.filter((item) => !item.valido).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Importar Planilha</h1>
        <p className="text-slate-500">Importe peças em massa via arquivo Excel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleArquivoChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                arquivo
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-300 hover:border-primary hover:bg-slate-50'
              }`}
            >
              {arquivo ? (
                <div className="space-y-2">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="font-medium text-green-900">{arquivo.name}</p>
                  <p className="text-sm text-green-700">
                    {(arquivo.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="font-medium">Clique para selecionar</p>
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
                className="w-full text-red-600"
                onClick={handleLimpar}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover arquivo
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Instruções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900 mb-2">Formato esperado:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• A primeira linha deve conter os cabeçalhos</li>
                  <li>• Cada linha representa uma peça</li>
                  <li>• A coluna "descricao" é obrigatória</li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">Colunas suportadas:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">descricao</Badge>
                    <span className="text-slate-500">*</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">tipoVeiculo</Badge>
                    <span className="text-xs text-slate-500">carro/moto/bicicleta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">marca</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">cor</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">ano</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">deposito</Badge>
                    <span className="text-xs text-slate-500">deposito1/2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">setor</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">localizacao</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">observacoes</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Preview da Importação
              </span>
              <div className="flex gap-2">
                <Badge className="bg-green-500">{itensValidos} válidos</Badge>
                {itensInvalidos > 0 && (
                  <Badge variant="destructive">{itensInvalidos} inválidos</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Depósito</TableHead>
                    <TableHead>Setor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((item, index) => (
                    <TableRow
                      key={index}
                      className={!item.valido ? 'bg-red-50' : undefined}
                    >
                      <TableCell>
                        {item.valido ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="flex items-center gap-1 text-red-500">
                            <X className="h-4 w-4" />
                            <span className="text-xs">{item.erro}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{item.descricao || '-'}</TableCell>
                      <TableCell className="capitalize">{item.tipoVeiculo}</TableCell>
                      <TableCell>{item.marca || '-'}</TableCell>
                      <TableCell>
                        {item.deposito === 'deposito1' ? 'Depósito 1' : 'Depósito 2'}
                      </TableCell>
                      <TableCell>{item.setor || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            {!importacaoConcluida && (
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleImportar}
                  disabled={isProcessing || itensValidos === 0}
                  className="flex-1"
                >
                  {isProcessing ? 'Importando...' : `Importar ${itensValidos} Peças`}
                </Button>
                <Button variant="outline" onClick={handleLimpar}>
                  Cancelar
                </Button>
              </div>
            )}

            {importacaoConcluida && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Importação concluída!</p>
                  <p className="text-sm text-green-700">
                    {itensValidos} peças foram importadas com sucesso.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="ml-auto"
                  onClick={handleLimpar}
                >
                  Nova Importação
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
