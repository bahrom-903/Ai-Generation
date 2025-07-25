import { ArtStyle, DimensionPreset, FineTunedModel, Currency, VipPass, AdPurchaseOption, ManifestItem } from './types';
import React from 'react';

// To replace an icon, simply change the SVG path data for the desired key below.
export const ICONS = {
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
    store: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />,
    trophy: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0zM16.5 18.75a9 9 0 00-9 0m9 0h.008v.008h-.008v-.008zm-9 0h-.008v.008h.008v-.008zM12 9.75V14.25m-2.25-4.5a2.25 2.25 0 012.25-2.25a2.25 2.25 0 012.25 2.25" />,
    bug: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-5.25-4.25-9.5-9.5-9.5S.5 6.75.5 12s4.25 9.5 9.5 9.5 9.5-4.25 9.5-9.5zM15 9a3 3 0 00-6 0m6 0v6m-6-6v6m6-3h-6m6 0H9" />,
    idea: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a6.01 6.01 0 00-3.75 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    back: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.182m-11.665-4.992a8.25 8.25 0 0111.665 0l3.18 3.182" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
    more: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />,
    save: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    cancel: <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    profile: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round"d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />,
    eye: <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.43-6.191a1.011 1.011 0 011.583 0l4.43 6.191a1.012 1.012 0 010 .639l-4.43 6.191a1.011 1.011 0 01-1.583 0l-4.43-6.191z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>,
    eyeSlash: <><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" /></>,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9" />,
    lock: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />,
    convert: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />,
    gamepad: <path strokeLinecap="round" strokeLinejoin="round" d="M15.25 7.5h-6.5a4.25 4.25 0 00-4.25 4.25v4.5a4.25 4.25 0 004.25 4.25h6.5a4.25 4.25 0 004.25-4.25v-4.5A4.25 4.25 0 0015.25 7.5zM8.5 11.25h2.25v2.25H8.5v-2.25zm5.25 5.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm.75-2.25a.75.75 0 100-1.5.75.75 0 000 1.5z" />,
    bitcoin: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.347 11.228c.355-.615.58-1.306.58-2.053 0-2.34-1.91-4.25-4.25-4.25h-4.327v11.5h4.634c2.583 0 4.673-2.09 4.673-4.673 0-.91-.26-1.75-.71-2.477ZM11.66 6.425h.927c1.517 0 2.75 1.233 2.75 2.75s-1.233 2.75-2.75 2.75h-.927V6.425zm1.207 9.575h-2.134v-3.5h2.134c1.93 0 3.5 1.57 3.5 3.5 0 1.93-1.57 3.5-3.5 3.5h-1.634v2h-1.5v-2h-2v-1.5h2v-8h-2v-1.5h2v-2h1.5v2h1.16c.418 0 .828.063 1.224.184l-1.307-1.307c-.584-.584-.816-1.365-.67-2.12.145-.755.78-1.39 1.535-1.535.755-.145 1.536.086 2.12.67l3.22 3.22c.28.28.513.597.69.94.06.113.11.23.155.35.346.946.22 2.01-.334 2.82l-1.84 2.653c.31.29.58.62.8 1a5.15 5.15 0 0 1 .53 4.25c-.53 1.83-2.16 3.16-4.11 3.42Z"/></svg>,
    ethereum: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 23.25L3.75 12.062l8.25-11.312 8.25 11.312L12 23.25Zm0-2.438l6.375-8.75L12 4.125l-6.375 7.938 6.375 8.75ZM12 11.25L3.75 12.062l8.25 4.125V11.25Zm8.25.812L12 11.25v5.188l8.25-4.125Z"/></svg>,
    usdt: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18.5a8.5 8.5 0 110-17 8.5 8.5 0 010 17zm-1.875-5.938h-4v-1.5h4v-3.75h-5.5v-1.5h7.375v8.25h1.5v1.5h-1.5v2h-1.5v-2z"/></svg>,
    steam: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.843 14.125c-1.125 1.25-4.008 2.031-5.78 1.14-.945-.472-.852-1.633.23-2.024 1.133-.406 4.312-.601 5.46-1.5.586-.47.672-1.375-.023-1.782-1.078-.632-3.32-.398-3.32-.398l-3.21 2.898c-1.03.922-.608 1.946 0 2.461 1.734 1.484 7.238.93 7.238.93.985-.047 1.266-1.172.157-1.734zm1.53-4.57c-.773.282-1.704.25-2.414-.14-3.14-.852-4.133-3.14-4.133-3.14s.422.844 2.82 1.633c2.72.633 4.407.024 4.407.024s-.282 1.156-.68 1.625zM12.023 9a3 3 0 110-6 3 3 0 010 6z" /></svg>,
    currencyFree: <path strokeLinecap="round" strokeLinejoin="round" d="M21.125 8.875 12 3.75l-9.125 5.125M21.125 8.875v8.25a2.25 2.25 0 0 1-2.25 2.25H5.125a2.25 2.25 0 0 1-2.25-2.25v-8.25M12 12.75v6.75" />,
    currencyData: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 110 18 9 9 0 010-18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /></>,
    currencyGold: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0zM16.5 18.75a9 9 0 00-9 0m9 0h.008v.008h-.008v-.008zm-9 0h-.008v.008h.008v-.008zM12 9.75V14.25m-2.25-4.5a2.25 2.25 0 012.25-2.25a2.25 2.25 0 012.25 2.25" />,
    currencySilver: <><path strokeLinecap="round" strokeLinejoin="round" d="m15.49 10.03-6.98-6.98a.75.75 0 0 0-1.06 1.06l6.98 6.98 2.5-2.5a.75.75 0 0 0-1.44-.38l-1.02 1.84m-3.44-5.02L4.51 3.53a.75.75 0 1 0-1.06 1.06l2.02 2.02" /></>,
    currencyStar: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />,
    currencyTask: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    currencyMythic: <path strokeLinecap="round" strokeLinejoin="round" d="M11.918 2.202a1.05 1.05 0 0 1 1.164 0l6.302 4.41a1.05 1.05 0 0 1 .516.91v8.956a1.05 1.05 0 0 1-.516.91l-6.302 4.41a1.05 1.05 0 0 1-1.164 0l-6.302-4.41a1.05 1.05 0 0 1-.516-.91V7.522a1.05 1.05 0 0 1 .516-.91L11.918 2.202Z" />,
    currencyEpic: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c.968 0 1.898.19 2.76.533l5.88 2.94a.75.75 0 0 1 .36.649v5.256a11.233 11.233 0 0 1-8.349 10.593 11.233 11.233 0 0 1-9.302-10.593V6.372a.75.75 0 0 1 .36-.649l5.88-2.94A11.16 11.16 0 0 1 12 2.25Z" />,
    currencyRare: <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811V8.649a1.5 1.5 0 00-.439-1.061l-5.024-5.024A1.5 1.5 0 0014.486 2H5.25A2.25 2.25 0 003 4.25v15.5A2.25 2.25 0 005.25 22h13.5A2.25 2.25 0 0021 19.75v-2.939z" />,
    chevronLeft: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />,
    chevronRight: <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />,
};

export const THEMES: ManifestItem[] = [
    { id: "dark", name: "Dark", description: "Стандартная темная тема.", scope: ["main_app"], price: { currency: "free" }, data: { bg: "bg-[#1a1b26]", main: "bg-[#24283b]", text: "text-[#c0caf5]", accent: "text-[#bb9af7]", accentGlow: "shadow-[0_0_15px_rgba(187,154,247,0.7)]", border: "border-[#bb9af7]/50", cardBg: "bg-[#24283b]/80", inputBg: "bg-[#1a1b26]/80" }},
    { id: "light", name: "Light", description: "Светлая и чистая тема.", scope: ["main_app"], price: { currency: "rare", amount: 5 }, data: { bg: "bg-[#c8d3f5]", main: "bg-[#d5d6db]", text: "text-[#343b58]", accent: "text-[#8c73cc]", accentGlow: "shadow-[0_0_15px_rgba(140,115,204,0.7)]", border: "border-[#8c73cc]/50", cardBg: "bg-[#d5d6db]/80", inputBg: "bg-[#c8d3f5]/80" }},
    { id: "gray", name: "Gray", description: "Минималистичный серый стиль.", scope: ["main_app"], price: { currency: "rare", amount: 5 }, data: { bg: "bg-[#323437]", main: "bg-[#2C2E31]", text: "text-[#E2E2E2]", accent: "text-[#6C99BB]", accentGlow: "shadow-[0_0_15px_rgba(108,153,187,0.7)]", border: "border-[#6C99BB]/50", cardBg: "bg-[#2C2E31]/80", inputBg: "bg-[#323437]/80" }},
    { id: "dracula", name: "Dracula", description: "Популярная тема для разработчиков.", scope: ["main_app"], price: { currency: "free" }, data: { bg: "bg-[#282a36]", main: "bg-[#44475a]", text: "text-[#f8f8f2]", accent: "text-[#bd93f9]", accentGlow: "shadow-[0_0_15px_rgba(189,147,249,0.7)]", border: "border-[#bd93f9]/50", cardBg: "bg-[#44475a]/80", inputBg: "bg-[#282a36]/80" }},
    { id: "nord", name: "Nord", description: "Холодные и спокойные тона севера.", scope: ["main_app"], price: { currency: "free" }, data: { bg: "bg-[#2e3440]", main: "bg-[#3b4252]", text: "text-[#d8dee9]", accent: "text-[#88c0d0]", accentGlow: "shadow-[0_0_15px_rgba(136,192,208,0.7)]", border: "border-[#88c0d0]/50", cardBg: "bg-[#3b4252]/80", inputBg: "bg-[#2e3440]/80" }},
    { id: "retro", name: "Retro", description: "Теплый ламповый стиль.", scope: ["main_app"], price: { currency: "epic", amount: 5 }, data: { bg: "bg-[#d4be98]", main: "bg-[#282828]", text: "text-[#d4be98]", accent: "text-[#458588]", accentGlow: "shadow-[0_0_15px_rgba(69,133,136,0.7)]", border: "border-[#458588]/50", cardBg: "bg-[#282828]/80", inputBg: "bg-[#3c3836]/80" }},
    { id: "cyberpunk", name: "Cyberpunk", description: "Неоновое будущее уже здесь.", scope: ["main_app"], price: { currency: "mythic", amount: 1 }, data: { bg: "bg-[#100122]", main: "bg-[#1e0e41]", text: "text-cyan-300", accent: "text-fuchsia-400", accentGlow: "shadow-[0_0_15px_rgba(240,71,151,0.7)]", border: "border-fuchsia-500/50", cardBg: "bg-[#1e0e41]/80", inputBg: "bg-[#100122]/80" }},
    { id: "solarized", name: "Solarized", description: "Для долгой работы без усталости глаз.", scope: ["main_app"], price: { currency: "epic", amount: 15 }, data: { bg: "bg-[#002b36]", main: "bg-[#073642]", text: "text-[#839496]", accent: "text-[#268bd2]", accentGlow: "shadow-[0_0_15px_rgba(38,139,210,0.7)]", border: "border-[#268bd2]/50", cardBg: "bg-[#073642]/80", inputBg: "bg-[#002b36]/80" }},
    { id: "gruvbox", name: "Gruvbox", description: "Ретро-стиль с приглушенными цветами.", scope: ["main_app"], price: { currency: "epic", amount: 15 }, data: { bg: "bg-[#282828]", main: "bg-[#3c3836]", text: "text-[#ebdbb2]", accent: "text-[#fabd2f]", accentGlow: "shadow-[0_0_15px_rgba(250,189,47,0.7)]", border: "border-[#fabd2f]/50", cardBg: "bg-[#3c3836]/80", inputBg: "bg-[#282828]/80" }},
    { id: "monokai", name: "Monokai", description: "Яркая и высококонтрастная тема.", scope: ["main_app"], price: { currency: "epic", amount: 15 }, data: { bg: "bg-[#272822]", main: "bg-[#3e3d32]", text: "text-[#f8f8f2]", accent: "text-[#f92672]", accentGlow: "shadow-[0_0_15px_rgba(249,38,114,0.7)]", border: "border-[#f92672]/50", cardBg: "bg-[#3e3d32]/80", inputBg: "bg-[#272822]/80" }},
    { id: "one_dark", name: "One Dark", description: "Стандартная тема Atom.", scope: ["main_app"], price: { currency: "rare", amount: 10 }, data: { bg: "bg-[#282c34]", main: "bg-[#353b45]", text: "text-[#abb2bf]", accent: "text-[#61afef]", accentGlow: "shadow-[0_0_15px_rgba(97,175,239,0.7)]", border: "border-[#61afef]/50", cardBg: "bg-[#353b45]/80", inputBg: "bg-[#282c34]/80" }},
    { id: "tomorrow_night", name: "Tomorrow Night", description: "Классическая темная тема.", scope: ["main_app"], price: { currency: "rare", amount: 10 }, data: { bg: "bg-[#1d1f21]", main: "bg-[#282a2e]", text: "text-[#c5c8c6]", accent: "text-[#81a2be]", accentGlow: "shadow-[0_0_15px_rgba(129,162,190,0.7)]", border: "border-[#81a2be]/50", cardBg: "bg-[#282a2e]/80", inputBg: "bg-[#1d1f21]/80" }},
    { id: "matrix", name: "Matrix", description: "Проснись, Нео...", scope: ["main_app"], price: { currency: "rare", amount: 10 }, data: { bg: "bg-[#000000]", main: "bg-[#0D0208]", text: "text-[#00ff41]", accent: "text-[#008F11]", accentGlow: "shadow-[0_0_15px_rgba(0,255,65,0.7)]", border: "border-[#008F11]/50", cardBg: "bg-[#0D0208]/80", inputBg: "bg-[#000000]/80" }},
    { id: "crimson", name: "Crimson", description: "Глубокие красные тона.", scope: ["main_app"], price: { currency: "epic", amount: 10 }, data: { bg: "bg-[#3A0000]", main: "bg-[#600000]", text: "text-[#FFC0CB]", accent: "text-[#FF4500]", accentGlow: "shadow-[0_0_15px_rgba(255,69,0,0.7)]", border: "border-[#FF4500]/50", cardBg: "bg-[#600000]/80", inputBg: "bg-[#3A0000]/80" }},
    { id: "synthwave", name: "Synthwave", description: "Неоновый стиль 80-х.", scope: ["main_app"], price: { currency: "mythic", amount: 1 }, data: { bg: "bg-[#261D4C]", main: "bg-[#30245F]", text: "text-[#FFD3E8]", accent: "text-[#FF88DC]", accentGlow: "shadow-[0_0_15px_rgba(255,136,220,0.7)]", border: "border-[#FF88DC]/50", cardBg: "bg-[#30245F]/80", inputBg: "bg-[#261D4C]/80" }},
    { id: "winterfall", name: "Снежная чистота", description: "Холодная элегантность зимы с ледяными акцентами.", scope: ["main_app"], price: { currency: "epic", amount: 10 }, data: { bg: "bg-[#e1eaf2]", main: "bg-[#f0f5fa]", text: "text-[#3a4f66]", accent: "text-[#6c9cde]", accentGlow: "shadow-[0_0_15px_rgba(108,156,222,0.7)]", border: "border-[#6c9cde]/50", cardBg: "bg-[#f0f5fa]/80", inputBg: "bg-[#e1eaf2]/80" }},
    { id: "sakura_dream", name: "Мечта о Сакуре", description: "Нежные розовые оттенки цветущей сакуры.", scope: ["main_app"], price: { currency: "epic", amount: 15 }, data: { bg: "bg-[#fceef1]", main: "bg-[#fff6f8]", text: "text-[#704256]", accent: "text-[#f29cb9]", accentGlow: "shadow-[0_0_15px_rgba(242,156,185,0.7)]", border: "border-[#f29cb9]/50", cardBg: "bg-[#fff6f8]/80", inputBg: "bg-[#fceef1]/80" }},
    { id: "emerald_serpent", name: "Изумрудный Змей", description: "Глубокие зеленые тона с роскошными золотыми акцентами.", scope: ["main_app"], price: { currency: "mythic", amount: 2 }, data: { bg: "bg-[#0b2b1d]", main: "bg-[#113d2c]", text: "text-[#d4af37]", accent: "text-[#50c878]", accentGlow: "shadow-[0_0_15px_rgba(80,200,120,0.7)]", border: "border-[#d4af37]/50", cardBg: "bg-[#113d2c]/80", inputBg: "bg-[#0b2b1d]/80" }},
    { id: "royal_amethyst", name: "Королевский Аметист", description: "Королевское сочетание аметиста и золота.", scope: ["main_app"], price: { currency: "mythic", amount: 2 }, data: { bg: "bg-[#2c1f3d]", main: "bg-[#4a3466]", text: "text-[#e8d9ff]", accent: "text-[#ffd700]", accentGlow: "shadow-[0_0_15px_rgba(255,215,0,0.7)]", border: "border-[#ffd700]/50", cardBg: "bg-[#4a3466]/80", inputBg: "bg-[#2c1f3d]/80" }},
];

export const BACKGROUNDS: ManifestItem[] = [
    { id: "bg_anime_city", name: "Anime City", url: "/backgrounds/anime-city.jpg", scope: ["main_app"], price: { currency: "free" } },
    { id: "bg_auto_night", name: "Auto Night", url: "/backgrounds/auto-night.jpg", scope: ["main_app"], price: { currency: "free" } },
    { id: "bg_cyberpunk_const", name: "Cyberpunk Default", url: "/backgrounds/cyberpunk.jpg", scope: ["main_app"], price: { currency: "free" } },
    { id: "bg_nier_2b", name: "Nier 2B", url: "/backgrounds/nier-2b.jpg", scope: ["main_app"], price: { currency: "rare", amount: 10 } },
    { id: "bg_dark_fantasy", name: "Dark Fantasy", url: "/backgrounds/dark-fantasy.jpg", scope: ["main_app"], price: { currency: "epic", amount: 5 } },
    { id: "bg_canyon", name: "Гранд-Каньон", url: "/backgrounds/canyon.jpg", scope: ["main_app"], price: { currency: "rare", amount: 15 } },
    { id: "bg_genos", name: "Генос", url: "/backgrounds/genos.png", scope: ["main_app"], price: { currency: "rare", amount: 15 } },
    { id: "bg_mountain_river", name: "Горная река", url: "/backgrounds/mountain-river.jpg", scope: ["main_app"], price: { currency: "epic", amount: 10 } },
    { id: "bg_night_tokyo", name: "Ночной Токио", url: "/backgrounds/night-tokyo.jpg", scope: ["main_app"], price: { currency: "epic", amount: 10 } },
    { id: "bg_noir_landscape", name: "Нуарный пейзаж", url: "/backgrounds/noir-landscape.jpg", scope: ["main_app"], price: { currency: "mythic", amount: 1 } },
    { id: "bg_neo_tokyo", name: "Нео-Токио", url: "/backgrounds/night-tokyo.jpg", scope: ["main_app"], price: { currency: "mythic", amount: 9999 }, description: "Эксклюзивный фон из набора 'Стиль Кибер-Самурая'." }
];


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

export const GENERATION_MODELS: {id: string, name: string}[] = [
    { id: 'imagen-3.0-generate-002', name: 'Gemini (Imagen 3)' },
    { id: 'replicate:fofr/juggernaut-xl:v10', name: 'Фотореализм (Juggernaut XL)' },
    { id: 'replicate:lucataco/anything-v5:04c08b8b2643a64b971204b4070a312450893325114c02f1278ff6715696652c', name: 'Аниме (Anything V5)' },
    { id: 'replicate:prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a33459231ede', name: 'Стиль Midjourney (Openjourney)' },
    { id: 'replicate:stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b', name: 'Универсальная (SDXL)' },
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
    { id: 'psychedelic_art', name: 'Психоделкиа', description: 'Используйте "fractals" или "swirls" в своем промпте для создания галлюциногенных визуальных эффектов.', keywords: 'psychedelic art, fractals, swirls, hallucinogenic visuals', previewImg: '/models/psychedelic.png' },
    { id: 'solarpunk', name: 'Соларпанк', description: 'Смешивает технологии и природу с этой эстетикой.', keywords: 'blend of tech and nature, solarpunk aesthetic, optimistic future', previewImg: '/models/solarpunk.png' },
    { id: 'cgi_noir', name: 'CGI Нуар', description: 'Создает темные атмосферные изображения, вдохновленные нуарными видеоиграми.', keywords: 'dark atmospheric images, noir video games, CGI look', previewImg: '/models/cgi_noir.png' },
    { id: '3d_sculpt', name: '3D-скульптура', description: 'Создает 3D-макеты с чистыми и простыми формами.', keywords: '3d-asset, 3d sculpt, simple shapes', previewImg: '/models/3d_sculpt.png' },
    { id: 'cybertech', name: 'Кибертех', description: 'Создайте киберпанковый мир с футуристическими городскими пейзажами и киборгами.', keywords: 'cyberpunk world, futuristic cityscapes, cyborgs, cybertech', previewImg: '/models/cybertech.png' },
    { id: 'dark_arts', name: 'Темные искусства', description: 'Создает атмосферные и готические произведения искусства.', keywords: 'atmospheric and gothic art, dark arts, moody', previewImg: '/models/dark_arts.png' },
    { id: 'toon_anime', name: 'Мультяшное аниме', description: 'Комбо мультяшного и аниме-элемента. Эксклюзивная платформа.', keywords: 'combo cartoon and anime element', previewImg: '/models/toon_anime.png' },
];

export const CURRENCIES: Omit<Currency, 'amount'>[] = [
    { id: 'free', name: 'Free', icon: ICONS.currencyFree, color: 'text-green-400', plus: false, description: 'Бесплатные попытки генерации. Восстанавливаются со временем.' },
    { id: 'data', name: 'Data', icon: ICONS.currencyData, color: 'text-cyan-400', plus: false, description: 'Валюта для специальных операций и анализа данных. Выдается за участие в событиях.' },
    { id: 'gold', name: 'Gold', icon: ICONS.currencyGold, color: 'text-yellow-400', plus: true, description: 'Золото. Покупается за реальные деньги или выдается VIP-пользователям. Используется для генерации высокого разрешения.' },
    { id: 'silver', name: 'Silver', icon: ICONS.currencySilver, color: 'text-gray-400', plus: true, description: 'Серебро. Покупается или обменивается за Жетоны Заданий. Для стандартных генераций.' },
    { id: 'star', name: 'Star', icon: ICONS.currencyStar, color: 'text-yellow-300', plus: true, description: 'Звездные кредиты. Самая редкая валюта. Для генерации максимального разрешения и эксклюзивных функций.' },
    { id: 'task', name: 'Task', icon: ICONS.currencyTask, color: 'text-blue-400', plus: false, description: 'Жетоны Заданий. Зарабатываются за выполнение ежедневных и еженедельных заданий. Можно обменять на другие валюты.' },
    { id: 'mythic', name: 'Mythic', icon: ICONS.currencyMythic, color: 'text-purple-400', plus: false, description: 'Мифическая валюта для покупки самых редких предметов в магазине. Добывается в событиях или в качестве бонусов.' },
    { id: 'epic', name: 'Epic', icon: ICONS.currencyEpic, color: 'text-indigo-400', plus: false, description: 'Эпическая валюта для покупки редких предметов в магазине. Добывается в событиях или в качестве бонусов.' },
    { id: 'rare', name: 'Rare', icon: ICONS.currencyRare, color: 'text-teal-400', plus: false, description: 'Редкая валюта для покупки необычных предметов в магазине. Добывается в событиях или в качестве бонусов.' },
];

export const DOLLAR_RATES: Record<string, number> = {
    silver: 0.99 / 10,
    gold: 1.99 / 5,
    star: 2.99 / 3,
    task: (0.99 / 10) / 250, // Derived from silver conversion
};

export const VIP_PASSES: VipPass[] = [
    {
        id: 'silver',
        name: 'Серебряный VIP Пропуск',
        price: '$7.99 / месяц',
        priceValue: 7.99,
        icon: ICONS.currencySilver,
        color: 'text-gray-300',
        borderColor: 'border-gray-400',
        unlocks: ['Доступ к Серебряному кошельку', 'Возможность ставить арты как фон профиля', '✅ Разблокирует 10 ежедневных бесплатных генераций!'],
        monthlyGrants: [
            { currency: 'silver', amount: 250 },
            { currency: 'task', amount: 10000 },
        ],
        perks: ['Эксклюзивный значок "Серебряный VIP"', 'Скидка 5% на покупку пакетов Жетонов', 'Лимит одновременной генерации: 4 изображения'],
    },
    {
        id: 'gold',
        name: 'Золотой VIP Пропуск',
        price: '$14.99 / месяц',
        priceValue: 14.99,
        icon: ICONS.currencyGold,
        color: 'text-yellow-300',
        borderColor: 'border-yellow-400',
        unlocks: ['Доступ к Золотому кошельку', 'Эксклюзивные фильтры: "Средневековье", "Матрица"', '📈 Увеличивает бесплатные генерации до 15 в день!'],
        monthlyGrants: [
            { currency: 'gold', amount: 200 },
            { currency: 'silver', amount: 100 },
            { currency: 'task', amount: 25000 },
        ],
        perks: ['Все привилегии Серебряного VIP', 'Анимированный "Золотой" значок', 'Скидка 10% на покупку пакетов Жетонов', 'Приоритетная очередь генерации', 'Лимит генерации: 6 изображений', 'Ускоренное накопление ДатаКоинов +10%'],
    },
    {
        id: 'star',
        name: 'Звёздный VIP Пропуск',
        price: '$29.99 / месяц',
        priceValue: 29.99,
        icon: ICONS.currencyStar,
        color: 'text-yellow-200',
        borderColor: 'border-yellow-300',
        unlocks: ['Доступ ко ВСЕМ кошелькам', 'Эксклюзивные фильтры: "Сверхъестественное", "Ужасы", "НЛО", "Blood", "NSFW"', '🚀 Увеличивает бесплатные генерации до 30 в день!'],
        monthlyGrants: [
            { currency: 'star', amount: 100 },
            { currency: 'gold', amount: 150 },
            { currency: 'task', amount: 60000 },
        ],
        perks: ['Все привилегии Золотого VIP', 'Уникальный анимированный значок', 'Эксклюзивный цвет ника', 'Скидка 20% на покупку Жетонов', 'Наивысший приоритет в очереди', 'Лимит генерации: 8 изображений', 'Ускоренное накопление ДатаКоинов +25%', 'Доступ к бета-тестированию'],
    }
];

export const TASK_CONVERSION_RATES = {
    silver: { tasks: 250, name: "Серебряный кредит" },
    gold: { tasks: 550, name: "Золотой кредит" },
    star: { tasks: 1200, name: "Звездный кредит" },
};

export const AD_PURCHASE_OPTIONS: AdPurchaseOption[] = [
    { id: 'weekly', durationDays: 7, price: 2.00, name: '1 неделя' },
    { id: 'biweekly', durationDays: 14, price: 3.60, name: '2 недели' },
    { id: 'monthly', durationDays: 30, price: 8.00, name: '1 месяц' },
];