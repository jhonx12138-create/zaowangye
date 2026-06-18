/**
 * IndexedDB 同步管理器
 * 提供 localStorage ↔ IndexedDB 双向同步的底层操作
 */
import { db } from '../db';
import { IDB_KEYS } from '../constants';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useMenuStore } from '../stores/useMenuStore';
import { useRecordStore } from '../stores/useRecordStore';
import { useFixedCostStore } from '../stores/useFixedCostStore';
import { useShopStore } from '../stores/useShopStore';

/**
 * 将数据备份到 IndexedDB
 */
export async function backupToIndexedDB(key: string, data: unknown): Promise<void> {
  try {
    await db.backup.put({ key, data, updatedAt: Date.now() });
  } catch (e) {
    console.warn(`[syncManager] Backup failed for "${key}":`, e);
  }
}

/**
 * 从 IndexedDB 恢复单条数据
 */
export async function restoreFromIndexedDB(key: string): Promise<unknown | null> {
  try {
    const entry = await db.backup.get(key);
    return entry?.data ?? null;
  } catch (e) {
    console.warn(`[syncManager] Restore failed for "${key}":`, e);
    return null;
  }
}

/**
 * 应用启动时执行：检查各 Store 是否需要从 IndexedDB 恢复
 * 仅当对应 Store 的 localStorage 无数据时才尝试恢复
 * @returns 成功恢复的 Store 数量
 */
export async function restoreAllFromIndexedDB(): Promise<number> {
  let restored = 0;

  try {
    // 原料
    const ings = await restoreFromIndexedDB(IDB_KEYS.ingredients);
    if (ings && Array.isArray(ings) && ings.length > 0) {
      const store = useIngredientStore.getState();
      if (store.ingredients.length === 0) {
        store.setIngredients(ings as Parameters<typeof store.setIngredients>[0]);
        restored++;
      }
    }

    // 菜品
    const menu = await restoreFromIndexedDB(IDB_KEYS.menuItems);
    if (menu && Array.isArray(menu) && menu.length > 0) {
      const store = useMenuStore.getState();
      if (store.menuItems.length === 0) {
        store.setMenuItems(menu as Parameters<typeof store.setMenuItems>[0]);
        restored++;
      }
    }

    // 记录
    const records = await restoreFromIndexedDB(IDB_KEYS.records);
    if (records && typeof records === 'object') {
      const data = records as { todayRecords: unknown; history: unknown[] };
      const store = useRecordStore.getState();
      if (!store.todayRecords && store.history.length === 0) {
        if (data.todayRecords) {
          store.setTodayRecords(data.todayRecords as Parameters<typeof store.setTodayRecords>[0]);
        }
        if (data.history && data.history.length > 0) {
          store.setHistory(data.history as Parameters<typeof store.setHistory>[0]);
        }
        restored++;
      }
    }

    // 固定成本
    const fixed = await restoreFromIndexedDB(IDB_KEYS.fixedCosts);
    if (fixed && typeof fixed === 'object') {
      const store = useFixedCostStore.getState();
      const fc = store.fixedCosts;
      if (fc.rent === 0 && fc.labor === 0 && fc.utilities === 0 && fc.seasoning === 0) {
        store.setFixedCosts(fixed as Parameters<typeof store.setFixedCosts>[0]);
        restored++;
      }
    }

    // 店铺信息
    const shop = await restoreFromIndexedDB(IDB_KEYS.shopInfo);
    if (shop && typeof shop === 'object') {
      const store = useShopStore.getState();
      if (!store.shopInfo.name) {
        store.setShopInfo(shop as Parameters<typeof store.setShopInfo>[0]);
        restored++;
      }
    }
  } catch (e) {
    console.error('[syncManager] restoreAllFromIndexedDB error:', e);
  }

  return restored;
}
