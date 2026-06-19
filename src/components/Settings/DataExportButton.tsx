/**
 * DataExportButton — 数据导出按钮组件
 * 导出历史记账数据为 CSV
 */
import { useState } from 'react';
import { useRecordStore } from '../../stores/useRecordStore';
import { useUIStore } from '../../stores/useUIStore';
import { exportIncomeCSV, exportExpenseCSV, exportAllCSV } from '../../utils/csvExport';

export default function DataExportButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  const todayRecords = useRecordStore((s) => s.todayRecords);
  const history = useRecordStore((s) => s.history);
  const showToast = useUIStore((s) => s.showToast);

  const allRecords = [...history];
  if (todayRecords) allRecords.push(todayRecords);

  const handleExport = (type: 'income' | 'expense' | 'all') => {
    if (allRecords.length === 0) {
      showToast('暂无数据可导出', 'warning');
      setMenuOpen(false);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    try {
      if (type === 'income') {
        exportIncomeCSV(allRecords, `zaowangye-income-${today}.csv`);
      } else if (type === 'expense') {
        exportExpenseCSV(allRecords, `zaowangye-expense-${today}.csv`);
      } else {
        exportAllCSV(allRecords, `zaowangye-all-${today}.csv`);
      }
      showToast('导出成功', 'success');
    } catch (e) {
      showToast('导出失败，请重试', 'error');
    }
    setMenuOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn-pill btn-pill-outline"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        📥 导出数据
      </button>

      {menuOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 4,
              background: '#fff',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              border: '1px solid var(--border)',
              zIndex: 11,
              overflow: 'hidden',
            }}
          >
            {[
              { type: 'all' as const, label: '导出全部', sub: '收入+支出' },
              { type: 'income' as const, label: '导出收入', sub: '仅收入记录' },
              { type: 'expense' as const, label: '导出支出', sub: '仅支出记录' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => handleExport(item.type)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 14px',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.sub}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
