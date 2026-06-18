/**
 * ProfitHeroCard — 今日净利大字卡片
 * 蓝色渐变背景，展示净利金额、最热菜品等价、与昨日对比
 */
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useDailySummary } from '../../hooks/useDailySummary';
import { useMenuStore } from '../../stores/useMenuStore';
import { formatMoney } from '../../constants';

export default function ProfitHeroCard() {
  const { todaySummary, yesterdayNetProfit } = useDailySummary();
  const menuItems = useMenuStore((s) => s.menuItems);

  const isLoading = !todaySummary;

  // 找到销量最高的菜品
  const topDish = [...menuItems].sort((a, b) => b.dailySales - a.dailySales)[0];

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, mb: 2, background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)' }}>
        <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Skeleton variant="text" width="80%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Skeleton variant="text" width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      </Paper>
    );
  }

  const { netProfit } = todaySummary;
  const diff = yesterdayNetProfit !== 0 ? netProfit - yesterdayNetProfit : 0;
  const isUp = diff >= 0;

  // ≈ 几盘最热菜品
  const dishEquiv = topDish && topDish.price > 0
    ? Math.round((netProfit > 0 ? netProfit : 0) / topDish.price)
    : 0;

  return (
    <Paper
      sx={{
        p: 3,
        mb: 2,
        background: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 装饰背景 */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.08)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.05)',
        }}
      />

      <Typography variant="body2" sx={{ opacity: 0.85, mb: 0.5 }}>
        今日净利（打烊后计算）
      </Typography>

      <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -1 }}>
        {formatMoney(netProfit)}
      </Typography>

      {dishEquiv > 0 && (
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
          净赚{formatMoney(netProfit)}，≈{dishEquiv}盘{topDish?.name || '...'}
        </Typography>
      )}

      {diff !== 0 && (
        <Box display="flex" alignItems="center" gap={0.5} mt={1}>
          {isUp ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            比昨天{isUp ? '多了' : '少了'} {formatMoney(Math.abs(diff))}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
