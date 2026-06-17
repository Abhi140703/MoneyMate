import { Card, CardContent } from './ui/card';
import { Lightbulb, TrendingUp, PiggyBank, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface FinancialTip {
  icon: any;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
}

interface FinancialInsightsProps {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  budgetAdherence: number;
}

export function FinancialInsights({ totalIncome, totalExpenses, savingsRate, budgetAdherence }: FinancialInsightsProps) {
  const tips: FinancialTip[] = [];

  // Generate insights based on financial data
  if (savingsRate < 20) {
    tips.push({
      icon: AlertCircle,
      title: 'Low Savings Rate',
      description: 'Try to save at least 20% of your income. Consider reviewing your expenses to find areas to cut back.',
      type: 'warning',
    });
  } else if (savingsRate >= 20 && savingsRate < 30) {
    tips.push({
      icon: TrendingUp,
      title: 'Good Savings Rate',
      description: 'You\'re saving a healthy amount! Keep up the good work.',
      type: 'success',
    });
  } else {
    tips.push({
      icon: PiggyBank,
      title: 'Excellent Savings Rate',
      description: 'Outstanding! You\'re saving more than 30% of your income. Consider investing some of these savings for long-term growth.',
      type: 'success',
    });
  }

  if (budgetAdherence < 50) {
    tips.push({
      icon: AlertCircle,
      title: 'Budget Concerns',
      description: 'You\'re exceeding most of your budgets. Review your spending habits and adjust budgets if needed.',
      type: 'warning',
    });
  } else if (budgetAdherence >= 80) {
    tips.push({
      icon: TrendingUp,
      title: 'Budget Champion',
      description: 'Excellent budget management! You\'re staying within your limits consistently.',
      type: 'success',
    });
  }

  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  if (expenseRatio > 80) {
    tips.push({
      icon: Lightbulb,
      title: 'Spending Alert',
      description: 'You\'re spending over 80% of your income. Look for ways to reduce discretionary expenses.',
      type: 'warning',
    });
  }

  // Add general tips
  tips.push({
    icon: Lightbulb,
    title: 'Pro Tip',
    description: 'Automate your savings by setting up automatic transfers to your savings account on payday.',
    type: 'info',
  });

  const getCardStyle = (type: 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800';
      case 'info':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getIconColor = (type: 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-amber-600 dark:text-amber-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tips.map((tip, index) => {
        const Icon = tip.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`border-2 ${getCardStyle(tip.type)}`}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${getIconColor(tip.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{tip.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
