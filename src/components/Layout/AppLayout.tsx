/**
 * AppLayout — 应用主布局容器
 * 包含 TopBar + 内容区域（Outlet）+ BottomNav
 * 处理全局 Toast 和 Confirm Dialog 渲染
 */
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Drawer, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useUIStore } from '../../stores/useUIStore';

export default function AppLayout() {
  const toast = useUIStore((s) => s.toast);
  const hideToast = useUIStore((s) => s.hideToast);
  const confirm = useUIStore((s) => s.confirm);
  const hideConfirm = useUIStore((s) => s.hideConfirm);
  const sheet = useUIStore((s) => s.sheet);
  const closeSheet = useUIStore((s) => s.closeSheet);

  const handleConfirm = () => {
    confirm.onConfirm?.();
    hideConfirm();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        bgcolor: 'background.default',
      }}
    >
      {/* 顶部栏 */}
      <TopBar />

      {/* 主内容区 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '56px',   // AppBar 高度
          pb: '72px',   // BottomNav 高度
          px: 2,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>

      {/* 底部导航 */}
      <BottomNav />

      {/* 全局 Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: 60 }}
      >
        {toast ? (
          <Alert onClose={hideToast} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>

      {/* 确认对话框 */}
      <Dialog open={confirm.open} onClose={hideConfirm}>
        <DialogTitle>{confirm.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirm.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={hideConfirm}>取消</Button>
          <Button onClick={handleConfirm} variant="contained" autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>

      {/* 底部弹出 Sheet */}
      <Drawer
        anchor="bottom"
        open={sheet.open}
        onClose={closeSheet}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '70vh',
            p: 2,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>{sheet.title}</Typography>
          <IconButton onClick={closeSheet} size="small"><CloseIcon /></IconButton>
        </Box>
        {sheet.content}
      </Drawer>
    </Box>
  );
}
