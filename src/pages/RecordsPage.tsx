/**
 * RecordsPage — 记账页面
 * 「记一笔」和「今日已记」两个 Tab，处理收入/支出录入全流程
 * 已移除时段选择和确认对话框，改为一步记账
 */
import { useState, useCallback } from 'react';
import { TextField } from '@mui/material';
import RecordTabs from '../components/Records/RecordTabs';
import DishSelector from '../components/Records/DishSelector';
import ExpenseForm from '../components/Records/ExpenseForm';
import OrderSummary from '../components/Records/OrderSummary';
import RecordsList from '../components/Records/RecordsList';
import { useRecordStore } from '../stores/useRecordStore';
import { useMenuStore } from '../stores/useMenuStore';
import { useUIStore } from '../stores/useUIStore';
import { generateId } from '../constants';
import type { Period, TableDish, IncomeRecord, ExpenseRecord } from '../types';

const DEFAULT_PERIOD: Period = 'noon';

export default function RecordsPage() {
  const [mainTab, setMainTab] = useState(0);
  const [recordType, setRecordType] = useState<'income' | 'expense'>('income');
  const [selectedDishes, setSelectedDishes] = useState<TableDish[]>([]);
  const [incomeNote, setIncomeNote] = useState('');

  const addIncomeRecord = useRecordStore((s) => s.addIncomeRecord);
  const addExpenseRecord = useRecordStore((s) => s.addExpenseRecord);
  const menuItems = useMenuStore((s) => s.menuItems);
  const showToast = useUIStore((s) => s.showToast);

  const handleAddDish = useCallback((menuId: string) => {
    setSelectedDishes((prev) => {
      const existing = prev.find((d) => d.menuId === menuId);
      if (existing) {
        return prev.map((d) => d.menuId === menuId ? { ...d, qty: d.qty + 1 } : d);
      }
      return [...prev, { menuId, qty: 1 }];
    });
  }, []);

  const handleRemoveDish = useCallback((menuId: string) => {
    setSelectedDishes((prev) => {
      const existing = prev.find((d) => d.menuId === menuId);
      if (existing && existing.qty <= 1) {
        return prev.filter((d) => d.menuId !== menuId);
      }
      return prev.map((d) => d.menuId === menuId ? { ...d, qty: d.qty - 1 } : d);
    });
  }, []);

  const total = selectedDishes.reduce((sum, sel) => {
    const dish = menuItems.find((d) => d.id === sel.menuId);
    return sum + (dish?.price ?? 0) * sel.qty;
  }, 0);

  /** 一步记账：直接使用传入的实收金额创建收入记录 */
  const handleIncomeSubmit = (actualAmount: number) => {
    if (selectedDishes.length === 0) return;
    const now = new Date();
    const record: IncomeRecord = {
      id: generateId(),
      amount: actualAmount,
      note: incomeNote.trim() || `桌单·${selectedDishes.length}道菜`,
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      period: DEFAULT_PERIOD,
      tableDishes: [...selectedDishes],
    };
    addIncomeRecord(record);
    setSelectedDishes([]);
    setIncomeNote('');
    showToast('记账成功！', 'success');
  };

  const handleExpenseSubmit = (record: ExpenseRecord) => {
    addExpenseRecord(record);
    showToast('支出记录已保存', 'success');
  };

  return (
    <div>
      <RecordTabs value={mainTab} onChange={(v) => setMainTab(v)} />

      {mainTab === 0 ? (
        /* ===== 记一笔 ===== */
        <div>
          {/* 收入/支出切换 */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            <button
              onClick={() => setRecordType('income')}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: recordType === 'income' ? 'var(--green)' : 'var(--bg)',
                color: recordType === 'income' ? '#fff' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              📈 桌单收入
            </button>
            <button
              onClick={() => setRecordType('expense')}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: recordType === 'expense' ? 'var(--red)' : 'var(--bg)',
                color: recordType === 'expense' ? '#fff' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              📉 采购支出
            </button>
          </div>

          {recordType === 'income' ? (
            <>
              <TextField
                fullWidth
                size="small"
                placeholder="备注（桌号/人数等，选填）"
                value={incomeNote}
                onChange={(e) => setIncomeNote(e.target.value)}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' },
                }}
              />
              <DishSelector
                selected={selectedDishes}
                onAdd={handleAddDish}
                onRemove={handleRemoveDish}
              />
              <OrderSummary
                selected={selectedDishes}
                onRemove={handleRemoveDish}
                onSubmit={handleIncomeSubmit}
              />
            </>
          ) : (
            <ExpenseForm period={DEFAULT_PERIOD} onSubmit={handleExpenseSubmit} />
          )}
        </div>
      ) : (
        /* ===== 今日已记 ===== */
        <RecordsList />
      )}
    </div>
  );
}
