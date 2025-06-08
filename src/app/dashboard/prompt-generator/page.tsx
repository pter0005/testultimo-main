
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Rocket,
  Clapperboard,
  Heart,
  Smile,
  Video,
  Drama,
  Sparkles,
  Search,
  Building2,
  Film,
  Wand2,
  Copy,
  Loader2,
  Lightbulb,
  Languages,
  Captions,
  ListX,
  Music2,
  User,
  MessageSquareText,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Footer from '@/components/layout/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  generateVeo3Prompt,
} from '@/ai/flows/veo3-prompt-generator-flow';
import {
  GenerateVeo3PromptInputSchema,
  type GenerateVeo3PromptInput,
  veo3PromptFieldDescriptions
} from '@/lib/schemas/veo3-prompt-schema';
import { useToast } from '@/hooks/use-toast';

const videoTypeOptions = [
  { id: 'action', label: 'Ação', icon: Clapperboard },
  { id: 'romance', label: 'Romance', icon: Heart },
  { id: 'comedy', label: 'Comédia', icon: Smile },
  { id: 'vlog', label: 'Vlog', icon: Video },
  { id: 'drama', label: 'Drama', icon: Drama },
  { id: 'fantasy', label: 'Fantasia', icon: Sparkles },
  { id: 'suspense', label: 'Suspense', icon: Search },
  { id: 'institutional', label: 'Institucional', icon: Building2 },
  { id: 'outro', label: 'Outro', icon: Film },
];

const creativityLevelOptions = ['Baixa', 'Média', 'Alta'] as const;
// const spokenLanguageOptions = ['Tem fala', 'Sem fala', 'Apenas legenda'] as const; // Not directly used here, but in schema
// const yesNoOptions = ['Sim', 'Não'] as const; // Not directly used here, but in schema


type PromptFormValues = GenerateVeo3PromptInput;

const creativityLevelMap: Record<typeof creativityLevelOptions[number], number> = {
  'Baixa': 0,
  'Média': 1,
  'Alta': 2,
};
const creativityLevelReverseMap: Record<number, typeof creativityLevelOptions[number]> = {
  0: 'Baixa',
  1: 'Média',
  2: 'Alta',
};

export default function PromptGeneratorPage() {
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const { toast } = useToast();

  const promptForm = useForm<PromptFormValues>({
    resolver: zodResolver(GenerateVeo3PromptInputSchema),
    defaultValues: {
      videoType: '',
      sceneDescription: '',
      mainSubjects: '',
      hasSpecificAccent: 'Não',
      accentDescription: '',
      hasSceneDialogues: 'Não',
      sceneDialoguesText: '',
      mainActions: '',
      visualStyle: 'cinematic and realistic',
      cameraAngle: '',
      additionalDetails: '',
      creativityLevel: 'Média',
      spokenLanguage: 'Sem fala',
      includeSubtitles: false,
      backgroundSounds: '',
      negativePrompts: '',
    },
  });

  const currentCreativitySliderValue = creativityLevelMap[promptForm.watch('creativityLevel')];
  const watchHasSpecificAccent = promptForm.watch('hasSpecificAccent');
  const watchHasSceneDialogues = promptForm.watch('hasSceneDialogues');

  const onPromptSubmit: SubmitHandler<PromptFormValues> = async (data) => {
    setIsPromptLoading(true);
    setGeneratedPrompt(null);
    console.log("Dados do formulário para o fluxo local:", data);

    try
    {
      const result = await generateVeo3Prompt(data);
      setGeneratedPrompt(result.generatedPrompt);
      toast({
        title: 'Prompt Gerado Localmente!',
        description: 'O prompt detalhado construído localmente está pronto.',
      });
    } catch (error) {
      console.error('Erro ao gerar prompt localmente:', error);
      let errorMessage = 'Ocorreu um problema ao tentar gerar o prompt localmente.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Erro ao Gerar Prompt',
        description: errorMessage,
      });
      setGeneratedPrompt(`Erro ao gerar prompt: ${errorMessage}`);
    } finally {
      setIsPromptLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: 'Prompt Copiado!',
        description: 'O prompt foi copiado para a área de transferência.',
      });
    }
  };

  const getFieldDescription = (fieldName: keyof PromptFormValues): string | undefined => {
    return veo3PromptFieldDescriptions[fieldName];
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
        <ScrollArea className="w-full max-w-3xl h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] pr-2 md:pr-4">
          <div className="w-full">
            <div className="text-center mb-8 md:mb-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary flex items-center justify-center">
                <Rocket className="mr-2 md:mr-3 h-7 w-7 md:h-8 md:w-8" />
                Gerador de Prompts Cinematográficos
              </h1>
              <p className="text-muted-foreground mt-2 text-base md:text-lg">Crie prompts detalhados para Google Veo 3 com base nas suas escolhas.</p>
            </div>

            <form onSubmit={promptForm.handleSubmit(onPromptSubmit)} className="space-y-6 md:space-y-8">
              <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">1. Gênero do Vídeo <span className="text-primary">*</span></CardTitle>
                  <CardDescription className="text-xs md:text-sm">{getFieldDescription('videoType')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="videoType"
                    control={promptForm.control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4"
                        disabled={isPromptLoading}
                      >
                        {videoTypeOptions.map((option) => (
                          <Label
                            key={option.id}
                            htmlFor={`videoType-${option.id}`}
                            className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 border border-input rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer bg-background/50 text-sm md:text-base"
                          >
                            <RadioGroupItem value={option.id} id={`videoType-${option.id}`} />
                            <option.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            <span>{option.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {promptForm.formState.errors.videoType && (
                    <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.videoType.message}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">2. Descrição da Cena <span className="text-primary">*</span></CardTitle>
                  <CardDescription className="text-xs md:text-sm">{getFieldDescription('sceneDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    {...promptForm.register('sceneDescription')}
                    maxLength={2500}
                    placeholder="Ex: Uma favela vibrante no Rio de Janeiro ao pôr do sol, com crianças brincando na rua e música tocando ao fundo. A luz dourada realça as cores das casas."
                    className="min-h-[80px] md:min-h-[100px] bg-input placeholder-muted-foreground"
                    disabled={isPromptLoading}
                  />
                  {promptForm.formState.errors.sceneDescription && (
                    <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.sceneDescription.message}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl flex items-center">
                        <MessageSquareText className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary"/>
                        Falas/Diálogos Adicionais na Cena
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">{getFieldDescription('hasSceneDialogues')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                    <Controller
                        name="hasSceneDialogues"
                        control={promptForm.control}
                        render={({ field }) => (
                            <RadioGroup
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value as 'Sim' | 'Não');
                                    if (value === 'Não') {
                                        promptForm.setValue('sceneDialoguesText', '', { shouldValidate: true });
                                    }
                                }}
                                className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4"
                                disabled={isPromptLoading}
                            >
                                <Label htmlFor="sceneDialogues-sim" className="flex items-center space-x-2 p-2 border border-input rounded-md hover:bg-accent cursor-pointer bg-background/50 text-sm md:text-base">
                                    <RadioGroupItem value="Sim" id="sceneDialogues-sim" />
                                    <span>Sim</span>
                                </Label>
                                <Label htmlFor="sceneDialogues-nao" className="flex items-center space-x-2 p-2 border border-input rounded-md hover:bg-accent cursor-pointer bg-background/50 text-sm md:text-base">
                                    <RadioGroupItem value="Não" id="sceneDialogues-nao" />
                                    <span>Não</span>
                                </Label>
                            </RadioGroup>
                        )}
                    />
                    {watchHasSceneDialogues === 'Sim' && (
                        <div>
                            <Label htmlFor="sceneDialoguesText" className="text-sm font-medium text-foreground/90">
                               {getFieldDescription('sceneDialoguesText') || "Digite as falas da cena (em Português-BR):"}
                            </Label>
                            <Textarea
                                id="sceneDialoguesText"
                                {...promptForm.register('sceneDialoguesText')}
                                maxLength={2500}
                                placeholder="Ex: Vendedor: 'Olha a promoção!' Cliente: 'Quanto custa?'"
                                className="mt-1 min-h-[80px] md:min-h-[100px] bg-input placeholder-muted-foreground"
                                disabled={isPromptLoading}
                            />
                            {promptForm.formState.errors.sceneDialoguesText && (
                                <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.sceneDialoguesText.message}</p>
                            )}
                        </div>
                    )}
                </CardContent>
              </Card>

              <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center"><User className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary"/>Personagem(ns)/Objetos Principais</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{getFieldDescription('mainSubjects')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <Textarea
                    {...promptForm.register('mainSubjects')}
                    maxLength={4000}
                    placeholder="Descreva o personagem principal ou objetos em foco..."
                    className="min-h-[100px] md:min-h-[120px] bg-input placeholder-muted-foreground"
                    disabled={isPromptLoading}
                  />
                  {promptForm.formState.errors.mainSubjects && (
                     <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.mainSubjects.message}</p>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-foreground/90">{getFieldDescription('hasSpecificAccent')}</Label>
                    <Controller
                        name="hasSpecificAccent"
                        control={promptForm.control}
                        render={({ field }) => (
                            <RadioGroup
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value as 'Sim' | 'Não');
                                    if (value === 'Não') {
                                      promptForm.setValue('accentDescription', '', { shouldValidate: true });
                                    }
                                }}
                                className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4 mt-1"
                                disabled={isPromptLoading}
                            >
                                <Label htmlFor="hasSpecificAccent-sim" className="flex items-center space-x-2 p-2 border border-input rounded-md hover:bg-accent cursor-pointer bg-background/50 text-sm md:text-base">
                                    <RadioGroupItem value="Sim" id="hasSpecificAccent-sim" />
                                    <span>Sim</span>
                                </Label>
                                <Label htmlFor="hasSpecificAccent-nao" className="flex items-center space-x-2 p-2 border border-input rounded-md hover:bg-accent cursor-pointer bg-background/50 text-sm md:text-base">
                                    <RadioGroupItem value="Não" id="hasSpecificAccent-nao" />
                                    <span>Não</span>
                                </Label>
                            </RadioGroup>
                        )}
                    />
                  </div>
                  {watchHasSpecificAccent === 'Sim' && (
                    <div>
                      <Label htmlFor="accentDescription" className="text-sm font-medium text-foreground/90">
                        {getFieldDescription('accentDescription') || "Descreva o sotaque:"}
                      </Label>
                      <Input
                        id="accentDescription"
                        {...promptForm.register('accentDescription')}
                        maxLength={200}
                        placeholder="Ex: Carioca, Baiano, Caipira"
                        className="mt-1 bg-input placeholder-muted-foreground"
                        disabled={isPromptLoading}
                      />
                       {promptForm.formState.errors.accentDescription && (
                        <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.accentDescription.message}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">4. Ações/Eventos Principais</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{getFieldDescription('mainActions')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    {...promptForm.register('mainActions')}
                    maxLength={2500}
                    placeholder="Ex: Ele começa a pintar um mural colorido na parede de uma casa, interagindo com os moradores que passam."
                    className="min-h-[80px] md:min-h-[100px] bg-input placeholder-muted-foreground"
                    disabled={isPromptLoading}
                  />
                  {promptForm.formState.errors.mainActions && (
                     <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.mainActions.message}</p>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">5. Estilo Visual</CardTitle>
                     <CardDescription className="text-xs md:text-sm">{getFieldDescription('visualStyle')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      {...promptForm.register('visualStyle')}
                      maxLength={300}
                      placeholder="Ex: Cinemático realista, anime..."
                      className="bg-input placeholder-muted-foreground"
                      disabled={isPromptLoading}
                    />
                    {promptForm.formState.errors.visualStyle && (
                        <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.visualStyle.message}</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">6. Câmera e Composição</CardTitle>
                     <CardDescription className="text-xs md:text-sm">{getFieldDescription('cameraAngle')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      {...promptForm.register('cameraAngle')}
                      maxLength={300}
                      placeholder="Ex: Close-up, tomada aérea..."
                      className="bg-input placeholder-muted-foreground"
                      disabled={isPromptLoading}
                    />
                     {promptForm.formState.errors.cameraAngle && (
                        <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.cameraAngle.message}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center"><Lightbulb className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary"/>Nível de Criatividade</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{getFieldDescription('creativityLevel')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-3">
                  <div className="text-center font-medium text-primary text-sm md:text-base">
                    {creativityLevelReverseMap[currentCreativitySliderValue]}
                  </div>
                  <Controller
                    name="creativityLevel"
                    control={promptForm.control}
                    render={({ field }) => (
                      <Slider
                        value={[creativityLevelMap[field.value]]}
                        onValueChange={(value) => {
                          field.onChange(creativityLevelReverseMap[value[0]]);
                        }}
                        min={0}
                        max={2}
                        step={1}
                        className="w-full"
                        disabled={isPromptLoading}
                      />
                    )}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>Baixa</span>
                    <span>Média</span>
                    <span>Alta</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center"><Languages className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary"/>Diretiva Geral de Linguagem Falada</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{getFieldDescription('spokenLanguage')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="spokenLanguage"
                    control={promptForm.control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as "Tem fala" | "Sem fala" | "Apenas legenda")}
                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4"
                        disabled={isPromptLoading}
                      >
                        {(["Tem fala", "Sem fala", "Apenas legenda"] as const).map((option) => (
                          <Label key={option} htmlFor={`spokenLang-${option}`} className="flex items-center space-x-2 p-2 border border-input rounded-md hover:bg-accent cursor-pointer bg-background/50 text-sm md:text-base">
                            <RadioGroupItem value={option} id={`spokenLang-${option}`} />
                            <span>{option}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center"><Captions className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary"/>Incluir Legendas?</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{getFieldDescription('includeSubtitles')}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center space-x-2 md:space-x-3">
                  <Controller
                    name="includeSubtitles"
                    control={promptForm.control}
                    render={({ field }) => (
                        <Switch
                            id="includeSubtitles"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPromptLoading}
                        />
                    )}
                  />
                  <Label htmlFor="includeSubtitles" className="text-sm md:text-base">
                    {promptForm.watch('includeSubtitles') ? "Sim, incluir legendas (PT-BR)" : "Não incluir legendas"}
                  </Label>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl flex items-center"><Music2 className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary"/>Sons de Fundo</CardTitle>
                    <CardDescription className="text-xs md:text-sm">{getFieldDescription('backgroundSounds')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      {...promptForm.register('backgroundSounds')}
                      maxLength={300}
                      placeholder="Ex: chuva forte, tráfego da cidade..."
                      className="bg-input placeholder-muted-foreground"
                      disabled={isPromptLoading}
                    />
                     {promptForm.formState.errors.backgroundSounds && (
                        <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.backgroundSounds.message}</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl flex items-center"><ListX className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary"/>Prompts Negativos</CardTitle>
                    <CardDescription className="text-xs md:text-sm">{getFieldDescription('negativePrompts')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      {...promptForm.register('negativePrompts')}
                      maxLength={300}
                      placeholder="Ex: baixa resolução, texto na tela..."
                      className="bg-input placeholder-muted-foreground"
                      disabled={isPromptLoading}
                    />
                     {promptForm.formState.errors.negativePrompts && (
                        <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.negativePrompts.message}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card/70 backdrop-blur-md border border-border/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Detalhes Adicionais</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{getFieldDescription('additionalDetails')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    {...promptForm.register('additionalDetails')}
                    maxLength={1500}
                    placeholder="Ex: Foco na alegria do personagem. Ritmo acelerado com cortes rápidos. Trilha sonora indie folk animada."
                    className="min-h-[80px] md:min-h-[100px] bg-input placeholder-muted-foreground"
                    disabled={isPromptLoading}
                  />
                   {promptForm.formState.errors.additionalDetails && (
                        <p className="text-xs md:text-sm font-medium text-destructive mt-2">{promptForm.formState.errors.additionalDetails.message}</p>
                    )}
                </CardContent>
              </Card>

              <div className="space-y-3 md:space-y-4">
                 <Button type="submit" size="lg" className="w-full shine-button bg-primary hover:bg-primary/90 text-base md:text-lg" disabled={isPromptLoading}>
                  {isPromptLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Montando Prompt Detalhado...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" /> Gerar Prompt Detalhado
                    </>
                  )}
                </Button>
              </div>
            </form>

            { generatedPrompt && (
            <Card className="mt-8 md:mt-10 bg-card/80 backdrop-blur-md border-primary/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-primary">Seu Prompt Gerado:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <ScrollArea className="h-[150px] md:h-[200px] w-full p-1">
                  <div className="p-3 bg-input rounded-md text-foreground whitespace-pre-wrap break-words min-h-[130px] md:min-h-[180px] flex items-start justify-start text-sm md:text-base">
                    {isPromptLoading && !generatedPrompt ? (
                      <span className="text-muted-foreground italic flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processando, aguarde...</span>
                    ) : generatedPrompt ? (
                      generatedPrompt
                    ) : (
                      <span className="text-muted-foreground">Seu prompt construído localmente aparecerá aqui.</span>
                    )}
                  </div>
                </ScrollArea>
                {generatedPrompt && !generatedPrompt.startsWith("Erro:") && !isPromptLoading && (
                  <Button onClick={copyToClipboard} variant="outline" className="w-full shine-button text-sm md:text-base">
                    <Copy className="mr-2 h-4 w-4" /> Copiar Prompt
                  </Button>
                )}
              </CardContent>
            </Card>
            )}
          </div>
        </ScrollArea>
      </main>

      <Footer className="py-6 md:py-8 border-t border-border/50 mt-auto text-center text-muted-foreground text-xs md:text-sm" />
    </div>
  );
}
