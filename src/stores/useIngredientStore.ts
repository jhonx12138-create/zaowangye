/**
 * Ingredient Store — 原料数据管理
 * 提供原料 CRUD、价格更新、IndexedDB 灾备同步
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ingredient } from '../types';
import { STORAGE_KEYS } from '../constants';
import { backupToIndexedDB, restoreFromIndexedDB } from '../utils/syncManager';
import { IDB_KEYS } from '../constants';

interface IngredientState {
  ingredients: Ingredient[];
  addIngredient: (ing: Omit<Ingredient, 'id' | 'priceHist' | 'isDemo'>) => void;
  updateIngredient: (id: string, updates: Partial<Omit<Ingredient, 'id' | 'priceHist' | 'isDemo'>>) => void;
  deleteIngredient: (id: string) => void;
  updatePrice: (id: string, newPrice: number) => void;
  getById: (id: string) => Ingredient | undefined;
  setIngredients: (ings: Ingredient[]) => void;
}

export const useIngredientStore = create<IngredientState>()(
  persist(
    (set, get) => ({
      ingredients: [],

      addIngredient: (ing) => {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        const now = new Date().toISOString().slice(0, 10);
        const newIngredient: Ingredient = {
          ...ing,
          id,
          priceHist: [{ date: now, price: ing.pricePerJin }],
          isDemo: false,
        };
        set((state) => ({ ingredients: [...state.ingredients, newIngredient] }));
      },

      updateIngredient: (id, updates) => {
        set((state) => ({
          ingredients: state.ingredients.map((ing) =>
            ing.id === id ? { ...ing, ...updates } : ing
          ),
        }));
      },

      deleteIngredient: (id) => {
        set((state) => ({
          ingredients: state.ingredients.filter((ing) => ing.id !== id),
        }));
      },

      updatePrice: (id, newPrice) => {
        const now = new Date().toISOString().slice(0, 10);
        set((state) => ({
          ingredients: state.ingredients.map((ing) => {
            if (ing.id !== id) return ing;
            const histEntry = { date: now, price: newPrice };
            // 同一天不重复添加历史
            const lastEntry = ing.priceHist[ing.priceHist.length - 1];
            const newHist =
              lastEntry && lastEntry.date === now
                ? [...ing.priceHist.slice(0, -1), histEntry]
                : [...ing.priceHist, histEntry];
            return { ...ing, pricePerJin: newPrice, priceHist: newHist };
          }),
        }));
      },

      getById: (id) => get().ingredients.find((ing) => ing.id === id),

      setIngredients: (ings) => set({ ingredients: ings }),
    }),
    {
      name: STORAGE_KEYS.ingredients,
      onRehydrateStorage: () => {
        return async (state) => {
          if (state && state.ingredients.length === 0) {
            // localStorage 为空，尝试从 IndexedDB 恢复
            const restored = await restoreFromIndexedDB(IDB_KEYS.ingredients);
            if (restored && Array.isArray(restored) && restored.length > 0) {
              state.setIngredients(restored as Ingredient[]);
            }
          }
        };
      },
    }
  )
);

// IndexedDB 灾备同步（debounce 500ms）
let syncTimer: ReturnType<typeof setTimeout> | null = null;
useIngredientStore.subscribe((state) => {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    backupToIndexedDB(IDB_KEYS.ingredients, state.ingredients);
  }, 500);
});
