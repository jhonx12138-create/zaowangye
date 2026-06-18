/**
 * PeriodSelector — 时段选择 Chip 组
 * 早市 / 午市 / 晚市 / 其他
 */
import { Box, Chip } from '@mui/material';
import { PERIODS, PERIOD_LABELS, PERIOD_ICONS } from '../../constants';
import type { Period } from '../../types';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
      {PERIODS.map((period) => (
        <Chip
          key={period}
          icon={<Box component="span" sx={{ fontSize: 14 }}>{PERIOD_ICONS[period]}</Box>}
          label={PERIOD_LABELS[period]}
          variant={value === period ? 'filled' : 'outlined'}
          color={value === period ? 'primary' : 'default'}
          onClick={() => onChange(period)}
          sx={{ fontWeight: 500, px: 0.5 }}
        />
      ))}
    </Box>
  );
}
