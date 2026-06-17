import { useFinance } from "../context/FinanceContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Trophy,
  Award,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { motion } from "motion/react";
import { formatCurrency } from "../../utils/currency";

interface TimelineEvent {
  id: string;
  date: string;
  type: "income" | "expense" | "goal" | "budget";
  title: string;
  description: string;
  amount?: number;
  icon: any;
  color: string;
}

export function FinancialTimeline() {
  const { transactions, goals, budgets } = useFinance();

  // Create timeline events from all sources
  const timelineEvents: TimelineEvent[] = [
    // Transaction events
    ...transactions.map((t) => ({
      id: t.id,
      date: t.date,
      type: t.type as "income" | "expense",
      title: t.description,
      description: t.category,
      amount: t.amount,
      icon: t.type === "income" ? TrendingUp : TrendingDown,
      color: t.type === "income" ? "#10B981" : "#EF4444",
    })),
    // Goal milestones
    ...(goals
      .map((g) => {
        const progress = (g.currentAmount / g.targetAmount) * 100;
        if (progress >= 100) {
          return {
            id: `goal-${g.id}`,
            date: new Date().toISOString().split("T")[0],
            type: "goal" as const,
            title: `Goal Achieved: ${g.name}`,
            description: `Successfully saved ${formatCurrency(g.targetAmount)}`,
            icon: Trophy,
            color: "#F59E0B",
          };
        } else if (progress >= 50) {
          return {
            id: `goal-${g.id}`,
            date: new Date().toISOString().split("T")[0],
            type: "goal" as const,
            title: `50% Milestone: ${g.name}`,
            description: `Halfway to your goal of ${formatCurrency(g.targetAmount)}`,
            icon: Award,
            color: g.color,
          };
        }
        return null;
      })
      .filter(Boolean) as TimelineEvent[]),
    // Budget achievements
    ...(budgets
      .map((b) => {
        const usage = (b.spent / b.amount) * 100;
        if (usage <= 80) {
          return {
            id: `budget-${b.id}`,
            date: new Date().toISOString().split("T")[0],
            type: "budget" as const,
            title: `Budget On Track: ${b.category}`,
            description: `Spending wisely - ${usage.toFixed(0)}% of budget used`,
            icon: CheckCircle,
            color: "#10B981",
          };
        }
        return null;
      })
      .filter(Boolean) as TimelineEvent[]),
  ];

  // Sort by date descending
  const sortedEvents = timelineEvents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Group by month
  const groupedByMonth = sortedEvents.reduce(
    (groups, event) => {
      const monthYear = new Date(event.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(event);
      return groups;
    },
    {} as Record<string, TimelineEvent[]>,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Financial Timeline
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Your financial journey visualized like a story
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedByMonth).map(([month, events], monthIndex) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: monthIndex * 0.1 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {month}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {events.map((event, eventIndex) => {
                    const Icon = event.icon;
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: eventIndex * 0.05 }}
                        className="relative pl-8 pb-6 last:pb-0"
                      >
                        {/* Timeline Line */}
                        {eventIndex < events.length - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-700" />
                        )}

                        {/* Timeline Dot */}
                        <div
                          className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: event.color }}
                        >
                          <Icon className="w-3 h-3 text-white" />
                        </div>

                        {/* Content Card */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="rounded-xl p-4 cursor-pointer transition-all"
                          style={{
                            background: `linear-gradient(135deg, ${event.color}10 0%, ${event.color}05 100%)`,
                            border: `1px solid ${event.color}30`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <div
                                  className="p-2 rounded-lg"
                                  style={{
                                    backgroundColor: `${event.color}20`,
                                  }}
                                >
                                  <Icon
                                    className="w-5 h-5"
                                    style={{ color: event.color }}
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-900 dark:text-white">
                                    {event.title}
                                  </h3>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {event.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {event.amount && (
                                <p
                                  className="text-xl font-bold"
                                  style={{ color: event.color }}
                                >
                                  {event.type === "income" ? "+" : "-"}
                                  {formatCurrency(event.amount)}
                                </p>
                              )}
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {new Date(event.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Additional context based on event type */}
                          {event.type === "goal" && (
                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                              <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-500" />
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Achievement unlocked!
                                </p>
                              </div>
                            </div>
                          )}

                          {event.type === "budget" && (
                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Great job managing your budget!
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {sortedEvents.length === 0 && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="text-center py-16">
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No events yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Start adding transactions and goals to see your financial timeline
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
