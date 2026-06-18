/**
 * DashboardPage — 仪表盘首页
 * 组合 ProfitHeroCard + PeriodStatusChips + QuickStatsGrid + ActionButtons
 */
import { Box } from '@mui/material';
import ProfitHeroCard from '../components/Dashboard/ProfitHeroCard';
import PeriodStatusChips from '../components/Dashboard/PeriodStatusChips';
import QuickStatsGrid from '../components/Dashboard/QuickStatsGrid';
import ActionButtons from '../components/Dashboard/ActionButtons';

export default function DashboardPage() {
  return (
    <Box>
      <ProfitHeroCard />
      <PeriodStatusChips />
      <QuickStatsGrid />
      <ActionButtons />
    </Box>
  );
}
