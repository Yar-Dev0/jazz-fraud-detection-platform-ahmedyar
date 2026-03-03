export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white/80 py-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
      <div className="mx-auto max-w-6xl px-4">
        <p>© {new Date().getFullYear()} TransactionGuard. All rights reserved.</p>
        <p className="mt-1">Mini transaction risk monitoring system</p>
      </div>
    </footer>
  );
}