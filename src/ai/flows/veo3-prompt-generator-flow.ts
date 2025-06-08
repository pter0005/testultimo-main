
'use server';
/**
 * @fileOverview Fluxo Genkit para gerar prompts para o Google Veo 3.
 * OPERA LOCALMENTE, construindo um prompt detalhado a partir das entradas do usuário.
 *
 * - generateVeo3Prompt - Função que lida com a geração de prompts.
 * - GenerateVeo3PromptInput - O tipo de entrada para a função generateVeo3Prompt (importado).
 * - GenerateVeo3PromptOutput - O tipo de retorno para a função generateVeo3Prompt.
 */

import { z } from 'zod';
import { GenerateVeo3PromptInputSchema, type GenerateVeo3PromptInput } from '@/lib/schemas/veo3-prompt-schema';

// Constantes para as opções do formulário, para manter consistência com a UI
const spokenLanguageOptions = ['Tem fala', 'Sem fala', 'Apenas legenda'] as const;

// Schema Zod para saída
const GenerateVeo3PromptOutputSchema = z.object({
  generatedPrompt: z.string().describe('O prompt detalhado gerado para o Google Veo 3.'),
});
export type GenerateVeo3PromptOutput = z.infer<typeof GenerateVeo3PromptOutputSchema>;


function constructDetailedVeo3Prompt(input: GenerateVeo3PromptInput): string {
  const {
    videoType,
    sceneDescription,
    mainSubjects,
    hasSpecificAccent,
    accentDescription,
    hasSceneDialogues,
    sceneDialoguesText,
    mainActions,
    visualStyle,
    cameraAngle,
    additionalDetails,
    creativityLevel,
    spokenLanguage,
    includeSubtitles,
    backgroundSounds,
    negativePrompts
  } = input;

  const promptLines: string[] = [];

  promptLines.push(
    `**Core Concept:** Generate a highly detailed, ${videoType.toLowerCase()} video segment, optimized for Google Veo 3. The overall tone should be [Infer tone from genre/description - e.g., tense, comedic, awe-inspiring, melancholic].`
  );
  promptLines.push(
    `**Overall Style:** ${visualStyle}. Aim for expressive facial animations, nuanced character performances, photorealistic textures (unless a stylized look is specified), and sophisticated, purposeful camera work.`
  );
  promptLines.push(
    `**Dialogues and Language:** All spoken dialogues MUST be in **Portuguese (Brazilian)**. If character descriptions include specific sotaques (accents), they must be rendered authentically and naturally.`
  );
  promptLines.push(
    `**Creativity Level:** **${creativityLevel}**. This should guide the balance between strict adherence to the prompt and imaginative visual interpretations. Low creativity means more literal, High means more artistic license within the described bounds.`
  );

  promptLines.push(`\n**II. Scene & Environment Details:**`);
  promptLines.push(
    `**Primary Setting:** ${sceneDescription}. Consider elements like: ` +
    `\n  - **Time of Day & Light:** (e.g., "Golden hour casting long shadows", "Overcast midday with flat, diffused light", "Neon-lit urban nightscape with reflections on wet pavement").` +
    `\n  - **Weather & Atmosphere:** (e.g., "Gentle rain falling", "Thick morning fog", "Crisp autumn air with falling leaves", "Oppressive summer heat haze").` +
    `\n  - **Dominant Colors & Palette:** (e.g., "Muted earth tones with a single splash of vibrant red", "Cool blues and grays creating a somber mood", "Saturated, high-contrast comic-book colors").` +
    `\n  - **Key Textures & Materials:** (e.g., "Rough-hewn stone, weathered wood, shimmering silk, polished chrome").`
  );

  promptLines.push(`\n**III. Characters / Main Subjects:**`);
  if (mainSubjects) {
    let characterPrompt = `**Main Focus:** ${mainSubjects}.`;
    if (hasSpecificAccent === 'Sim' && accentDescription) {
      characterPrompt += ` This character speaks with a **${accentDescription}** accent in Portuguese (Brazilian). Ensure any dialogue provided for this character reflects this.`;
    } else {
      characterPrompt += ` Any dialogue for this character is in standard Portuguese (Brazilian).`;
    }
    promptLines.push(
      characterPrompt +
      `\n  - For each character described, detail: ` +
      `\n    - **Physicality:** Age appearance, build (slender, muscular, heavyset), height, distinct facial features (e.g., sharp nose, high cheekbones), hair (color, style, length), eye color.` +
      `\n    - **Attire:** Specific clothing items, style (casual, formal, period-specific), fabric, condition (new, worn, pristine, tattered), and any accessories.` +
      `\n    - **Props:** Objects they carry or interact with significantly.` +
      `\n    - **Expressions & Body Language:** Key emotions to convey and how (e.g., "furrowed brow and clenched fists to show anger", "eyes wide with wonder, a slight smile").` +
      `\n    - **Dialogue Delivery (if applicable):** If dialogue is included in their description, it MUST be in Portuguese (Brazilian), considering the specified accent.`
    );
  } else {
    promptLines.push(
      "No specific characters detailed by the user. If characters are implied by the scene or actions, their appearance and behavior should be contextually appropriate and visually compelling, fitting the overall style and tone. Any implied dialogue is in Portuguese (Brazilian)."
    );
  }

  promptLines.push(`\n**IV. Key Actions, Narrative Beats & Scene Dialogues:**`);
  if (mainActions) {
    promptLines.push(
      `**Core Events & Interactions:** ${mainActions}. Describe the sequence and impact of these actions. ` +
      `\n  - Specify the dynamics (e.g., "a sudden, violent confrontation", "a slow, deliberate reveal", "a humorous misunderstanding escalating").`
    );
  } else {
    promptLines.push("No specific key actions detailed by the user. The scene should evolve organically based on the environment and characters, or maintain a specific mood if it's more atmospheric.");
  }

  if (hasSceneDialogues === 'Sim' && sceneDialoguesText) {
    promptLines.push(
      `**Additional Scene Dialogues:** The following dialogues occur in the scene, spoken in **Portuguese (Brazilian)** by relevant characters (not necessarily the main subject, or by off-screen characters if appropriate for the context):` +
      `\n  - "${sceneDialoguesText.replace(/\n/g, "\"\n  - \"")}"`
    );
  }

  promptLines.push(`\n**V. Cinematography & Visual Direction:**`);
  if (cameraAngle) {
    promptLines.push(
      `**Camera Work & Composition:** ${cameraAngle}. Consider: ` +
      `\n  - **Shot Types:** (e.g., "Sequence opens with an establishing long shot, transitions to medium shots for dialogue, and uses an extreme close-up for emotional impact."). ` +
      `\n  - **Camera Movements:** (e.g., "Slow tracking shot following the character", "Dynamic handheld camera during a chase sequence", "Static, observational tripod shots", "Sweeping drone establishing shot").` +
      `\n  - **Angles:** (e.g., "Low-angle shots to make the subject imposing", "High-angle to show vulnerability or an overview").` +
      `\n  - **Focus & Depth of Field:** (e.g., "Shallow depth of field to isolate the character", "Deep focus to show the environment's scale").`
    );
  } else {
    promptLines.push(
      "**Camera Work & Composition:** Employ standard cinematic best practices. Vary shot types, angles, and movements to create visual interest and support the narrative or mood effectively. Default to realistic and immersive camera motion unless the visual style dictates otherwise."
    );
  }

  let pacingExtracted = false;
  if (additionalDetails) {
    const paceKeywords = ["ritmo", "edição", "cuts", "pace", "velocidade de corte", "estilo de edição"];
    for (const keyword of paceKeywords) {
        const regex = new RegExp(`.*(${keyword}[^.]*.).*`, 'i'); // Try to match sentence
        const paceMatch = additionalDetails.match(regex);
        if (paceMatch && paceMatch[0]) {
            promptLines.push(`**Pacing & Editing Style:** (Extracted from additional details) ${paceMatch[0]}. (e.g., "Fast-paced with quick, rhythmic cuts", "Slow, deliberate pacing with long takes and smooth transitions").`);
            pacingExtracted = true;
            break;
        }
    }
  }
  if (!pacingExtracted) {
     promptLines.push(`**Pacing & Editing Style:** The pacing should match the genre and scene content. (e.g., action sequences benefit from faster cuts, dramatic moments from longer takes).`);
  }


  promptLines.push(`\n**VI. Audio Design:**`);
  const generalSpokenLanguageDirective: Record<typeof spokenLanguageOptions[number], string> = {
    'Tem fala': "The video is expected to have spoken content in Portuguese (Brazilian).",
    'Sem fala': "The video primarily uses visual storytelling and ambient sounds, with no spoken dialogues from characters.",
    'Apenas legenda': "Communication is conveyed through text captions in Portuguese (Brazilian); no spoken voice from characters."
  };
  promptLines.push(`**General Dialogue Approach:** ${generalSpokenLanguageDirective[spokenLanguage]}`);

  if (backgroundSounds) {
    promptLines.push(`**Soundscape & Ambience:** Rich and immersive. Include: ${backgroundSounds}. Consider the quality of sound (e.g., "clear and crisp", "distant and muffled", "echoing").`);
  } else {
    promptLines.push("**Soundscape & Ambience:** Rich and immersive. Ambient sounds should be contextually appropriate to the scene, enhancing realism and atmosphere.");
  }

  let musicExtracted = false;
  if (additionalDetails) {
    const musicKeywords = ["música", "trilha sonora", "soundtrack", "tema musical"];
     for (const keyword of musicKeywords) {
        const regex = new RegExp(`.*(${keyword}[^.]*.).*`, 'i'); // Try to match sentence
        const musicMatch = additionalDetails.match(regex);
        if (musicMatch && musicMatch[0]) {
            promptLines.push(`**Music (Optional):** (Extracted from additional details) ${musicMatch[0]}. Specify genre, mood, and how it should interact with the scene (e.g., "underscore, tense electronic", "prominent, uplifting orchestral score").`);
            musicExtracted = true;
            break;
        }
     }
  }


  promptLines.push(`\n**VII. Subtitles & Negative Constraints:**`);
  promptLines.push(`**Subtitles:** ${includeSubtitles ? "Enabled (in Portuguese (Brazilian), accurately transcribing any spoken dialogue)" : "Disabled"}.`);

  if (negativePrompts) {
    promptLines.push(`**Negative Prompts (AVOID THESE):** Explicitly AVOID the following elements: ${negativePrompts}. This includes ensuring no unwanted text overlays, glitches, or out-of-context elements.`);
  }

   promptLines.push(`\n**VIII. Final Notes for AI:**`);
   if (additionalDetails) {
        let remainingDetails = additionalDetails;
        if (pacingExtracted) {
            const paceKeywords = ["ritmo", "edição", "cuts", "pace", "velocidade de corte", "estilo de edição"];
            for (const keyword of paceKeywords) {
                const regex = new RegExp(`.*(${keyword}[^.]*.).*`, 'i'); // Try to match sentence
                remainingDetails = remainingDetails.replace(regex, '').trim();
            }
        }
        if (musicExtracted) {
            const musicKeywords = ["música", "trilha sonora", "soundtrack", "tema musical"];
            for (const keyword of musicKeywords) {
                const regex = new RegExp(`.*(${keyword}[^.]*.).*`, 'i'); // Try to match sentence
                remainingDetails = remainingDetails.replace(regex, '').trim();
            }
        }
        if (remainingDetails.length > 5) { // Arbitrary small length to avoid empty strings
             promptLines.push(`**User's Additional Specifications (Other):** Carefully consider these user-provided details for further refinement: ${remainingDetails}.`);
        }
   }
   promptLines.push(`The goal is a polished, professional, and highly engaging video segment. Pay close attention to continuity and the seamless integration of all specified elements. Emphasize emotional impact and visual storytelling.`);

  return promptLines.join("\n\n");
}

export async function generateVeo3Prompt(input: GenerateVeo3PromptInput): Promise<GenerateVeo3PromptOutput> {
  console.log("Executando generateVeo3Prompt LOCALMENTE com input:", input);
  try {
    // Validação Zod usando o schema importado
    const validatedInput = GenerateVeo3PromptInputSchema.parse(input);
    
    const constructedPrompt = constructDetailedVeo3Prompt(validatedInput);
    
    // Simula um pequeno atraso, como se fosse uma chamada de API (opcional, para UX)
    await new Promise(resolve => setTimeout(resolve, 100)); 

    console.log("Retornando prompt construído LOCALMENTE:", constructedPrompt);
    return { generatedPrompt: constructedPrompt };

  } catch (error: any) {
    console.error("Erro na validação ou processamento interno do fluxo LOCAL:", error);
    if (error instanceof z.ZodError) {
        // Re-lança o ZodError para que a infraestrutura do Server Action
        // possa lidar com ele e retornar um erro 400 estruturado.
        throw error;
    }
    // Para outros tipos de erro, garante que uma instância de Error seja lançada.
    if (error instanceof Error) {
        throw new Error(`Falha no processamento interno dos dados do prompt (local). Detalhe: ${error.message}`);
    }
    throw new Error(`Falha no processamento interno dos dados do prompt (local). Erro desconhecido: ${String(error)}`);
  }
}
