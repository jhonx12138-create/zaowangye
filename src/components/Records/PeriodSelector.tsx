/**
 * PeriodSelector — 时段选择按钮组
 * 早市 / 午市 / 晚市 / 其他
 */
import { PERIODS, PERIOD_LABELS, PERIOD_ICONS } from '../../constants';
import type { Period } from '../../types';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
      {PERIODS.map((period) => {
        const isActive = value === period;
        return (
          <button
            key={period}
            onClick={() => onChange(period)}
            className={`tag-btn${isActive ? ' active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span style={{ fontSize: 13 }}>{PERIOD_ICONS[period]}</span>
            {PERIOD_LABELS[period]}
          </button>
        );
      })}
    </div>
  );
}
