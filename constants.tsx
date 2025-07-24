import React from 'react';
import { ArtStyle, Theme, Background, DimensionPreset, FineTunedModel } from './types';

export const ART_STYLES: ArtStyle[] = [
  { id: 'none', name: '-- Без стиля --', keywords: 'high quality, masterpiece' },
  { id: 'waifu', name: 'Вайфу', keywords: 'beautiful anime girl, waifu, cute, detailed face, masterpiece' },
  { id: 'anime_gif', name: 'Аниме Гифки', keywords: 'dynamic anime scene, action shot, vibrant colors, masterpiece' },
  { id: 'cyberpunk', name: 'Киберпанк', keywords: 'cyberpunk city, neon lights, futuristic, high-tech, cyborg, masterpiece' },
  { id: 'nature', name: 'Природа', keywords: 'breathtaking landscape, beautiful nature, serene, detailed, masterpiece' },
  { id: 'games', name: 'Игры', keywords: 'video game character, fantasy art, epic scene, game concept art, masterpiece' },
  { id: 'dark_anime', name: 'Dark Аниме', keywords: 'dark anime, gothic, mysterious, moody lighting, intense, masterpiece' },
  { id: 'superheroes', name: 'Супергерои', keywords: 'superhero, comic book style, dynamic pose, powerful, masterpiece' },
];

export const DIMENSION_PRESETS: DimensionPreset[] = [
    // Standard
    { w: 512, h: 768, group: 'standard' },
    { w: 768, h: 512, group: 'standard' },
    { w: 768, h: 1024, group: 'standard' },
    { w: 1024, h: 768, group: 'standard' },
    { w: 1920, h: 1080, group: 'standard' },
    { w: 1080, h: 1920, group: 'standard' },
    { w: 3840, h: 2160, group: 'standard' },
    { w: 2160, h: 3840, group: 'standard' },
    { w: 7680, h: 4320, group: 'standard' },

    // Square
    { w: 512, h: 512, group: 'square' },
    { w: 768, h: 768, group: 'square' },
    { w: 1024, h: 1024, group: 'square' },
    { w: 2048, h: 2048, group: 'square' },
    { w: 4096, h: 4096, group: 'square' },
    { w: 8192, h: 8192, group: 'square' },
];

export const FINE_TUNED_MODELS: FineTunedModel[] = [
    { id: 'vibrant_pop', name: 'Яркий поп-арт', description: 'Сочные, постерные иллюстрации с жирными цветами и причудливыми деталями.', keywords: 'vibrant, poster art-inspired illustrations, bold colors, whimsical details', previewImg: '/models/dopamine.png' },
    { id: 'minimalist_illustration', name: 'Минимализм', description: 'Минималистичные иллюстрации с мягкими цветами и плоскими тенями, сочетающие реализм с ощущением сказки.', keywords: 'minimalist illustration, soft colors, flat shadows, storybook realism', previewImg: '/models/editorial.png' },
    { id: 'ethereal_80s', name: 'Эфирное ретро 80-х', description: 'Неземные научно-фантастические вайбы 80-х с розовой и серебряной цветовой схемой.', keywords: 'ethereal 80s sci-fi vibes, pink and silver color scheme', previewImg: '/models/retro_futurism.png' },
    { id: 'dreamy_acrylics', name: 'Мечтательный акрил', description: 'Текстурированный, живописный стиль с мягкими пастельными оттенками.', keywords: 'textured, painterly style, soft pastel hues, acrylic painting style', previewImg: '/models/dreamy_acrylics.png' },
    { id: 'pop_surrealism', name: 'Поп-сюрреализм', description: 'Яркие, гиперреальные детали, которые могут превратить изображение в смесь причудливого и жуткого.', keywords: 'vibrant, hyperreal details, whimsical and macabre, pop surrealism', previewImg: '/models/pop_surrealism.png' },
    { id: 'infrared_photography', name: 'Инфракрасное фото', description: 'Сдвигает цвета в сторону сказочной, неземной реальности, создавая потусторонние пейзажи.', keywords: 'dreamlike, ethereal reality, infrared photography style, otherworldly landscapes', previewImg: '/models/infrared.png' },
    { id: 'woodcut_illustration', name: 'Ксилография', description: 'Жирные линии и драматические тени, вдохновленные традиционными техниками ксилографии.', keywords: 'bold lines, dramatic shadowing, traditional woodcut illustration style', previewImg: '/models/woodcut.png' },
    { id: 'abstract_line_art', name: 'Абстрактные линии', description: 'Живые, минималистичные детали с акцентом на контур и форму.', keywords: 'expressive, minimalist details, contour and form, abstract line art', previewImg: '/models/abstract_line_art.png' },
    { id: 'game_ui', name: 'Игровой интерфейс', description: 'Генерирует игровые интерфейсы, макеты и другие элементы в стиле видеоигр.', keywords: 'game ui, game interface, layouts, 2d game assets', previewImg: '/models/game_ui.png' },
    { id: 'cel_shaded_anime', name: 'Сел-шейдинг аниме', description: 'Превращает сцены в яркие, классические аниме-стили с четкими контурами.', keywords: 'vibrant, classic anime-style visuals, crisp outlines, cel-shaded', previewImg: '/models/cel_shaded.png' },
    { id: 'medieval_illustration', name: 'Средневековая иллюстрация', description: 'Добавляет средневековый шарм вашим изображениям. Оптимально для бардов и рыцарей.', keywords: 'medieval charm, medieval illustration, tapestry style', previewImg: '/models/medieval_illustration.png' },
    { id: 'cosmic_retro', name: 'Космическое ретро', description: 'Ностальгические вайбы, вдохновленные классической научной фантастикой и космическими операми.', keywords: 'nostalgic vibes, classic sci-fi, cosmic retro', previewImg: '/models/cosmic_retro.png' },
    { id: 'rainbowcore', name: 'Радужный стиль', description: 'Придайте вашим изображениям другой мир, используя цвета радуги.', keywords: 'otherworldly glow, rainbow colors, iridescent', previewImg: '/models/rainbowcore.png' },
    { id: 'glitch_art', name: 'Глитч-арт', description: 'Инжектирует хаотическую энергию с помощью ярких, поврежденных визуальных эффектов и аберраций.', keywords: 'chaotic energy, vibrant, corrupted visuals, glitch art', previewImg: '/models/glitch_art.png' },
    { id: 'white_ethereal', name: 'Белая эфирность', description: 'Добавьте аналоговый вайб с помощью зернистости, виньетирования и красивых несовершенств.', keywords: 'analog vibe, film grain, beautiful imperfections, white ethereal', previewImg: '/models/white_ethereal.png' },
    { id: 'analog_photography', name: 'Аналоговое фото', description: 'Работает лучше всего с Leonardo Vision XL. Идеально для фотореализма.', keywords: 'analog photography, film look, vintage photo', previewImg: '/models/analog_photo.png' },
    { id: 'soft_pastel_anime', name: 'Мягкое пастельное аниме', description: 'Создает милые аниме-изображения в мягких пастельных тонах.', keywords: 'cute anime images, soft pastel tones', previewImg: '/models/soft_pastel_anime.png' },
    { id: 'psychedelic_art', name: 'Психоделика', description: 'Используйте "fractals" или "swirls" в своем промпте для создания галлюциногенных визуальных эффектов.', keywords: 'psychedelic art, fractals, swirls, hallucinogenic visuals', previewImg: '/models/psychedelic.png' },
    { id: 'solarpunk', name: 'Соларпанк', description: 'Смешивает технологии и природу с этой эстетикой.', keywords: 'blend of tech and nature, solarpunk aesthetic, optimistic future', previewImg: '/models/solarpunk.png' },
    { id: 'cgi_noir', name: 'CGI Нуар', description: 'Создает темные атмосферные изображения, вдохновленные нуарными видеоиграми.', keywords: 'dark atmospheric images, noir video games, CGI look', previewImg: '/models/cgi_noir.png' },
    { id: '3d_sculpt', name: '3D-скульптура', description: 'Создает 3D-макеты с чистыми и простыми формами.', keywords: '3d-asset, 3d sculpt, simple shapes', previewImg: '/models/3d_sculpt.png' },
    { id: 'cybertech', name: 'Кибертех', description: 'Создайте киберпанковый мир с футуристическими городскими пейзажами и киборгами.', keywords: 'cyberpunk world, futuristic cityscapes, cyborgs, cybertech', previewImg: '/models/cybertech.png' },
    { id: 'dark_arts', name: 'Темные искусства', description: 'Создает атмосферные и готические произведения искусства.', keywords: 'atmospheric and gothic art, dark arts, moody', previewImg: '/models/dark_arts.png' },
    { id: 'toon_anime', name: 'Мультяшное аниме', description: 'Комбо мультяшного и аниме-элемента. Эксклюзивная платформа.', keywords: 'combo cartoon and anime element', previewImg: '/models/toon_anime.png' },
];


export const THEMES: Theme[] = [
    { id: 'dark', name: 'Dark', colors: { bg: 'bg-[#1a1b26]', main: 'bg-[#24283b]', text: 'text-[#c0caf5]', accent: 'text-[#bb9af7]', accentGlow: 'shadow-[0_0_15px_rgba(187,154,247,0.7)]', border: 'border-[#bb9af7]/50', cardBg: 'bg-[#24283b]/80', inputBg: 'bg-[#1a1b26]/80' } },
    { id: 'light', name: 'Light', colors: { bg: 'bg-[#c8d3f5]', main: 'bg-[#d5d6db]', text: 'text-[#343b58]', accent: 'text-[#8c73cc]', accentGlow: 'shadow-[0_0_15px_rgba(140,115,204,0.7)]', border: 'border-[#8c73cc]/50', cardBg: 'bg-[#d5d6db]/80', inputBg: 'bg-[#c8d3f5]/80' } },
    { id: 'gray', name: 'Gray', colors: { bg: 'bg-gray-800', main: 'bg-gray-700', text: 'text-gray-200', accent: 'text-teal-400', accentGlow: 'shadow-[0_0_15px_rgba(45,212,191,0.7)]', border: 'border-teal-400/50', cardBg: 'bg-gray-700/80', inputBg: 'bg-gray-800/80' } },
    { id: 'retro', name: 'Retro', colors: { bg: 'bg-[#d4be98]', main: 'bg-[#282828]', text: 'text-[#d4be98]', accent: 'text-[#458588]', accentGlow: 'shadow-[0_0_15px_rgba(69,133,136,0.7)]', border: 'border-[#458588]/50', cardBg: 'bg-[#282828]/80', inputBg: 'bg-[#3c3836]/80' } },
    { id: 'dracula', name: 'Dracula', colors: { bg: 'bg-[#282a36]', main: 'bg-[#44475a]', text: 'text-[#f8f8f2]', accent: 'text-[#bd93f9]', accentGlow: 'shadow-[0_0_15px_rgba(189,147,249,0.7)]', border: 'border-[#bd93f9]/50', cardBg: 'bg-[#44475a]/80', inputBg: 'bg-[#282a36]/80' } },
    { id: 'nord', name: 'Nord', colors: { bg: 'bg-[#2e3440]', main: 'bg-[#3b4252]', text: 'text-[#d8dee9]', accent: 'text-[#88c0d0]', accentGlow: 'shadow-[0_0_15px_rgba(136,192,208,0.7)]', border: 'border-[#88c0d0]/50', cardBg: 'bg-[#3b4252]/80', inputBg: 'bg-[#2e3440]/80' } },
    { id: 'solarized', name: 'Solarized', colors: { bg: 'bg-[#002b36]', main: 'bg-[#073642]', text: 'text-[#839496]', accent: 'text-[#268bd2]', accentGlow: 'shadow-[0_0_15px_rgba(38,139,210,0.7)]', border: 'border-[#268bd2]/50', cardBg: 'bg-[#073642]/80', inputBg: 'bg-[#002b36]/80' } },
    { id: 'gruvbox', name: 'Gruvbox', colors: { bg: 'bg-[#282828]', main: 'bg-[#3c3836]', text: 'text-[#ebdbb2]', accent: 'text-[#fabd2f]', accentGlow: 'shadow-[0_0_15px_rgba(250,189,47,0.7)]', border: 'border-[#fabd2f]/50', cardBg: 'bg-[#3c3836]/80', inputBg: 'bg-[#282828]/80' } },
    { id: 'monokai', name: 'Monokai', colors: { bg: 'bg-[#272822]', main: 'bg-[#3e3d32]', text: 'text-[#f8f8f2]', accent: 'text-[#a6e22e]', accentGlow: 'shadow-[0_0_15px_rgba(166,226,46,0.7)]', border: 'border-[#a6e22e]/50', cardBg: 'bg-[#3e3d32]/80', inputBg: 'bg-[#272822]/80' } },
    { id: 'tomorrow_night', name: 'Tomorrow night', colors: { bg: 'bg-[#1d1f21]', main: 'bg-[#282a2e]', text: 'text-[#c5c8c6]', accent: 'text-[#b294bb]', accentGlow: 'shadow-[0_0_15px_rgba(178,148,187,0.7)]', border: 'border-[#b294bb]/50', cardBg: 'bg-[#282a2e]/80', inputBg: 'bg-[#1d1f21]/80' } },
    { id: 'one_dark', name: 'One dark', colors: { bg: 'bg-[#282c34]', main: 'bg-[#353b45]', text: 'text-[#abb2bf]', accent: 'text-[#61afef]', accentGlow: 'shadow-[0_0_15px_rgba(97,175,239,0.7)]', border: 'border-[#61afef]/50', cardBg: 'bg-[#353b45]/80', inputBg: 'bg-[#282c34]/80' } },
    { id: 'cyberpunk', name: 'Cyberpunk', colors: { bg: 'bg-[#100122]', main: 'bg-[#1e0e41]', text: 'text-cyan-300', accent: 'text-fuchsia-400', accentGlow: 'shadow-[0_0_15px_rgba(240,71,151,0.7)]', border: 'border-fuchsia-500/50', cardBg: 'bg-[#1e0e41]/80', inputBg: 'bg-[#100122]/80' } },
    { id: 'matrix', name: 'Matrix', colors: { bg: 'bg-black', main: 'bg-[#0d0d0d]', text: 'text-green-400', accent: 'text-lime-300', accentGlow: 'shadow-[0_0_15px_rgba(190,242,100,0.7)]', border: 'border-green-400/50', cardBg: 'bg-[#0d0d0d]/80', inputBg: 'bg-black/80' } },
    { id: 'crimson', name: 'Crimson', colors: { bg: 'bg-[#3d0000]', main: 'bg-[#1a0000]', text: 'text-red-200', accent: 'text-red-400', accentGlow: 'shadow-[0_0_15px_rgba(248,113,113,0.7)]', border: 'border-red-400/50', cardBg: 'bg-[#1a0000]/80', inputBg: 'bg-black/80' } },
    { id: 'synthwave', name: 'Synthwave', colors: { bg: 'bg-[#2b1055]', main: 'bg-[#1c0522]', text: 'text-[#ff6ac1]', accent: 'text-[#00f7ff]', accentGlow: 'shadow-[0_0_15px_rgba(0,247,255,0.7)]', border: 'border-[#00f7ff]/50', cardBg: 'bg-[#1c0522]/80', inputBg: 'bg-black/80' } },
];

export const BACKGROUNDS: Background[] = [
    { id: 'anime-city.jpg', name: 'Anime City' },
    { id: 'auto-night.jpg', name: 'Auto Night' },
    { id: 'canyon.jpg', name: 'Canyon' },
    { id: 'cyberpunk.jpg', name: 'Cyberpunk' },
    { id: 'dark-fantasy.jpg', name: 'Dark Fantasy' },
    { id: 'genos.png', name: 'Genos' },
    { id: 'mountain-river.jpg', name: 'Mountain River' },
    { id: 'nier-2b.jpg', name: 'Nier 2B' },
    { id: 'night-tokyo.jpg', name: 'Night Tokyo' },
    { id: 'noir-landscape.jpg', name: 'Noir Landscape' },
];

export const Icons = {
    menu: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    generate: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.5 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />,
    random: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.182m-11.665-4.992a8.25 8.25 0 0111.665 0l3.18 3.182" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />,
    export: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.353-.029.706-.029 1.058 0 .522.042 1.034.243 1.458.597.424.354.755.823.999 1.341.244.518.375 1.079.375 1.652V7.5m-9 0h9m-9 0c-1.657 0-3 1.343-3 3v6c0 1.657 1.343 3 3 3h9c1.657 0 3-1.343 3-3v-6c0-1.657-1.343-3-3-3m-9 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V8.625c0-.621-.504-1.125-1.125-1.125H18.375m-9 0h9" />,
    bg: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
    delete: <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.533c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />,
    heart: <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />,
    theme: <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402a3.75 3.75 0 00-.615-6.228L14.25 7.5l-6.402 6.402a3.75 3.75 0 000 5.304zm1.13-1.13a2.25 2.25 0 01-3.182 0l-6.401-6.402a2.25 2.25 0 010-3.182s.455-.455 1.13-.615l6.228 6.228a2.25 2.25 0 010 3.182l-6.402 6.402z" />,
    trophy: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0zM16.5 18.75a9 9 0 00-9 0m9 0h.008v.008h-.008v-.008zm-9 0h-.008v.008h.008v-.008zM12 9.75V14.25m-2.25-4.5a2.25 2.25 0 012.25-2.25a2.25 2.25 0 012.25 2.25" />,
    bug: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-5.25-4.25-9.5-9.5-9.5S.5 6.75.5 12s4.25 9.5 9.5 9.5 9.5-4.25 9.5-9.5zM15 9a3 3 0 00-6 0m6 0v6m-6-6v6m6-3h-6m6 0H9" />,
    idea: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a6.01 6.01 0 00-3.75 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    back: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.182m-11.665-4.992a8.25 8.25 0 0111.665 0l3.18 3.182" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
    more: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />,
    save: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    cancel: <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    profile: <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />,
    dataCoin: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.79 6.22a2.5 2.5 0 11-3.52 3.52 2.5 2.5 0 013.52-3.52zm7.1 7.08a2.5 2.5 0 11-3.52 3.52 2.5 2.5 0 013.52-3.52zM12 6.5a1 1 0 00-1 1v7a1 1 0 002 0v-7a1 1 0 00-1-1z" />,
    goldCoin: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />,
    silverCoin: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM9.5 15.5H8V8.63l-1.88.5v-1.2l3-1.23h1.38V15.5zm4.88-1.75c0 .8-.23 1.45-.68 1.95s-1.07.75-1.87.75c-.8 0-1.45-.25-1.9-.75s-.68-1.15-.68-1.95V9.78c0-.8.23-1.45.68-1.95s1.08-.75 1.87-.75c.8 0 1.45.25 1.9.75s.68 1.15.68 1.95v3.97z" />,
    star: <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9" />
};