/**
 * IngredientsPage — 原料价格本页面
 * 展示原料列表，支持搜索、添加、编辑、查看价格历史
 */
import { useState, useMemo } from 'react';
import { Box, Typography, Paper, Button, TextField, InputAdornment, Fab } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import IngredientRow from '../components/Ingredients/IngredientRow';
import IngredientEditDialog from '../components/Ingredients/IngredientEditDialog';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useUIStore } from '../stores/useUIStore';
import { formatMoney, formatPercent } from '../constants';
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
      // 编辑模式
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
      // 新增模式
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
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>
          原料价格本
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ borderRadius: 3 }}
        >
          添加
        </Button>
      </Box>

      {/* 搜索框 */}
      <TextField
        fullWidth
        size="small"
        placeholder="搜索原料或供应商…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><SearchIcon /></InputAdornment>
          ),
        }}
      />

      {/* 空状态 */}
      {ingredients.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" gutterBottom>
            暂无原料数据
          </Typography>
          <Typography variant="caption" color="text.disabled" display="block" mb={2}>
            添加原料来支持菜品成本计算
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAdd}>
            添加原料
          </Button>
        </Paper>
      ) : filtered.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            没有找到匹配的原料
          </Typography>
        </Paper>
      ) : (
        <Box>
          <Typography variant="caption" color="text.secondary" mb={1} display="block">
            共 {filtered.length} 种原料
          </Typography>
          {filtered.map((ing) => (
            <IngredientRow
              key={ing.id}
              ingredient={ing}
              onEdit={() => handleEdit(ing)}
            />
          ))}
        </Box>
      )}

      {/* 添加/编辑对话框 */}
      <IngredientEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
        ingredient={editingIngredient}
      />
    </Box>
  );
}
