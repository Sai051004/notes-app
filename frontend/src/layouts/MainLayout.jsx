import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar.jsx';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <section
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </section>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet context={{ openSidebar: () => setSidebarOpen(true) }} />
      </main>
    </section>
  );
};
