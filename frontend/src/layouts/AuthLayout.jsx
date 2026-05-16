import { Outlet, Link } from 'react-router-dom';
import { FileText, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export const AuthLayout = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <section className="flex min-h-screen">
      <aside className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-primary-600 to-primary-900 p-12 text-white lg:flex">
        <header className="flex items-center gap-3">
          <FileText className="h-10 w-10" />
          <span className="text-2xl font-bold">Notes</span>
        </header>
        <section>
          <h2 className="text-4xl font-bold leading-tight">
            Capture ideas.
            <br />
            Share securely.
            <br />
            Never lose a version.
          </h2>
          <p className="mt-4 text-primary-100">
            Professional note-taking with version history, sharing, and full-text search.
          </p>
        </section>
        <p className="text-sm text-primary-200">© 2026 Notes App</p>
      </aside>

      <section className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute right-6 top-6 rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <section className="w-full max-w-md">
          <header className="mb-8 flex items-center gap-2 lg:hidden">
            <FileText className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold">Notes</span>
          </header>
          <Outlet />
        </section>

        <footer className="absolute bottom-6 text-center text-sm text-gray-500">
          <Link to="/about" className="hover:text-primary-600">
            About
          </Link>
        </footer>
      </section>
    </section>
  );
};
