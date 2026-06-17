import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Income } from "./pages/Income";
import { Expenses } from "./pages/Expenses";
import { Budget } from "./pages/Budget";
import { Analytics } from "./pages/Analytics";
import { Goals } from "./pages/Goals";
import { Transactions } from "./pages/Transactions";
import { FinancialTimeline } from "./pages/FinancialTimeline";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Layout } from "./components/Layout";
import { Loans } from "./pages/Loans";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },

  {
    path: "/register",
    Component: Register,
  },

  {
    path: "/",
  element: (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  ),
    children: [
      { index: true, Component: Dashboard },
      { path: "income", Component: Income },
      { path: "expenses", Component: Expenses },
      { path: "budget", Component: Budget },
      { path: "analytics", Component: Analytics },
      { path: "goals", Component: Goals },
      { path: "loans", Component: Loans },
      { path: "transactions", Component: Transactions },
      { path: "timeline", Component: FinancialTimeline },
      { path: "profile", Component: Profile },
      { path: "admin", Component: AdminDashboard },
    ],
  },
]);
