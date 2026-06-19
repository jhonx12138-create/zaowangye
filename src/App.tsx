/**
 * App 根组件
 * 职责：HashRouter 路由表 + 启动初始化
 * 使用 phone-frame 经典蓝设计系统（CSS Variables）
 */
import { useEffect, useState } from 'react';
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

/** 启动初始化组件 — IndexedDB 恢复 + 演示数据 */
function AppInit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const restored = await restoreAllFromIndexedDB();
        if (restored > 0) {
          console.log(`[AppInit] Restored ${restored} store(s) from IndexedDB`);
        }
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 24, color: 'var(--red)' }}>
        {error}
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 12 }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>灶王爷正在起灶…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
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
  );
}
