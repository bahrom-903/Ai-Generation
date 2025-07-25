import { ShopPackage, CurrencyShopData } from '../types';
import { ICONS } from '../constants';

// Единоразовые пакеты и специальные предложения
export const SPECIAL_OFFERS: ShopPackage[] = [
    // Обновленный Стартер Пак
    {
        id: 'starter_pack_newbie_v2',
        name: "Стартер Пак Новичка",
        price: 2.99,
        currencySymbol: '$',
        bonuses: [
            { id: 'silver', amount: 40 },
            { id: 'gold', amount: 10 },
            { id: 'star', amount: 2 },
            { id: 'rare', amount: 1 },
        ],
        note: "Улучшенный пак! Можно купить только 1 раз на аккаунт."
    },
    // Новый пак "Стратегический Старт"
    {
        id: 'strategic_start_pack',
        name: "Стратегический Старт",
        price: 4.99,
        currencySymbol: '$',
        bonuses: [
            { id: 'silver', amount: 25 },
            { id: 'gold', amount: 8 },
            { id: 'star', amount: 1 },
            { id: 'rare', amount: 2 },
            { id: 'task', amount: 10000 },
            { id: 'data', amount: 5000 },
        ],
        note: "Все необходимое для мощного рывка в самом начале."
    },
    // Пакеты с жетонами
    {
        id: 'researcher_pack',
        name: "Набор 'Исследователь'",
        price: 4.99,
        currencySymbol: '$',
        bonuses: [
            { id: 'task', amount: 25000 },
            { id: 'rare', amount: 5 },
        ],
        note: "Для тех, кто хочет быстро получить жетоны и косметику."
    },
    {
        id: 'architect_pack',
        name: "Набор 'Архитектор'",
        price: 19.99,
        currencySymbol: '$',
        bonuses: [
            { id: 'task', amount: 120000 },
            { id: 'epic', amount: 3 },
            { id: 'data', amount: 15000 },
        ],
        note: "Большой запас жетонов и эпические предметы."
    },
    {
        id: 'demiurge_pack',
        name: "Набор 'Демиург'",
        price: 49.99,
        currencySymbol: '$',
        bonuses: [
            { id: 'task', amount: 350000 },
            { id: 'mythic', amount: 2 },
            { id: 'data', amount: 50000 },
        ],
        note: "Максимальный буст для самых амбициозных."
    },
    // Пакеты с косметикой
    {
        id: 'customization_starter_pack',
        name: "Пакет Кастомизации Новичка",
        price: 2.99,
        currencySymbol: '$',
        bonuses: [
            { id: 'rare', amount: 3 },
            { id: 'task', amount: 5000 },
        ],
        note: "Быстро сделайте интерфейс красивым."
    },
    {
        id: 'cyber_samurai_pack',
        name: "Стиль Кибер-Самурая",
        price: 9.99,
        currencySymbol: '$',
        bonuses: [
            { id: 'epic', amount: 1 },
            { id: 'rare', amount: 5 },
            { id: 'task', amount: 15000 },
        ],
        note: "Тематический набор с эксклюзивным фоном.",
        exclusiveUnlocks: ['bg:bg_neo_tokyo'],
    },
    {
        id: 'architect_treasure_pack',
        name: "Сокровищница Архитектора",
        price: 19.99,
        currencySymbol: '$',
        bonuses: [
            { id: 'epic', amount: 3 },
            { id: 'rare', amount: 10 },
            { id: 'task', amount: 40000 },
        ],
        note: "Много косметики и приятный бонус в виде жетонов.",
        exclusiveUnlocks: ['animation:glitch'],
    },
    {
        id: 'demiurge_legacy_pack',
        name: "Наследие Демиурга",
        price: 49.99,
        currencySymbol: '$',
        bonuses: [
            { id: 'mythic', amount: 2 },
            { id: 'epic', amount: 5 },
            { id: 'task', amount: 120000 },
        ],
        note: "Ультимативный пакет с уникальным статусом в профиле.",
        exclusiveUnlocks: ['status:Меценат'],
    },
];

// Эти данные могут быть использованы, если вы захотите вернуть простые пакеты валют
export const SHOP_DATA: CurrencyShopData[] = [
  {
    currencyId: 'silver',
    name: 'Пакеты "СЕРЕБРО"',
    icon: ICONS.currencySilver,
    packages: [
      { id: 'silver_1', name: 'Пробный Набор', price: 0.99, amount: 10, currencySymbol: '$', bonuses: [], note: 'Базовая цена' },
      { id: 'silver_2', name: 'Стартовый Набор', price: 4.99, amount: 55, currencySymbol: '$', bonuses: [], note: '+10% выгоды' },
      { id: 'silver_3', name: 'Набор Энтузиаста', price: 9.99, amount: 120, currencySymbol: '$', bonuses: [{ id: 'rare', amount: 1 }], note: '+20% выгоды' },
    ],
  },
  {
    currencyId: 'gold',
    name: 'Пакеты "ЗОЛОТО"',
    icon: ICONS.currencyGold,
    packages: [
      { id: 'gold_1', name: 'Пробный Набор', price: 1.99, amount: 5, currencySymbol: '$', bonuses: [], note: 'Базовая цена' },
      { id: 'gold_2', name: 'Стартовый Набор', price: 9.99, amount: 28, currencySymbol: '$', bonuses: [], note: '+12% выгоды' },
      { id: 'gold_3', name: 'Набор Энтузиаста', price: 19.99, amount: 60, currencySymbol: '$', bonuses: [{ id: 'rare', amount: 2 }], note: '+20% выгоды' },
    ],
  },
  {
    currencyId: 'star',
    name: 'Пакеты "ЗВЁЗДНЫЕ КРЕДИТЫ"',
    icon: ICONS.currencyStar,
    packages: [
      { id: 'star_1', name: 'Пробный Набор', price: 2.99, amount: 3, currencySymbol: '$', bonuses: [], note: 'Базовая цена' },
      { id: 'star_2', name: 'Стартовый Набор', price: 14.99, amount: 16, currencySymbol: '$', bonuses: [], note: '+6% выгоды' },
      { id: 'star_3', name: 'Набор Энтузиаста', price: 29.99, amount: 35, currencySymbol: '$', bonuses: [{ id: 'rare', amount: 3 }], note: '+16% выгоды' },
    ],
  },
];