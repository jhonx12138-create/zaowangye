/**
 * ExpenseForm — 采购支出表单
 * 支出类别选择 + 金额 + 备注
 */
import { useState } from 'react';
import { Box, TextField, ToggleButtonGroup, ToggleButton, Typography, Button } from '@mui/material';
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
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
        支出类别
      </Typography>
      <ToggleButtonGroup
        value={category}
        exclusive
        onChange={(_, val) => val && setCategory(val)}
        size="small"
        sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}
      >
        {EXPENSE_CATEGORIES.map((cat) => (
          <ToggleButton
            key={cat.key}
            value={cat.key}
            sx={{ borderRadius: 3, px: 2, py: 0.5, textTransform: 'none', fontSize: 13 }}
          >
            {cat.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <TextField
        fullWidth
        label="金额"
        type="number"
        value={amount}
        onChange={(e) => { setAmount(e.target.value); setError(''); }}
        error={!!error && !!amount && isNaN(parseFloat(amount))}
        helperText={error && !!amount && isNaN(parseFloat(amount)) ? error : ''}
        placeholder="0.00"
        sx={{ mb: 2 }}
        InputProps={{ startAdornment: <Typography sx={{ mr: 0.5 }}>¥</Typography> }}
      />

      <TextField
        fullWidth
        label="备注说明"
        value={note}
        onChange={(e) => { setNote(e.target.value); setError(''); }}
        placeholder="例：猪肉10斤+青椒5斤"
        multiline
        rows={2}
        sx={{ mb: 2 }}
      />

      {error && (
        <Typography color="error" variant="caption" display="block" mb={1}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={!amount || !note.trim()}
        sx={{ py: 1.2 }}
      >
        确认支出 {amount ? formatMoney(parseFloat(amount)) : ''}
      </Button>
    </Box>
  );
}
