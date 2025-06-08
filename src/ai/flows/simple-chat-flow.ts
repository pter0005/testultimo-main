
'use server';
/**
 * @fileOverview Um fluxo Genkit simples para um chatbot.
 * ATUALMENTE OPERANDO EM MODO LOCAL SIMPLIFICADO (SEM IA EXTERNA).
 *
 * - chatWithAI - Função que lida com a pergunta do usuário e retorna uma resposta.
 * - ChatInput - O tipo de entrada para a função chatWithAI.
 * - ChatOutput - O tipo de retorno para a função chatWithAI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatInputSchema = z.object({
  question: z.string().min(1, { message: 'A pergunta não pode estar vazia.' }),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  answer: z.string().describe('A resposta gerada.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// Função principal exportada que será chamada pelo frontend
export async function chatWithAI(input: ChatInput): Promise<ChatOutput> {
  // Validação da entrada
  try {
    ChatInputSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Pergunta inválida: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error('Ocorreu um erro ao processar sua pergunta.');
  }

  // Lógica do chatbot local simplificado
  const userAnswer = input.question.toLowerCase();
  let botResponse = `Você perguntou: "${input.question}". \n\nEu sou um bot de demonstração e minhas respostas são limitadas por enquanto!`;

  if (userAnswer.includes("olá") || userAnswer.includes("oi")) {
    botResponse = "Olá! Como posso te ajudar hoje (de forma simples)?";
  } else if (userAnswer.includes("como você está")) {
    botResponse = "Estou funcionando, obrigado por perguntar! E você?";
  } else if (userAnswer.includes("adeus") || userAnswer.includes("tchau")) {
    botResponse = "Até logo! Volte sempre.";
  } else if (userAnswer.includes("obrigado") || userAnswer.includes("obrigada")) {
    botResponse = "De nada! 😊";
  }


  // Simula um pequeno atraso, como se fosse uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 300));

  return { answer: botResponse };
}


// O CÓDIGO ABAIXO REFERENTE À IA EXTERNA (OpenAI) É MANTIDO PARA FACILITAR UMA FUTURA REATIVAÇÃO,
// MAS NÃO ESTÁ SENDO UTILIZADO PELA FUNÇÃO EXPORTADA chatWithAI.

/*
const chatPromptOpenAI = ai.definePrompt({
  name: 'simpleChatPromptOpenAI',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `Você é um assistente de IA amigável e prestativo.
Responda à seguinte pergunta do usuário de forma concisa e útil:

Pergunta do Usuário:
{{{question}}}

Sua Resposta:
`,
  model: 'openai/gpt-3.5-turbo', // Especifica o modelo OpenAI a ser usado
  config: {
    temperature: 0.7,
  }
});

const chatFlowWithOpenAI = ai.defineFlow(
  {
    name: 'simpleChatFlowOpenAI',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    try {
      // Verifica se a OPENAI_API_KEY está disponível antes de tentar chamar o fluxo
      if (!process.env.OPENAI_API_KEY) {
        console.error("Chatbot OpenAI: OPENAI_API_KEY não configurada. Retornando resposta padrão.");
        // Nota: Na versão simplificada atual, este fluxo não é chamado se a chave não estiver presente na função exportada.
        // Esta verificação aqui seria uma segunda camada se o fluxo fosse chamado diretamente.
        return { answer: "Desculpe, o serviço de chat avançado não está configurado corretamente no momento. Verifique as configurações da API Key da OpenAI." };
      }
      const { output } = await chatPromptOpenAI(input);
      if (!output || typeof output.answer !== 'string') {
        console.error('Chatbot OpenAI: A IA não retornou uma resposta de texto válida.', output);
        throw new Error('A IA não conseguiu gerar uma resposta ou o formato é inesperado.');
      }
      return output;
    } catch (error) {
      console.error('Chatbot OpenAI: Erro durante a execução do fluxo de chat:', error);
      if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
         throw new Error('Problema com a chave da API OpenAI. Verifique se está correta e ativa.');
      }
      if (error instanceof Error && (error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("limit"))) {
        throw new Error('Você excedeu sua cota ou limite de uso com a API OpenAI.');
      }
      throw new Error('Ocorreu um erro ao se comunicar com a IA para o chat.');
    }
  }
);

// Para reativar a IA da OpenAI, a função chatWithAI deveria chamar chatFlowWithOpenAI(input)
// e a verificação da OPENAI_API_KEY poderia ser centralizada.
*/
