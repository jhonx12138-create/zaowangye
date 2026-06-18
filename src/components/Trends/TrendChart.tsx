/**
 * TrendChart — 经营趋势图表组件
 * 基于 Recharts，支持净利柱状图 / 收支折线图模式切换
 */
import { useState } from 'react';
import {
  Paper, Box, ToggleButtonGroup, ToggleButton, Typography,
} from '@mui/material';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { CHART_COLORS } from '../../constants';
import type { DailySummary } from '../../types';

type ChartMode = 'netProfit' | 'incomeExpense';

interface TrendChartProps {
  data: DailySummary[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const [mode, setMode] = useState<ChartMode>('netProfit');

  // 按日期升序排列（图表从左到右）
  const chartData = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      ...d,
      日期: d.date.slice(5), // MM-DD
    }));

  return (
    <Paper sx={{ p: 2 }}>
      {/* 模式切换 */}
      <Box display="flex" justifyContent="center" mb={2}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, val) => val && setMode(val)}
          size="small"
        >
          <ToggleButton value="netProfit" sx={{ px: 2, textTransform: 'none', fontWeight: 600 }}>
            净利趋势
          </ToggleButton>
          <ToggleButton value="incomeExpense" sx={{ px: 2, textTransform: 'none', fontWeight: 600 }}>
            收支对比
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        {mode === 'netProfit' ? (
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis
              dataKey="日期"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(v: number) => `¥${v}`}
            />
            <Tooltip
              formatter={(value: number) => [`¥${value.toFixed(2)}`, '净利']}
              labelFormatter={(label: string) => `日期：${label}`}
            />
            <ReferenceLine y={0} stroke="#C62828" strokeDasharray="3 3" />
            <Bar
              dataKey="netProfit"
              name="净利"
              radius={[4, 4, 0, 0]}
              fill={CHART_COLORS.netProfit}
            />
          </BarChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis
              dataKey="日期"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(v: number) => `¥${v}`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [`¥${value.toFixed(2)}`, name]}
              labelFormatter={(label: string) => `日期：${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              name="收入"
              stroke={CHART_COLORS.income}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="支出"
              stroke={CHART_COLORS.expense}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="netProfit"
              name="净利"
              stroke={CHART_COLORS.netProfit}
              strokeWidth={2}
              dot={{ r: 3 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Paper>
  );
}
