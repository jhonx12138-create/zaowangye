/**
 * ConfirmDialog — 确认提交对话框
 * 展示收入记录摘要，确认后提交
 */
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Box, Typography, Chip, Divider,
} from '@mui/material';
import { useMenuStore } from '../../stores/useMenuStore';
import { PERIOD_LABELS, formatMoney } from '../../constants';
import type { TableDish } from '../../types';
import type { Period } from '../../types';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tableDishes: TableDish[];
  total: number;
  period: Period;
  note: string;
}

export default function ConfirmDialog({
  open, onClose, onConfirm,
  tableDishes, total, period, note,
}: ConfirmDialogProps) {
  const menuItems = useMenuStore((s) => s.menuItems);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>确认桌单</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Chip
            label={PERIOD_LABELS[period]}
            size="small"
            color="primary"
            variant="filled"
          />
          {note && (
            <Typography variant="body2" color="text.secondary">
              {note}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        {tableDishes.map((td) => {
          const dish = menuItems.find((d) => d.id === td.menuId);
          if (!dish) return null;
          return (
            <Box key={td.menuId} display="flex" justifyContent="space-between" py={0.5}>
              <Typography variant="body2">
                {dish.name} × {td.qty}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatMoney(dish.price * td.qty)}
              </Typography>
            </Box>
          );
        })}

        <Divider sx={{ my: 1.5 }} />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" fontWeight={700}>合计</Typography>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {formatMoney(total)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>修改</Button>
        <Button onClick={onConfirm} variant="contained" autoFocus>
          确认记账
        </Button>
      </DialogActions>
    </Dialog>
  );
}
