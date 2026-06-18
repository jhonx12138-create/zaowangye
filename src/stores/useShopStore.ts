/**
 * Shop Store — 店铺信息管理
 * 管理店铺基本信息（名称、店主、电话、地址）
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShopInfo } from '../types';
import { STORAGE_KEYS } from '../constants';
import { backupToIndexedDB, restoreFromIndexedDB } from '../utils/syncManager';
import { IDB_KEYS } from '../constants';

interface ShopState {
  shopInfo: ShopInfo;
  updateShopInfo: (info: Partial<ShopInfo>) => void;
  setShopInfo: (info: ShopInfo) => void;
}

const DEFAULT_SHOP_INFO: ShopInfo = {
  name: '',
  owner: '',
  phone: '',
  address: '',
};

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      shopInfo: { ...DEFAULT_SHOP_INFO },

      updateShopInfo: (info) => {
        set((state) => ({
          shopInfo: { ...state.shopInfo, ...info },
        }));
      },

      setShopInfo: (info) => set({ shopInfo: info }),
    }),
    {
      name: STORAGE_KEYS.shop,
      onRehydrateStorage: () => {
        return async (state) => {
          if (state && !state.shopInfo.name) {
            const restored = await restoreFromIndexedDB(IDB_KEYS.shopInfo);
            if (restored && typeof restored === 'object') {
              state.setShopInfo(restored as ShopInfo);
            }
          }
        };
      },
    }
  )
);

let syncTimer5: ReturnType<typeof setTimeout> | null = null;
useShopStore.subscribe((state) => {
  if (syncTimer5) clearTimeout(syncTimer5);
  syncTimer5 = setTimeout(() => {
    backupToIndexedDB(IDB_KEYS.shopInfo, state.shopInfo);
  }, 500);
});
