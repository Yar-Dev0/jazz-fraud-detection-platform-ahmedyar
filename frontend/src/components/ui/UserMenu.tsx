import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { createPortal } from "react-dom";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-blue text-white shadow-sm dark:bg-white dark:text-primary-blue"
        onClick={() => setOpen((o) => !o)}
      >
        <FaUserCircle size={20} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <ul className="flex flex-col">
            <li>
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">
                <FaUser /> Profile
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">
                <FaCog /> Settings
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}