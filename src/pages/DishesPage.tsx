/**
 * DishesPage — 菜品管理页面
 * 支持分类筛选、搜索、排序、点击查看/编辑菜品
 */
import { useState, useMemo } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import DishCard from '../components/Dishes/DishCard';
import DishEditSheet from '../components/Dishes/DishEditSheet';
import { useMenuStore } from '../stores/useMenuStore';
import { useUIStore } from '../stores/useUIStore';
import { getDishCost, getGrossMargin } from '../utils/calculations';
import { DISH_CATEGORIES } from '../constants';
import type { MenuItem } from '../types';

const CATEGORY_EMOJI: Record<string, string> = {
  '全部': '📋', '凉菜': '🥗', '热菜': '🍖', '主食': '🍜', '汤品': '🍲', '饮品': '🥤',
};

export default function DishesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');
  const [sortBy, setSortBy] = useState<'name' | 'margin' | 'sales'>('name');
  const [editOpen, setEditOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  const menuItems = useMenuStore((s) => s.menuItems);
  const addMenuItem = useMenuStore((s) => s.addMenuItem);
  const updateMenuItem = useMenuStore((s) => s.updateMenuItem);
  const showToast = useUIStore((s) => s.showToast);

  const categories = ['全部', ...DISH_CATEGORIES];

  const filteredAndSorted = useMemo(() => {
    let items = [...menuItems];
    if (category !== '全部') {
      items = items.filter((d) => d.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));
    }
    if (sortBy === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    } else if (sortBy === 'margin') {
      items.sort((a, b) => {
        const ma = getGrossMargin(a.price, getDishCost(a.id));
        const mb = getGrossMargin(b.price, getDishCost(b.id));
        return mb - ma;
      });
    } else if (sortBy === 'sales') {
      items.sort((a, b) => b.dailySales - a.dailySales);
    }
    return items;
  }, [menuItems, search, sortBy, category]);

  const handleDishClick = (dish: MenuItem) => {
    setEditingDish(dish);
    setEditOpen(true);
  };

  const handleAdd = () => {
    setEditingDish(null);
    setEditOpen(true);
  };

  const handleSave = (data: { name: string; price: number; category: string; dailySales: number; ings: { ingId: string; amount: number; unit: string }[] }) => {
    if (editingDish) {
      updateMenuItem(editingDish.id, data);
      showToast('菜品已更新', 'success');
    } else {
      addMenuItem(data);
      showToast('菜品已添加', 'success');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 18, fontWeight: 700 }}>菜品成本档案</span>
        <button className="btn-pill btn-pill-primary" onClick={handleAdd} style={{ padding: '6px 14px', fontSize: 13 }}>
          + 添加
        </button>
      </div>

      {/* 搜索 */}
      <TextField
        fullWidth size="small" placeholder="搜索菜品…" value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
        InputProps={{
          startAdornment: <InputAdornment position="start" sx={{ color: 'var(--text-secondary)' }}>🔍</InputAdornment>,
        }}
      />

      {/* 分类 chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto', paddingBottom: 2 }}>
        {categories.map((cat) => {
          const isActive = category === cat;
          const emoji = CATEGORY_EMOJI[cat] || '';
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0, padding: '6px 12px', borderRadius: 24, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid var(--primary)',
                background: isActive ? 'var(--primary)' : '#fff',
                color: isActive ? '#fff' : 'var(--primary)',
                whiteSpace: 'nowrap', fontFamily: 'inherit',
              }}
            >
              {emoji} {cat}
            </button>
          );
        })}
      </div>

      {/* 排序 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {[
          { key: 'name' as const, label: '名称' },
          { key: 'margin' as const, label: '毛利率' },
          { key: 'sales' as const, label: '销量' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key)}
            style={{
              padding: '4px 10px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
              background: sortBy === s.key ? 'var(--primary)' : 'var(--bg)',
              color: sortBy === s.key ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {menuItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>暂无菜品数据</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', opacity: 0.7, marginBottom: 12 }}>
            添加菜品来管理成本和毛利率
          </div>
          <button className="btn-pill btn-pill-primary" onClick={handleAdd} style={{ fontSize: 13, padding: '6px 14px' }}>
            + 添加菜品
          </button>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>没有找到匹配的菜品</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {category !== '全部' ? `${category} · ` : ''}共 {filteredAndSorted.length} 道菜品
          </div>
          {filteredAndSorted.map((dish) => (
            <DishCard key={dish.id} dish={dish} onClick={() => handleDishClick(dish)} />
          ))}
        </div>
      )}

      <DishEditSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        dish={editingDish}
      />
    </div>
  );
}
