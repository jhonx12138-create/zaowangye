/**
 * RecordsPage — 记账页面
 * 包含「记一笔」和「今日已记」两个 Tab，处理收入/支出录入全流程
 */
import { useState, useCallback } from 'react';
import { Box, ToggleButtonGroup, ToggleButton, TextField, Typography } from '@mui/material';
import RecordTabs from '../components/Records/RecordTabs';
import PeriodSelector from '../components/Records/PeriodSelector';
import DishSelector from '../components/Records/DishSelector';
import ExpenseForm from '../components/Records/ExpenseForm';
import OrderSummary from '../components/Records/OrderSummary';
import RecordsList from '../components/Records/RecordsList';
import ConfirmDialog from '../components/Records/ConfirmDialog';
import { useRecordStore } from '../stores/useRecordStore';
import { useMenuStore } from '../stores/useMenuStore';
import { useUIStore } from '../stores/useUIStore';
import { generateId } from '../constants';
import type { Period, TableDish, IncomeRecord, ExpenseRecord } from '../types';

export default function RecordsPage() {
  // 主 Tab
  const [mainTab, setMainTab] = useState(0);
  // 记一笔子 Tab：收入/支出
  const [recordType, setRecordType] = useState<'income' | 'expense'>('income');
  // 收入相关状态
  const [period, setPeriod] = useState<Period>('noon');
  const [selectedDishes, setSelectedDishes] = useState<TableDish[]>([]);
  const [incomeNote, setIncomeNote] = useState('');
  // 确认对话框
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRecord, setPendingRecord] = useState<{ dishes: TableDish[]; total: number } | null>(null);

  const addIncomeRecord = useRecordStore((s) => s.addIncomeRecord);
  const addExpenseRecord = useRecordStore((s) => s.addExpenseRecord);
  const menuItems = useMenuStore((s) => s.menuItems);
  const showToast = useUIStore((s) => s.showToast);

  // 添加/移除菜品
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

  // 计算总价
  const total = selectedDishes.reduce((sum, sel) => {
    const dish = menuItems.find((d) => d.id === sel.menuId);
    return sum + (dish?.price ?? 0) * sel.qty;
  }, 0);

  // 提交收入记录
  const handleIncomeSubmit = () => {
    if (selectedDishes.length === 0) return;
    setPendingRecord({ dishes: [...selectedDishes], total });
    setConfirmOpen(true);
  };

  const handleConfirmIncome = () => {
    if (!pendingRecord) return;
    const now = new Date();
    const record: IncomeRecord = {
      id: generateId(),
      amount: pendingRecord.total,
      note: incomeNote.trim() || `桌单·${pendingRecord.dishes.length}道菜`,
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      period,
      tableDishes: pendingRecord.dishes,
    };
    addIncomeRecord(record);
    setSelectedDishes([]);
    setIncomeNote('');
    setConfirmOpen(false);
    setPendingRecord(null);
    showToast('记账成功！', 'success');
  };

  // 提交支出记录
  const handleExpenseSubmit = (record: ExpenseRecord) => {
    addExpenseRecord(record);
    showToast('支出记录已保存', 'success');
  };

  return (
    <Box>
      <RecordTabs value={mainTab} onChange={(_, v) => setMainTab(v)} />

      {mainTab === 0 ? (
        /* ===== 记一笔 ===== */
        <Box>
          {/* 收入/支出切换 */}
          <ToggleButtonGroup
            value={recordType}
            exclusive
            onChange={(_, val) => val && setRecordType(val)}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="income" sx={{ py: 1, fontWeight: 600 }}>
              📈 桌单收入
            </ToggleButton>
            <ToggleButton value="expense" sx={{ py: 1, fontWeight: 600 }}>
              📉 采购支出
            </ToggleButton>
          </ToggleButtonGroup>

          {recordType === 'income' ? (
            <>
              <PeriodSelector value={period} onChange={setPeriod} />
              <TextField
                fullWidth
                size="small"
                placeholder="备注（桌号/人数等，选填）"
                value={incomeNote}
                onChange={(e) => setIncomeNote(e.target.value)}
                sx={{ mb: 1.5 }}
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
            <ExpenseForm period={period} onSubmit={handleExpenseSubmit} />
          )}
        </Box>
      ) : (
        /* ===== 今日已记 ===== */
        <RecordsList />
      )}

      {/* 确认对话框 */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmIncome}
        tableDishes={pendingRecord?.dishes ?? []}
        total={pendingRecord?.total ?? 0}
        period={period}
        note={incomeNote}
      />
    </Box>
  );
}
