/**
 * BottomNav — 底部导航栏
 * 4 个导航项 + 中央 FAB「记一笔」
 */
import { useLocation, useNavigate } from 'react-router-dom';
import { Paper, BottomNavigation, BottomNavigationAction, Fab, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';

const NAV_ITEMS = [
  { label: '仪表盘', icon: <DashboardIcon />, path: '/' },
  { label: '记账', icon: <ReceiptIcon />, path: '/records' },
  { label: '菜品', icon: <RestaurantIcon />, path: '/dishes' },
  { label: '设置', icon: <SettingsIcon />, path: '/settings' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = '/' + location.pathname.split('/').filter(Boolean)[0] || '/';
  const activeIndex = NAV_ITEMS.findIndex((item) => item.path === currentPath);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        pb: 'env(safe-area-inset-bottom, 0px)',
      }}
      elevation={3}
    >
      <Box sx={{ position: 'relative' }}>
        <BottomNavigation
          value={activeIndex >= 0 ? activeIndex : 0}
          onChange={(_e, newIdx) => {
            if (NAV_ITEMS[newIdx]) {
              navigate(NAV_ITEMS[newIdx].path);
            }
          }}
          sx={{
            height: 64,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              maxWidth: 'none',
              py: 0.5,
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: 11,
            },
          }}
        >
          {NAV_ITEMS.map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              icon={item.icon}
              sx={{
                // 中间两项留出 FAB 空间
                ...(item.path === '/records' && { mr: 4 }),
                ...(item.path === '/dishes' && { ml: 4 }),
              }}
            />
          ))}
        </BottomNavigation>

        {/* 中央 FAB */}
        <Fab
          color="primary"
          size="medium"
          onClick={() => navigate('/records')}
          sx={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: 4,
            zIndex: 1,
          }}
        >
          <EditIcon />
        </Fab>
      </Box>
    </Paper>
  );
}
