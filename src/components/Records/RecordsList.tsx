/**
 * RecordsList — 今日已记列表
 * 卡片化展示收入/支出记录，支持删除
 */
import { useTodayRecords } from '../../hooks/useTodayRecords';
import { useRecordStore } from '../../stores/useRecordStore';
import { PERIOD_LABELS, EXPENSE_CATEGORY_LABELS, formatMoney } from '../../constants';
import type { Period, ExpenseCategory } from '../../types';

export default function RecordsList() {
  const { income, expense, hasRecords } = useTodayRecords();
  const deleteIncomeRecord = useRecordStore((s) => s.deleteIncomeRecord);
  const deleteExpenseRecord = useRecordStore((s) => s.deleteExpenseRecord);

  if (!hasRecords) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>今日暂无记录</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', opacity: 0.7 }}>
          切换到「记一笔」开始记账
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* 收入记录 */}
      {income.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 6 }}>
            📈 收入 · {income.length} 笔
          </div>
          {income.map((rec) => (
            <div key={rec.id} className="card" style={{ marginBottom: 6, padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>
                      +{formatMoney(rec.amount)}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        padding: '1px 6px',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {PERIOD_LABELS[rec.period as Period]}
                    </span>
                  </div>
                  <div style={{ fontSize: 12 }}>{rec.note}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {rec.time}
                    {rec.tableDishes.length > 0 && ` · ${rec.tableDishes.length} 道菜`}
                  </div>
                </div>
                <button
                  onClick={() => deleteIncomeRecord(rec.id)}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', border: 'none',
                    background: 'var(--red-bg)', color: 'var(--red)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 支出记录 */}
      {expense.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', marginBottom: 6 }}>
            📉 支出 · {expense.length} 笔
          </div>
          {expense.map((rec) => (
            <div key={rec.id} className="card" style={{ marginBottom: 6, padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--red)' }}>
                      -{formatMoney(rec.amount)}
                    </span>
                    <span
                      style={{
                        fontSize: 10, padding: '1px 6px', borderRadius: 8,
                        border: '1px solid var(--border)', color: 'var(--text-secondary)',
                      }}
                    >
                      {PERIOD_LABELS[rec.period as Period]}
                    </span>
                    <span
                      style={{
                        fontSize: 10, padding: '1px 6px', borderRadius: 8,
                        background: 'var(--bg)', color: 'var(--text-secondary)',
                      }}
                    >
                      {EXPENSE_CATEGORY_LABELS[rec.category as ExpenseCategory]}
                    </span>
                  </div>
                  <div style={{ fontSize: 12 }}>{rec.note}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {rec.time}
                  </div>
                </div>
                <button
                  onClick={() => deleteExpenseRecord(rec.id)}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', border: 'none',
                    background: 'var(--red-bg)', color: 'var(--red)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
