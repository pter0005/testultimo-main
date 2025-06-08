
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, AlertTriangle } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

export default function JanAiPromptGeneratorPage() {
  const { toast } = useToast();

  const fixedPrompt = `Você é um engenheiro de narrativa visual. Crie prompts cinematográficos detalhados para o Google Veo 3 com:

- Ambientação no Brasil (favela, sertão, periferia, interior, etc.)
- Divisão de tempo: 0–2s, 3–5s, 6–8s
- Movimentos de câmera (travelling, drone, close-up, POV)
- Emoções e expressões faciais
- Diálogo curto em português
- Estilo cinematográfico realista e imersivo`;

  const copyFixedPrompt = () => {
    navigator.clipboard.writeText(fixedPrompt).then(() => {
      toast({
        title: "Instrução Copiada!",
        description: "Cole na interface da IA dentro da janela abaixo.",
      });
    }).catch(err => {
      console.error('Erro ao copiar prompt: ', err);
      toast({
        variant: "destructive",
        title: "Erro ao Copiar",
        description: "Não foi possível copiar a instrução. Tente manualmente.",
      });
    });
  };

  const janAiUrl = "http://localhost:1337"; 

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
             <div className="text-xl font-bold tracking-tight">
                <span className="text-foreground">Team</span>
                <span className="text-primary">VEO3</span>
              </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="shine-button">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Módulos
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">
              Gerador de Prompts com Jan.ai (Local)
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Use a IA Jan.ai (rodando no seu computador) para criar prompts cinematográficos.
            </p>
          </div>

          <Alert variant="destructive" className="mb-8 bg-destructive/10 border-destructive/30 text-destructive-foreground">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertTitle className="font-semibold text-destructive">Atenção: Requer Software Local!</AlertTitle>
            <AlertDescription className="text-sm text-destructive/90">
              Esta ferramenta é uma interface para o aplicativo <strong className="font-medium">Jan.ai</strong>, que precisa estar <strong className="font-medium">instalado e rodando no SEU computador</strong>.
              A janela abaixo tentará carregar o Jan.ai de <code className="bg-destructive/20 px-1 py-0.5 rounded text-xs font-mono">{janAiUrl}</code>.
              Se o Jan.ai não estiver em execução ou acessível nessa URL, o espaço abaixo ficará em branco ou mostrará um erro de conexão.
              Esta não é uma funcionalidade online hospedada.
            </AlertDescription>
          </Alert>

          <Card className="mb-8 bg-card/70 backdrop-blur-md border-border/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Instrução Recomendada para Jan.ai</CardTitle>
              <CardDescription>
                Copie esta instrução e cole na interface do Jan.ai (dentro da janela abaixo) para melhores resultados com Google Veo 3.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-input p-4 rounded-md text-sm whitespace-pre-wrap break-words overflow-x-auto max-h-60">
                {fixedPrompt}
              </pre>
              <Button onClick={copyFixedPrompt} className="mt-4 shine-button w-full sm:w-auto">
                <Copy className="mr-2 h-4 w-4" />
                Copiar Instrução
              </Button>
            </CardContent>
          </Card>

          <div className="bg-card/70 backdrop-blur-md p-1 sm:p-2 rounded-lg shadow-xl border border-border/30">
            <iframe
              src={janAiUrl}
              className="w-full h-[500px] sm:h-[650px] border-none rounded-md" 
              title="Jan.ai Interface Local"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups" 
            />
          </div>

          <p className="text-center text-muted-foreground mt-8 text-sm">
            Dica: O desempenho da IA no iframe pode ser intensivo.
            Se notar lentidão, considere usar o aplicativo Jan.ai diretamente em sua própria janela.
          </p>

        </div>
      </main>

      <Footer className="py-8 border-t border-border/50 mt-auto text-center text-muted-foreground text-sm" />
    </div>
  );
}

    