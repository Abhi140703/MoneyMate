import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import {
  Plus,
  Wallet,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { formatCurrency } from "../../utils/currency";

const expenseCategories = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Bills & Utilities",
  "Entertainment",
  "Healthcare",
  "Education",
  "Travel",
  "Rent",
  "Investments",
  "Other",
];

export function Budget() {
  const { budgets, addBudget, updateBudget, deleteBudget, transactions } =
    useFinance();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const currentMonth = new Date().toISOString().slice(0, 7);

  // Calculate spent amounts from transactions
  const monthlyBudgets = budgets.map((budget) => {
    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === budget.category &&
          t.date.startsWith(currentMonth),
      )
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...budget, spent };
  });

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = monthlyBudgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;

  const handleAddBudget = () => {
    if (!category || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    addBudget({
      category,
      amount: parseFloat(amount),
      spent: 0,
      month: currentMonth,
    });
    toast.success("Budget created successfully!");
    setCategory("");
    setAmount("");
    setShowAddDialog(false);
  };

  const handleDelete = (id: string) => {
    deleteBudget(id);
    toast.success("Budget deleted successfully");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Budget Planning
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Plan and track your monthly budgets
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(totalBudget)}
                  </p>
                  <p className="text-sm text-blue-100 mt-1">This month</p>
                </div>
                <Wallet className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalSpent)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {totalBudget > 0
                      ? ((totalSpent / totalBudget) * 100).toFixed(1)
                      : 0}
                    % used
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 opacity-30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card
            className={`border-0 shadow-xl ${
              remaining >= 0
                ? "bg-gradient-to-br from-green-500 to-green-600"
                : "bg-gradient-to-br from-red-500 to-red-600"
            } text-white`}
          >
            <CardHeader className="pb-2">
              <CardTitle
                className={`text-sm font-medium ${remaining >= 0 ? "text-green-100" : "text-red-100"}`}
              >
                Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(Math.abs(remaining))}
                  </p>
                  <p
                    className={`text-sm mt-1 ${remaining >= 0 ? "text-green-100" : "text-red-100"}`}
                  >
                    {remaining >= 0 ? "Under budget" : "Over budget"}
                  </p>
                </div>
                {remaining >= 0 ? (
                  <CheckCircle className="w-12 h-12 opacity-50" />
                ) : (
                  <AlertTriangle className="w-12 h-12 opacity-50" />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Budget Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyBudgets.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">
                  No budgets created yet
                </p>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  variant="outline"
                  className="mt-4"
                >
                  Create Your First Budget
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {monthlyBudgets.map((budget) => {
                  const percentage = (budget.spent / budget.amount) * 100;
                  const isOverBudget = percentage > 100;
                  const isWarning = percentage > 80 && percentage <= 100;

                  return (
                    <motion.div
                      key={budget._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {budget.category}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {formatCurrency(budget.spent)} of{" "}
                            {formatCurrency(budget.amount)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p
                              className={`text-lg font-bold ${
                                isOverBudget
                                  ? "text-red-600 dark:text-red-400"
                                  : isWarning
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-green-600 dark:text-green-400"
                              }`}
                            >
                              {percentage.toFixed(1)}%
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {formatCurrency(budget.amount - budget.spent)}{" "}
                              left
                            </p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleDelete(budget._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className={`h-3 ${
                          isOverBudget
                            ? "[&>div]:bg-red-600"
                            : isWarning
                              ? "[&>div]:bg-amber-500"
                              : "[&>div]:bg-green-600"
                        }`}
                      />
                      {isOverBudget && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          <p className="text-sm font-medium">
                            Over budget by{" "}
                            {formatCurrency(budget.spent - budget.amount)}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Budget Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Monthly Budget Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddBudget}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Create Budget
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="fixed bottom-6 right-6 md:hidden h-14 w-14 rounded-full p-0 shadow-xl bg-blue-600 hover:bg-blue-700 z-50"
          >
            <Plus className="w-6 h-6" />
          </Button>
    </div>
  );
}
