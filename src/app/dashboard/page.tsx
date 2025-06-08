
'use client'; 

import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';
import { ModuleCard, type ModuleCardProps } from '@/components/dashboard/ModuleCard';
import { UserCircle, Search, Bell, ArrowLeft, Bot, MessageCircle, Wand2, ShoppingBag, Star } from 'lucide-react'; 
import InteractiveBackground from '@/components/common/InteractiveBackground';
import { useRouter } from 'next/navigation';


// Removido metadata daqui para evitar erro em client component, mover para layout ou page.tsx pai se necessário.

const modulesData: Omit<ModuleCardProps, 'aulasCount'>[] = [ 
  {
    title: 'O Segredo da VEO3',
    description: 'Fazendo um vídeo do zero',
    imageUrl: 'https://i.imgur.com/MFaqsLj.jpeg',
    dataAiHint: 'abstract tech',
    linkUrl: '/dashboard/aula/o-segredo-da-veo3',
    // buttonText and buttonIcon will use defaults from ModuleCard ("Assistir agora", PlayCircle)
  },
  {
    title: 'Tudo Sobre Redes Sociais',
    description: 'Domine as redes e viralize!',
    imageUrl: 'https://i.imgur.com/EnRyxx3.png',
    dataAiHint: 'social media strategy',
    linkUrl: '/dashboard/aula/tudo-sobre-redes-sociais',
    // buttonText and buttonIcon will use defaults
  },
  {
    title: 'Seja Afiliado',
    description: 'Divulgue o curso "Domine o Google Veo 3" e ajude milhares de pessoas a criarem vídeos profissionais com inteligência artificial, mesmo que nunca tenham editado um vídeo antes!',
    imageUrl: 'https://i.imgur.com/bYVF0Ak.jpeg',
    dataAiHint: 'affiliate marketing business',
    linkUrl: '/dashboard/afiliado',
    buttonIcon: ShoppingBag, // Alterado para ShoppingBag
    buttonText: "Saiba Mais", // Alterado
  },
  {
    title: 'Bot Criador de Prompts',
    description: "Gere prompts otimizados para videos com IA no Google Veo 3.",
    imageUrl: 'https://i.imgur.com/Wr9zMxb.png',
    dataAiHint: 'ai bot abstract',
    linkUrl: '/dashboard/prompt-generator',
    buttonText: 'Acessar agora',
    buttonIcon: Bot,
  },
  {
    title: '1 Ano de Assinatura (Gemini, Flow, One)',
    description: 'Garanta seu acesso premium ao Google Veo3 por 15 meses e desbloqueie todo o potencial da IA para criação de vídeos.',
    imageUrl: 'https://i.imgur.com/7Vd3YNK.png', 
    dataAiHint: 'subscription service technology',
    linkUrl: '/dashboard/assinatura-veo3', 
    buttonText: 'Ver Planos',
    buttonIcon: Star, 
  },
  // Card "Criador de Instruções (IA)" não está na imagem fornecida, mantido removido
  // Card "Chatbot AI (Local)" não está na imagem fornecida, mantido removido
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          boxShadow: '0 0 40px 10px hsla(var(--primary), 0.1), 0 0 60px 20px hsla(var(--primary), 0.06) inset, 0 0 15px 3px hsla(var(--primary), 0.08)'
        }}
      />

      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground/70 hover:text-foreground mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="text-xl font-bold tracking-tight">
                <span className="text-foreground">Team</span>
                <span className="text-primary">VEO3</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center sm:space-x-4 space-x-2">
            <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
              <UserCircle className="h-6 w-6" />
            </Button>
            <Link href="/login">
              <Button variant="outline" className="shine-button text-sm px-3 py-1.5 h-auto">
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <section
          className="relative border-b border-border/30 overflow-hidden"
        >
          <InteractiveBackground />
          <div
            id="hero-section-content"
            className="relative z-[2] mx-auto w-full max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                  Seja Bem Vindo(a)
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground">
                  Tudo sobre VEO3 e Técnicas de IA
                </p>
                <p className="text-sm text-muted-foreground/80">
                  By - TEAMVEO3
                </p>
              </div>
              <div className="hidden lg:block">
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20 relative z-[2]">
          <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8 sm:mb-10">Módulos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"> 
              {modulesData.map((module) => (
                <ModuleCard key={module.title} {...module as ModuleCardProps} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer className="py-8 border-t border-border/50 mt-auto relative z-[2]" />
    </div>
  );
}
