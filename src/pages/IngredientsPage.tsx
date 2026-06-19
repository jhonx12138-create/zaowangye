/**
 * IngredientsPage — 原料价格本页面
 * 展示原料列表，支持搜索、添加、编辑（使用底部半弹层）
 */
import { useState, useMemo } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import IngredientRow from '../components/Ingredients/IngredientRow';
import IngredientEditSheet from '../components/Ingredients/IngredientEditDialog';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useUIStore } from '../stores/useUIStore';
import type { Ingredient } from '../types';

export default function IngredientsPage() {
  const [search, setSearch] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const ingredients = useIngredientStore((s) => s.ingredients);
  const addIngredient = useIngredientStore((s) => s.addIngredient);
  const updateIngredient = useIngredientStore((s) => s.updateIngredient);
  const updatePrice = useIngredientStore((s) => s.updatePrice);
  const showToast = useUIStore((s) => s.showToast);

  const filtered = useMemo(() => {
    if (!search.trim()) return ingredients;
    const q = search.trim().toLowerCase();
    return ingredients.filter(
      (ing) =>
        ing.name.toLowerCase().includes(q) ||
        ing.supplier.toLowerCase().includes(q)
    );
  }, [ingredients, search]);

  const handleAdd = () => {
    setEditingIngredient(null);
    setEditDialogOpen(true);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setEditDialogOpen(true);
  };

  const handleSave = (data: { name: string; pricePerJin: number; supplier: string }) => {
    if (editingIngredient) {
      const oldPrice = editingIngredient.pricePerJin;
      updateIngredient(editingIngredient.id, {
        name: data.name,
        supplier: data.supplier,
      });
      if (data.pricePerJin !== oldPrice) {
        updatePrice(editingIngredient.id, data.pricePerJin);
      }
      showToast('原料已更新', 'success');
    } else {
      addIngredient({
        name: data.name,
        pricePerJin: data.pricePerJin,
        unit: '斤',
        typUnit: '两',
        supplier: data.supplier,
      });
      showToast('原料已添加', 'success');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 18, fontWeight: 700 }}>原料价格本</span>
        <button
          className="btn-pill btn-pill-primary"
          onClick={handleAdd}
          style={{ padding: '6px 14px', fontSize: 13 }}
        >
          + 添加
        </button>
      </div>

      <TextField
        fullWidth
        size="small"
        placeholder="搜索原料或供应商…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ color: 'var(--text-secondary)' }}>
              🔍
            </InputAdornment>
          ),
        }}
      />

      {ingredients.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>暂无原料数据</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', opacity: 0.7, marginBottom: 12 }}>
            添加原料来支持菜品成本计算
          </div>
          <button className="btn-pill btn-pill-primary" onClick={handleAdd} style={{ fontSize: 13, padding: '6px 14px' }}>
            + 添加原料
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            没有找到匹配的原料
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
            共 {filtered.length} 种原料
          </div>
          {filtered.map((ing) => (
            <IngredientRow
              key={ing.id}
              ingredient={ing}
              onEdit={() => handleEdit(ing)}
            />
          ))}
        </div>
      )}

      <IngredientEditSheet
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
        ingredient={editingIngredient}
      />
    </div>
  );
}
