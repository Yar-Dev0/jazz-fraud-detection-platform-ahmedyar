import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import TransactionsPage from "./pages/TransactionsPage";
import UploadPage from "./pages/UploadPage";
import { UserMenu } from "./components/ui/UserMenu";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function AppShell() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-50">
          <Toaster position="top-right" />
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:justify-between sm:px-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm dark:bg-slate-100 dark:text-slate-900">
                  RM
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    RiskMonitor
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Transaction Risk
                  </span>
                </div>
              </div>
              <nav className="flex flex-1 justify-center md:justify-start gap-3 text-sm font-medium text-text-gray">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `rounded-full px-3.5 py-1.5 transition-all duration-300 ease-out ${
                      isActive
                        ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40"
                        : "text-text-gray hover:bg-light-gray hover:shadow-sm hover:shadow-slate-200/50 hover:scale-105"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/transactions"
                  className={({ isActive }) =>
                    `rounded-full px-3.5 py-1.5 transition-all duration-300 ease-out ${
                      isActive
                        ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40"
                        : "text-text-gray hover:bg-light-gray hover:shadow-sm hover:shadow-slate-200/50 hover:scale-105"
                    }`
                  }
                >
                  Transactions
                </NavLink>
                <NavLink
                  to="/upload"
                  className={({ isActive }) =>
                    `rounded-full px-3.5 py-1.5 transition-all duration-300 ease-out ${
                      isActive
                        ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40"
                        : "text-text-gray hover:bg-light-gray hover:shadow-sm hover:shadow-slate-200/50 hover:scale-105"
                    }`
                  }
                >
                  Upload
                </NavLink>
              </nav>
            </div>
            <div className="flex items-center gap-3 relative">
              <UserMenu />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[var(--container-width)] px-4 py-8 sm:px-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
  );
}

function App() {
  return <AppShell />;
}

export default App;