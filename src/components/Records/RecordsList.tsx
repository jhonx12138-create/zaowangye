/**
 * RecordsList — 今日已记列表
 * 展示收入/支出记录，支持删除
 */
import { Box, Typography, Paper, IconButton, Chip, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTodayRecords } from '../../hooks/useTodayRecords';
import { useRecordStore } from '../../stores/useRecordStore';
import { PERIOD_LABELS, EXPENSE_CATEGORY_LABELS, formatMoney } from '../../constants';
import type { Period, ExpenseCategory } from '../../types';

export default function RecordsList() {
  const { income, expense, hasRecords } = useTodayRecords();
  const deleteIncomeRecord = useRecordStore((s) => s.deleteIncomeRecord);
  const deleteExpenseRecord = useRecordStore((s) => s.deleteExpenseRecord);

  if (!hasRecords) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">今日暂无记录</Typography>
        <Typography variant="caption" color="text.disabled">
          切换到「记一笔」开始记账
        </Typography>
      </Paper>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      {/* 收入记录 */}
      {income.length > 0 && (
        <Box>
          <Typography variant="body2" fontWeight={700} color="success.main" mb={1}>
            📈 收入 · {income.length} 笔
          </Typography>
          {income.map((rec) => (
            <Paper key={rec.id} sx={{ p: 1.5, mb: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      +{formatMoney(rec.amount)}
                    </Typography>
                    <Chip
                      label={PERIOD_LABELS[rec.period as Period]}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 11, height: 22 }}
                    />
                  </Box>
                  <Typography variant="body2">{rec.note}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {rec.time}
                    {rec.tableDishes.length > 0 && ` · ${rec.tableDishes.length} 道菜`}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteIncomeRecord(rec.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* 支出记录 */}
      {expense.length > 0 && (
        <Box>
          <Typography variant="body2" fontWeight={700} color="error.main" mb={1}>
            📉 支出 · {expense.length} 笔
          </Typography>
          {expense.map((rec) => (
            <Paper key={rec.id} sx={{ p: 1.5, mb: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="body2" fontWeight={600} color="error.main">
                      -{formatMoney(rec.amount)}
                    </Typography>
                    <Chip
                      label={PERIOD_LABELS[rec.period as Period]}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 11, height: 22 }}
                    />
                    <Chip
                      label={EXPENSE_CATEGORY_LABELS[rec.category as ExpenseCategory]}
                      size="small"
                      sx={{ fontSize: 11, height: 22, bgcolor: 'grey.100' }}
                    />
                  </Box>
                  <Typography variant="body2">{rec.note}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {rec.time}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteExpenseRecord(rec.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
