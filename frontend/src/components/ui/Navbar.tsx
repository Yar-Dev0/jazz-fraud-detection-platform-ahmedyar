import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/transactions", label: "Transactions" },
    { to: "/upload", label: "Upload" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
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

        <nav className="hidden md:flex justify-center gap-3 text-sm font-medium text-text-gray">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 transition-all duration-300 ease-out ${
                  isActive
                    ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40"
                    : "text-text-gray hover:bg-light-gray hover:shadow-sm hover:shadow-slate-200/50 hover:scale-105"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex">
            <UserMenu />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-slate-900 transition-transform" />
            <div className="w-6 h-0.5 bg-slate-900 transition-transform" />
            <div className="w-6 h-0.5 bg-slate-900 transition-transform" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-2">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2.5 transition-all duration-300 ease-out text-sm font-medium ${
                    isActive
                      ? "bg-primary-blue text-white shadow-md shadow-primary-blue/30"
                      : "text-text-gray hover:bg-light-gray"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="border-t border-slate-200 mt-2 pt-2 flex">
              <UserMenu />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}