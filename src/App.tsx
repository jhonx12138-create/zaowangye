/**
 * App 根组件
 * 职责：配置 MUI 主题、CssBaseline、HashRouter 路由表
 * 启动时执行 IndexedDB 数据恢复检查
 */
import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box, Typography } from '@mui/material';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { restoreAllFromIndexedDB } from './utils/syncManager';
import { initDemoData } from './utils/demo';
import AppLayout from './components/Layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import DishesPage from './pages/DishesPage';
import IngredientsPage from './pages/IngredientsPage';
import SettingsPage from './pages/SettingsPage';
import TrendsPage from './pages/TrendsPage';

const theme = createTheme({
  palette: {
    primary: { main: '#1976D2', dark: '#1565C0', light: '#BBDEFB' },
    secondary: { main: '#FF6F00' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' },
    success: { main: '#2E7D32' },
    error: { main: '#C62828' },
  },
  typography: {
    fontFamily: `"PingFang SC","Microsoft YaHei",sans-serif`,
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 24 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

/** 启动初始化组件 — 检查 IndexedDB 恢复 + 初始化演示数据 */
function AppInit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        // 尝试从 IndexedDB 恢复数据
        const restored = await restoreAllFromIndexedDB();
        if (restored > 0) {
          console.log(`[AppInit] Restored ${restored} store(s) from IndexedDB`);
        }
        // 初始化演示数据（仅在首次使用时）
        initDemoData();
        setReady(true);
      } catch (e) {
        console.error('[AppInit] Initialization failed:', e);
        setError('应用初始化失败，请刷新页面重试');
      }
    }
    init();
  }, []);

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!ready) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2}>
        <CircularProgress />
        <Typography color="text.secondary">灶王爷正在起灶…</Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <AppInit>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/records" element={<RecordsPage />} />
              <Route path="/dishes" element={<DishesPage />} />
              <Route path="/ingredients" element={<IngredientsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/trends" element={<TrendsPage />} />
            </Route>
          </Routes>
        </AppInit>
      </HashRouter>
    </ThemeProvider>
  );
}
