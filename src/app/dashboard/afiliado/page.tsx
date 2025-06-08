
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, ShoppingBag, ExternalLink, FileText } from 'lucide-react'; // Adicionado FileText
import Footer from '@/components/layout/Footer';

export default function AfiliadoPage() {
  const affiliateBenefits = [
    "Ensino 100% prático, direto ao ponto",
    "Método exclusivo para criar vários vídeos com uma conta só e totalmente de graça — o grande diferencial que vende!",
    "Técnicas de prompt engineering, personalização e estratégias de monetização",
    "Ideal para quem quer ganhar dinheiro com vídeos, criar conteúdo ou oferecer serviços como freelancer"
  ];

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
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-primary">
            Programa de Afiliados VEO3 Academy
          </h1>
          
          <div className="bg-card/70 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-xl border border-border/30 space-y-6">
            <p className="text-lg text-foreground/90 leading-relaxed">
              Divulgue o curso <strong className="text-primary">"Domine o Google Veo 3"</strong> e ajude milhares de pessoas a criarem vídeos profissionais com inteligência artificial, mesmo que nunca tenham editado um vídeo antes!
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mt-6 mb-3">Por que se tornar um afiliado?</h2>
            <ul className="space-y-3 text-foreground/80">
              {affiliateBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-primary/10 rounded-md border border-primary/30">
              <p className="text-lg font-semibold text-primary flex items-center">
                <ShoppingBag className="h-6 w-6 mr-3 shrink-0" />
                Ótima oportunidade para afiliados!
              </p>
              <p className="text-foreground/80 mt-2">
                Promova um curso com alta demanda, linguagem acessível e aplicação imediata.
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xl text-foreground/90 leading-relaxed">
                👉 Comece a divulgar agora e ajude seus seguidores a transformar ideias em vídeos incríveis — e ainda ganhar dinheiro com isso!
              </p>
            </div>
          </div>

          <div className="mt-10 w-full bg-card/30 rounded-lg border border-border/20 shadow-md p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 text-center">Instruções para se Afiliar</h2>
            <p className="text-foreground/90 leading-relaxed text-center mb-6">
              Acesse nosso guia com instruções e materiais para te ajudar a divulgar o curso!
            </p>
            <div className="text-center">
              <Link href="https://www.dropbox.com/scl/fi/fsiryayp5my8im9qvc59w/Ebook_Domine_as_Redes_Sociais_Corrigido.pdf?rlkey=7largbxkzv6nyztoxcx0v0tt3&st=6742rgn1&dl=1" passHref legacyBehavior>
                <a target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="lg" className="shine-button">
                    <FileText className="mr-2 h-5 w-5" />
                    Baixar Guia de Afiliação (PDF)
                  </Button>
                </a>
              </Link>
            </div>
          </div>

          <div className="mt-10 w-full text-center space-y-6 p-6 bg-card/30 rounded-lg border border-border/20 shadow-md">
            <div className="mt-8 pt-6 border-t border-border/30 text-sm text-muted-foreground">
              <h3 className="text-md font-semibold text-foreground mb-3">Suporte para Afiliados:</h3>
              <p>Email - <a href="mailto:teamveo3top@gmail.com" className="text-primary hover:underline">teamveo3top@gmail.com</a></p>
              <p className="mt-1">Tiktok - experimentoscuriosos1</p>
              <p className="mt-1">Instagram - Ia.malucas</p>
            </div>
          </div>
        </div>
      </main>

      <Footer className="py-8 border-t border-border/50 mt-auto text-center text-muted-foreground text-sm" />
    </div>
  );
}
