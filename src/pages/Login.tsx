import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Car, Lock, Mail, Zap, Shield } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 sm:p-6">
      {/* Background animado */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      
      {/* Círculos decorativos */}
      <div className="hidden sm:block absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="hidden sm:block absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo animado */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl animate-pulse" />
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <Car className="h-10 w-10 sm:h-16 sm:h-16 text-white" />
            </div>
          </div>
        </div>
        
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-4 sm:pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Sistema Profissional</span>
            </div>
            <CardTitle className="text-3xl font-bold text-gradient">
              Desmanche Pro
            </CardTitle>
            <CardDescription className="text-slate-500">
              Gestão completa de peças e estoque
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {erro && (
              <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-slate-700">Senha</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 gradient-primary btn-glow text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    Entrando...
                  </span>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Credenciais de demonstração
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-medium text-slate-700">Admin:</span>
                  <span className="text-slate-500">admin@desmanche.com / admin123</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="font-medium text-slate-700">Operador:</span>
                  <span className="text-slate-500">operador@desmanche.com / operador123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-white/60 text-sm mt-6">
          © 2025 Desmanche Pro - Sistema de Catalogação
        </p>
      </div>
    </div>
  );
}
