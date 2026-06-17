import { useFinance } from "../context/FinanceContext";
import { formatCurrency } from "../../utils/currency";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link } from "react-router";
import { useState } from "react";
import { AddTransactionDialog } from "../components/AddTransactionDialog";
import { FinancialInsights } from "../components/FinancialInsights";

export function Dashboard() {
const {
  transactions,
  budgets,
  goals,
  loans,
  totalIncome,
  totalExpenses,
  balance,
} = useFinance();
const totalLoanAmount =
  loans.reduce(
    (sum, loan) =>
      sum + loan.totalAmount,
    0
  );

const totalLoanPaid =
  loans.reduce(
    (sum, loan) =>
      sum + loan.paidAmount,
    0
  );

const totalLoanRemaining =
  totalLoanAmount -
  totalLoanPaid;

const overdueLoans =
  loans.filter(
    (loan) =>
      loan.totalAmount >
        loan.paidAmount &&
      new Date(
        loan.dueDate
      ) < new Date()
  ).length;
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // Calculate financial health score
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const budgetAdherence =
    budgets.length > 0
      ? (budgets.filter((b) => b.spent <= b.amount).length / budgets.length) *
        100
      : 100;
  const financialHealthScore = Math.round(
    savingsRate * 0.5 + budgetAdherence * 0.5,
  );

  // Recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Spending by category
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#2563EB",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  // Monthly cash flow (mock data for last 6 months)
  const cashFlowData = [
    { month: "Jan", income: 5200, expenses: 3800 },
    { month: "Feb", income: 5500, expenses: 4100 },
    { month: "Mar", income: 5800, expenses: 3900 },
    { month: "Apr", income: 6200, expenses: 4500 },
    { month: "May", income: 6000, expenses: 4200 },
    { month: "Jun", income: totalIncome, expenses: totalExpenses },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Financial Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here's your financial overview
          </p>
        </div>
        <Button
          onClick={() => setShowAddTransaction(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(balance)}
                  </p>
                  <p className="text-sm text-blue-100 mt-1">Current balance</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <Wallet className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(totalIncome)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-100" />
                    <p className="text-sm text-green-100">This month</p>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-100">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(totalExpenses)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowDownRight className="w-4 h-4 text-red-100" />
                    <p className="text-sm text-red-100">This month</p>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <TrendingDown className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-100">
                Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(totalIncome - totalExpenses)}
                  </p>
                  <p className="text-sm text-amber-100 mt-1">
                    {savingsRate.toFixed(0)}% saved
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <PiggyBank className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </Card>
        </motion.div>
      </div>

      {/* Loan Summary */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <Card>
    <CardContent className="p-6">
      <h3 className="text-slate-500">
        Total Loans
      </h3>

      <p className="text-2xl font-bold">
        ₹{totalLoanAmount}
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <h3 className="text-slate-500">
        Paid
      </h3>

      <p className="text-2xl font-bold text-green-600">
        ₹{totalLoanPaid}
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <h3 className="text-slate-500">
        Remaining
      </h3>

      <p className="text-2xl font-bold text-red-600">
        ₹{totalLoanRemaining}
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <h3 className="text-slate-500">
        Overdue
      </h3>

      <p className="text-2xl font-bold text-red-600">
        {overdueLoans}
      </p>
    </CardContent>
  </Card>
</div>

      {/* Financial Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Financial Health Score
              </CardTitle>
              <span className="text-3xl font-bold text-blue-600">
                {financialHealthScore}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={financialHealthScore} className="h-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Savings Rate
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {savingsRate.toFixed(0)}%
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Budget Adherence
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {budgetAdherence.toFixed(0)}%
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Active Goals
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {goals.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Cash Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Monthly Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cashFlowData}>
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorExpense"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Spending by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Link to="/transactions">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          transaction.type === "income"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {transaction.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "income"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Savings Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Savings Goals</CardTitle>
                <Link to="/goals">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => {
                  const progress =
                    (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <div
                      key={goal._id}
                      className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {goal.name}
                        </p>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: goal.color }}
                        >
                          {progress.toFixed(0)}%
                        </p>
                      </div>
                      <Progress
                        value={progress}
                        className="h-2 mb-2"
                        style={{ backgroundColor: `${goal.color}20` }}
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                          {formatCurrency(goal.currentAmount)} /{" "}
                          {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          Target:{" "}
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Financial Insights & Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Financial Insights & Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialInsights
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              savingsRate={savingsRate}
              budgetAdherence={budgetAdherence}
            />
          </CardContent>
        </Card>
      </motion.div>

      <AddTransactionDialog
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
      />
    </div>
  );
}
