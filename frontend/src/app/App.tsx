import { RouterProvider } from 'react-router';
import { router } from './routes';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <RouterProvider router={router} />
        <Toaster />
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;
