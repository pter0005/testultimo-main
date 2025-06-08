
'use client';

import type { FC, ElementType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, type LucideIcon } from 'lucide-react';

export interface ModuleCardProps {
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  linkUrl: string;
  buttonText?: string;
  buttonIcon?: LucideIcon | ElementType; // Allow LucideIcon or any other component type
}

export const ModuleCard: FC<ModuleCardProps> = ({
  title,
  description,
  imageUrl,
  dataAiHint,
  linkUrl,
  buttonText = 'Assistir agora',
  buttonIcon: ButtonIconComponent = PlayCircle,
}) => {
  return (
    <Card className="bg-card/70 border-border/50 transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden rounded-lg hover:scale-105 hover:shadow-[0_0_25px_3px_hsl(var(--primary)_/_0.4)]">
      <CardHeader className="p-0 relative">
        <Image
          src={imageUrl}
          alt={title}
          width={300}
          height={170}
          className="w-full h-auto object-cover aspect-[300/170]"
          data-ai-hint={dataAiHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold leading-tight mb-1 text-foreground">
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3"> {/* Increased line-clamp for longer descriptions */}
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={linkUrl} className="w-full">
          <Button variant="ghost" className="w-full justify-start text-sm text-primary hover:text-primary/80 hover:bg-primary/10 p-2 shine-button">
            <ButtonIconComponent className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

