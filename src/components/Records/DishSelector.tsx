/**
 * DishSelector — 菜品选择器
 * 搜索框 + 分类 Chip 按钮（带 emoji 图标） + 菜品卡列表
 */
import { useState, useMemo } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { useMenuStore } from '../../stores/useMenuStore';
import { getDishCost, getGrossMargin } from '../../utils/calculations';
import { DISH_CATEGORIES, formatMoney, formatPercent, MARGIN_COLORS, MARGIN_THRESHOLDS } from '../../constants';
import type { TableDish } from '../../types';

interface DishSelectorProps {
  selected: TableDish[];
  onAdd: (menuId: string) => void;
  onRemove: (menuId: string) => void;
}

/** 分类名 → emoji 映射 */
const CATEGORY_EMOJI: Record<string, string> = {
  '全部': '📋',
  '凉菜': '🥗',
  '热菜': '🍖',
  '主食': '🍜',
  '汤品': '🍲',
  '饮品': '🥤',
};

export default function DishSelector({ selected, onAdd, onRemove }: DishSelectorProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');
  const menuItems = useMenuStore((s) => s.menuItems);

  const filteredDishes = useMemo(() => {
    let items = menuItems;
    if (category !== '全部') {
      items = items.filter((d) => d.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((d) => d.name.toLowerCase().includes(q));
    }
    return items;
  }, [menuItems, category, search]);

  const categories = ['全部', ...DISH_CATEGORIES];

  // 空状态
  if (menuItems.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 24, marginBottom: 10 }}>
        <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>暂无菜品数据</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', opacity: 0.7 }}>
          请先在「菜品成本档案」中添加菜品
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 搜索框 */}
      <TextField
        fullWidth
        size="small"
        placeholder="搜索菜品…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 1,
          '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ color: 'var(--text-secondary)' }}>
              🔍
            </InputAdornment>
          ),
        }}
      />

      {/* 分类 Chip 按钮 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto', paddingBottom: 2 }}>
        {categories.map((cat) => {
          const isActive = category === cat;
          const emoji = CATEGORY_EMOJI[cat] || '';
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: 24,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: `1.5px solid var(--primary)`,
                background: isActive ? 'var(--primary)' : '#fff',
                color: isActive ? '#fff' : 'var(--primary)',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              {emoji} {cat}
            </button>
          );
        })}
      </div>

      {/* 菜品列表 */}
      {filteredDishes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 20, marginBottom: 10 }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {search ? `没有找到"${search}"相关的菜品` : '该分类下暂无菜品'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
          {filteredDishes.map((dish) => {
            const cost = getDishCost(dish.id);
            const margin = getGrossMargin(dish.price, cost);
            const marginColor: string =
              margin >= MARGIN_THRESHOLDS.high ? MARGIN_COLORS.high :
              margin >= MARGIN_THRESHOLDS.mid ? MARGIN_COLORS.mid :
              MARGIN_COLORS.low;
            const sel = selected.find((s) => s.menuId === dish.id);
            const qty = sel?.qty ?? 0;

            return (
              <div
                key={dish.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  border: qty > 0 ? '2px solid var(--primary)' : undefined,
                }}
              >
                {/* 菜品信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      成本{formatMoney(cost)}
                    </span>
                    <span style={{ fontSize: 11, color: marginColor, fontWeight: 600 }}>
                      毛利{formatPercent(margin)}
                    </span>
                  </div>
                </div>

                {/* 数量调节 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <button
                    disabled={qty === 0}
                    onClick={() => onRemove(dish.id)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: 'none',
                      background: qty > 0 ? 'var(--primary-bg)' : 'var(--bg)',
                      color: qty > 0 ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: qty > 0 ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    −
                  </button>
                  <span className="mono" style={{ fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => onAdd(dish.id)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: 'none',
                      background: 'var(--primary)',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
