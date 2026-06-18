/**
 * useDailySummary Hook
 * 计算今日汇总 + 历史日汇总数组，用于仪表盘和趋势图
 */
import { useMemo } from 'react';
import { useRecordStore } from '../stores/useRecordStore';
import { useFixedCostStore } from '../stores/useFixedCostStore';
import { getTodayNetProfit, calcDayNetProfit } from '../utils/calculations';
import type { DailySummary } from '../types';

export function useDailySummary(): {
  todaySummary: DailySummary | null;
  historySummaries: DailySummary[];
  yesterdayNetProfit: number;
} {
  const todayRecords = useRecordStore((s) => s.todayRecords);
  const history = useRecordStore((s) => s.history);
  const fixedCosts = useFixedCostStore((s) => s.fixedCosts);

  return useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    // 今日汇总
    let todaySummary: DailySummary | null = null;
    if (todayRecords && todayRecords.date === today) {
      const { totalIncome, totalExpense, dailyFixed, netProfit, recordCount } =
        getTodayNetProfit(todayRecords, fixedCosts);
      todaySummary = {
        date: today,
        income: totalIncome,
        expense: totalExpense,
        fixed: dailyFixed,
        netProfit,
      };
    }

    // 历史汇总（按日期排序，最近在前）
    const historySummaries: DailySummary[] = history
      .map((day) => {
        const income = day.income.reduce((s, r) => s + r.amount, 0);
        const expense = day.expense.reduce((s, r) => s + r.amount, 0);
        const net = calcDayNetProfit(day, fixedCosts);
        const dailyFixed = income - expense - net; // = getDailyFixedCost(fixedCosts)
        return {
          date: day.date,
          income,
          expense,
          fixed: Math.abs(dailyFixed),
          netProfit: net,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    // 昨天净利
    const yesterdayNetProfit =
      historySummaries.length > 0 ? historySummaries[0].netProfit : 0;

    return { todaySummary, historySummaries, yesterdayNetProfit };
  }, [todayRecords, history, fixedCosts]);
}
