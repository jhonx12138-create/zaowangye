/**
 * TrendChart — 经营趋势图表组件
 * Recharts 净利柱状图 / 收支折线图模式切换
 */
import { useState } from 'react';
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

  const chartData = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      ...d,
      日期: d.date.slice(5),
    }));

  return (
    <div className="card">
      {/* 模式切换 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setMode('netProfit')}
            className={`tag-btn${mode === 'netProfit' ? ' active' : ''}`}
            style={{ fontSize: 12, padding: '5px 14px', fontWeight: 600 }}
          >
            净利趋势
          </button>
          <button
            onClick={() => setMode('incomeExpense')}
            className={`tag-btn${mode === 'incomeExpense' ? ' active' : ''}`}
            style={{ fontSize: 12, padding: '5px 14px', fontWeight: 600 }}
          >
            收支对比
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {mode === 'netProfit' ? (
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="日期" tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} tickFormatter={(v: number) => `¥${v}`} />
            <Tooltip
              formatter={(value: number) => [`¥${value.toFixed(2)}`, '净利']}
              labelFormatter={(label: string) => `日期：${label}`}
            />
            <ReferenceLine y={0} stroke="#C62828" strokeDasharray="3 3" />
            <Bar dataKey="netProfit" name="净利" radius={[4, 4, 0, 0]} fill={CHART_COLORS.netProfit} />
          </BarChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="日期" tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} tickFormatter={(v: number) => `¥${v}`} />
            <Tooltip
              formatter={(value: number, name: string) => [`¥${value.toFixed(2)}`, name]}
              labelFormatter={(label: string) => `日期：${label}`}
            />
            <Legend />
            <Line type="monotone" dataKey="income" name="收入" stroke={CHART_COLORS.income} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="expense" name="支出" stroke={CHART_COLORS.expense} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="netProfit" name="净利" stroke={CHART_COLORS.netProfit} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
