
import {genkit} from 'genkit';
import { googleAI } from '@genkit-ai/googleai'; // Importação adicionada

// import wasmInit from 'vsda/rust/web/vsda_bg.wasm' // Importação problemática removida
 
const googleApiKey = process.env.GOOGLE_API_KEY;
const pluginsToUse = [];

if (googleApiKey && googleApiKey.trim() !== "") {
  try {
    pluginsToUse.push(googleAI({ apiKey: googleApiKey }));
    console.log("[Genkit Setup] Plugin Google AI configurado.");
  } catch (e) {
    console.error("[Genkit Setup] Erro ao inicializar o plugin Google AI:", e);
    console.warn(
      "\n\n**************************************************************************************\n" +
      "AVISO: Falha ao carregar Google AI. Verifique a GOOGLE_API_KEY e as dependências.\n" +
      "**************************************************************************************\n\n"
    );
  }
} else {
  console.warn(
    "\n\n**************************************************************************************\n" +
    "AVISO: GOOGLE_API_KEY não encontrada ou está vazia. Funcionalidades dependentes do Google AI\n" +
    "não operarão corretamente até que a chave seja configurada no arquivo .env (ou .env.local)\n" +
    "e o servidor reiniciado.\n" +
    "**************************************************************************************\n\n"
  );
}

export const ai = genkit({
  plugins: pluginsToUse,
  // logLevel: 'debug',
  // logSinks: ['json'],
});

if (pluginsToUse.length === 0) {
    console.log("[Genkit Setup] Nenhum plugin de IA externo configurado (Google AI). As funcionalidades de IA atuais (Gerador de Prompt, Chatbot) operarão em modo local/simplificado se dependerem desses plugins.");
} else {
    console.log("[Genkit Setup] Genkit inicializado com plugins:", pluginsToUse.map(p => p.name || 'Unnamed Plugin'));
}
