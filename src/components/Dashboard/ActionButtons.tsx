/**
 * ActionButtons — 仪表盘操作按钮区
 * 蓝色药丸大按钮 + 成本档案/经营趋势入口卡片
 */
import { useNavigate } from 'react-router-dom';

export default function ActionButtons() {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: 10 }}>
      {/* 主操作 — 蓝色药丸大按钮 */}
      <button
        className="btn-pill btn-pill-primary"
        onClick={() => navigate('/records')}
        style={{
          width: '100%',
          padding: '14px 20px',
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 10,
          boxShadow: '0 2px 8px rgba(25,118,210,0.3)',
        }}
      >
        ✏️ 开始记账
      </button>

      {/* 辅助入口卡片 */}
      <div style={{ display: 'flex', gap: 8 }}>
        {/* 菜品成本档案 */}
        <div
          className="card"
          onClick={() => navigate('/dishes')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '10px 12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🍳</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>菜品成本档案</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>管理菜品与原料</div>
            </div>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: 16 }}>›</span>
        </div>

        {/* 经营趋势 */}
        <div
          className="card"
          onClick={() => navigate('/trends')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '10px 12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📈</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>经营趋势</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>收支走势分析</div>
            </div>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: 16 }}>›</span>
        </div>
      </div>
    </div>
  );
}
