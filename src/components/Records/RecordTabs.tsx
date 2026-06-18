/**
 * RecordTabs — 记账页面 Tab 切换
 * 「记一笔」和「今日已记」两个 Tab
 */
import { Tabs, Tab, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ListAltIcon from '@mui/icons-material/ListAlt';

interface RecordTabsProps {
  value: number;
  onChange: (_: React.SyntheticEvent, newValue: number) => void;
}

export default function RecordTabs({ value, onChange }: RecordTabsProps) {
  return (
    <Paper sx={{ mb: 2 }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant="fullWidth"
        sx={{
          '& .MuiTab-root': { py: 1.5, fontWeight: 600 },
        }}
      >
        <Tab icon={<EditIcon />} label="记一笔" iconPosition="start" />
        <Tab icon={<ListAltIcon />} label="今日已记" iconPosition="start" />
      </Tabs>
    </Paper>
  );
}
