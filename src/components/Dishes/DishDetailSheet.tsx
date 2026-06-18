/**
 * DishDetailSheet — 菜品原料构成详情 Sheet
 * 展示菜品原料列表、各原料用量、成本分解
 */
import { Box, Typography, Divider, Chip } from '@mui/material';
import { useIngredientStore } from '../../stores/useIngredientStore';
import { getDishCost, getGrossMargin } from '../../utils/calculations';
import { formatMoney, formatPercent, MARGIN_COLORS, MARGIN_THRESHOLDS } from '../../constants';
import type { MenuItem } from '../../types';

interface DishDetailSheetProps {
  dish: MenuItem;
}

export default function DishDetailSheet({ dish }: DishDetailSheetProps) {
  const ingredients = useIngredientStore((s) => s.ingredients);
  const cost = getDishCost(dish.id);
  const margin = getGrossMargin(dish.price, cost);

  const marginColor =
    margin >= MARGIN_THRESHOLDS.high ? MARGIN_COLORS.high :
    margin >= MARGIN_THRESHOLDS.mid ? MARGIN_COLORS.mid :
    MARGIN_COLORS.low;

  return (
    <Box>
      {/* 菜品概览 */}
      <Box mb={2}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="h6" fontWeight={700}>{dish.name}</Typography>
          <Chip label={dish.category} size="small" variant="outlined" />
        </Box>
        <Box display="flex" gap={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">售价</Typography>
            <Typography variant="body1" fontWeight={700}>{formatMoney(dish.price)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">成本</Typography>
            <Typography variant="body1" fontWeight={700}>{formatMoney(cost)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">毛利率</Typography>
            <Typography variant="body1" fontWeight={700} sx={{ color: marginColor }}>
              {formatPercent(margin)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">日均</Typography>
            <Typography variant="body1" fontWeight={700}>{dish.dailySales}份</Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* 原料构成 */}
      <Typography variant="body2" fontWeight={700} mb={1}>
        原料构成 · {dish.ings.length} 种
      </Typography>

      {dish.ings.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          暂无原料数据
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={1}>
          {dish.ings.map((ing, idx) => {
            const ingData = ingredients.find((i) => i.id === ing.ingId);
            const ingCost = ingData ? (ing.amount / 16) * ingData.pricePerJin : 0;
            const costPct = cost > 0 ? (ingCost / cost) * 100 : 0;

            return (
              <Box
                key={idx}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                }}
              >
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={600}>
                    {ingData?.name || '未知原料'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {ing.amount} 两
                    {ingData && ` · ${formatMoney(ingData.pricePerJin)}/斤`}
                    {ingData?.supplier && ` · ${ingData.supplier}`}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" fontWeight={600}>
                    {formatMoney(ingCost)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    占{costPct.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            );
          })}

          {/* 合计 */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.dark' }}
          >
            <Typography variant="body2" fontWeight={700}>原料成本合计</Typography>
            <Typography variant="body2" fontWeight={700}>
              {formatMoney(cost)}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
