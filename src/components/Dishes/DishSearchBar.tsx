/**
 * DishSearchBar — 菜品搜索栏
 * 搜索框 + 排序按钮组
 */
import { TextField, InputAdornment } from '@mui/material';

interface DishSearchBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  sortBy: 'name' | 'margin' | 'sales';
  onSortChange: (val: 'name' | 'margin' | 'sales') => void;
}

const SORT_OPTIONS: { key: 'name' | 'margin' | 'sales'; label: string }[] = [
  { key: 'name', label: '名称' },
  { key: 'margin', label: '毛利率' },
  { key: 'sales', label: '销量' },
];

export default function DishSearchBar({ search, onSearchChange, sortBy, onSortChange }: DishSearchBarProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="搜索菜品…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>排序：</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {SORT_OPTIONS.map((opt) => {
            const isActive = sortBy === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => onSortChange(opt.key)}
                className={`tag-btn${isActive ? ' active' : ''}`}
                style={{ fontSize: 12, padding: '3px 12px' }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
