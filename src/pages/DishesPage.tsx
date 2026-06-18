/**
 * DishesPage — 菜品管理页面
 * 展示菜品列表，支持搜索、排序、查看原料构成详情
 */
import { useState, useMemo } from 'react';
import { Box, Typography, Paper, Button, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DishSearchBar from '../components/Dishes/DishSearchBar';
import DishCard from '../components/Dishes/DishCard';
import DishDetailSheet from '../components/Dishes/DishDetailSheet';
import { useMenuStore } from '../stores/useMenuStore';
import { useUIStore } from '../stores/useUIStore';
import { getDishCost, getGrossMargin } from '../utils/calculations';
import type { MenuItem } from '../types';

export default function DishesPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'margin' | 'sales'>('name');
  const menuItems = useMenuStore((s) => s.menuItems);
  const openSheet = useUIStore((s) => s.openSheet);

  const filteredAndSorted = useMemo(() => {
    let items = [...menuItems];

    // 搜索过滤
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }

    // 排序
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
  }, [menuItems, search, sortBy]);

  const handleDishClick = (dish: MenuItem) => {
    openSheet(dish.name, <DishDetailSheet dish={dish} />);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        菜品成本档案
      </Typography>

      <DishSearchBar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* 加载状态：空列表 */}
      {menuItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" gutterBottom>
            暂无菜品数据
          </Typography>
          <Typography variant="caption" color="text.disabled" display="block" mb={2}>
            添加菜品来管理成本和毛利率
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />}>
            添加菜品
          </Button>
        </Paper>
      ) : filteredAndSorted.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            没有找到匹配的菜品
          </Typography>
        </Paper>
      ) : (
        <Box>
          <Typography variant="caption" color="text.secondary" mb={1} display="block">
            共 {filteredAndSorted.length} 道菜品
          </Typography>
          {filteredAndSorted.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onClick={() => handleDishClick(dish)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
