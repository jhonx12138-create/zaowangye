/**
 * Menu Store — 菜品 / 菜单数据管理
 * 提供菜品 CRUD、跨 Store 成本计算、IndexedDB 灾备同步
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem } from '../types';
import { STORAGE_KEYS } from '../constants';
import { backupToIndexedDB, restoreFromIndexedDB } from '../utils/syncManager';
import { IDB_KEYS } from '../constants';
import { useIngredientStore } from './useIngredientStore';

interface MenuState {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'isDemo'>) => void;
  updateMenuItem: (id: string, updates: Partial<Omit<MenuItem, 'id' | 'isDemo'>>) => void;
  deleteMenuItem: (id: string) => void;
  /** 计算菜品原料成本（跨 Store 读取原料价格） */
  getDishCost: (menuId: string) => number;
  getByCategory: (category: string) => MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      menuItems: [],

      addMenuItem: (item) => {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        const newItem: MenuItem = { ...item, id, isDemo: false };
        set((state) => ({ menuItems: [...state.menuItems, newItem] }));
      },

      updateMenuItem: (id, updates) => {
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      deleteMenuItem: (id) => {
        set((state) => ({
          menuItems: state.menuItems.filter((item) => item.id !== id),
        }));
      },

      getDishCost: (menuId: string): number => {
        const dish = get().menuItems.find((d) => d.id === menuId);
        if (!dish) return 0;
        // 跨 Store 读取原料价格（ESM 循环引用在懒调用时安全）
        const ingredients = useIngredientStore.getState().ingredients;
        return dish.ings.reduce((sum, ing) => {
          const ingData = ingredients.find((i) => i.id === ing.ingId);
          if (!ingData) return sum;
          return sum + (ing.amount / 16) * ingData.pricePerJin;
        }, 0);
      },

      getByCategory: (category) =>
        get().menuItems.filter((item) => item.category === category),

      setMenuItems: (items) => set({ menuItems: items }),
    }),
    {
      name: STORAGE_KEYS.menu,
      onRehydrateStorage: () => {
        return async (state) => {
          if (state && state.menuItems.length === 0) {
            const restored = await restoreFromIndexedDB(IDB_KEYS.menuItems);
            if (restored && Array.isArray(restored) && restored.length > 0) {
              state.setMenuItems(restored as MenuItem[]);
            }
          }
        };
      },
    }
  )
);

let syncTimer2: ReturnType<typeof setTimeout> | null = null;
useMenuStore.subscribe((state) => {
  if (syncTimer2) clearTimeout(syncTimer2);
  syncTimer2 = setTimeout(() => {
    backupToIndexedDB(IDB_KEYS.menuItems, state.menuItems);
  }, 500);
});
