/**
 * OrderSummary — 已选桌单汇总
 * 展示已选菜品、合计金额、确认提交按钮
 */
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMenuStore } from '../../stores/useMenuStore';
import { formatMoney } from '../../constants';
import type { TableDish } from '../../types';

interface OrderSummaryProps {
  selected: TableDish[];
  onRemove: (menuId: string) => void;
  onSubmit: () => void;
}

export default function OrderSummary({ selected, onRemove, onSubmit }: OrderSummaryProps) {
  const menuItems = useMenuStore((s) => s.menuItems);

  if (selected.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', mb: 2 }}>
        <Typography color="text.secondary">请选择菜品</Typography>
        <Typography variant="caption" color="text.disabled">
          点击菜品旁的 + 按钮添加
        </Typography>
      </Paper>
    );
  }

  const total = selected.reduce((sum, sel) => {
    const dish = menuItems.find((d) => d.id === sel.menuId);
    return sum + (dish?.price ?? 0) * sel.qty;
  }, 0);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="body2" fontWeight={700} mb={1}>
        📋 桌单汇总
      </Typography>

      {selected.map((sel) => {
        const dish = menuItems.find((d) => d.id === sel.menuId);
        if (!dish) return null;
        const subtotal = dish.price * sel.qty;
        return (
          <Box
            key={sel.menuId}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={0.75}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">
                {dish.name}×{sel.qty}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" fontWeight={600}>
                {formatMoney(subtotal)}
              </Typography>
              <Button
                size="small"
                color="error"
                sx={{ minWidth: 'auto', p: 0.5 }}
                onClick={() => onRemove(sel.menuId)}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </Box>
          </Box>
        );
      })}

      <Divider sx={{ my: 1 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="body2" fontWeight={700}>合计</Typography>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          {formatMoney(total)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onSubmit}
        sx={{ py: 1.2, fontWeight: 700 }}
      >
        确认提交 · {formatMoney(total)}
      </Button>
    </Paper>
  );
}
