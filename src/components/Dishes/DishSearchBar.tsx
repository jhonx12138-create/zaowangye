/**
 * DishSearchBar — 菜品搜索栏
 * 搜索框 + 排序方式选择
 */
import { TextField, InputAdornment, ToggleButtonGroup, ToggleButton, Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface DishSearchBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  sortBy: 'name' | 'margin' | 'sales';
  onSortChange: (val: 'name' | 'margin' | 'sales') => void;
}

export default function DishSearchBar({ search, onSearchChange, sortBy, onSortChange }: DishSearchBarProps) {
  return (
    <Box mb={2}>
      <TextField
        fullWidth
        size="small"
        placeholder="搜索菜品…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><SearchIcon /></InputAdornment>
          ),
        }}
      />
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="caption" color="text.secondary">排序：</Typography>
        <ToggleButtonGroup
          value={sortBy}
          exclusive
          onChange={(_, val) => val && onSortChange(val)}
          size="small"
        >
          <ToggleButton value="name" sx={{ px: 1.5, py: 0.25, fontSize: 12, textTransform: 'none' }}>
            名称
          </ToggleButton>
          <ToggleButton value="margin" sx={{ px: 1.5, py: 0.25, fontSize: 12, textTransform: 'none' }}>
            毛利率
          </ToggleButton>
          <ToggleButton value="sales" sx={{ px: 1.5, py: 0.25, fontSize: 12, textTransform: 'none' }}>
            销量
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
