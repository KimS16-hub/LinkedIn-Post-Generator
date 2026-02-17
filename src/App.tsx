import { useEffect, useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { SingleTopicInput } from './components/SingleTopicInput';
import { PostPreview } from './components/PostPreview';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { Linkedin, Moon, Sun } from 'lucide-react';
import { usePostGeneration } from './hooks/usePostGeneration';
import { useSettings } from './hooks/useSettings';
import type { Brief } from './types';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { posts, error, generatePosts, setError } = usePostGeneration();
  const { apiKey } = useSettings();

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
    if (!apiKey) {
      setError('Please set your OpenAI API key in the settings panel');
      return;
    }
    generatePosts(briefs);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-end">
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
        </div>

        <div className="text-center mb-12">
          <Linkedin className="h-12 w-12 text-blue-600 mx-auto" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            LinkedIn Post Generator
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Upload a spreadsheet with your content briefs and get AI-generated LinkedIn posts
          </p>
        </div>

        <SettingsPanel />

        {/* Single topic: paste or type one topic at a time */}
        <SingleTopicInput
          onBriefsLoaded={handleBriefsLoaded}
          onError={handleError}
        />

        {/* Bulk: upload CSV/XLSX with many topics */}
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
              Generated Posts ({posts.length})
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
