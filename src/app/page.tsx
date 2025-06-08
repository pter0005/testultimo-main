// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login');
  // O redirect deve ser a última coisa, mas para garantir que o componente retorne algo,
  // podemos adicionar um return null ou um fallback simples, embora não deva ser alcançado.
  return null;
}
