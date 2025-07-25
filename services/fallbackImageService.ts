import { GenerationConfig } from "../types";

// Base64 для серого изображения-заглушки при сбое Gemini
const genericFallbackImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAABNElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4MGEwAAB3hD8qAAAAABJRU5ErkJggg==";

/**
 * Создает изображение-заглушку с текстом с помощью Canvas API.
 * @param text - Текст для отображения на изображении.
 * @param width - Ширина изображения.
 * @param height - Высота изображения.
 * @returns Строка Base64 с изображением в формате PNG.
 */
function createImagePlaceholder(text: string, width: number = 512, height: number = 512): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return genericFallbackImageBase64;

    // Фон
    ctx.fillStyle = '#2d3748'; // gray-800
    ctx.fillRect(0, 0, width, height);

    // Текст
    ctx.fillStyle = '#e2e8f0'; // gray-300
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Динамический размер шрифта
    const fontSize = Math.max(20, Math.floor(width / 22));
    ctx.font = `bold ${fontSize}px sans-serif`;

    const lines = text.split('\n');
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    let startY = (height - totalHeight) / 2 + (lineHeight / 2);

    lines.forEach(line => {
        ctx.fillText(line, width / 2, startY);
        startY += lineHeight;
    });

    return canvas.toDataURL('image/png');
}

/**
 * Генерирует изображения с использованием резервного API, когда Gemini недоступен.
 * Возвращает общую заглушку.
 * @param prompt - Промпт для генерации.
 * @param config - Конфигурация генерации.
 * @returns Массив строк Base64 с изображениями.
 */
export const generateWithFallback = async (prompt: string, config: GenerationConfig): Promise<string[]> => {
    console.log("Executing generation with generic fallback service.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Имитация задержки сети

    const images: string[] = [];
    const placeholder = createImagePlaceholder("Резервный API", config.width, config.height);
    for (let i = 0; i < config.numberOfImages; i++) {
        images.push(placeholder);
    }
    
    return images;
};

/**
 * Симулирует генерацию с моделью Replicate.
 * Возвращает заглушку с названием модели.
 * @param config - Конфигурация генерации.
 * @param modelName - Имя модели для отображения.
 * @returns Массив строк Base64 с изображениями.
 */
export const generateReplicatePlaceholder = async (config: GenerationConfig, modelName: string): Promise<string[]> => {
    console.log(`Simulating generation with Replicate model placeholder: ${modelName}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки сети
    
    const placeholderText = `Симуляция генерации:\n${modelName}`;
    const placeholder = createImagePlaceholder(placeholderText, config.width, config.height);
    
    const images: string[] = [];
    for (let i = 0; i < config.numberOfImages; i++) {
        images.push(placeholder);
    }
    return images;
};