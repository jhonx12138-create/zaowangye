/**
 * ExpenseForm — 采购支出表单
 * 支出类别选择 + 金额 + 备注
 */
import { useState } from 'react';
import { TextField } from '@mui/material';
import { EXPENSE_CATEGORIES } from '../../constants';
import type { ExpenseRecord, ExpenseCategory, Period } from '../../types';
import { generateId, formatMoney } from '../../constants';

interface ExpenseFormProps {
  period: Period;
  onSubmit: (record: ExpenseRecord) => void;
}

export default function ExpenseForm({ period, onSubmit }: ExpenseFormProps) {
  const [category, setCategory] = useState<ExpenseCategory>('ingredient');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('请输入有效金额');
      return;
    }
    if (!note.trim()) {
      setError('请输入备注说明');
      return;
    }
    setError('');

    const now = new Date();
    const record: ExpenseRecord = {
      id: generateId(),
      amount: amt,
      note: note.trim(),
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      period,
      category,
    };

    onSubmit(record);
    setAmount('');
    setNote('');
  };

  return (
    <div>
      {/* 支出类别 */}
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
        支出类别
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {EXPENSE_CATEGORIES.map((cat) => {
          const isActive = category === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`tag-btn${isActive ? ' active' : ''}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 金额 */}
      <TextField
        fullWidth
        label="金额"
        type="number"
        value={amount}
        onChange={(e) => { setAmount(e.target.value); setError(''); }}
        error={!!error && !!amount && isNaN(parseFloat(amount))}
        helperText={error && !!amount && isNaN(parseFloat(amount)) ? error : ''}
        placeholder="0.00"
        size="small"
        sx={{
          mb: 1.5,
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--radius-sm)',
            '& input': { fontFamily: 'var(--font-mono)', fontSize: 15 },
          },
        }}
        InputProps={{
          startAdornment: <span style={{ marginRight: 4, color: 'var(--text-secondary)' }}>¥</span>,
        }}
      />

      {/* 备注 */}
      <TextField
        fullWidth
        label="备注说明"
        value={note}
        onChange={(e) => { setNote(e.target.value); setError(''); }}
        placeholder="例：猪肉10斤+青椒5斤"
        multiline
        rows={2}
        size="small"
        sx={{
          mb: 1.5,
          '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' },
        }}
      />

      {error && (
        <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8 }}>{error}</div>
      )}

      <button
        className="btn-pill btn-pill-primary"
        onClick={handleSubmit}
        disabled={!amount || !note.trim()}
        style={{ width: '100%', padding: '12px 0', fontSize: 16 }}
      >
        确认支出 {amount ? formatMoney(parseFloat(amount)) : ''}
      </button>
    </div>
  );
}
