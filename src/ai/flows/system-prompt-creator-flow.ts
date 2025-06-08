
'use server';
/**
 * @fileOverview Fluxo Genkit para gerar "prompts de sistema" para instruir IAs de vídeo.
 * Usa a API da Hugging Face, com fallback para um prompt genérico se a API key não estiver configurada.
 *
 * - generateSystemPrompt - Função que lida com a geração do prompt de sistema.
 * - SystemPromptCreatorInput - O tipo de entrada para a função.
 * - SystemPromptCreatorOutput - O tipo de retorno para a função.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SystemPromptCreatorInputSchema = z.object({
  userInputTopic: z.string().min(10, { message: 'Por favor, descreva o tópico com pelo menos 10 caracteres.' }),
});
export type SystemPromptCreatorInput = z.infer<typeof SystemPromptCreatorInputSchema>;

const SystemPromptCreatorOutputSchema = z.object({
  generatedSystemPrompt: z.string().describe('O prompt de sistema detalhado gerado pela IA ou um prompt de exemplo.'),
});
export type SystemPromptCreatorOutput = z.infer<typeof SystemPromptCreatorOutputSchema>;

// Este é o "meta-prompt" que instrui a Hugging Face a criar um "prompt de sistema"
const PROMPT_FOR_SYSTEM_PROMPT_CREATION_HUGGINGFACE = `Você é um especialista em engenharia de prompts e na criação de prompts de sistema para modelos de IA generativa de vídeo, como o Google Veo 3.
Sua tarefa é gerar um conjunto de diretrizes detalhadas (um 'prompt de sistema') que um usuário poderá fornecer a outra IA para criar prompts de vídeo cinematográficos.
O usuário fornecerá um tópico ou objetivo principal. Baseado nisso, você deve elaborar o prompt de sistema.

O prompt de sistema gerado deve instruir a IA final a incluir, quando relevante para o tópico do usuário:
- Sugestões de movimentos de câmera (ex: POV, travelling, drone, close-up, plongée, contra-plongée, panorâmica, tilt).
- Tipos de ambientação, com foco no Brasil se o tópico sugerir (ex: urbano moderno, favela vibrante, sertão árido, praias paradisíacas, floresta amazônica densa, centros históricos coloniais, festas populares).
- Detalhes sobre descrição de personagens (aparência física, vestuário, adereços, arquétipos, motivações).
- Ênfase em expressões faciais e linguagem corporal para transmitir emoções específicas.
- Potencial para diálogo curto, impactante e natural em português brasileiro, se aplicável.
- Estrutura temporal para o vídeo (ex: divisão por segmentos de tempo como 0-2s, 3-5s, 6-8s, ou introdução, desenvolvimento, clímax).
- Estilo visual e atmosfera (ex: cinematográfico realista, documental imersivo, onírico surreal, suspense sombrio, comédia vibrante, nostálgico sépia).
- Considerar elementos narrativos como tom (ex: épico, íntimo, humorístico, tenso), ritmo (ex: rápido, lento, progressivo) e público-alvo.
- Uso de luz e cor para criar o ambiente desejado.
- Efeitos especiais sutis ou proeminentes, se o tópico pedir.

O resultado que você gerar deve ser APENAS o conjunto de diretrizes (o prompt de sistema), pronto para ser copiado e usado. Não inclua introduções como 'Aqui está o prompt de sistema:' ou qualquer texto explicativo seu.

Tópico/Objetivo fornecido pelo usuário: {{{userInputTopic}}}

Seu prompt de sistema gerado:`;

interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

const FALLBACK_SYSTEM_PROMPT = `AVISO: A HUGGING_FACE_API_KEY não está configurada no ambiente. A funcionalidade completa de geração de prompt de sistema está desabilitada.
Este é um exemplo genérico de prompt de sistema que você pode adaptar:

"Você é uma IA assistente para criação de prompts de vídeo. Com base no tópico do usuário, gere um prompt de vídeo detalhado.
O prompt deve considerar:
- Tópico: [Tópico fornecido pelo usuário aqui: {{{userInputTopic}}}]
- Estilo Visual: (ex: cinematográfico, documental, animação)
- Ambientação: (ex: local, hora do dia, atmosfera)
- Personagens: (ex: descrição física, vestuário, emoções)
- Ações Principais: (ex: o que acontece na cena)
- Movimentos de Câmera: (ex: close-up, travelling, drone)
- Áudio: (ex: diálogos em português brasileiro, trilha sonora, efeitos sonoros)
- Elementos a Evitar: (ex: texto na tela, baixa qualidade)

Lembre-se de instruir a IA final a ser criativa, mas respeitar as diretrizes fornecidas."

Para habilitar a geração de prompts de sistema pela IA da Hugging Face, configure a HUGGING_FACE_API_KEY.`;


async function callHuggingFaceAPI(prompt: string, userInputTopic: string): Promise<string> {
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  if (!apiKey) {
    console.warn("Hugging Face API Key não encontrada. Retornando prompt de sistema de fallback.");
    return FALLBACK_SYSTEM_PROMPT.replace('{{{userInputTopic}}}', userInputTopic);
  }

  const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.1'; 

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { 
          max_new_tokens: 512, 
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.1,
          return_full_text: false, 
        },
        options: {
          wait_for_model: true, 
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Erro desconhecido ao decodificar resposta da API." }));
      console.error(`Erro da API Hugging Face: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`Falha ao chamar API da Hugging Face: ${errorData?.error || response.statusText}`);
    }

    const result = await response.json() as HuggingFaceResponse[]; 
    
    if (result && result.length > 0 && result[0].generated_text) {
      return result[0].generated_text.trim();
    } else if (result && (result as any).error) {
      console.error("Erro retornado pela API Hugging Face no payload:", (result as any).error);
      throw new Error(`Erro da Hugging Face: ${(result as any).error}`);
    } else {
      console.error("Resposta inesperada da API Hugging Face:", result);
      throw new Error("Não foi possível extrair o texto gerado da resposta da Hugging Face.");
    }

  } catch (error) {
    console.error("Erro ao se comunicar com a Hugging Face:", error);
    if (error instanceof Error && error.message.includes("Chave da API")) {
      // Este erro específico não deveria acontecer se a verificação inicial da chave for feita,
      // mas mantido por segurança.
      return FALLBACK_SYSTEM_PROMPT.replace('{{{userInputTopic}}}', userInputTopic);
    }
    throw new Error("Erro na comunicação com o serviço de IA (Hugging Face) para gerar o prompt de sistema.");
  }
}


const systemPromptCreatorFlow = ai.defineFlow(
  {
    name: 'systemPromptCreatorFlow',
    inputSchema: SystemPromptCreatorInputSchema,
    outputSchema: SystemPromptCreatorOutputSchema,
  },
  async (input) => {
    // Se a API Key não estiver presente, callHuggingFaceAPI já retornará o fallback.
    // A chamada à API só acontecerá se a chave existir.
    const fullPromptForHF = PROMPT_FOR_SYSTEM_PROMPT_CREATION_HUGGINGFACE.replace('{{{userInputTopic}}}', input.userInputTopic);
    
    try {
      const generatedSystemPrompt = await callHuggingFaceAPI(fullPromptForHF, input.userInputTopic);
      if (!generatedSystemPrompt) {
        // Isso não deveria acontecer se callHuggingFaceAPI sempre retorna string ou lança erro
        throw new Error('A IA (Hugging Face) não retornou um prompt de sistema válido, nem um fallback.');
      }
      return { generatedSystemPrompt };
    } catch (error) {
      console.error("Erro detalhado no systemPromptCreatorFlow:", error);
      // Re-throw para ser pego pelo handler da página
      if (error instanceof Error) throw error;
      throw new Error("Falha ao gerar o prompt de sistema com a IA.");
    }
  }
);

export async function generateSystemPrompt(input: SystemPromptCreatorInput): Promise<SystemPromptCreatorOutput> {
  return systemPromptCreatorFlow(input);
}

    