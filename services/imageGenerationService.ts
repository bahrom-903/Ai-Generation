import { GoogleGenAI } from "@google/genai";
import { ArtStyle, GenerationConfig, FineTunedModel } from "../types";
import { FINE_TUNED_MODELS, GENERATION_MODELS } from "../constants";
import { generateWithFallback, generateReplicatePlaceholder } from "./fallbackImageService";
import { generateWithReplicate } from "./replicateService";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Primary API_KEY (Gemini) environment variable is not set. The app will rely on the fallback service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

/**
 * Имитирует отправку отчета об ошибке на сервер мониторинга.
 * @param apiName - Название API, которое вызвало ошибку.
 * @param error - Объект ошибки.
 */
async function reportApiFailure(apiName: 'gemini' | 'fallback' | 'replicate', error: any) {
    console.warn(`Reporting failure for ${apiName} API. Error: ${error.message}`);
    // В реальном приложении здесь был бы fetch-запрос на ваш сервер для логирования
    return Promise.resolve();
}


const base64ToPart = (base64: string) => {
    const mimeType = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';
    const data = base64.split(',')[1];
    return { inlineData: { mimeType, data } };
}

const buildFullPrompt = (prompt: string, negativePrompt: string, style: ArtStyle, config: GenerationConfig): string => {
    let fullPrompt = prompt;

    if (style.keywords) fullPrompt += `, ${style.keywords}`;
    if (config.fineTunedModelId) {
        const model = FINE_TUNED_MODELS.find(m => m.id === config.fineTunedModelId);
        if (model) fullPrompt += `, ${model.keywords}`;
    }
    if (config.isPhotoreal) fullPrompt += `, photorealistic, 8k, hyper detailed, sharp focus`;
    if (config.isAlchemy) fullPrompt += `, stunningly beautiful, high quality, award-winning art`;
    if (config.isTiling) fullPrompt += `, seamless pattern, repeating texture, tileable`;
    if (config.isBlackAndWhite) fullPrompt += `, monochrome, black and white`;
    if (config.isAnime) fullPrompt += `, in the style of anime, anime art`;
    if (config.isCartoon) fullPrompt += `, in the style of a cartoon, animated, cartoonish`;
    if (config.isMedieval) fullPrompt += `, medieval, fantasy, knight, castle, dragon`;
    if (config.isGames) fullPrompt += ', video game art style, in-game screenshot, HUD elements';
    if (config.isPixel) fullPrompt += ', pixel art, 8-bit, 16-bit, pixelated, low-res';
    if (config.isMatrix) fullPrompt += ', matrix digital rain, green code, cyberspace, computer terminal';
    if (config.isUFO) fullPrompt += ', UFO, alien encounter, flying saucer, extraterrestrial, otherworldly glow';
    if (config.isBlood) fullPrompt += ', bloody, blood splatters, gore, visceral, brutal';
    if (config.isSupernatural) fullPrompt += ', supernatural, paranormal, ghosts, ethereal beings, mysterious phenomena';
    if (config.isHorror) fullPrompt += ', horror, scary, creepy, unsettling, dark atmosphere, monster';
    if (config.isFuture) fullPrompt += `, futuristic, sci-fi, advanced technology, future city`;
    if (config.isVintage) fullPrompt += `, vintage photo, retro, old-fashioned, sepia tones, film grain`;
    if (config.isSteampunk) fullPrompt += `, steampunk, victorian, gears, clockwork, steam-powered`;
    if (config.isWatercolor) fullPrompt += `, watercolor painting, wet-on-wet, paint drips, soft edges`;
    if (config.isAbstract) fullPrompt += `, abstract art, non-representational, shapes, colors, forms`;
    if (config.isNeon) {
        let neonColorPrompt = config.neonColor === 'rainbow' ? 'rainbow colored' : config.neonColor;
        let neonPromptPart = `glowing neon style, vibrant ${neonColorPrompt} neon lighting`;
        if (config.neonTarget === 'background') neonPromptPart += ' on the background';
        else if (config.neonTarget === 'character') neonPromptPart += ' on the character';
        else if (config.neonTarget === 'frame') neonPromptPart += ' as a border frame around the image';
        neonPromptPart += `, neon intensity ${config.neonStrength}%`;
        fullPrompt += `, ${neonPromptPart}`;
    }

    // Negative prompt is handled differently for Replicate vs Gemini
    // For Gemini, we append it. For Replicate, it's a separate field.
    if (config.generationModelId === 'imagen-3.0-generate-002' && negativePrompt) {
        fullPrompt += `; negative prompt: ${negativePrompt}`;
    }
    return fullPrompt;
}

const generateWithGemini = async (prompt: string, config: GenerationConfig): Promise<string[]> => {
  if (!ai) {
    throw new Error("Клиент Gemini AI не инициализирован. Проверьте API_KEY.");
  }
  
  const userAspectRatio = config.width / config.height;
  const supportedRatios: {[key: string]: number} = { "1:1": 1.0, "4:3": 4/3, "3:4": 3/4, "16:9": 16/9, "9:16": 9/16 };
  const closestRatio = Object.keys(supportedRatios).reduce((prev, curr) => 
      (Math.abs(supportedRatios[curr] - userAspectRatio) < Math.abs(supportedRatios[prev] - userAspectRatio) ? curr : prev)
  ) as "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

  let requestContents: any;
  if (config.sourceImage && config.sourceImage.src) {
      const imagePart = base64ToPart(config.sourceImage.src);
      let strengthPrompt = "Use the provided image as a reference.";
      if (config.sourceImage.strength > 0.7) strengthPrompt = "Closely follow the provided image's style and composition.";
      else if (config.sourceImage.strength < 0.4) strengthPrompt = "Take light inspiration from the provided image.";
      requestContents = { parts: [{ text: `${prompt}. ${strengthPrompt}` }, imagePart] };
  } else {
      requestContents = prompt;
  }

  const response = await ai.models.generateImages({
    model: config.generationModelId || 'imagen-3.0-generate-002',
    prompt: requestContents,
    config: {
      numberOfImages: config.numberOfImages,
      outputMimeType: 'image/jpeg',
      aspectRatio: closestRatio,
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
  } else {
    throw new Error("No image was generated by Gemini.");
  }
};

/**
 * Основная функция генерации изображений с отказоустойчивостью и переключением моделей.
 */
export const generateImages = async (prompt: string, negativePrompt: string, style: ArtStyle, config: GenerationConfig): Promise<string[]> => {
    const modelId = config.generationModelId;
    const fullPrompt = buildFullPrompt(prompt, negativePrompt, style, config);

    if (modelId === 'imagen-3.0-generate-002') {
        // Standard Gemini flow with fallback
        try {
            const result = await generateWithGemini(fullPrompt, config);
            console.log("Image generated successfully with primary API (Gemini).");
            return result;
        } catch (geminiError) {
            console.error("Primary API (Gemini) failed:", geminiError);
            await reportApiFailure('gemini', geminiError);
            
            console.log("Switching to fallback API...");
            alert("Основной сервис (Gemini) временно недоступен. Переключаемся на резервный...");
            
            try {
                const fallbackResult = await generateWithFallback(fullPrompt, config);
                console.log("Image generated successfully with fallback API.");
                return fallbackResult;
            } catch (fallbackError) {
                console.error("Fallback API also failed:", fallbackError);
                await reportApiFailure('fallback', fallbackError);
                throw new Error("Основной и резервный сервисы генерации изображений недоступны. Пожалуйста, попробуйте позже.");
            }
        }
    } else if (modelId.startsWith('replicate:')) {
        try {
            const results = await generateWithReplicate(fullPrompt, negativePrompt, config);
            console.log(`Image(s) generated successfully with Replicate model via backend.`);
            return results;
        } catch (replicateError: any) {
            console.error("Replicate API call via backend failed:", replicateError);
            await reportApiFailure('replicate', replicateError);
            alert(`Не удалось сгенерировать изображение через модель Replicate. Ошибка: ${replicateError.message}`);
            // Fallback to placeholder on Replicate failure
            const modelName = GENERATION_MODELS.find(m => m.id === modelId)?.name || 'Replicate Model';
            return generateReplicatePlaceholder(config, modelName);
        }
    } else {
        // Unknown model
        throw new Error(`Неизвестный ID модели: ${modelId}`);
    }
};