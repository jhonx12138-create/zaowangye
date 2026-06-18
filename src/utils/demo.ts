/**
 * 演示数据初始化
 * 首次使用时写入模拟数据到各 Store，帮助用户快速体验
 */
import { useIngredientStore } from '../stores/useIngredientStore';
import { useMenuStore } from '../stores/useMenuStore';
import { useRecordStore } from '../stores/useRecordStore';
import { useFixedCostStore } from '../stores/useFixedCostStore';
import { useShopStore } from '../stores/useShopStore';
import type { Ingredient, MenuItem, IncomeRecord, ExpenseRecord } from '../types';
import { STORAGE_KEYS } from '../constants';

/** 检查演示数据是否已初始化 */
function isDemoInitialized(): boolean {
  return localStorage.getItem(STORAGE_KEYS.demoInitialized) === 'true';
}

/** 标记演示数据已初始化 */
function markDemoInitialized(): void {
  localStorage.setItem(STORAGE_KEYS.demoInitialized, 'true');
}

/** 初始化所有演示数据 */
export function initDemoData(): void {
  if (isDemoInitialized()) return;

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const timeStr = () => {
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // ===== 演示原料（11 种）=====
  const demoIngredients: Ingredient[] = [
    { id: 'demo-ing-1', name: '猪肉', pricePerJin: 15, unit: '斤', typUnit: '两', supplier: '张屠夫', priceHist: [{ date: today, price: 15 }], isDemo: true },
    { id: 'demo-ing-2', name: '牛肉', pricePerJin: 38, unit: '斤', typUnit: '两', supplier: '李记牛肉', priceHist: [{ date: today, price: 38 }], isDemo: true },
    { id: 'demo-ing-3', name: '鸡肉', pricePerJin: 12, unit: '斤', typUnit: '两', supplier: '三鸟市场', priceHist: [{ date: today, price: 12 }], isDemo: true },
    { id: 'demo-ing-4', name: '草鱼', pricePerJin: 10, unit: '斤', typUnit: '两', supplier: '江边渔市', priceHist: [{ date: today, price: 10 }], isDemo: true },
    { id: 'demo-ing-5', name: '豆腐', pricePerJin: 3, unit: '斤', typUnit: '两', supplier: '老王豆坊', priceHist: [{ date: today, price: 3 }], isDemo: true },
    { id: 'demo-ing-6', name: '青椒', pricePerJin: 4, unit: '斤', typUnit: '两', supplier: '农贸市场', priceHist: [{ date: today, price: 4 }], isDemo: true },
    { id: 'demo-ing-7', name: '黄瓜', pricePerJin: 3, unit: '斤', typUnit: '两', supplier: '农贸市场', priceHist: [{ date: today, price: 3 }], isDemo: true },
    { id: 'demo-ing-8', name: '土豆', pricePerJin: 2.5, unit: '斤', typUnit: '两', supplier: '农贸市场', priceHist: [{ date: today, price: 2.5 }], isDemo: true },
    { id: 'demo-ing-9', name: '面粉', pricePerJin: 3, unit: '斤', typUnit: '两', supplier: '粮油店', priceHist: [{ date: today, price: 3 }], isDemo: true },
    { id: 'demo-ing-10', name: '大米', pricePerJin: 4, unit: '斤', typUnit: '两', supplier: '粮油店', priceHist: [{ date: today, price: 4 }], isDemo: true },
    { id: 'demo-ing-11', name: '食用油', pricePerJin: 12, unit: '斤', typUnit: '两', supplier: '粮油店', priceHist: [{ date: today, price: 12 }], isDemo: true },
  ];

  // ===== 演示菜品（10 道）=====
  const demoMenuItems: MenuItem[] = [
    {
      id: 'demo-dish-1', name: '鱼香肉丝', price: 38, dailySales: 25, category: '热菜',
      ings: [
        { ingId: 'demo-ing-1', amount: 4.8, unit: '两' },   // 猪肉 0.3斤
        { ingId: 'demo-ing-6', amount: 2.4, unit: '两' },   // 青椒 0.15斤
        { ingId: 'demo-ing-11', amount: 0.5, unit: '两' },  // 食用油 少许
      ],
      isDemo: true,
    },
    {
      id: 'demo-dish-2', name: '红烧肉', price: 48, dailySales: 18, category: '热菜',
      ings: [
        { ingId: 'demo-ing-1', amount: 8, unit: '两' },     // 猪肉 0.5斤
      ],
      isDemo: true,
    },
    {
      id: 'demo-dish-3', name: '宫保鸡丁', price: 32, dailySales: 22, category: '热菜',
      ings: [
        { ingId: 'demo-ing-3', amount: 4.8, unit: '两' },   // 鸡肉 0.3斤
        { ingId: 'demo-ing-6', amount: 1.6, unit: '两' },   // 青椒 0.1斤
        { ingId: 'demo-ing-11', amount: 0.4, unit: '两' },  // 食用油
      ],
      isDemo: true,
    },
    {
      id: 'demo-dish-4', name: '水煮鱼', price: 58, dailySales: 12, category: '热菜',
      ings: [
        { ingId: 'demo-ing-4', amount: 12.8, unit: '两' },  // 草鱼 0.8斤
        { ingId: 'demo-ing-11', amount: 0.6, unit: '两' },  // 食用油
      ],
      isDemo: true,
    },
    {
      id: 'demo-dish-5', name: '麻婆豆腐', price: 22, dailySales: 30, category: '热菜',
      ings: [
        { ingId: 'demo-ing-5', amount: 8, unit: '两' },     // 豆腐 0.5斤
        { ingId: 'demo-ing-1', amount: 1.6, unit: '两' },   // 猪肉 0.1斤
      ],
      isDemo: true,
    },
    {
      id: 'demo-dish-6', name: '回锅肉', price: 36, dailySales: 20, category: '热菜',
      ings: [
        { ingId: 'demo-ing-1', amount: 6.4, unit: '两' },   // 猪肉 0.4斤
        { ingId: 'demo-ing-6', amount: 3.2, unit: '两' },   // 青椒 0.2斤
      ],
      isDemo: true,
    },
    {
      id: 'demo-dish-7', name: '拍黄瓜', price: 16, dailySales: 15, category: '凉菜',
      ings: [
        { ingId: 'demo-ing-7', amount: 6.4, unit: '两' },   // 黄瓜 0.4斤
      ],
      isDemo: true,
    },
    {
      id: 'demo-dish-8', name: '酸辣土豆丝', price: 18, dailySales: 28, category: '热菜',
      ings: [
        { ingId: 'demo-ing-8', amount: 8, unit: '两' },     // 土豆 0.5斤
        { ingId: 'demo-ing-6', amount: 0.8, unit: '两' },   // 青椒 0.05斤
      ],
      isDemo: true,
    },
    {
      id: 'demo-dish-9', name: '蛋炒饭', price: 15, dailySales: 35, category: '主食',
      ings: [
        { ingId: 'demo-ing-10', amount: 3.2, unit: '两' },  // 大米 0.2斤
        { ingId: 'demo-ing-11', amount: 0.4, unit: '两' },  // 食用油
      ],
      isDemo: true,
    },
    {
      id: 'demo-dish-10', name: '豆腐汤', price: 20, dailySales: 20, category: '汤品',
      ings: [
        { ingId: 'demo-ing-5', amount: 4.8, unit: '两' },   // 豆腐 0.3斤
        { ingId: 'demo-ing-7', amount: 1.6, unit: '两' },   // 黄瓜 0.1斤
      ],
      isDemo: true,
    },
  ];

  // ===== 演示固定成本 =====
  const demoFixedCosts = {
    rent: 3000,
    labor: 8000,
    utilities: 1500,
    seasoning: 800,
  };

  // ===== 演示店铺信息 =====
  const demoShopInfo = {
    name: '我家小馆',
    owner: '张老板',
    phone: '13800138000',
    address: '建设路美食街18号',
  };

  // ===== 演示今日记录 =====
  const demoIncome1: IncomeRecord = {
    id: 'demo-inc-1',
    amount: 218,
    note: '桌3·4位',
    time: '12:30',
    period: 'noon',
    tableDishes: [
      { menuId: 'demo-dish-1', qty: 2 },
      { menuId: 'demo-dish-5', qty: 3 },
      { menuId: 'demo-dish-9', qty: 4 },
    ],
  };

  const demoIncome2: IncomeRecord = {
    id: 'demo-inc-2',
    amount: 356,
    note: '桌5·6位',
    time: '19:15',
    period: 'evening',
    tableDishes: [
      { menuId: 'demo-dish-2', qty: 2 },
      { menuId: 'demo-dish-3', qty: 3 },
      { menuId: 'demo-dish-4', qty: 1 },
      { menuId: 'demo-dish-6', qty: 2 },
      { menuId: 'demo-dish-9', qty: 2 },
    ],
  };

  const demoExpense: ExpenseRecord = {
    id: 'demo-exp-1',
    amount: 185,
    note: '猪肉10斤+青椒5斤+草鱼8斤',
    time: '08:00',
    period: 'morning',
    category: 'ingredient',
  };

  // ===== 写入各 Store =====
  useIngredientStore.getState().setIngredients(demoIngredients);
  useMenuStore.getState().setMenuItems(demoMenuItems);
  useFixedCostStore.getState().setFixedCosts(demoFixedCosts);
  useShopStore.getState().setShopInfo(demoShopInfo);

  const recordStore = useRecordStore.getState();
  recordStore.setTodayRecords({
    date: today,
    income: [demoIncome1, demoIncome2],
    expense: [demoExpense],
  });

  markDemoInitialized();
}
