/**
 * PeriodStatusChips — 时段完成状态标签
 * 居中展示各时段记账状态（绿色已完成 / 灰色未记账）
 */
import { PERIODS, PERIOD_LABELS, PERIOD_ICONS } from '../../constants';
import { useTodayRecords } from '../../hooks/useTodayRecords';
import type { Period } from '../../types';

export default function PeriodStatusChips() {
  const { income, expense } = useTodayRecords();

  const periodHasRecords = (period: Period): boolean => {
    return (
      income.some((r) => r.period === period) ||
      expense.some((r) => r.period === period)
    );
  };

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
      {PERIODS.map((period) => {
        const hasData = periodHasRecords(period);
        return (
          <span
            key={period}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 500,
              background: hasData ? 'var(--green-bg)' : 'var(--bg)',
              color: hasData ? 'var(--green)' : 'var(--text-secondary)',
              border: `1px solid ${hasData ? 'var(--green)' : 'var(--border)'}`,
            }}
          >
            <span style={{ fontSize: 13 }}>{PERIOD_ICONS[period]}</span>
            {PERIOD_LABELS[period]}
            {hasData ? ' ✓' : ''}
          </span>
        );
      })}
    </div>
  );
}
