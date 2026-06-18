/**
 * Fixed Cost Store — 固定成本管理
 * 管理店铺月度固定成本（房租、人工、水电、调料）
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FixedCosts } from '../types';
import { STORAGE_KEYS } from '../constants';
import { backupToIndexedDB, restoreFromIndexedDB } from '../utils/syncManager';
import { IDB_KEYS } from '../constants';

interface FixedCostState {
  fixedCosts: FixedCosts;
  updateFixedCosts: (costs: Partial<FixedCosts>) => void;
  setFixedCosts: (costs: FixedCosts) => void;
}

const DEFAULT_FIXED_COSTS: FixedCosts = {
  rent: 0,
  labor: 0,
  utilities: 0,
  seasoning: 0,
};

export const useFixedCostStore = create<FixedCostState>()(
  persist(
    (set) => ({
      fixedCosts: { ...DEFAULT_FIXED_COSTS },

      updateFixedCosts: (costs) => {
        set((state) => ({
          fixedCosts: { ...state.fixedCosts, ...costs },
        }));
      },

      setFixedCosts: (costs) => set({ fixedCosts: costs }),
    }),
    {
      name: STORAGE_KEYS.fixedCosts,
      onRehydrateStorage: () => {
        return async (state) => {
          if (state) {
            const isDefault =
              state.fixedCosts.rent === 0 &&
              state.fixedCosts.labor === 0 &&
              state.fixedCosts.utilities === 0 &&
              state.fixedCosts.seasoning === 0;
            if (isDefault) {
              const restored = await restoreFromIndexedDB(IDB_KEYS.fixedCosts);
              if (restored && typeof restored === 'object') {
                state.setFixedCosts(restored as FixedCosts);
              }
            }
          }
        };
      },
    }
  )
);

let syncTimer4: ReturnType<typeof setTimeout> | null = null;
useFixedCostStore.subscribe((state) => {
  if (syncTimer4) clearTimeout(syncTimer4);
  syncTimer4 = setTimeout(() => {
    backupToIndexedDB(IDB_KEYS.fixedCosts, state.fixedCosts);
  }, 500);
});
