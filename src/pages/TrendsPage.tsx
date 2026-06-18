/**
 * TrendsPage — 经营趋势图页面
 * 展示历史净利/收支趋势图，支持模式切换
 */
import { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TrendChart from '../components/Trends/TrendChart';
import { useDailySummary } from '../hooks/useDailySummary';

export default function TrendsPage() {
  const { historySummaries } = useDailySummary();

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        经营趋势图
      </Typography>

      {historySummaries.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" gutterBottom>
            暂无历史数据
          </Typography>
          <Typography variant="caption" color="text.disabled">
            多记几天账后，这里会展示经营趋势图表
          </Typography>
        </Paper>
      ) : (
        <>
          <Typography variant="caption" color="text.secondary" mb={1} display="block">
            共 {historySummaries.length} 天数据
          </Typography>
          <TrendChart data={historySummaries} />
        </>
      )}
    </Box>
  );
}
