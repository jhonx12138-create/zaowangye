/**
 * useTodayRecords Hook
 * 返回今日记账记录，自动处理日期变更
 */
import { useRecordStore } from '../stores/useRecordStore';
import type { DayRecord } from '../types';

export function useTodayRecords(): {
  today: DayRecord | null;
  income: DayRecord['income'];
  expense: DayRecord['expense'];
  hasRecords: boolean;
} {
  const todayRecords = useRecordStore((s) => s.todayRecords);

  const today = new Date().toISOString().slice(0, 10);
  const isToday = todayRecords?.date === today;

  const records = isToday ? todayRecords : null;

  return {
    today: records,
    income: records?.income ?? [],
    expense: records?.expense ?? [],
    hasRecords: (records?.income.length ?? 0) + (records?.expense.length ?? 0) > 0,
  };
}
