/**
 * AppLayout — phone-frame 布局容器
 * 375px 居中模拟手机外壳，全屏时 100% 宽
 * BottomNav 使用 fixed 定位固定在视口底部，不随内容滚动
 */
import { Outlet } from 'react-router-dom';
import { Box, Snackbar, Alert } from '@mui/material';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useUIStore } from '../../stores/useUIStore';

export default function AppLayout() {
  const { toast, hideToast } = useUIStore();

  return (
    <>
      <Box className="phone-frame" sx={{ maxWidth: 375, mx: 'auto' }}>
        <TopBar />
        <Box
          sx={{
            flex: 1,
            px: 1.25,
            py: 0.75,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingBottom: '60px',
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <BottomNav />
      <Snackbar
        open={toast !== null}
        autoHideDuration={2000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ position: 'fixed', bottom: 72 }}
      >
        <Alert severity={toast?.severity || 'success'} sx={{ borderRadius: 3, fontSize: 12 }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
