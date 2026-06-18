/**
 * QuickStatsGrid — 2×2 统计网格
 * 展示收入/支出/日摊固定成本/记账笔数
 */
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TodayIcon from '@mui/icons-material/Today';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useDailySummary } from '../../hooks/useDailySummary';
import { useRecordStore } from '../../stores/useRecordStore';
import { formatMoney } from '../../constants';

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export default function QuickStatsGrid() {
  const { todaySummary } = useDailySummary();

  if (!todaySummary) {
    return (
      <Box mb={2}>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          {[1, 2, 3, 4].map((i) => (
            <Paper key={i} sx={{ p: 2 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="70%" height={30} />
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }

  const { income, expense, fixed } = todaySummary;
  // 从 RecordStore 直接获取今日记账笔数
  const todayRecords = useRecordStore((s) => s.todayRecords);
  const recordCount = (todayRecords?.income.length ?? 0) + (todayRecords?.expense.length ?? 0);

  const stats: StatItem[] = [
    {
      label: '收入',
      value: formatMoney(income),
      icon: <ArrowUpwardIcon />,
      color: '#2E7D32',
      bgColor: '#E8F5E9',
    },
    {
      label: '支出',
      value: formatMoney(expense),
      icon: <ArrowDownwardIcon />,
      color: '#C62828',
      bgColor: '#FFEBEE',
    },
    {
      label: '日摊成本',
      value: formatMoney(fixed),
      icon: <TodayIcon />,
      color: '#FF6F00',
      bgColor: '#FFF3E0',
    },
    {
      label: '记账笔数',
      value: `${recordCount || 0} 笔`,
      icon: <ReceiptIcon />,
      color: '#1565C0',
      bgColor: '#E3F2FD',
    },
  ];

  return (
    <Box mb={2}>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
        {stats.map((stat) => (
          <Paper key={stat.label} sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 0.75,
                borderRadius: 2,
                bgcolor: stat.bgColor,
                color: stat.color,
                mb: 1,
              }}
            >
              {stat.icon}
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {stat.label}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {stat.value}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
