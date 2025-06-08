
"use client";

import Footer from '@/components/layout/Footer';
import Logo from '@/components/common/Logo';
import LoginForm from '@/components/auth/LoginForm';
import InteractiveBackground from '@/components/common/InteractiveBackground'; // Adicionada a importação
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden">
      <InteractiveBackground /> {/* Componente adicionado de volta */}
      <div className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-md">
        <Logo className="text-5xl mb-8" />
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-md shadow-xl rounded-xl border-border/30">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center text-primary">Acesse sua Conta</h1>
            <p className="text-sm text-muted-foreground text-center">
              Bem-vindo de volta! Faça login para continuar.
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
      <Footer className="py-8 absolute bottom-0 w-full z-10" />
    </div>
  );
}
