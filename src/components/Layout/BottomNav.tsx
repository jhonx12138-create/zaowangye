/**
 * BottomNav — 底部固定导航栏
 * 4 普通项 + 1 中央蓝色 FAB（记账入口）
 * 使用 position: fixed 固定在视口底部
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

const NAV_ITEMS = [
  { path: '/', icon: '📊', label: '首页' },
  { path: '/dishes', icon: '📋', label: '菜单' },
  { path: '/records', icon: '＋', label: '记账', isFab: true },
  { path: '/ingredients', icon: '📦', label: '原料' },
  { path: '/settings', icon: '⚙️', label: '设置' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      className="bottom-nav-container"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 375,
        maxWidth: '100%',
        zIndex: 100,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.isFab ? false : location.pathname === item.path;

        if (item.isFab) {
          return (
            <button
              key={item.path}
              className="nav-center-fab"
              onClick={() => navigate(item.path)}
              aria-label="记账"
            >
              ＋
            </button>
          );
        }

        return (
          <button
            key={item.path}
            className="nav-item"
            onClick={() => navigate(item.path)}
            style={{
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: 11,
            }}
          >
            <span className="nav-icon" style={{ fontSize: 22 }}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </Box>
  );
}
