/**
 * DashboardPage — 仪表盘首页
 * 组合 ProfitHeroCard + PeriodStatusChips + QuickStatsGrid + ActionButtons
 */
import ProfitHeroCard from '../components/Dashboard/ProfitHeroCard';
import PeriodStatusChips from '../components/Dashboard/PeriodStatusChips';
import QuickStatsGrid from '../components/Dashboard/QuickStatsGrid';
import ActionButtons from '../components/Dashboard/ActionButtons';

export default function DashboardPage() {
  const tips = [
    '📈 今日进账不错，继续保持！',
    '💰 每一分利润都是辛苦赚来的',
    '🔥 生意红火，灶王爷陪您记账',
    '🍳 成本控制好，利润自然高',
    '☕ 忙完记得喝口水，账本都在呢',
    '🎯 关注菜品毛利率，发现利润王牌',
    '🌟 天道酬勤，今日劳动必有回报',
    '📋 定期检查原料价格，成本心中有数',
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div>
      <ProfitHeroCard />
      <PeriodStatusChips />
      <QuickStatsGrid />
      <ActionButtons />
      <div style={{
        textAlign: 'center', padding: '12px 10px 4px',
        fontSize: 12, color: 'var(--text-secondary)', opacity: 0.75,
        lineHeight: 1.8,
      }}>
        <div>{tip}</div>
        <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>
          灶王爷一直帮您看着账本~
        </div>
      </div>
    </div>
  );
}
