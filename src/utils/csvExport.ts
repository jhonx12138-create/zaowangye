/**
 * CSV 导出工具
 * 将记账数据导出为 CSV 文件下载
 */
import type { DayRecord, IncomeRecord, ExpenseRecord } from '../types';
import { PERIOD_LABELS, EXPENSE_CATEGORY_LABELS } from '../constants';
import type { Period, ExpenseCategory } from '../types';

/** 转义 CSV 字段 */
function escapeCSV(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/** 导出收入记录为 CSV */
export function exportIncomeCSV(records: DayRecord[], filename: string = 'zaowangye-income.csv'): void {
  const headers = ['日期', '时间', '时段', '金额', '备注'];
  const rows: string[][] = [headers];

  for (const day of records) {
    for (const r of day.income) {
      rows.push([
        day.date,
        r.time,
        PERIOD_LABELS[r.period as Period] || r.period,
        r.amount.toFixed(2),
        r.note,
      ]);
    }
  }

  const csv = rows.map((row) => row.map(escapeCSV).join(',')).join('\n');
  downloadCSV(csv, filename);
}

/** 导出支出记录为 CSV */
export function exportExpenseCSV(records: DayRecord[], filename: string = 'zaowangye-expense.csv'): void {
  const headers = ['日期', '时间', '时段', '类别', '金额', '备注'];
  const rows: string[][] = [headers];

  for (const day of records) {
    for (const r of day.expense) {
      rows.push([
        day.date,
        r.time,
        PERIOD_LABELS[r.period as Period] || r.period,
        EXPENSE_CATEGORY_LABELS[r.category as ExpenseCategory] || r.category,
        r.amount.toFixed(2),
        r.note,
      ]);
    }
  }

  const csv = rows.map((row) => row.map(escapeCSV).join(',')).join('\n');
  downloadCSV(csv, filename);
}

/** 导出收入+支出汇总 */
export function exportAllCSV(records: DayRecord[], filename: string = 'zaowangye-all.csv'): void {
  const headers = ['日期', '时间', '时段', '类型', '分类', '金额', '备注'];
  const rows: string[][] = [headers];

  for (const day of records) {
    for (const r of day.income) {
      rows.push([
        day.date,
        r.time,
        PERIOD_LABELS[r.period as Period] || r.period,
        '收入',
        '',
        r.amount.toFixed(2),
        r.note,
      ]);
    }
    for (const r of day.expense) {
      rows.push([
        day.date,
        r.time,
        PERIOD_LABELS[r.period as Period] || r.period,
        '支出',
        EXPENSE_CATEGORY_LABELS[r.category as ExpenseCategory] || r.category,
        r.amount.toFixed(2),
        r.note,
      ]);
    }
  }

  const csv = rows.map((row) => row.map(escapeCSV).join(',')).join('\n');
  downloadCSV(csv, filename);
}

/** 触发 CSV 文件下载 */
function downloadCSV(csv: string, filename: string): void {
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
