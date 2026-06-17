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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import {
  Plus,
  Target,
  Trophy,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { formatCurrency } from "../../utils/currency";

export function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showContributeDialog, setShowContributeDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");

  const handleAddGoal = () => {
    if (!goalName || !targetAmount || !targetDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const colors = [
      "#2563EB",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    addGoal({
      name: goalName,
      targetAmount: parseFloat(targetAmount),
      targetDate,
      color: randomColor,
    });

    toast.success("Goal created successfully!");
    setGoalName("");
    setTargetAmount("");
    setTargetDate("");
    setShowAddDialog(false);
  };

  const handleContribute = () => {
    if (!selectedGoal || !contributionAmount) {
      toast.error("Please enter an amount");
      return;
    }

    const goal = goals.find((g) => g.id === selectedGoal);
    if (!goal) return;

    const newAmount = goal.currentAmount + parseFloat(contributionAmount);
    updateGoal(selectedGoal, { currentAmount: newAmount });

    // Check if goal is completed
    if (newAmount >= goal.targetAmount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      toast.success("🎉 Congratulations! Goal achieved!");
    } else {
      toast.success("Contribution added successfully!");
    }

    setContributionAmount("");
    setShowContributeDialog(false);
    setSelectedGoal(null);
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
    toast.success("Goal deleted successfully");
  };

  const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount);
  const activeGoals = goals.filter((g) => g.currentAmount < g.targetAmount);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Savings Goals
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track your financial goals and milestones
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-600/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-100">
                Total Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{goals.length}</p>
                  <p className="text-sm text-amber-100 mt-1">
                    {completedGoals.length} completed
                  </p>
                </div>
                <Target className="w-12 h-12 opacity-50" />
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
                Total Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(
                      goals.reduce((sum, g) => sum + g.targetAmount, 0),
                    )}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Combined goals
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-amber-600 opacity-30" />
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
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(
                      goals.reduce((sum, g) => sum + g.currentAmount, 0),
                    )}
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Current progress
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600 opacity-30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Active Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeGoals.map((goal) => {
                  const progress =
                    (goal.currentAmount / goal.targetAmount) * 100;
                  const daysLeft = Math.ceil(
                    (new Date(goal.targetDate).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24),
                  );

                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all group"
                      style={{ borderColor: `${goal.color}40` }}
                    >
                      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                          onClick={() => {
                            setSelectedGoal(goal.id);
                            setShowContributeDialog(true);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-red-600"
                          onClick={() => handleDelete(goal.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="p-3 rounded-full"
                          style={{ backgroundColor: `${goal.color}20` }}
                        >
                          <Target
                            className="w-6 h-6"
                            style={{ color: goal.color }}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                            {goal.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Progress
                            </p>
                            <p
                              className="text-2xl font-bold"
                              style={{ color: goal.color }}
                            >
                              {progress.toFixed(1)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Saved
                            </p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                              {formatCurrency(goal.currentAmount)}
                            </p>
                          </div>
                        </div>

                        <Progress
                          value={Math.min(progress, 100)}
                          className="h-3"
                          style={{
                            backgroundColor: `${goal.color}20`,
                          }}
                        />

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">
                            Target: {formatCurrency(goal.targetAmount)}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        </div>

                        <Button
                          onClick={() => {
                            setSelectedGoal(goal.id);
                            setShowContributeDialog(true);
                          }}
                          className="w-full mt-3"
                          style={{ backgroundColor: goal.color }}
                        >
                          Add Contribution
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Trophy className="w-5 h-5" />
                Completed Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-600"
                        onClick={() => handleDelete(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {goal.name}
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      ✓ {formatCurrency(goal.targetAmount)} achieved
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardContent className="text-center py-12">
              <Target className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No goals yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Start setting savings goals to track your financial progress
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Add Goal Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                placeholder="e.g., Emergency Fund, Vacation, New Car"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
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
                onClick={handleAddGoal}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                Create Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contribute Dialog */}
      <Dialog
        open={showContributeDialog}
        onOpenChange={setShowContributeDialog}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Contribution</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="contributionAmount">Amount</Label>
              <Input
                id="contributionAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="mt-1"
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowContributeDialog(false);
                  setSelectedGoal(null);
                  setContributionAmount("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleContribute}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Add Contribution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
