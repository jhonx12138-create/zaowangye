/**
 * OrderSummary — 已选桌单汇总
 * 展示已选菜品、应收/实收金额、确认记账按钮（一步完成）
 */
import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useMenuStore } from '../../stores/useMenuStore';
import { formatMoney } from '../../constants';
import type { TableDish } from '../../types';

interface OrderSummaryProps {
  selected: TableDish[];
  onRemove: (menuId: string) => void;
  /** 一步记账回调，传入实收金额 */
  onSubmit: (actualAmount: number) => void;
}

export default function OrderSummary({ selected, onRemove, onSubmit }: OrderSummaryProps) {
  const menuItems = useMenuStore((s) => s.menuItems);

  const total = selected.reduce((sum, sel) => {
    const dish = menuItems.find((d) => d.id === sel.menuId);
    return sum + (dish?.price ?? 0) * sel.qty;
  }, 0);

  const [actualAmount, setActualAmount] = useState(String(total.toFixed(2)));

  // 应收金额变化时同步更新实收金额默认值
  useEffect(() => {
    setActualAmount(String(total.toFixed(2)));
  }, [total]);

  if (selected.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 20, marginBottom: 10 }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>请选择菜品</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', opacity: 0.7 }}>
          点击菜品旁的 + 按钮添加
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    const amt = parseFloat(actualAmount);
    if (isNaN(amt) || amt <= 0) return;
    onSubmit(amt);
  };

  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
        📋 桌单汇总
      </div>

      {selected.map((sel) => {
        const dish = menuItems.find((d) => d.id === sel.menuId);
        if (!dish) return null;
        const subtotal = dish.price * sel.qty;
        return (
          <div
            key={sel.menuId}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13 }}>{dish.name}×{sel.qty}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>
                {formatMoney(subtotal)}
              </span>
              <button
                onClick={() => onRemove(sel.menuId)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--red-bg)',
                  color: 'var(--red)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                }}
              >
                ×
              </button>
            </div>
          </div>
        );
      })}

      <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />

      {/* 应收金额 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>应收金额</span>
        <span className="mono" style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
          {formatMoney(total)}
        </span>
      </div>

      {/* 实收金额 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>实收金额</span>
        <TextField
          size="small"
          type="number"
          value={actualAmount}
          onChange={(e) => setActualAmount(e.target.value)}
          sx={{
            width: 130,
            '& .MuiOutlinedInput-root': {
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: 15,
              fontWeight: 600,
            },
          }}
          InputProps={{
            startAdornment: <span style={{ marginRight: 2, color: 'var(--text-secondary)', fontSize: 14 }}>¥</span>,
          }}
        />
      </div>

      <button
        className="btn-pill btn-pill-primary"
        onClick={handleSubmit}
        style={{ width: '100%', padding: '12px 0', fontSize: 15, fontWeight: 700 }}
      >
        ✅ 确认记账
      </button>
    </div>
  );
}
