/**
 * ActionButtons — 仪表盘操作按钮区域
 * 「开始记账」大按钮 + 菜品/趋势入口
 */
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function ActionButtons() {
  const navigate = useNavigate();

  return (
    <Box mb={2}>
      {/* 主操作按钮 */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<EditIcon />}
        onClick={() => navigate('/records')}
        sx={{
          py: 1.5,
          mb: 1.5,
          fontSize: 18,
          fontWeight: 700,
          boxShadow: 2,
        }}
      >
        开始记账
      </Button>

      {/* 辅助入口卡片 */}
      <Box display="flex" gap={1.5}>
        <Paper
          onClick={() => navigate('/dishes')}
          sx={{
            flex: 1,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            '&:active': { opacity: 0.8 },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <RestaurantIcon color="primary" />
            <Box>
              <Typography variant="body2" fontWeight={600}>菜品成本档案</Typography>
              <Typography variant="caption" color="text.secondary">管理菜品与原料</Typography>
            </Box>
          </Box>
          <ChevronRightIcon color="action" />
        </Paper>

        <Paper
          onClick={() => navigate('/trends')}
          sx={{
            flex: 1,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            '&:active': { opacity: 0.8 },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUpIcon color="secondary" />
            <Box>
              <Typography variant="body2" fontWeight={600}>经营趋势</Typography>
              <Typography variant="caption" color="text.secondary">收支走势分析</Typography>
            </Box>
          </Box>
          <ChevronRightIcon color="action" />
        </Paper>
      </Box>
    </Box>
  );
}
