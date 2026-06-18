import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, TrendingDown, Edit, Trash2, CreditCard } from "lucide-react";
import { motion } from "motion/react";
import { AddTransactionDialog } from "../components/AddTransactionDialog";
import { toast } from "sonner";
import { formatCurrency } from "../../utils/currency";

export function Expenses() {
  const { transactions, deleteTransaction } = useFinance();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const totalExpenses = expenseTransactions.reduce(
    (sum, t) => sum + t.amount,
    0,
  );
  const recurringExpenses = expenseTransactions
    .filter((t) => t.recurring)
    .reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const expensesByCategory = expenseTransactions.reduce(
    (acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast.success("Expense deleted successfully");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Expense Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track and manage your expenses
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-600/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
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
                  <p className="text-sm text-red-100 mt-1">All time</p>
                </div>
                <CreditCard className="w-12 h-12 opacity-50" />
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
              <CardTitle className="text-sm font-medium">
                Recurring Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(recurringExpenses)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Monthly recurring
                  </p>
                </div>
                <TrendingDown className="w-12 h-12 text-red-600 opacity-30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {Object.keys(expensesByCategory).length}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Active categories
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 opacity-30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Expenses by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div
                  key={category}
                  className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800"
                >
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {category}
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {formatCurrency(amount)}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {((amount / totalExpenses) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Expense List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>All Expense Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingDown className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">
                    No expense transactions yet
                  </p>
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    Add Your First Expense
                  </Button>
                </div>
              ) : (
                expenseTransactions.map((transaction) => (
                  <motion.div
                    key={transaction._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {" "}
                      <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {transaction.description}
                          </p>
                          {transaction.recurring && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                              Recurring
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {transaction.category}
                          </p>
                          {transaction.paymentMethod && (
                            <>
                              <span className="text-slate-300 dark:text-slate-700">
                                •
                              </span>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {transaction.paymentMethod}
                              </p>
                            </>
                          )}
                          <span className="text-slate-300 dark:text-slate-700">
                            •
                          </span>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <p className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                        -{formatCurrency(transaction.amount)}
                      </p>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => handleDelete(transaction._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <Button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-6 right-6 md:hidden h-14 w-14 rounded-full p-0 shadow-xl bg-red-600 hover:bg-red-700 z-50"
      >
        <Plus className="w-6 h-6" />
      </Button>
      <AddTransactionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
