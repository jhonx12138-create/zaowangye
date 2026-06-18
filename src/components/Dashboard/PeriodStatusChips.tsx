/**
 * PeriodStatusChips — 时段完成状态 Chips
 * 展示各时段记账状态（早市✓ / 午市✓ / 晚市✓ / 其他）
 */
import { Box, Chip } from '@mui/material';
import { PERIODS, PERIOD_LABELS, PERIOD_ICONS } from '../../constants';
import { useTodayRecords } from '../../hooks/useTodayRecords';
import type { Period } from '../../types';

export default function PeriodStatusChips() {
  const { income, expense } = useTodayRecords();

  // 合并该时段的所有记录
  const periodHasRecords = (period: Period): boolean => {
    return (
      income.some((r) => r.period === period) ||
      expense.some((r) => r.period === period)
    );
  };

  return (
    <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
      {PERIODS.map((period) => {
        const hasData = periodHasRecords(period);
        return (
          <Chip
            key={period}
            icon={<Box component="span" sx={{ fontSize: 14 }}>{PERIOD_ICONS[period]}</Box>}
            label={
              <span>
                {PERIOD_LABELS[period]}
                {hasData ? ' ✓' : ''}
              </span>
            }
            variant={hasData ? 'filled' : 'outlined'}
            color={hasData ? 'primary' : 'default'}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      })}
    </Box>
  );
}
