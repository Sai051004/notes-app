import { Menu } from 'lucide-react';

export const Header = ({ title, subtitle, onMenuClick, actions }) => (
  <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 lg:px-8">
    <section className="flex items-center gap-4">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      <section>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </section>
    </section>
    {actions && <section className="flex items-center gap-2">{actions}</section>}
  </header>
);
