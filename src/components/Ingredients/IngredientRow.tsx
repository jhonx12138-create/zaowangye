/**
 * IngredientRow — 原料列表行
 * 卡片展示原料名称、单价、供应商，支持点击查看历史价格一览
 */
import { useState } from 'react';
import { Box } from '@mui/material';
import { formatMoney } from '../../constants';
import type { Ingredient } from '../../types';

interface IngredientRowProps {
  ingredient: Ingredient;
  onEdit: () => void;
}

function getPriceTrend(ingredient: Ingredient): 'up' | 'down' | 'flat' {
  const hist = ingredient.priceHist;
  if (hist.length < 2) return 'flat';
  const latest = hist[hist.length - 1].price;
  const prev = hist[hist.length - 2].price;
  if (latest > prev) return 'up';
  if (latest < prev) return 'down';
  return 'flat';
}

export default function IngredientRow({ ingredient, onEdit }: IngredientRowProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const trend = getPriceTrend(ingredient);
  const trendIcon = { up: '⬆', down: '⬇', flat: '→' }[trend];
  const trendColor = { up: 'var(--red)', down: 'var(--green)', flat: 'var(--text-secondary)' }[trend];

  const priceHist = ingredient.priceHist;

  return (
    <>
      <div className="card" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ingredient.name}
            </span>
            <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 10, border: '1.5px solid var(--primary)', color: 'var(--primary)', fontWeight: 500 }}>
              {formatMoney(ingredient.pricePerJin)}/斤
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{ingredient.supplier}</span>
            {priceHist.length >= 2 && (
              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, border: `1px solid ${trendColor}`, color: trendColor, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                {trendIcon} {trendColor === 'var(--red)' ? '涨' : trendColor === 'var(--green)' ? '跌' : '平'}
              </span>
            )}
          </div>
        </div>

        {/* 调价次数 — 可点击 */}
        {priceHist.length > 0 && (
          <button
            onClick={() => setHistoryOpen(true)}
            style={{
              fontSize: 10, color: 'var(--primary)', flexShrink: 0, background: 'var(--primary-bg)',
              border: 'none', borderRadius: 8, padding: '3px 8px', cursor: 'pointer',
              fontWeight: 500, fontFamily: 'inherit',
            }}
          >
            {priceHist.length}次调价 ›
          </button>
        )}

        <button onClick={onEdit}
          style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--bg)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
          ✎
        </button>
      </div>

      {/* 价格历史一览 — 底部半弹层 */}
      {historyOpen && (
        <>
          <Box onClick={() => setHistoryOpen(false)} sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', zIndex: 1300 }} />
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 375, maxWidth: '100%', bgcolor: '#fff', borderRadius: '14px 14px 0 0', zIndex: 1301, px: 2.5, pt: 1.5, pb: 3, maxHeight: '60vh', overflowY: 'auto' }}
          >
            <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: '#D0D0D0', mx: 'auto', mb: 1.5 }} />
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{ingredient.name} · 价格历史</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
              共 {priceHist.length} 次调价记录
            </div>

            {[...priceHist].reverse().map((entry, idx) => {
              const isLast = idx === 0;
              return (
                <div key={entry.date}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0', borderBottom: '1px solid var(--border)',
                    background: isLast ? 'var(--primary-bg)' : undefined,
                    borderRadius: isLast ? 'var(--radius-sm)' : undefined,
                    paddingLeft: isLast ? 10 : 0, paddingRight: isLast ? 10 : 0,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: isLast ? 700 : 500 }}>{entry.date}</div>
                    {isLast && <div style={{ fontSize: 10, color: 'var(--primary)', marginTop: 2 }}>当前价格</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span className="mono" style={{ fontSize: 15, fontWeight: 700 }}>
                      {formatMoney(entry.price)}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>元/斤</span>
                  </div>
                </div>
              );
            })}

            <button className="btn-pill btn-pill-primary" onClick={() => setHistoryOpen(false)}
              style={{ width: '100%', marginTop: 16, padding: '10px 0', fontSize: 14 }}>
              关闭
            </button>
          </Box>
        </>
      )}
    </>
  );
}
