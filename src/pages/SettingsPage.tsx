/**
 * SettingsPage — 小店设置页面
 * 管理店铺信息、固定成本、数据导出与重置
 */
import { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DataExportButton from '../components/Settings/DataExportButton';
import { useShopStore } from '../stores/useShopStore';
import { useFixedCostStore } from '../stores/useFixedCostStore';
import { useUIStore } from '../stores/useUIStore';
import { formatMoney } from '../constants';

export default function SettingsPage() {
  const shopInfo = useShopStore((s) => s.shopInfo);
  const updateShopInfo = useShopStore((s) => s.updateShopInfo);
  const fixedCosts = useFixedCostStore((s) => s.fixedCosts);
  const updateFixedCosts = useFixedCostStore((s) => s.updateFixedCosts);
  const showToast = useUIStore((s) => s.showToast);
  const showConfirm = useUIStore((s) => s.showConfirm);

  // 店铺信息本地编辑态
  const [shopForm, setShopForm] = useState({ ...shopInfo });
  const [costForm, setCostForm] = useState({ ...fixedCosts });

  const handleSaveShop = () => {
    updateShopInfo(shopForm);
    showToast('店铺信息已保存', 'success');
  };

  const handleSaveCosts = () => {
    updateFixedCosts(costForm);
    showToast('固定成本已保存', 'success');
  };

  const handleReset = () => {
    showConfirm(
      '重置所有数据',
      '此操作将清空所有记账数据、菜品和原料信息，且不可恢复。确定要继续吗？',
      () => {
        localStorage.clear();
        // 使用 IndexedDB 删除所有备份
        import('../db').then(({ db }) => {
          db.backup.clear().catch(console.warn);
        });
        showToast('数据已重置，请刷新页面', 'info');
        setTimeout(() => window.location.reload(), 1500);
      }
    );
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        小店设置
      </Typography>

      {/* 店铺信息 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" fontWeight={700} mb={1.5}>
          🏪 店铺信息
        </Typography>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <TextField
            label="店铺名称"
            value={shopForm.name}
            onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
            size="small"
            fullWidth
          />
          <TextField
            label="店主"
            value={shopForm.owner}
            onChange={(e) => setShopForm({ ...shopForm, owner: e.target.value })}
            size="small"
            fullWidth
          />
          <TextField
            label="电话"
            value={shopForm.phone}
            onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
            size="small"
            fullWidth
          />
          <TextField
            label="地址"
            value={shopForm.address}
            onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
            size="small"
            fullWidth
          />
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveShop}
            size="small"
          >
            保存店铺信息
          </Button>
        </Box>
      </Paper>

      {/* 固定成本 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" fontWeight={700} mb={1.5}>
          💰 月度固定成本
        </Typography>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <TextField
            label="房租（元/月）"
            type="number"
            value={costForm.rent || ''}
            onChange={(e) => setCostForm({ ...costForm, rent: Number(e.target.value) || 0 })}
            size="small"
            fullWidth
            InputProps={{ startAdornment: <Typography sx={{ mr: 0.5 }}>¥</Typography> }}
          />
          <TextField
            label="人工（元/月）"
            type="number"
            value={costForm.labor || ''}
            onChange={(e) => setCostForm({ ...costForm, labor: Number(e.target.value) || 0 })}
            size="small"
            fullWidth
            InputProps={{ startAdornment: <Typography sx={{ mr: 0.5 }}>¥</Typography> }}
          />
          <TextField
            label="水电（元/月）"
            type="number"
            value={costForm.utilities || ''}
            onChange={(e) => setCostForm({ ...costForm, utilities: Number(e.target.value) || 0 })}
            size="small"
            fullWidth
            InputProps={{ startAdornment: <Typography sx={{ mr: 0.5 }}>¥</Typography> }}
          />
          <TextField
            label="调料辅料（元/月）"
            type="number"
            value={costForm.seasoning || ''}
            onChange={(e) => setCostForm({ ...costForm, seasoning: Number(e.target.value) || 0 })}
            size="small"
            fullWidth
            InputProps={{ startAdornment: <Typography sx={{ mr: 0.5 }}>¥</Typography> }}
          />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              日摊成本 ≈ {formatMoney(
                (costForm.rent + costForm.labor + costForm.utilities + costForm.seasoning) /
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
              )}
            </Typography>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveCosts}
              size="small"
            >
              保存成本
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* 数据管理 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" fontWeight={700} mb={1.5}>
          📦 数据管理
        </Typography>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <DataExportButton />
          <Divider />
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={handleReset}
            fullWidth
            sx={{ py: 1 }}
          >
            重置所有数据
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
