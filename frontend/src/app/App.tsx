import { RouterProvider } from "react-router";
import { router } from "./routes";
import { FinanceProvider } from "./context/FinanceContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <RouterProvider router={router} />
          <Toaster />
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;