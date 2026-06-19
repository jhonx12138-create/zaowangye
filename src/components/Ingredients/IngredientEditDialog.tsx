/**
 * IngredientEditSheet — 添加/编辑原料底部半弹层
 * 从底部滑入的半透明遮罩 + 白色卡片，替代居中弹窗
 */
import { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import type { Ingredient } from '../../types';

interface IngredientEditSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; pricePerJin: number; supplier: string }) => void;
  ingredient?: Ingredient | null;
}

export default function IngredientEditSheet({
  open,
  onClose,
  onSave,
  ingredient,
}: IngredientEditSheetProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [error, setError] = useState('');

  const isEdit = !!ingredient;

  useEffect(() => {
    if (open) {
      if (ingredient) {
        setName(ingredient.name);
        setPrice(String(ingredient.pricePerJin));
        setSupplier(ingredient.supplier);
      } else {
        setName('');
        setPrice('');
        setSupplier('');
      }
      setError('');
    }
  }, [open, ingredient]);

  const handleSave = () => {
    const priceNum = parseFloat(price);
    if (!name.trim()) {
      setError('请输入原料名称');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('请输入有效的单价');
      return;
    }
    if (!supplier.trim()) {
      setError('请输入供应商');
      return;
    }
    onSave({
      name: name.trim(),
      pricePerJin: priceNum,
      supplier: supplier.trim(),
    });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* 半透明遮罩 */}
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.4)',
          zIndex: 1300,
          animation: 'fadeIn 0.2s ease',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}
      />

      {/* 底部白色卡片 */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 375,
          maxWidth: '100%',
          bgcolor: '#fff',
          borderRadius: '14px 14px 0 0',
          zIndex: 1301,
          px: 2.5,
          pt: 1.5,
          pb: 3,
          animation: 'slideUp 0.25s ease',
          '@keyframes slideUp': {
            from: { transform: 'translateX(-50%) translateY(100%)' },
            to: { transform: 'translateX(-50%) translateY(0)' },
          },
        }}
      >
        {/* 拖动把手 */}
        <Box
          sx={{
            width: 36,
            height: 4,
            borderRadius: 2,
            bgcolor: '#D0D0D0',
            mx: 'auto',
            mb: 1.5,
          }}
        />

        {/* 标题 */}
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
          {isEdit ? '编辑原料' : '添加原料'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextField
            label="原料名称"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="例：猪肉"
            fullWidth
            autoFocus
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
          />
          <TextField
            label="单价（元/斤）"
            type="number"
            value={price}
            onChange={(e) => { setPrice(e.target.value); setError(''); }}
            placeholder="0.00"
            fullWidth
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
            InputProps={{
              startAdornment: <span style={{ marginRight: 4, color: 'var(--text-secondary)' }}>¥</span>,
            }}
          />
          <TextField
            label="供应商"
            value={supplier}
            onChange={(e) => { setSupplier(e.target.value); setError(''); }}
            placeholder="例：农贸市场"
            fullWidth
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
          />
          {error && (
            <div style={{ color: 'var(--red)', fontSize: 12 }}>{error}</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn-pill btn-pill-outline" onClick={onClose}>取消</button>
          <button className="btn-pill btn-pill-primary" onClick={handleSave}>
            {isEdit ? '保存修改' : '添加'}
          </button>
        </div>
      </Box>
    </>
  );
}
