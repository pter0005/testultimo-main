
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Se for usar o logo como imagem
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wand2, Copy, Loader2, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { generateSystemPrompt, type SystemPromptCreatorInput } from '@/ai/flows/system-prompt-creator-flow';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  userInputTopic: z.string().min(10, { message: 'Descreva o tópico com pelo menos 10 caracteres.' })
                           .max(500, { message: 'A descrição do tópico não pode exceder 500 caracteres.'}),
});

type FormValues = z.infer<typeof formSchema>;

export default function InstructionCreatorPage() {
  const [generatedInstructions, setGeneratedInstructions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInputTopic: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedInstructions(null);
    try {
      const result = await generateSystemPrompt(data as SystemPromptCreatorInput);
      setGeneratedInstructions(result.generatedSystemPrompt);
      toast({
        title: 'Instruções Geradas!',
        description: 'Seu prompt de sistema para IA de vídeo está pronto.',
      });
    } catch (error) {
      console.error('Erro ao gerar instruções:', error);
      let errorMessage = 'Ocorreu um problema ao gerar as instruções com a IA.';
      if (error instanceof Error) {
        errorMessage = error.message.includes("Chave da API") 
          ? "Erro de autenticação com a Hugging Face. Verifique sua API Key."
          : error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Erro ao Gerar Instruções',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedInstructions) {
      navigator.clipboard.writeText(generatedInstructions);
      toast({
        title: 'Instruções Copiadas!',
        description: 'O prompt de sistema foi copiado para a área de transferência.',
      });
    }
  };

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
        <ScrollArea className="w-full max-w-3xl h-[calc(100vh-10rem)] pr-4">
          <div className="w-full">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center justify-center">
                <Wand2 className="mr-3 h-8 w-8" />
                Criador de Instruções para IA (Veo 3)
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">Gere prompts de sistema detalhados para guiar IAs de vídeo.</p>
            </div>
            
            <div className="bg-primary/10 border border-primary/30 text-primary-foreground p-4 rounded-md mb-6 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-primary">Como usar:</h3>
                <p className="text-sm text-primary/90">
                  Descreva abaixo o tema ou objetivo principal dos vídeos que você quer criar (ex: "vídeos de ação em favelas com drones", "documentários sobre a natureza amazônica", "vlogs de viagem pelo nordeste com foco em culinária").
                  Quanto mais detalhes você fornecer, melhores e mais personalizadas serão as instruções geradas pela IA. Essas instruções (prompt de sistema) podem ser usadas para guiar outra IA de geração de vídeo.
                </p>
              </div>
            </div>


            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">1. Descreva o Tópico/Objetivo Principal <span className="text-primary">*</span></CardTitle>
                  <CardDescription>Forneça detalhes sobre o que você quer que o prompt de sistema final ajude a criar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    {...form.register('userInputTopic')}
                    placeholder="Ex: Quero gerar prompts de sistema para criar vídeos curtos de suspense psicológico ambientados em grandes cidades brasileiras à noite, com foco em personagens solitários e atmosfera noir."
                    className="min-h-[120px] bg-input placeholder-muted-foreground"
                    disabled={isLoading}
                  />
                  {form.formState.errors.userInputTopic && (
                    <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.userInputTopic.message}</p>
                  )}
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full shine-button bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Gerando com IA (Hugging Face)...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" /> Gerar Instruções
                  </>
                )}
              </Button>
            </form>

            { (isLoading || generatedInstructions) && (
              <Card className="mt-10 bg-card/80 backdrop-blur-md border-primary/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Instruções Geradas (Prompt de Sistema):</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-input rounded-md text-foreground whitespace-pre-wrap break-words min-h-[200px] flex items-start justify-start"> {/* Changed to items-start and justify-start */}
                    {isLoading && !generatedInstructions ? (
                       <span className="text-muted-foreground italic flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Aguardando resposta da IA...
                      </span>
                    ) : generatedInstructions ? (
                      generatedInstructions
                    ) : (
                      <span className="text-muted-foreground">Suas instruções geradas pela IA aparecerão aqui.</span>
                    )}
                  </div>
                  {generatedInstructions && !isLoading && (
                    <Button onClick={copyToClipboard} variant="outline" className="w-full shine-button">
                      <Copy className="mr-2 h-4 w-4" /> Copiar Instruções
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </main>

      <Footer className="py-8 border-t border-border/50 mt-auto text-center text-muted-foreground text-sm" />
    </div>
  );
}
