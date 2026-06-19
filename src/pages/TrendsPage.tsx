/**
 * TrendsPage — 经营趋势图页面
 * 展示历史净利/收支趋势图
 */
import TrendChart from '../components/Trends/TrendChart';
import { useDailySummary } from '../hooks/useDailySummary';

export default function TrendsPage() {
  const { historySummaries } = useDailySummary();

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
        经营趋势图
      </div>

      {historySummaries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>暂无历史数据</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', opacity: 0.7 }}>
            多记几天账后，这里会展示经营趋势图表
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
            共 {historySummaries.length} 天数据
          </div>
          <TrendChart data={historySummaries} />
        </>
      )}
    </div>
  );
}
