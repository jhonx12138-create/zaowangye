/**
 * DishCard — 菜品卡片
 * 展示菜品名称、售价、成本、毛利率、销量，点击展开原料详情
 */
import { getDishCost, getGrossMargin } from '../../utils/calculations';
import { formatMoney, formatPercent, MARGIN_COLORS, MARGIN_THRESHOLDS } from '../../constants';
import type { MenuItem } from '../../types';

interface DishCardProps {
  dish: MenuItem;
  onClick: () => void;
}

export default function DishCard({ dish, onClick }: DishCardProps) {
  const cost = getDishCost(dish.id);
  const margin = getGrossMargin(dish.price, cost);
  const marginColor =
    margin >= MARGIN_THRESHOLDS.high ? MARGIN_COLORS.high :
    margin >= MARGIN_THRESHOLDS.mid ? MARGIN_COLORS.mid :
    MARGIN_COLORS.low;

  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        marginBottom: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {/* 左侧信息 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {dish.name}
          </span>
          <span
            style={{
              fontSize: 11,
              padding: '1px 6px',
              borderRadius: 10,
              border: '1.5px solid var(--primary)',
              color: 'var(--primary)',
              fontWeight: 500,
            }}
          >
            {formatMoney(dish.price)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            成本 {formatMoney(cost)}
          </span>
          <span style={{ fontSize: 11, color: marginColor, fontWeight: 700 }}>
            毛利{formatPercent(margin)}
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
            {dish.category}
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)', opacity: 0.8 }}>
            日均售{dish.dailySales}份
          </span>
        </div>

        {/* 原料数量 */}
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', opacity: 0.7, marginTop: 2 }}>
          {dish.ings.length} 种原料
        </div>
      </div>

      {/* 毛利率指示条 */}
      <div
        style={{
          width: 6,
          height: 56,
          borderRadius: 3,
          background: marginColor,
          flexShrink: 0,
        }}
      />

      {/* 箭头 */}
      <span style={{ color: 'var(--text-secondary)', fontSize: 16, flexShrink: 0 }}>›</span>
    </div>
  );
}
