/**
 * 核心计算工具函数
 * 提供菜品成本、净利润、毛利率等核心业务计算
 */
import type { DayRecord, FixedCosts, IncomeRecord, ExpenseRecord } from '../types';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useMenuStore } from '../stores/useMenuStore';

/**
 * 获取单个菜品的原料成本
 * 遍历菜品原料构成，查找原料单价，计算 Σ(用量/16 × 元/斤)
 */
export function getDishCost(menuId: string): number {
  const dish = useMenuStore.getState().menuItems.find((d) => d.id === menuId);
  if (!dish) return 0;
  const ingredients = useIngredientStore.getState().ingredients;
  return dish.ings.reduce((sum, ing) => {
    const ingData = ingredients.find((i) => i.id === ing.ingId);
    if (!ingData) return sum;
    return sum + (ing.amount / 16) * ingData.pricePerJin;
  }, 0);
}

/** 毛利率 = (售价 - 成本) / 售价 */
export function getGrossMargin(sellingPrice: number, cost: number): number {
  if (sellingPrice <= 0) return 0;
  return (sellingPrice - cost) / sellingPrice;
}

/** 获取当前月份天数 */
function daysInMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

/** 日摊固定成本 = 月度固定成本总额 / 当月天数 */
export function getDailyFixedCost(fixedCosts: FixedCosts): number {
  const total = fixedCosts.rent + fixedCosts.labor + fixedCosts.utilities + fixedCosts.seasoning;
  return total / daysInMonth();
}

/** 计算日汇总 */
export function getTodayNetProfit(
  dayRecord: DayRecord,
  fixedCosts: FixedCosts
): {
  totalIncome: number;
  totalExpense: number;
  dailyFixed: number;
  netProfit: number;
  recordCount: number;
} {
  const totalIncome = dayRecord.income.reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = dayRecord.expense.reduce((sum, r) => sum + r.amount, 0);
  const dailyFixed = getDailyFixedCost(fixedCosts);
  const netProfit = totalIncome - totalExpense - dailyFixed;
  const recordCount = dayRecord.income.length + dayRecord.expense.length;

  return { totalIncome, totalExpense, dailyFixed, netProfit, recordCount };
}

/** 计算某日净利（已扣除日摊成本） */
export function calcDayNetProfit(dayRecord: DayRecord, fixedCosts: FixedCosts): number {
  const income = dayRecord.income.reduce((sum, r) => sum + r.amount, 0);
  const expense = dayRecord.expense.reduce((sum, r) => sum + r.amount, 0);
  return income - expense - getDailyFixedCost(fixedCosts);
}

/** 计算收入总额 */
export function calcTotalIncome(records: IncomeRecord[]): number {
  return records.reduce((sum, r) => sum + r.amount, 0);
}

/** 计算支出总额 */
export function calcTotalExpense(records: ExpenseRecord[]): number {
  return records.reduce((sum, r) => sum + r.amount, 0);
}
