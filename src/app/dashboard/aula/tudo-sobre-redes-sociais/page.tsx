
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TudoSobreRedesSociaisAulaPage() {
  // ATENÇÃO: Substitua 'dQw4w9WgXcQ' pelo ID do vídeo do YouTube correto para esta aula.
  const videoId = 'SOG0n-04fNI'; // <<<<----- ID ATUALIZADO
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="https://i.imgur.com/ny9FJ1z.png"
              alt="VEO3 Academy Logo"
              width={50}
              height={18}
              className="object-contain"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
              }}
              data-ai-hint="futuristic logo"
            />
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
          Aula: Tudo Sobre Redes Sociais
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
                  title="YouTube video player - Tudo Sobre Redes Sociais"
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
                {/* ATENÇÃO: Atualize esta descrição com o conteúdo relevante para a aula "Tudo Sobre Redes Sociais" */}
                Nesta aula, você aprenderá os fundamentos e estratégias avançadas para dominar as redes sociais, aumentar seu alcance e engajamento, e viralizar seu conteúdo. Descubra as melhores práticas para cada plataforma e como construir uma presença online impactante.
              </p>
            </div>
          </div>
        </div>

        {/* E-book and Support Section - Pode precisar ser personalizado para esta aula */}
        <div className="mt-10 w-full max-w-3xl text-center space-y-6 p-6 bg-card/30 rounded-lg border border-border/20 shadow-md">
          <div>
            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
              Clique no arquivo abaixo para baixar o material complementar desta aula.
            </p>
            <div className="mt-6">
              {/* ATENÇÃO: Atualize o href e o nome do arquivo se houver um e-book específico para esta aula */}
              <Link href="https://www.dropbox.com/scl/fi/fsiryayp5my8im9qvc59w/Ebook_Domine_as_Redes_Sociais_Corrigido.pdf?rlkey=7largbxkzv6nyztoxcx0v0tt3&st=1ua655el&dl=1" passHref legacyBehavior>
                <a target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="md" className="shine-button w-full sm:w-auto sm:size-lg">
                    <FileText className="mr-2 h-5 w-5" />
                    Baixar Material Complementar (PDF)
                  </Button>
                </a>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/30 text-sm text-muted-foreground">
            <h3 className="text-md font-semibold text-foreground mb-3">Suporte:</h3>
            <p>Email - <a href="mailto:teamveo3top@gmail.com" className="text-primary hover:underline">teamveo3top@gmail.com</a></p>
            <p className="mt-1">Tiktok - experimentoscuriosos1</p>
            <p className="mt-1">Instagram - Ia.malucas</p>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-border/50 mt-auto text-center text-muted-foreground text-sm">
        <p>© Team-Veo3 – 2025</p>
      </footer>
    </div>
  );
}
