/**
 * 全局类型定义
 * 定义应用所有核心数据模型接口
 */

/** 价格历史条目 */
export interface PriceHistoryEntry {
  date: string;   // ISO date string YYYY-MM-DD
  price: number;  // 元/斤
}

/** 原料 */
export interface Ingredient {
  id: string;
  name: string;
  pricePerJin: number;          // 元/斤
  unit: string;                 // 斤
  typUnit: string;              // 两
  supplier: string;
  priceHist: PriceHistoryEntry[];
  isDemo: boolean;
}

/** 菜品原料用量 */
export interface MenuIngredient {
  ingId: string;
  amount: number;  // 用量（单位：两）
  unit: string;    // 两
}

/** 菜品 / 菜单项 */
export interface MenuItem {
  id: string;
  name: string;
  price: number;          // 售价（元）
  dailySales: number;     // 日均销量
  category: string;       // 凉菜/热菜/主食/汤品/饮品
  ings: MenuIngredient[];
  isDemo: boolean;
}

/** 桌单菜品 */
export interface TableDish {
  menuId: string;
  qty: number;
}

/** 收入记录 */
export interface IncomeRecord {
  id: string;
  amount: number;
  note: string;
  time: string;            // HH:mm
  period: 'morning' | 'noon' | 'evening' | 'other';
  tableDishes: TableDish[];
}

/** 支出记录 */
export interface ExpenseRecord {
  id: string;
  amount: number;
  note: string;
  time: string;            // HH:mm
  period: 'morning' | 'noon' | 'evening' | 'other';
  category: 'ingredient' | 'seasoning' | 'supplies' | 'other';
}

/** 日记账 */
export interface DayRecord {
  date: string;            // YYYY-MM-DD
  income: IncomeRecord[];
  expense: ExpenseRecord[];
}

/** 固定成本 */
export interface FixedCosts {
  rent: number;
  labor: number;
  utilities: number;
  seasoning: number;
}

/** 店铺信息 */
export interface ShopInfo {
  name: string;
  owner: string;
  phone: string;
  address: string;
}

/** 日汇总 */
export interface DailySummary {
  date: string;
  income: number;
  expense: number;
  fixed: number;
  netProfit: number;
}

/** 时段类型 */
export type Period = 'morning' | 'noon' | 'evening' | 'other';

/** 支出类别类型 */
export type ExpenseCategory = 'ingredient' | 'seasoning' | 'supplies' | 'other';

/** Toast 消息 */
export interface ToastMessage {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

/** 确认对话框状态 */
export interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
}

/** 底部弹出 Sheet 状态 */
export interface SheetState {
  open: boolean;
  title: string;
  content: React.ReactNode | null;
}
