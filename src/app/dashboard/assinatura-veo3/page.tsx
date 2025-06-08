
"use client";

import Link from 'next/link';
// import Image from 'next/image'; // Not used in this version
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react'; // FileText no longer needed
import Footer from '@/components/layout/Footer';

export default function AssinaturaVeo3AulaPage() {
  // ATENÇÃO: Substitua 'SEU_VIDEO_ID_AQUI' pelo ID do vídeo do YouTube correto para esta aula.
  const videoId = 'OMHKkO-O8ow'; 
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;

  // const materialComplementarUrl = '#'; // Material complementar foi removido

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
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-primary">
          {/* ATENÇÃO: Ajuste o título da aula conforme necessário */}
          Aula: Como Obter Assinatura VEO3 Gratuitamente
        </h1>
        
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          {/* Coluna do Vídeo */}
          <div className="lg:w-3/4 w-full">
            <div 
              className="w-full aspect-video rounded-xl shadow-2xl border border-primary/30 bg-card relative"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              }}
            >
              <div className="rounded-xl overflow-hidden h-full w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={videoUrl}
                  title="YouTube video player - Aula Assinatura VEO3"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Coluna da Descrição */}
          <div className="lg:w-1/4 w-full">
            <div
              className="
                w-full 
                bg-card/70 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-border/30
                text-left"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">Sobre esta aula</h2>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                {/* ATENÇÃO: Atualize esta descrição com o conteúdo relevante para a aula */}
                Nesta aula exclusiva, você aprenderá o passo a passo e as estratégias para conseguir sua assinatura do Google Veo3 (incluindo Gemini, Flow e Google One) de forma gratuita. Descubra os métodos e dicas para aproveitar ao máximo essas ferramentas poderosas sem custo!
              </p>
            </div>
          </div>
        </div>
        
        {/* Seção de Suporte */}
        <div className="mt-10 w-full max-w-3xl text-center p-6 bg-card/30 rounded-lg border border-border/20 shadow-md">
          {/* A seção de material complementar e seu placeholder foram completamente removidos. */}
          {/* A div abaixo agora é o único filho direto, então `space-y-6` do pai não se aplicará se for o único elemento,
              e removemos mt-8, pt-6 e border-t para um espaçamento mais limpo. */}
          <div className="text-sm text-muted-foreground">
            <h3 className="text-md font-semibold text-foreground mb-3">Suporte:</h3>
            <p>Email - <a href="mailto:teamveo3top@gmail.com" className="text-primary hover:underline">teamveo3top@gmail.com</a></p>
            <p className="mt-1">Tiktok - experimentoscuriosos1</p>
            <p className="mt-1">Instagram - Ia.malucas</p>
          </div>
        </div>
      </main>

      <Footer className="py-8 border-t border-border/50 mt-auto text-center text-muted-foreground text-sm" />
    </div>
  );
}
