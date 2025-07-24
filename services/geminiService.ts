import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ArtStyle, GenerationConfig, FineTunedModel } from "../types";
import { FINE_TUNED_MODELS } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const base64ToPart = (base64: string) => {
    const mimeType = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';
    const data = base64.split(',')[1];
    return { inlineData: { mimeType, data } };
}

export const generateImages = async (prompt: string, negativePrompt: string, style: ArtStyle, config: GenerationConfig): Promise<string[]> => {
  let fullPrompt = prompt;

  if (style.keywords) {
    fullPrompt += `, ${style.keywords}`;
  }

  if (config.fineTunedModelId) {
    const model = FINE_TUNED_MODELS.find(m => m.id === config.fineTunedModelId);
    if(model) fullPrompt += `, ${model.keywords}`;
  }
  
  if (config.isPhotoreal) {
      fullPrompt += `, photorealistic, 8k, hyper detailed, sharp focus`;
  }
  if (config.isAlchemy) {
      // Alchemy is a concept from a different service, we can simulate it with quality keywords
      fullPrompt += `, stunningly beautiful, high quality, award-winning art`;
  }
  if (config.isTiling) {
      // Tiling is also specific, we can ask for a seamless pattern
      fullPrompt += `, seamless pattern, repeating texture, tileable`;
  }
  if (config.isBlackAndWhite) {
      fullPrompt += `, monochrome, black and white`;
  }
  if (config.isAnime) {
      fullPrompt += `, in the style of anime, anime art`;
  }
  if (config.isCartoon) {
      fullPrompt += `, in the style of a cartoon, animated, cartoonish`;
  }
  if (config.isMedieval) {
      fullPrompt += `, medieval, fantasy, knight, castle, dragon`;
  }


  if (negativePrompt) {
    fullPrompt += `; negative prompt: ${negativePrompt}`;
  }
  
  const userAspectRatio = config.width / config.height;
  // Imagen 3 supports 8192x8192, so we can use a wider range of aspect ratios.
  // We'll stick to the main ones for simplicity.
  const supportedRatios: {[key: string]: number} = {
    "1:1": 1.0,
    "4:3": 4 / 3,
    "3:4": 3 / 4,
    "16:9": 16 / 9,
    "9:16": 9 / 16,
  };
  
  const closestRatio = Object.keys(supportedRatios).reduce((prev, curr) => {
      return (Math.abs(supportedRatios[curr] - userAspectRatio) < Math.abs(supportedRatios[prev] - userAspectRatio) ? curr : prev);
  }) as "1:1" | "3:4" | "4:3" | "9:16" | "16:9";


  try {
    let requestContents: any;

    if (config.sourceImage && config.sourceImage.src) {
        const imagePart = base64ToPart(config.sourceImage.src);
        let strengthPrompt = "Use the provided image as a reference.";
        if (config.sourceImage.strength > 0.7) strengthPrompt = "Closely follow the provided image's style and composition.";
        else if (config.sourceImage.strength < 0.4) strengthPrompt = "Take light inspiration from the provided image.";
        
        requestContents = { parts: [ {text: `${fullPrompt}. ${strengthPrompt}`}, imagePart] };
    } else {
        requestContents = fullPrompt;
    }

    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
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
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    throw new Error("Failed to generate image. Please check your prompt and API key.");
  }
};