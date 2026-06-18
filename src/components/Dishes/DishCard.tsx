/**
 * DishCard — 菜品卡片
 * 展示菜品名称、售价、成本、毛利率、销量，点击展开原料详情
 */
import { Paper, Typography, Box, Chip, IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getDishCost, getGrossMargin } from '../../utils/calculations';
import { formatMoney, formatPercent, MARGIN_COLORS, MARGIN_THRESHOLDS } from '../../constants';
import type { MenuItem } from '../../types';

interface DishCardProps {
  dish: MenuItem;
  onClick: () => void;
}

export default function DishCard({ dish, onClick }: DishCardProps) {
  const cost = getDishCost(dish.id);
  const margin = getGrossMargin(dish.price, cost);
  const marginColor =
    margin >= MARGIN_THRESHOLDS.high ? MARGIN_COLORS.high :
    margin >= MARGIN_THRESHOLDS.mid ? MARGIN_COLORS.mid :
    MARGIN_COLORS.low;

  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 2,
        mb: 1,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        transition: 'box-shadow 0.2s',
        '&:active': { opacity: 0.9 },
      }}
    >
      {/* 左侧信息 */}
      <Box flex={1} minWidth={0}>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Typography variant="body1" fontWeight={700} noWrap>
            {dish.name}
          </Typography>
          <Chip
            label={formatMoney(dish.price)}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontSize: 12, height: 24 }}
          />
        </Box>

        <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
          <Typography variant="caption" color="text.secondary">
            成本 {formatMoney(cost)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: marginColor, fontWeight: 700 }}
          >
            毛利{formatPercent(margin)}
          </Typography>
          <Chip
            label={dish.category}
            size="small"
            variant="outlined"
            sx={{ fontSize: 11, height: 20, color: 'text.secondary' }}
          />
          <Typography variant="caption" color="text.disabled">
            日均售{dish.dailySales}份
          </Typography>
        </Box>

        {/* 原料数量指示 */}
        <Typography variant="caption" color="text.disabled">
          {dish.ings.length} 种原料
        </Typography>
      </Box>

      {/* 毛利率指示条 */}
      <Box
        sx={{
          width: 6,
          height: 56,
          borderRadius: 3,
          bgcolor: marginColor,
          flexShrink: 0,
        }}
      />

      <IconButton size="small" sx={{ flexShrink: 0 }}>
        <ChevronRightIcon />
      </IconButton>
    </Paper>
  );
}
