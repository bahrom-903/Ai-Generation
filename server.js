
import express from 'express';
import Replicate from 'replicate';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.use(cors());
app.use(express.json());

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

// Serve static files from the React app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, 'dist'); // Assuming the build output is in a 'dist' folder

// Serve static files from root for local dev simplicity
app.use(express.static(__dirname)); 


// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});