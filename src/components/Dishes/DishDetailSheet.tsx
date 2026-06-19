/**
 * DishDetailSheet — 菜品原料构成详情 Sheet
 * 展示菜品原料列表、各原料用量、成本分解
 */
import { useIngredientStore } from '../../stores/useIngredientStore';
import { getDishCost, getGrossMargin } from '../../utils/calculations';
import { formatMoney, formatPercent, MARGIN_COLORS, MARGIN_THRESHOLDS } from '../../constants';
import type { MenuItem } from '../../types';

interface DishDetailSheetProps {
  dish: MenuItem;
}

export default function DishDetailSheet({ dish }: DishDetailSheetProps) {
  const ingredients = useIngredientStore((s) => s.ingredients);
  const cost = getDishCost(dish.id);
  const margin = getGrossMargin(dish.price, cost);

  const marginColor =
    margin >= MARGIN_THRESHOLDS.high ? MARGIN_COLORS.high :
    margin >= MARGIN_THRESHOLDS.mid ? MARGIN_COLORS.mid :
    MARGIN_COLORS.low;

  return (
    <div>
      {/* 菜品概览 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>{dish.name}</span>
          <span
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {dish.category}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>售价</div>
            <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{formatMoney(dish.price)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>成本</div>
            <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{formatMoney(cost)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>毛利率</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: marginColor }}>{formatPercent(margin)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>日均</div>
            <div className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{dish.dailySales}份</div>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />

      {/* 原料构成 */}
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
        原料构成 · {dish.ings.length} 种
      </div>

      {dish.ings.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>暂无原料数据</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dish.ings.map((ing, idx) => {
            const ingData = ingredients.find((i) => i.id === ing.ingId);
            const ingCost = ingData ? (ing.amount / 16) * ingData.pricePerJin : 0;
            const costPct = cost > 0 ? (ingCost / cost) * 100 : 0;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 10,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {ingData?.name || '未知原料'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {ing.amount} 两
                    {ingData && ` · ${formatMoney(ingData.pricePerJin)}/斤`}
                    {ingData?.supplier && ` · ${ingData.supplier}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>
                    {formatMoney(ingCost)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    占{costPct.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}

          {/* 合计 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-bg)',
              color: 'var(--primary-dark)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>原料成本合计</span>
            <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>
              {formatMoney(cost)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
