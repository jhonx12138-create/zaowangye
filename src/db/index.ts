/**
 * IndexedDB 数据库定义（基于 Dexie.js）
 * 作为 localStorage 的灾备存储
 */
import Dexie, { type Table } from 'dexie';

/** IndexedDB 备份条目 */
export interface BackupEntry {
  key: string;
  data: unknown;
  updatedAt: number;
}

/** 灶王爷 IndexedDB 数据库 */
class ZaowangyeDB extends Dexie {
  backup!: Table<BackupEntry, string>;

  constructor() {
    super('ZaowangyeDB');
    this.version(1).stores({
      backup: '&key',
    });
  }
}

export const db = new ZaowangyeDB();
