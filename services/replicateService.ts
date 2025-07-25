import { GenerationConfig } from "../types";

export const generateWithReplicate = async (prompt: string, negativePrompt: string, config: GenerationConfig): Promise<string[]> => {
    const imagePromises: Promise<string>[] = [];

    // The backend in the user's example generates one image per call.
    // To satisfy `numberOfImages`, we must call it multiple times.
    for (let i = 0; i < config.numberOfImages; i++) {
        imagePromises.push(new Promise(async (resolve, reject) => {
            const modelIdentifier = config.generationModelId.replace('replicate:', '');
            const body = {
                prompt,
                negative_prompt: negativePrompt,
                model_identifier: modelIdentifier,
                // In a real scenario, other config params like width, height, etc.,
                // would be passed here if the backend supports them.
            };
            
            try {
                // This fetch call targets the backend server which proxies requests to Replicate.
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: `Request failed with status ${response.status}` }));
                    return reject(new Error(errorData.error || `Ошибка сервера: ${response.status}`));
                }

                const data = await response.json();
                if (!data.imageUrl) {
                    return reject(new Error("API не вернул URL изображения."));
                }
                resolve(data.imageUrl);

            } catch (error) {
                console.error("Network or fetch error for Replicate service:", error);
                reject(error);
            }
        }));
    }

    return await Promise.all(imagePromises);
};
