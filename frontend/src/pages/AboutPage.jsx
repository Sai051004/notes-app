import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { aboutService } from '../services/about.service.js';
import { useTheme } from '../context/ThemeContext.jsx';

const AboutPage = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    aboutService
      .getAbout()
      .then((res) => setInfo(res.data))
      .catch(() =>
        setInfo({
          name: 'Notes App',
          email: 'support@example.com',
          'my features': {},
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <nav className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary-600">
            <FileText className="h-6 w-6" />
            Notes
          </Link>
          <section className="flex items-center gap-4">
            <button type="button" onClick={toggleTheme} className="text-sm text-gray-500">
              {darkMode ? 'Light' : 'Dark'} mode
            </button>
            <Link to="/" className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </section>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <article className="card">
            <h1 className="text-3xl font-bold">{info?.name}</h1>
            <p className="mt-2 text-primary-600">{info?.email}</p>

            {info?.['my features'] && (
              <section className="mt-10 space-y-4">
                <h2 className="text-xl font-semibold">My features</h2>
                {Object.entries(info['my features']).map(([name, description]) => (
                  <section key={name} className="rounded-lg bg-gray-50 p-5 dark:bg-gray-800">
                    <h3 className="font-semibold">{name}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
                  </section>
                ))}
              </section>
            )}
          </article>
        )}
      </main>
    </section>
  );
};

export default AboutPage;
