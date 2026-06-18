/**
 * IngredientRow — 原料列表行
 * 展示原料名称、单价、供应商、最近价格变动
 */
import { Paper, Typography, Box, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { formatMoney } from '../../constants';
import type { Ingredient } from '../../types';

interface IngredientRowProps {
  ingredient: Ingredient;
  onEdit: () => void;
}

/** 获取价格趋势方向 */
function getPriceTrend(ingredient: Ingredient): 'up' | 'down' | 'flat' {
  const hist = ingredient.priceHist;
  if (hist.length < 2) return 'flat';
  const latest = hist[hist.length - 1].price;
  const prev = hist[hist.length - 2].price;
  if (latest > prev) return 'up';
  if (latest < prev) return 'down';
  return 'flat';
}

export default function IngredientRow({ ingredient, onEdit }: IngredientRowProps) {
  const trend = getPriceTrend(ingredient);
  const trendIcon = {
    up: <TrendingUpIcon fontSize="small" sx={{ color: 'error.main' }} />,
    down: <TrendingDownIcon fontSize="small" sx={{ color: 'success.main' }} />,
    flat: <TrendingFlatIcon fontSize="small" sx={{ color: 'text.disabled' }} />,
  }[trend];

  const trendLabel = {
    up: '上涨',
    down: '下降',
    flat: '持平',
  }[trend];

  return (
    <Paper
      sx={{
        p: 2,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      {/* 左侧信息 */}
      <Box flex={1} minWidth={0}>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Typography variant="body1" fontWeight={700} noWrap>
            {ingredient.name}
          </Typography>
          <Chip
            label={`${formatMoney(ingredient.pricePerJin)}/斤`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontSize: 12, height: 24 }}
          />
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            {ingredient.supplier}
          </Typography>
          {ingredient.priceHist.length >= 2 && (
            <Chip
              icon={trendIcon}
              label={trendLabel}
              size="small"
              variant="outlined"
              sx={{ fontSize: 11, height: 20 }}
            />
          )}
        </Box>
      </Box>

      {/* 价格历史简短摘要 */}
      {ingredient.priceHist.length > 0 && (
        <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
          {ingredient.priceHist.length}次调价
        </Typography>
      )}

      {/* 编辑按钮 */}
      <IconButton size="small" onClick={onEdit} sx={{ flexShrink: 0 }}>
        <EditIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}
