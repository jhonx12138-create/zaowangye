/**
 * TopBar — 紧凑 App Header
 * 左侧 logo 方块 + 名称，右侧店铺名小字
 */
import { Box } from '@mui/material';
import { useShopStore } from '../../stores/useShopStore';

export default function TopBar() {
  const shopInfo = useShopStore((s) => s.shopInfo);

  return (
    <Box className="app-header">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Box
          sx={{
            width: 28, height: 28, borderRadius: '7px',
            bgcolor: 'var(--primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700,
          }}
        >
          灶
        </Box>
        <Box component="span" sx={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>
          灶王爷
        </Box>
        <Box component="span" className="demo-badge">演示中</Box>
      </Box>
      <Box component="span" sx={{ fontSize: 10, color: 'var(--text-secondary)' }}>
        {shopInfo?.name || '我家小馆'} · 桌单记账
      </Box>
    </Box>
  );
}
