/**
 * DataExportButton — 数据导出按钮组件
 * 将历史记账数据导出为 CSV 文件下载
 */
import { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useRecordStore } from '../../stores/useRecordStore';
import { useUIStore } from '../../stores/useUIStore';
import { exportIncomeCSV, exportExpenseCSV, exportAllCSV } from '../../utils/csvExport';

export default function DataExportButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const todayRecords = useRecordStore((s) => s.todayRecords);
  const history = useRecordStore((s) => s.history);
  const showToast = useUIStore((s) => s.showToast);

  const allRecords = [...history];
  if (todayRecords) allRecords.push(todayRecords);

  const handleExport = (type: 'income' | 'expense' | 'all') => {
    if (allRecords.length === 0) {
      showToast('暂无数据可导出', 'warning');
      setAnchorEl(null);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    try {
      if (type === 'income') {
        exportIncomeCSV(allRecords, `zaowangye-income-${today}.csv`);
      } else if (type === 'expense') {
        exportExpenseCSV(allRecords, `zaowangye-expense-${today}.csv`);
      } else {
        exportAllCSV(allRecords, `zaowangye-all-${today}.csv`);
      }
      showToast('导出成功', 'success');
    } catch (e) {
      showToast('导出失败，请重试', 'error');
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        fullWidth
        sx={{ py: 1 }}
      >
        导出数据
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleExport('all')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="导出全部" secondary="收入+支出" />
        </MenuItem>
        <MenuItem onClick={() => handleExport('income')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="导出收入" secondary="仅收入记录" />
        </MenuItem>
        <MenuItem onClick={() => handleExport('expense')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="导出支出" secondary="仅支出记录" />
        </MenuItem>
      </Menu>
    </>
  );
}
