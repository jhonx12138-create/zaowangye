/**
 * SettingsPage — 小店设置页面
 * 管理店铺信息、固定成本、数据导出与重置
 */
import { useState } from 'react';
import { TextField } from '@mui/material';
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
        import('../db').then(({ db }) => {
          db.backup.clear().catch(console.warn);
        });
        showToast('数据已重置，请刷新页面', 'info');
        setTimeout(() => window.location.reload(), 1500);
      }
    );
  };

  const dayCount = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dailyFixed = (costForm.rent + costForm.labor + costForm.utilities + costForm.seasoning) / dayCount;

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
        小店设置
      </div>

      {/* 店铺信息 */}
      <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>🏪 店铺信息</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TextField
            label="店铺名称"
            value={shopForm.name}
            onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
          />
          <TextField
            label="店主"
            value={shopForm.owner}
            onChange={(e) => setShopForm({ ...shopForm, owner: e.target.value })}
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
          />
          <TextField
            label="电话"
            value={shopForm.phone}
            onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
          />
          <TextField
            label="地址"
            value={shopForm.address}
            onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
          />
          <button
            className="btn-pill btn-pill-primary"
            onClick={handleSaveShop}
            style={{ fontSize: 13, padding: '8px 0', width: '100%' }}
          >
            💾 保存店铺信息
          </button>
        </div>
      </div>

      {/* 固定成本 */}
      <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>💰 月度固定成本</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TextField
            label="房租（元/月）"
            type="number"
            value={costForm.rent || ''}
            onChange={(e) => setCostForm({ ...costForm, rent: Number(e.target.value) || 0 })}
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
            InputProps={{ startAdornment: <span style={{ marginRight: 4, color: 'var(--text-secondary)' }}>¥</span> }}
          />
          <TextField
            label="人工（元/月）"
            type="number"
            value={costForm.labor || ''}
            onChange={(e) => setCostForm({ ...costForm, labor: Number(e.target.value) || 0 })}
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
            InputProps={{ startAdornment: <span style={{ marginRight: 4, color: 'var(--text-secondary)' }}>¥</span> }}
          />
          <TextField
            label="水电（元/月）"
            type="number"
            value={costForm.utilities || ''}
            onChange={(e) => setCostForm({ ...costForm, utilities: Number(e.target.value) || 0 })}
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
            InputProps={{ startAdornment: <span style={{ marginRight: 4, color: 'var(--text-secondary)' }}>¥</span> }}
          />
          <TextField
            label="调料辅料（元/月）"
            type="number"
            value={costForm.seasoning || ''}
            onChange={(e) => setCostForm({ ...costForm, seasoning: Number(e.target.value) || 0 })}
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--radius-sm)' } }}
            InputProps={{ startAdornment: <span style={{ marginRight: 4, color: 'var(--text-secondary)' }}>¥</span> }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              日摊成本 ≈ {formatMoney(dailyFixed)}
            </span>
            <button
              className="btn-pill btn-pill-primary"
              onClick={handleSaveCosts}
              style={{ fontSize: 13, padding: '6px 14px' }}
            >
              💾 保存成本
            </button>
          </div>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📦 数据管理</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DataExportButton />
          <div style={{ height: 1, background: 'var(--border)' }} />
          <button
            className="btn-pill btn-pill-danger"
            onClick={handleReset}
            style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}
          >
            🗑 重置所有数据
          </button>
        </div>
      </div>
    </div>
  );
}
