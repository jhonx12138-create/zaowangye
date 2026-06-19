/**
 * ProfitHeroCard — 今日净利大字卡片
 * 白色卡片，42px 等宽大数字，正绿负红零灰，对比昨日
 */
import { useDailySummary } from '../../hooks/useDailySummary';
import { useMenuStore } from '../../stores/useMenuStore';
import { formatMoney } from '../../constants';

export default function ProfitHeroCard() {
  const { todaySummary, yesterdayNetProfit } = useDailySummary();
  const menuItems = useMenuStore((s) => s.menuItems);

  const isLoading = !todaySummary;

  if (isLoading) {
    return (
      <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ height: 14, width: '60%', background: 'var(--border)', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 42, width: '80%', background: 'var(--border)', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 14, width: '40%', background: 'var(--border)', borderRadius: 4 }} />
      </div>
    );
  }

  const { netProfit } = todaySummary;
  const diff = yesterdayNetProfit !== 0 ? netProfit - yesterdayNetProfit : 0;
  const isUp = diff >= 0;
  const isZero = netProfit === 0;

  // ≈ 几盘最热菜品
  const topDish = [...menuItems].sort((a, b) => b.dailySales - a.dailySales)[0];
  const dishEquiv = topDish && topDish.price > 0
    ? Math.round((netProfit > 0 ? netProfit : 0) / topDish.price)
    : 0;

  const profitColor = netProfit > 0 ? 'var(--green)' : netProfit < 0 ? 'var(--red)' : 'var(--text-secondary)';

  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
        今日净利（打烊后计算）
      </div>

      <div
        className="mono"
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: profitColor,
          marginBottom: 4,
          lineHeight: 1.1,
        }}
      >
        {netProfit >= 0 ? '+' : ''}{formatMoney(netProfit).replace('¥', '')}
        <span style={{ fontSize: 22, fontWeight: 400, marginLeft: 0 }}>¥</span>
      </div>

      {dishEquiv > 0 && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
          净赚{formatMoney(netProfit)}，≈{dishEquiv}盘{topDish?.name || '...'}
        </div>
      )}

      {diff !== 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
          <span style={{ color: isUp ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
            {isUp ? '📈' : '📉'} 比昨天{isUp ? '多了' : '少了'} {formatMoney(Math.abs(diff))}
          </span>
        </div>
      )}
    </div>
  );
}
