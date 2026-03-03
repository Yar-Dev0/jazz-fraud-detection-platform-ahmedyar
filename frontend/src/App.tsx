import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import TransactionsPage from "./pages/TransactionsPage";
import UploadPage from "./pages/UploadPage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./components/ui/Navbar";
import { Footer } from "./components/ui/Footer";

function AppShell() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-50">
          <Toaster position="top-right" />
          <Navbar />

        <main className="mx-auto max-w-[var(--container-width)] px-4 py-8 sm:px-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  </QueryClientProvider>
  );
}

function App() {
  return <AppShell />;
}

export default App;