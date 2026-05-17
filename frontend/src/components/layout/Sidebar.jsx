import { NavLink } from 'react-router-dom';
import {
  Archive,
  FileText,
  Info,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  Search,
  Share2,
  Sun,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
  }`;

export const Sidebar = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const handleNav = () => onNavigate?.();

  return (
    <aside className="flex h-full w-64 flex-col app-shell-border-r bg-white dark:bg-gray-900">
      <header className="shell-header gap-2 px-5">
        <FileText className="h-7 w-7 shrink-0 text-primary-600" />
        <span className="text-lg font-bold text-gray-900 dark:text-white">Notes</span>
      </header>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <NavLink to="/" end className={navLinkClass} onClick={handleNav}>
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink to="/notes/new" className={navLinkClass} onClick={handleNav}>
          <Plus className="h-5 w-5" />
          New Note
        </NavLink>
        <NavLink to="/shared" className={navLinkClass} onClick={handleNav}>
          <Share2 className="h-5 w-5" />
          Shared Notes
        </NavLink>
        <NavLink to="/search" className={navLinkClass} onClick={handleNav}>
          <Search className="h-5 w-5" />
          Search
        </NavLink>
        <NavLink to="/?archived=true" className={navLinkClass} onClick={handleNav}>
          <Archive className="h-5 w-5" />
          Archived
        </NavLink>
        <NavLink to="/about" className={navLinkClass} onClick={handleNav}>
          <Info className="h-5 w-5" />
          About
        </NavLink>
      </nav>

      <footer className="app-shell-border-t p-4">
        <p className="mb-3 truncate px-3 text-xs text-gray-500">{user?.email}</p>
        <button
          type="button"
          onClick={toggleTheme}
          className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </footer>
    </aside>
  );
};
