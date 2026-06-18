/**
 * 应用常量定义
 * 集中管理所有业务常量、颜色 Token、标签映射
 */

import type { Period, ExpenseCategory } from '../types';

// ===== 时段 =====
export const PERIODS: readonly Period[] = ['morning', 'noon', 'evening', 'other'] as const;

export const PERIOD_LABELS: Record<Period, string> = {
  morning: '早市',
  noon: '午市',
  evening: '晚市',
  other: '其他',
};

export const PERIOD_ICONS: Record<Period, string> = {
  morning: '🌤',
  noon: '☀️',
  evening: '🌙',
  other: '📌',
};

// ===== 菜品分类 =====
export const DISH_CATEGORIES = ['凉菜', '热菜', '主食', '汤品', '饮品'] as const;

// ===== 支出分类 =====
export const EXPENSE_CATEGORIES: readonly { key: ExpenseCategory; label: string }[] = [
  { key: 'ingredient', label: '食材采购' },
  { key: 'seasoning', label: '调料辅料' },
  { key: 'supplies', label: '耗材杂项' },
  { key: 'other', label: '其他' },
] as const;

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  ingredient: '食材采购',
  seasoning: '调料辅料',
  supplies: '耗材杂项',
  other: '其他',
};

// ===== 语义颜色 Token =====
export const MARGIN_COLORS = {
  high: '#2E7D32',
  mid: '#FF6F00',
  low: '#C62828',
} as const;

export const CHART_COLORS = {
  income: '#2E7D32',
  expense: '#C62828',
  netProfit: '#1976D2',
  fixed: '#FF6F00',
} as const;

// ===== 毛利率阈值 =====
export const MARGIN_THRESHOLDS = {
  high: 0.60,  // ≥60% 高毛利
  mid: 0.35,   // ≥35% 中毛利，<35% 低毛利
} as const;

// ===== 本地存储 Key =====
export const STORAGE_KEYS = {
  ingredients: 'zaowangye-ingredient-storage',
  menu: 'zaowangye-menu-storage',
  records: 'zaowangye-record-storage',
  fixedCosts: 'zaowangye-fixedcost-storage',
  shop: 'zaowangye-shop-storage',
  ui: 'zaowangye-ui-storage',
  demoInitialized: 'zaowangye-demo-initialized',
} as const;

// ===== IndexedDB Key =====
export const IDB_KEYS = {
  ingredients: 'ingredients',
  menuItems: 'menuItems',
  records: 'records',
  fixedCosts: 'fixedCosts',
  shopInfo: 'shopInfo',
} as const;

// ===== Toast 自动消失时长 =====
export const TOAST_DURATION = 3000; // ms

// ===== 货币格式化 =====
export function formatMoney(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}

/** 百分比格式化 */
export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

/** 生成唯一 ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
