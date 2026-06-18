/**
 * DishSelector — 菜品选择器
 * 搜索框 + 分类 Tabs + 菜品列表（含价格/成本/毛利/数量调节）
 */
import { useState, useMemo } from 'react';
import {
  Box, TextField, InputAdornment, Tabs, Tab, Typography, IconButton,
  Paper, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useMenuStore } from '../../stores/useMenuStore';
import { getDishCost, getGrossMargin } from '../../utils/calculations';
import { DISH_CATEGORIES, formatMoney, formatPercent, MARGIN_COLORS, MARGIN_THRESHOLDS } from '../../constants';
import type { TableDish } from '../../types';

interface DishSelectorProps {
  selected: TableDish[];
  onAdd: (menuId: string) => void;
  onRemove: (menuId: string) => void;
}

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
      <Paper sx={{ p: 4, textAlign: 'center', mb: 2 }}>
        <Typography color="text.secondary">暂无菜品数据</Typography>
        <Typography variant="caption" color="text.disabled">
          请先在「菜品成本档案」中添加菜品
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* 搜索框 */}
      <TextField
        fullWidth
        size="small"
        placeholder="搜索菜品…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 1.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><SearchIcon /></InputAdornment>
          ),
        }}
      />

      {/* 分类 Tabs */}
      <Tabs
        value={categories.indexOf(category)}
        onChange={(_, idx) => setCategory(categories[idx])}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 1.5,
          minHeight: 40,
          '& .MuiTab-root': { minHeight: 40, py: 0.5, fontSize: 13, fontWeight: 600 },
        }}
      >
        {categories.map((cat) => (
          <Tab key={cat} label={cat} />
        ))}
      </Tabs>

      {/* 菜品列表 */}
      {filteredDishes.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', mb: 2 }}>
          <Typography color="text.secondary">
            {search ? `没有找到"${search}"相关的菜品` : '该分类下暂无菜品'}
          </Typography>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="column" gap={1} mb={2}>
          {filteredDishes.map((dish) => {
            const cost = getDishCost(dish.id);
            const margin = getGrossMargin(dish.price, cost);
            const marginColor =
              margin >= MARGIN_THRESHOLDS.high ? MARGIN_COLORS.high :
              margin >= MARGIN_THRESHOLDS.mid ? MARGIN_COLORS.mid :
              MARGIN_COLORS.low;
            const sel = selected.find((s) => s.menuId === dish.id);
            const qty = sel?.qty ?? 0;

            return (
              <Paper
                key={dish.id}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  border: qty > 0 ? 2 : 0,
                  borderColor: qty > 0 ? 'primary.main' : 'transparent',
                }}
              >
                {/* 菜品信息 */}
                <Box flex={1} minWidth={0}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {dish.name}
                    </Typography>
                    <Chip
                      label={formatMoney(dish.price)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: 11, height: 22 }}
                    />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" color="text.secondary">
                      成本{formatMoney(cost)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: marginColor, fontWeight: 600 }}
                    >
                      毛利{formatPercent(margin)}
                    </Typography>
                  </Box>
                </Box>

                {/* 数量调节 */}
                <Box display="flex" alignItems="center" gap={0.5}>
                  <IconButton
                    size="small"
                    disabled={qty === 0}
                    onClick={() => onRemove(dish.id)}
                    sx={{ bgcolor: qty > 0 ? 'primary.light' : 'action.hover', width: 32, height: 32 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ minWidth: 24, textAlign: 'center' }}
                  >
                    {qty}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onAdd(dish.id)}
                    sx={{ bgcolor: 'primary.main', color: 'white', width: 32, height: 32, '&:hover': { bgcolor: 'primary.dark' } }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
