import React, { createContext, useContext, useEffect, useState } from "react";

import {
  getTransactions,
  createTransaction,
  updateTransaction as updateTransactionAPI,
  deleteTransaction as deleteTransactionAPI,
} from "../../services/financeService";

import {
  getBudgets,
  createBudget,
  updateBudget as updateBudgetAPI,
  deleteBudget as deleteBudgetAPI,
} from "../../services/budgetService";

import {
  getGoals,
  createGoal,
  updateGoal as updateGoalAPI,
  deleteGoal as deleteGoalAPI,
} from "../../services/goalService";

import {
  getLoans,
  createLoan,
  updateLoan as updateLoanAPI,
  deleteLoan as deleteLoanAPI,
} from "../../services/loanService";

export interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod?: string;
  recurring?: boolean;
}

export interface Budget {
  _id: string;
  category: string;
  amount: number;
  spent: number;
  month: string;
}

export interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  color: string;
}

export interface Loan {
  _id: string;

  type: "borrowed" | "lent";

  personName: string;

  totalAmount: number;

  paidAmount: number;

  dueDate: string;

  description: string;

 paymentHistory?: {
  amount: number;
  date: string;
}[];
}

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  loans: Loan[];

  loading: boolean;

  addTransaction: (transaction: Omit<Transaction, "_id">) => Promise<void>;

  updateTransaction: (
    id: string,
    transaction: Partial<Transaction>,
  ) => Promise<void>;

  deleteTransaction: (id: string) => Promise<void>;

  addBudget: (budget: Omit<Budget, "_id">) => Promise<void>;

  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;

  deleteBudget: (id: string) => Promise<void>;

  addGoal: (goal: Omit<Goal, "_id">) => Promise<void>;

  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;

  deleteGoal: (id: string) => Promise<void>;

  addLoan: (loan: Omit<Loan, "_id">) => Promise<void>;

  updateLoan: (id: string, loan: Partial<Loan>) => Promise<void>;

  deleteLoan: (id: string) => Promise<void>;

  refreshGoals: () => Promise<void>;
  refreshLoans: () => Promise<void>;

  totalIncome: number;
  totalExpenses: number;
  balance: number;

  refreshTransactions: () => Promise<void>;
  refreshBudgets: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [budgets, setBudgets] = useState<Budget[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [goals, setGoals] = useState<Goal[]>([]);

  const [loans, setLoans] = useState<Loan[]>([]);

  // =========================
  // TRANSACTIONS
  // =========================

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();

      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "_id">) => {
    try {
      await createTransaction(transaction);

      await fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const updateTransaction = async (
    id: string,
    transaction: Partial<Transaction>,
  ) => {
    try {
      await updateTransactionAPI(id, transaction);

      await fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransactionAPI(id);

      await fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // BUDGETS
  // =========================

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();

      setBudgets(data);
    } catch (error) {
      console.error("Failed to fetch budgets", error);
    }
  };

  const addBudget = async (budget: Omit<Budget, "_id">) => {
    try {
      await createBudget(budget);

      await fetchBudgets();
    } catch (error) {
      console.error(error);
    }
  };

  const updateBudget = async (id: string, budget: Partial<Budget>) => {
    try {
      await updateBudgetAPI(id, budget);

      await fetchBudgets();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await deleteBudgetAPI(id);

      await fetchBudgets();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // GOALS (LocalStorage)
  // =========================
  const fetchGoals = async () => {
    try {
      const data = await getGoals();

      setGoals(data);
    } catch (error) {
      console.error("Failed to fetch goals", error);
    }
  };

  const addGoal = async (goal: Omit<Goal, "_id">) => {
    try {
      await createGoal(goal);

      await fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  const updateGoal = async (id: string, goal: Partial<Goal>) => {
    try {
      await updateGoalAPI(id, goal);

      await fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };
  const deleteGoal = async (id: string) => {
    try {
      await deleteGoalAPI(id);

      await fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  //==========================
  //  Loan
  //==========================
  const fetchLoans = async () => {
    try {
      const data = await getLoans();

      setLoans(data);
    } catch (error) {
      console.error("Failed to fetch loans", error);
    }
  };

  const addLoan = async (loan: Omit<Loan, "_id">) => {
    try {
      await createLoan(loan);

      await fetchLoans();
    } catch (error) {
      console.error(error);
    }
  };

  const updateLoan = async (id: string, loan: Partial<Loan>) => {
    try {
      await updateLoanAPI(id, loan);

      await fetchLoans();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLoan = async (id: string) => {
    try {
      await deleteLoanAPI(id);

      await fetchLoans();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchTransactions(),
          fetchBudgets(),
          fetchGoals(),
          fetchLoans(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // =========================
  // CALCULATIONS
  // =========================

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        loans,

        loading,

        addTransaction,
        updateTransaction,
        deleteTransaction,

        addBudget,
        updateBudget,
        deleteBudget,

        addGoal,
        updateGoal,
        deleteGoal,

        addLoan,
        updateLoan,
        deleteLoan,

        totalIncome,
        totalExpenses,
        balance,

        refreshTransactions: fetchTransactions,

        refreshBudgets: fetchBudgets,

        refreshGoals: fetchGoals,
        refreshLoans: fetchLoans,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useFinance must be used within FinanceProvider");
  }

  return context;
};
