/**
 * 灶王爷 核心计算逻辑验证脚本
 * 独立 Node.js ESM 测试，不依赖浏览器 DOM
 */

// ============================================================
// 手动复制核心计算逻辑（与 src/utils/calculations.ts 一致）
// ============================================================

/**
 * 获取单个菜品的原料成本
 * 公式：Σ(用量/16 × 元/斤)
 * 用量单位：两（1斤=16两），pricePerJin 单位：元/斤
 */
function getDishCost(ings, ingredients) {
  return ings.reduce((sum, ing) => {
    const ingData = ingredients.find((i) => i.id === ing.ingId);
    if (!ingData) return sum;
    return sum + (ing.amount / 16) * ingData.pricePerJin;
  }, 0);
}

/** 毛利率 = (售价 - 成本) / 售价 */
function getGrossMargin(sellingPrice, cost) {
  if (sellingPrice <= 0) return 0;
  return (sellingPrice - cost) / sellingPrice;
}

/** 日摊固定成本 = 月度固定成本总额 / 当月天数 */
function getDailyFixedCost(fixedCosts, daysInMonth = 30) {
  const total = fixedCosts.rent + fixedCosts.labor + fixedCosts.utilities + fixedCosts.seasoning;
  return total / daysInMonth;
}

/** 计算日净利 */
function getTodayNetProfit(totalIncome, totalExpense, dailyFixed) {
  return totalIncome - totalExpense - dailyFixed;
}

// ============================================================
// 测试运行器
// ============================================================
let totalPass = 0;
let totalFail = 0;

function test(description, actual, expected, tolerance = 0.01) {
  const pass = Math.abs(actual - expected) < tolerance;
  if (pass) {
    console.log(`[PASS] ${description} → ${actual}`);
    totalPass++;
  } else {
    console.log(`[FAIL] ${description} → 期望 ${expected}，实际 ${actual}`);
    totalFail++;
  }
}

function testExact(description, actual, expected) {
  const pass = actual === expected;
  if (pass) {
    console.log(`[PASS] ${description} → ${actual}`);
    totalPass++;
  } else {
    console.log(`[FAIL] ${description} → 期望 ${expected}，实际 ${actual}`);
    totalFail++;
  }
}

console.log('========================================');
console.log('  灶王爷 核心计算逻辑测试');
console.log('========================================\n');

// ============================================================
// 场景1：getDishCost - 鱼香肉丝成本计算
// ============================================================
console.log('--- 场景1：菜品成本计算 ---');

const mockIngredients = [
  { id: 'ing-1', name: '猪肉', pricePerJin: 18 },
  { id: 'ing-2', name: '青椒', pricePerJin: 4 },
  { id: 'ing-3', name: '木耳', pricePerJin: 30 },
];

const fishDishIngs = [
  { ingId: 'ing-1', amount: 3 },   // 猪肉 3两
  { ingId: 'ing-2', amount: 1 },   // 青椒 1两
  { ingId: 'ing-3', amount: 0.5 }, // 木耳 0.5两
];

// 手工计算：3/16*18 + 1/16*4 + 0.5/16*30 = 3.375 + 0.25 + 0.9375 = 4.5625
const fishCost = getDishCost(fishDishIngs, mockIngredients);
test('场景1：鱼香肉丝成本（猪肉3两18元/斤 + 青椒1两4元/斤 + 木耳0.5两30元/斤）', fishCost, 4.5625);

// 额外验证各原料分量
const step1 = (3 / 16) * 18;
const step2 = (1 / 16) * 4;
const step3 = (0.5 / 16) * 30;
test('  分步验证-猪肉成本 3/16*18', step1, 3.375);
test('  分步验证-青椒成本 1/16*4', step2, 0.25);
test('  分步验证-木耳成本 0.5/16*30', step3, 0.9375);

// ============================================================
// 场景2：getGrossMargin - 毛利率计算
// ============================================================
console.log('\n--- 场景2：毛利率计算 ---');

const margin = getGrossMargin(38, fishCost);
// 预期：(38 - 4.5625) / 38 = 33.4375 / 38 = 0.879934...
test('场景2：售价38元、成本4.5625元的毛利率', margin, 0.879934, 0.001);

// 边界：售价为0
test('  边界：售价为0时毛利率为0', getGrossMargin(0, 10), 0);
// 边界：售价为负数
test('  边界：售价为负数时毛利率为0', getGrossMargin(-5, 10), 0);
// 边界：成本大于售价（亏本）
test('  边界：售价10元、成本15元（亏本）毛利率', getGrossMargin(10, 15), -0.5);

// ============================================================
// 场景3：getDailyFixedCost - 日摊固定成本
// ============================================================
console.log('\n--- 场景3：日摊固定成本 ---');

const fixedCosts = { rent: 3000, labor: 8000, utilities: 1500, seasoning: 800 };
// 预期：(3000+8000+1500+800)/30 = 13300/30 = 443.333...
const dailyFixed = getDailyFixedCost(fixedCosts, 30);
test('场景3：房租3000+人工8000+水电1500+调料800 / 30天', dailyFixed, 443.333, 0.01);

// 验证总额
const total = fixedCosts.rent + fixedCosts.labor + fixedCosts.utilities + fixedCosts.seasoning;
test('  分步验证-固定成本总额', total, 13300);

// ============================================================
// 场景4：getTodayNetProfit - 日净利润
// ============================================================
console.log('\n--- 场景4：日净利润 ---');

// 收入3200、支出1500、日摊443.33
// 预期：3200 - 1500 - 443.33 = 1256.67
const netProfit4 = getTodayNetProfit(3200, 1500, dailyFixed);
test('场景4：收入3200、支出1500、日摊443.33的净利润', netProfit4, 1256.667, 0.01);

// ============================================================
// 场景5：边界情况 - 空数据（无记录时的净利展示）
// ============================================================
console.log('\n--- 场景5：空数据边界 ---');

// 空收入、空支出 → 净利 = -日摊 = -443.33
const netProfit5 = getTodayNetProfit(0, 0, dailyFixed);
test('场景5：空收入、空支出 → 净利 = -日摊', netProfit5, -443.333, 0.01);

// ============================================================
// 场景6：金额校验 - 负数输入处理
// ============================================================
console.log('\n--- 场景6：负数输入边界 ---');

// 负收入场景（虽然业务上不应发生，验证公式行为）
const netProfitNegIncome = getTodayNetProfit(-100, 500, dailyFixed);
console.log(`  负收入 -100、支出 500、日摊 ${dailyFixed.toFixed(2)} → 净利 = ${netProfitNegIncome.toFixed(2)}`);
test('场景6a：负收入时净利计算（公式仍正确运行）', netProfitNegIncome, -100 - 500 - dailyFixed, 0.01);

// 负支出场景
const netProfitNegExpense = getTodayNetProfit(1000, -200, dailyFixed);
console.log(`  收入 1000、负支出 -200、日摊 ${dailyFixed.toFixed(2)} → 净利 = ${netProfitNegExpense.toFixed(2)}`);
test('场景6b：负支出时净利计算（公式仍正确运行）', netProfitNegExpense, 1000 - (-200) - dailyFixed, 0.01);

// 毛利率负成本
test('场景6c：成本为负数时毛利率计算', getGrossMargin(38, -10), (38 - (-10)) / 38);

// ============================================================
// 额外测试：核心公式代数验证
// ============================================================
console.log('\n--- 额外：公式代数一致性验证 ---');

// 验证 getTodayNetProfit = totalIncome - totalExpense - getDailyFixedCost
const income = 5000;
const expense = 2300;
const netProfitDirect = getTodayNetProfit(income, expense, dailyFixed);
const netProfitCalc = income - expense - dailyFixed;
test('公式一致性：净利 = 收入 - 支出 - 日摊', netProfitDirect, netProfitCalc);

// 验证毛利率公式：margin = (price - cost) / price
const price = 45;
const cost = 12.5;
const marginDirect = getGrossMargin(price, cost);
const marginCalc = (price - cost) / price;
test('公式一致性：毛利率 = (售价-成本)/售价', marginDirect, marginCalc);

// ============================================================
// 汇总
// ============================================================
console.log('\n========================================');
console.log(`  测试结果：${totalPass} PASS / ${totalFail} FAIL / ${totalPass + totalFail} TOTAL`);
console.log('========================================');

if (totalFail > 0) {
  process.exit(1);
}
