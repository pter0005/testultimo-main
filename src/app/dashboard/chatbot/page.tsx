
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { chatWithAI, type ChatInput } from '@/ai/flows/simple-chat-flow'; // Atualizado para novo nome de função

const formSchema = z.object({
  question: z.string().min(1, { message: 'Por favor, digite sua pergunta.' }),
});
type FormValues = z.infer<typeof formSchema>;

export default function ChatbotPage() {
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setChatResponse(null);
    try {
      const result = await chatWithAI(data as ChatInput); // Atualizado para novo nome de função
      setChatResponse(result.answer);
      form.reset(); // Limpa o campo de input após o envio
    } catch (error) {
      console.error('Erro ao conversar com o chatbot:', error);
      let errorMessage = 'Ocorreu um problema ao tentar conversar com a IA.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Erro no Chatbot',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
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
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center justify-center">
              <MessageCircle className="mr-3 h-8 w-8" />
              Chatbot AI
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Pergunte qualquer coisa para nossa IA!</p>
          </div>

          <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Converse com a IA</CardTitle>
              <CardDescription>Digite sua pergunta abaixo e pressione Enter ou clique em Enviar.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    {...form.register('question')}
                    placeholder="Qual a sua dúvida?"
                    className="bg-input placeholder-muted-foreground text-base"
                    disabled={isLoading}
                  />
                  {form.formState.errors.question && (
                    <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.question.message}</p>
                  )}
                </div>
                <Button type="submit" size="lg" className="w-full shine-button bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Pensando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Enviar Pergunta
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          { (isLoading || chatResponse) && (
            <Card className="mt-8 bg-card/80 backdrop-blur-md border-primary/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Resposta da IA:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-input rounded-md text-foreground whitespace-pre-wrap break-words min-h-[80px] flex items-center justify-start">
                  {isLoading && !chatResponse ? (
                    <span className="text-muted-foreground italic flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Aguardando resposta...
                    </span>
                  ) : chatResponse ? (
                    chatResponse
                  ) : (
                     <span className="text-muted-foreground">A resposta da IA aparecerá aqui.</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer className="py-8 border-t border-border/50 mt-auto text-center text-muted-foreground text-sm" />
    </div>
  );
}
