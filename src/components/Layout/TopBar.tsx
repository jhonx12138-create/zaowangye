/**
 * TopBar — 顶部标题栏
 * 显示应用名称「灶王爷」
 */
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function TopBar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'primary.main',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: '56px !important', px: 2 }}>
        <RestaurantIcon sx={{ mr: 1, fontSize: 24 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, flexGrow: 1 }}>
          灶王爷
        </Typography>
        <Box
          component="span"
          sx={{
            fontSize: 12,
            opacity: 0.7,
            fontWeight: 500,
          }}
        >
          菜品记账助手
        </Box>
      </Toolbar>
    </AppBar>
  );
}
