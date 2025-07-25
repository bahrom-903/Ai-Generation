import express from 'express';
import Replicate from 'replicate';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// --- Обязательная настройка для работы с путями в ES-модулях ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -------------------------------------------------------------

const app = express();
const PORT = process.env.PORT || 3001;

// --- НАСТРОЙКА MIDDLEWARE (ПРОМЕЖУТОЧНОГО ПО) ---
// Используй CORS, это хорошая практика
app.use(cors());
// Позволяем серверу принимать JSON
app.use(express.json());

// --- ИНИЦИАЛИЗАЦИЯ КЛИЕНТОВ API ---
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// =================================================================
// --- СЕКЦИЯ API-РОУТОВ (Должна идти ПЕРЕД раздачей статики!) ---
// =================================================================
app.post('/api/generate', async (req, res) => {
  try {
    const { model_identifier, prompt, negative_prompt } = req.body;

    if (!model_identifier || !prompt) {
      return res.status(400).json({ error: 'Отсутствуют обязательные параметры: model_identifier и prompt.' });
    }

    const output = await replicate.run(
      model_identifier,
      {
        input: {
          prompt: prompt,
          negative_prompt: negative_prompt || undefined,
        },
      }
    );
    
    if (!output || !Array.isArray(output) || output.length === 0 || !output[0]) {
        return res.status(500).json({ error: 'Replicate API не вернул ожидаемый результат.' });
    }

    res.status(200).json({ imageUrl: output[0] });

  } catch (error) {
    console.error('Ошибка при обращении к Replicate API:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера при генерации изображения.' });
  }
});

// =================================================================
// --- СЕКЦИЯ РАЗДАЧИ ФРОНТЕНДА (Должна идти ПОСЛЕ всех API!) ---
// =================================================================

// 1. Указываем Express, что папка 'dist' содержит статические файлы нашего сайта
const buildPath = path.join(__dirname, 'dist');
app.use(express.static(buildPath));

// 2. На любой другой GET-запрос мы отдаем главный файл index.html из папки 'dist'
// Это позволяет React Router'у управлять навигацией на стороне клиента
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// --- ЗАПУСК СЕРВЕРА ---
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
