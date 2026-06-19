/**
 * DishEditSheet — 添加/编辑菜品的底部半弹层
 * 支持修改名称、售价、分类、日均销量、关联原料
 */
import { useState, useEffect } from 'react';
import { TextField, Box, Select, MenuItem as MuiMenuItem, InputLabel, FormControl } from '@mui/material';
import { useIngredientStore } from '../../stores/useIngredientStore';
import { DISH_CATEGORIES, formatMoney } from '../../constants';
import type { MenuItem as DishType, MenuIngredient } from '../../types';

interface DishEditSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; price: number; category: string; dailySales: number; ings: MenuIngredient[] }) => void;
  dish?: DishType | null;
}

export default function DishEditSheet({ open, onClose, onSave, dish }: DishEditSheetProps) {
  const ingredients = useIngredientStore((s) => s.ingredients);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string>(DISH_CATEGORIES[0]);
  const [dailySales, setDailySales] = useState('10');
  const [dishIngs, setDishIngs] = useState<MenuIngredient[]>([]);
  const [error, setError] = useState('');

  const isEdit = !!dish;

  useEffect(() => {
    if (open) {
      if (dish) {
        setName(dish.name);
        setPrice(String(dish.price));
        setCategory(dish.category);
        setDailySales(String(dish.dailySales));
        setDishIngs(dish.ings.map((i: MenuIngredient) => ({ ...i })));
      } else {
        setName(''); setPrice(''); setCategory(DISH_CATEGORIES[0] as string); setDailySales('10'); setDishIngs([]);
      }
      setError('');
    }
  }, [open, dish]);

  const handleSave = () => {
    const priceNum = parseFloat(price);
    const salesNum = parseInt(dailySales, 10);
    if (!name.trim()) { setError('请输入菜品名称'); return; }
    if (isNaN(priceNum) || priceNum <= 0) { setError('请输入有效售价'); return; }
    if (isNaN(salesNum) || salesNum < 0) { setError('请输入有效日均销量'); return; }
    onSave({ name: name.trim(), price: priceNum, category, dailySales: salesNum, ings: dishIngs });
    onClose();
  };

  const handleToggleIng = (ingId: string) => {
    setDishIngs((prev) => {
      const exists = prev.find((i) => i.ingId === ingId);
      if (exists) return prev.filter((i) => i.ingId !== ingId);
      return [...prev, { ingId, amount: 0.5, unit: '两' }];
    });
  };

  const handleIngAmount = (ingId: string, amount: number) => {
    setDishIngs((prev) => prev.map((i) => i.ingId === ingId ? { ...i, amount: Math.max(0, Math.round(amount * 10) / 10) } : i));
  };

  if (!open) return null;

  return (
    <>
      <Box onClick={onClose} sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', zIndex: 1300 }} />
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 375, maxWidth: '100%', bgcolor: '#fff',
          borderRadius: '14px 14px 0 0', zIndex: 1301,
          px: 2.5, pt: 1.5, pb: 3, maxHeight: '80vh', overflowY: 'auto',
        }}
      >
        <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: '#D0D0D0', mx: 'auto', mb: 1.5 }} />
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>{isEdit ? '编辑菜品' : '添加菜品'}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextField label="菜品名称" value={name} onChange={(e) => { setName(e.target.value); setError(''); }} fullWidth size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }} />

          <div style={{ display: 'flex', gap: 8 }}>
            <TextField label="售价（元）" type="number" value={price}
              onChange={(e) => { setPrice(e.target.value); setError(''); }} size="small"
              sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
              InputProps={{ startAdornment: <span style={{ color: 'var(--text-secondary)' }}>¥</span> }} />
            <TextField label="日均销量" type="number" value={dailySales}
              onChange={(e) => setDailySales(e.target.value)} size="small"
              sx={{ width: 110, '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }} />
          </div>

          <FormControl size="small">
            <InputLabel>分类</InputLabel>
            <Select value={category} label="分类" onChange={(e) => setCategory(e.target.value as typeof DISH_CATEGORIES[number])}
              sx={{ borderRadius: 'var(--radius-sm)' }}>
              {DISH_CATEGORIES.map((cat) => (
                <MuiMenuItem key={cat} value={cat}>{cat}</MuiMenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 关联原料 */}
          {ingredients.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                关联原料
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ingredients.map((ing) => {
                  const selected = dishIngs.find((i) => i.ingId === ing.id);
                  return (
                    <div key={ing.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                        border: selected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: selected ? 'var(--primary-bg)' : '#fff',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleToggleIng(ing.id)}
                    >
                      <span style={{ flex: 1, fontSize: 13, fontWeight: selected ? 600 : 400 }}>
                        {ing.name}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        {formatMoney(ing.pricePerJin)}/斤
                      </span>
                      {selected && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleIngAmount(ing.id, selected.amount - 0.5)}
                            style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'var(--bg)', cursor: 'pointer', fontSize: 14 }}>−</button>
                          <span style={{ fontSize: 13, fontWeight: 600, minWidth: 30, textAlign: 'center' }}>
                            {selected.amount}两
                          </span>
                          <button onClick={() => handleIngAmount(ing.id, selected.amount + 0.5)}
                            style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 14 }}>+</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && <div style={{ color: 'var(--red)', fontSize: 12 }}>{error}</div>}
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
