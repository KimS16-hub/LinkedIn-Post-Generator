import { useEffect, useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { SingleTopicInput } from './components/SingleTopicInput';
import { PostPreview } from './components/PostPreview';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { Linkedin, Moon, Sun, LogOut } from 'lucide-react';
import { usePostGeneration } from './hooks/usePostGeneration';
import type { Brief } from './types';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { posts, error, generatePosts, setError } = usePostGeneration();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleBriefsLoaded = (briefs: Brief[]) => {
    generatePosts(briefs);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Toggle light and dark mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4" />
                Light mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                Dark mode
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Log ud"
          >
            <LogOut className="h-4 w-4" />
            Log ud
          </button>
        </div>

        <div className="text-center mb-12">
          <Linkedin className="h-12 w-12 text-blue-600 mx-auto" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            LinkedIn Post Generator
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Skriv din idé – agenten gør resten
          </p>
        </div>

        <SettingsPanel />

        <SingleTopicInput
          onBriefsLoaded={handleBriefsLoaded}
          onError={handleError}
        />

        <FileUpload
          onBriefsLoaded={handleBriefsLoaded}
          onError={handleError}
        />

        {error && (
          <div className="mt-8 rounded-md bg-red-50 p-4 dark:bg-red-950/40">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {posts.length > 0 && (
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Genererede opslag ({posts.length})
            </h2>
            {posts.map((post) => (
              <PostPreview key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
