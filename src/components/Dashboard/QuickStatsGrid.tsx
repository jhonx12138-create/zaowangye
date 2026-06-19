/**
 * QuickStatsGrid — 2×2 统计网格
 * 蓝色底小卡片：收入/支出/日摊成本/记账笔数
 */
import { useDailySummary } from '../../hooks/useDailySummary';
import { useRecordStore } from '../../stores/useRecordStore';
import { formatMoney } from '../../constants';

interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
}

export default function QuickStatsGrid() {
  const { todaySummary } = useDailySummary();

  if (!todaySummary) {
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card" style={{ height: 80 }} />
          ))}
        </div>
      </div>
    );
  }

  const { income, expense, fixed } = todaySummary;
  const todayRecords = useRecordStore((s) => s.todayRecords);
  const recordCount = (todayRecords?.income.length ?? 0) + (todayRecords?.expense.length ?? 0);

  const stats: StatItem[] = [
    { label: '收入', value: formatMoney(income), icon: '📈', color: 'var(--green)', bgColor: 'var(--green-bg)' },
    { label: '支出', value: formatMoney(expense), icon: '📉', color: 'var(--red)', bgColor: 'var(--red-bg)' },
    { label: '日摊成本', value: formatMoney(fixed), icon: '📅', color: 'var(--accent)', bgColor: 'var(--accent-light)' },
    { label: '记账笔数', value: `${recordCount || 0} 笔`, icon: '📋', color: 'var(--primary-dark)', bgColor: 'var(--primary-bg)' },
  ];

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ padding: '10px 12px' }}>
            <div
              style={{
                display: 'inline-flex',
                width: 28,
                height: 28,
                borderRadius: 'var(--radius-sm)',
                background: stat.bgColor,
                color: stat.color,
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                marginBottom: 6,
              }}
            >
              {stat.icon}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>
              {stat.label}
            </div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
