/**
 * RecordTabs — 记账页面 Tab 切换
 * 「记一笔」和「今日已记」两个按钮
 */
interface RecordTabsProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function RecordTabs({ value, onChange }: RecordTabsProps) {
  const tabs = [
    { label: '✏️ 记一笔', idx: 0 },
    { label: '📋 今日已记', idx: 1 },
  ];

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        padding: 4,
        marginBottom: 10,
        gap: 4,
      }}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.idx;
        return (
          <button
            key={tab.idx}
            onClick={() => onChange(tab.idx)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
