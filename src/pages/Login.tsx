import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Car, Lock, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true);

    try {
      const sucesso = await login(email, senha);
      if (!sucesso) {
        setErro('Email ou senha incorretos');
      }
    } catch (error) {
      setErro('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 p-4 rounded-full">
            <Car className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">
              Sistema de Catalogação
            </CardTitle>
            <CardDescription className="text-slate-500">
              Desmanche e Gerenciamento de Peças
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {erro && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
              <p className="font-medium mb-2">Credenciais de demonstração:</p>
              <div className="space-y-1">
                <p><span className="font-medium">Admin:</span> admin@desmanche.com / admin123</p>
                <p><span className="font-medium">Operador:</span> operador@desmanche.com / operador123</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-slate-400 text-sm mt-6">
          © 2025 Sistema de Catalogação - Desmanche
        </p>
      </div>
    </div>
  );
}
