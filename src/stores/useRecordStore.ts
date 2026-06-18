/**
 * Record Store — 记账记录管理
 * 管理今日账目 + 历史账目，支持收入/支出记录的增删
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DayRecord, IncomeRecord, ExpenseRecord } from '../types';
import { STORAGE_KEYS } from '../constants';
import { backupToIndexedDB, restoreFromIndexedDB } from '../utils/syncManager';
import { IDB_KEYS } from '../constants';

interface RecordState {
  todayRecords: DayRecord | null;
  history: DayRecord[];
  addIncomeRecord: (record: IncomeRecord) => void;
  addExpenseRecord: (record: ExpenseRecord) => void;
  deleteIncomeRecord: (recordId: string) => void;
  deleteExpenseRecord: (recordId: string) => void;
  /** 移动今日记录到历史 */
  archiveToday: () => void;
  setTodayRecords: (record: DayRecord | null) => void;
  setHistory: (records: DayRecord[]) => void;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function ensureToday(get: () => RecordState): DayRecord {
  const state = get();
  const today = todayStr();
  if (state.todayRecords && state.todayRecords.date === today) {
    return state.todayRecords;
  }
  // 日期已变，归档旧记录
  if (state.todayRecords && state.todayRecords.date !== today) {
    const archived = { ...state.todayRecords };
    get().archiveToday();
  }
  return { date: today, income: [], expense: [] };
}

export const useRecordStore = create<RecordState>()(
  persist(
    (set, get) => ({
      todayRecords: null,
      history: [],

      addIncomeRecord: (record) => {
        set((state) => {
          const today = ensureToday(get);
          return {
            todayRecords: {
              ...today,
              income: [...today.income, record],
            },
          };
        });
      },

      addExpenseRecord: (record) => {
        set((state) => {
          const today = ensureToday(get);
          return {
            todayRecords: {
              ...today,
              expense: [...today.expense, record],
            },
          };
        });
      },

      deleteIncomeRecord: (recordId) => {
        set((state) => {
          if (!state.todayRecords) return state;
          return {
            todayRecords: {
              ...state.todayRecords,
              income: state.todayRecords.income.filter((r) => r.id !== recordId),
            },
          };
        });
      },

      deleteExpenseRecord: (recordId) => {
        set((state) => {
          if (!state.todayRecords) return state;
          return {
            todayRecords: {
              ...state.todayRecords,
              expense: state.todayRecords.expense.filter((r) => r.id !== recordId),
            },
          };
        });
      },

      archiveToday: () => {
        set((state) => {
          if (!state.todayRecords) return state;
          return {
            todayRecords: null,
            history: [...state.history, state.todayRecords],
          };
        });
      },

      setTodayRecords: (record) => set({ todayRecords: record }),
      setHistory: (records) => set({ history: records }),
    }),
    {
      name: STORAGE_KEYS.records,
      onRehydrateStorage: () => {
        return async (state) => {
          if (state && !state.todayRecords && state.history.length === 0) {
            // 尝试从 IndexedDB 恢复
            const restored = await restoreFromIndexedDB(IDB_KEYS.records);
            if (restored && typeof restored === 'object') {
              const data = restored as { todayRecords: DayRecord | null; history: DayRecord[] };
              if (data.todayRecords) state.setTodayRecords(data.todayRecords);
              if (data.history && data.history.length > 0) state.setHistory(data.history);
            }
          }
        };
      },
    }
  )
);

let syncTimer3: ReturnType<typeof setTimeout> | null = null;
useRecordStore.subscribe((state) => {
  if (syncTimer3) clearTimeout(syncTimer3);
  syncTimer3 = setTimeout(() => {
    backupToIndexedDB(IDB_KEYS.records, {
      todayRecords: state.todayRecords,
      history: state.history,
    });
  }, 500);
});
