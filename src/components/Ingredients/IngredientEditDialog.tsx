/**
 * IngredientEditDialog — 添加/编辑原料对话框
 * 支持名称、单价、供应商字段
 */
import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography,
} from '@mui/material';
import type { Ingredient } from '../../types';

interface IngredientEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; pricePerJin: number; supplier: string }) => void;
  /** 编辑模式：传入已有原料 */
  ingredient?: Ingredient | null;
}

export default function IngredientEditDialog({
  open,
  onClose,
  onSave,
  ingredient,
}: IngredientEditDialogProps) {
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? '编辑原料' : '添加原料'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="原料名称"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="例：猪肉"
            fullWidth
            autoFocus
          />
          <TextField
            label="单价（元/斤）"
            type="number"
            value={price}
            onChange={(e) => { setPrice(e.target.value); setError(''); }}
            placeholder="0.00"
            fullWidth
            InputProps={{
              startAdornment: <Typography sx={{ mr: 0.5 }}>¥</Typography>,
            }}
          />
          <TextField
            label="供应商"
            value={supplier}
            onChange={(e) => { setSupplier(e.target.value); setError(''); }}
            placeholder="例：农贸市场"
            fullWidth
          />
          {error && (
            <Typography color="error" variant="caption">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} variant="contained">
          {isEdit ? '保存修改' : '添加'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
