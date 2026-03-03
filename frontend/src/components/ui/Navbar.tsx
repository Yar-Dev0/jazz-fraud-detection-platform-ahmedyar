import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:justify-between sm:px-6">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <Logo size={36} />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
                TransactionGuard
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-primary-blue dark:text-neon-yellow">
                Risk Monitoring
              </span>
            </div>
          </div>
        </NavLink>

        <nav className="flex justify-center md:justify-start gap-3 text-sm font-medium text-text-gray">
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

        <div className="flex items-center gap-3 relative">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}