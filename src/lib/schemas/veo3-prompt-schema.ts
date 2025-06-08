
import { z, type ZodTypeAny } from 'zod';

const creativityLevelOptions = ['Baixa', 'Média', 'Alta'] as const;
const spokenLanguageOptions = ['Tem fala', 'Sem fala', 'Apenas legenda'] as const;
const yesNoOptions = ['Sim', 'Não'] as const;

export const GenerateVeo3PromptInputSchema = z.object({
  videoType: z.string({ required_error: 'Por favor, selecione o tipo de vídeo (gênero).' })
    .describe('Selecione o gênero ou tipo principal do vídeo a ser gerado.'),
  sceneDescription: z.string()
    .min(10, { message: 'Descrição da cena deve ter pelo menos 10 caracteres.' })
    .max(2500, { message: 'Descrição da cena não pode exceder 2500 caracteres.' })
    .describe('Detalhe o local, hora do dia, condições climáticas, iluminação, atmosfera geral, paleta de cores e texturas. Max: 2500 char.'),
  mainSubjects: z.string()
    .max(4000, { message: 'Detalhes do personagem não podem exceder 4000 caracteres.' })
    .optional()
    .describe('Personagens/objetos centrais: nome, idade aparente, tipo físico (detalhar altura, peso, porte), traços faciais (formato do rosto, nariz, boca, olhos), cabelo (cor, estilo, comprimento), olhos (cor), vestuário detalhado (estilo, tecido, condição), adereços, linguagem corporal, expressões chave, e motivações. Inclua falas principais do personagem aqui entre aspas. Ex: "Zé, 30s, 1.80m, porte atlético, rosto anguloso, cabelo preto curto, olhos castanhos, veste camiseta regata branca surrada e bermuda jeans rasgada. Expressão cansada. Fala: \'Aí sim, partiu praia!\'". Max: 4000 char.'),
  hasSpecificAccent: z.enum(yesNoOptions).default('Não')
    .describe('O personagem principal descrito acima tem um sotaque específico?'),
  accentDescription: z.string()
    .max(200, { message: 'Descrição do sotaque não pode exceder 200 caracteres.' })
    .optional()
    .describe('Se sim, qual o tipo de sotaque? (Ex: Carioca, Baiano, Caipira). Max: 200 char.'),
  hasSceneDialogues: z.enum(yesNoOptions).default('Não')
    .describe('Haverá falas/diálogos principais na cena (além dos do personagem principal)?'),
  sceneDialoguesText: z.string()
    .max(2500, { message: 'Falas da cena não podem exceder 2500 caracteres.' })
    .optional()
    .describe('Se sim, digite as falas/diálogos da cena aqui. Escreva em Português (Brasileiro). Max: 2500 char.'),
  mainActions: z.string()
    .max(2500, { message: 'Ações principais não podem exceder 2500 caracteres.' })
    .optional()
    .describe('Ações/eventos chave e interações, descrevendo o impacto e a dinâmica. Diálogos específicos podem ser adicionados no campo "Falas/Diálogos Adicionais na Cena" ou na descrição do personagem principal. Max: 2500 char.'),
  visualStyle: z.string()
    .max(300, { message: 'Estilo visual não pode exceder 300 caracteres.' })
    .optional()
    .default('cinematic and realistic')
    .describe('Estilo visual detalhado: e.g., "hyperrealistic com textura granulada", "onírico e etéreo com foco suave", "animação cel-shaded vibrante". Max: 300 char.'),
  cameraAngle: z.string()
    .max(300, { message: 'Ângulo da câmera não pode exceder 300 caracteres.' })
    .optional()
    .describe('Sugestão de câmera/composição inicial e movimentos chave. Ex: "Close-up extremo, travelling lento acompanhando, tomada aérea dinâmica". Max: 300 char.'),
  additionalDetails: z.string()
    .max(1500, { message: 'Detalhes adicionais não podem exceder 1500 caracteres.' })
    .optional()
    .describe('Detalhes como emoções predominantes, ritmo da edição (cortes rápidos, tomadas longas), sugestões de música (gênero, tom), e outros elementos específicos. Max: 1500 char.'),
  creativityLevel: z.enum(creativityLevelOptions).default('Média')
    .describe('Controle o quão criativa a IA será na geração do prompt.'),
  spokenLanguage: z.enum(spokenLanguageOptions).default('Sem fala')
    .describe('Define a abordagem geral para o áudio falado. Detalhes específicos de falas e sotaques são tratados nos campos de Personagem e Falas da Cena.'),
  includeSubtitles: z.boolean().optional().default(false)
    .describe('Marque para incluir legendas em Português (Brasileiro) no vídeo.'),
  backgroundSounds: z.string()
    .max(300, { message: 'Sons de fundo não podem exceder 300 caracteres.' })
    .optional()
    .describe('Sons de fundo desejados, separados por vírgula (ex: chuva forte, tráfego da cidade, cantos de pássaros exóticos). Qualidade do som (imersivo, abafado). Max: 300 char.'),
  negativePrompts: z.string()
    .max(300, { message: 'Prompts negativos não podem exceder 300 caracteres.' })
    .optional()
    .describe('Elementos a serem explicitamente evitados pela IA (ex: baixa resolução, texto na tela, animais). Max: 300 char.'),
}).refine((data) => {
  if (data.hasSpecificAccent === 'Sim') {
    return !!data.accentDescription?.trim();
  }
  return true;
}, {
  message: "Por favor, descreva o tipo de sotaque.",
  path: ["accentDescription"],
}).refine((data) => {
  if (data.hasSceneDialogues === 'Sim') {
    return !!data.sceneDialoguesText?.trim();
  }
  return true;
}, {
  message: "Por favor, insira as falas da cena.",
  path: ["sceneDialoguesText"],
});

export type GenerateVeo3PromptInput = z.infer<typeof GenerateVeo3PromptInputSchema>;

// Helper function to extract descriptions from the schema
const extractDescriptions = (schema: z.ZodObject<any, any, any>): Record<string, string | undefined> => {
  const descriptions: Record<string, string | undefined> = {};
  for (const key in schema.shape) {
    const fieldSchema = schema.shape[key] as ZodTypeAny; // ZodTypeAny is a base type for Zod schemas
    if (fieldSchema && fieldSchema._def && typeof fieldSchema._def.description === 'string') {
      descriptions[key] = fieldSchema._def.description;
    } else {
      // Fallback or log if description is not found, though .describe() should ensure it's there
      // console.warn(`Description not found for schema field: ${key}`);
      descriptions[key] = undefined;
    }
  }
  return descriptions;
};

export const veo3PromptFieldDescriptions: Record<keyof GenerateVeo3PromptInput, string | undefined> =
  extractDescriptions(GenerateVeo3PromptInputSchema) as Record<keyof GenerateVeo3PromptInput, string | undefined>;
