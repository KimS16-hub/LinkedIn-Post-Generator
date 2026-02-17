import { useState, useCallback } from 'react';
import { FileText } from 'lucide-react';
import type { Brief } from '../types';

interface SingleTopicInputProps {
  onBriefsLoaded: (briefs: Brief[]) => void;
  onError: (error: string) => void;
}

/**
 * Input for pasting or typing a single topic at a time.
 * Submitting sends one brief to the same handler as bulk upload.
 */
export function SingleTopicInput({ onBriefsLoaded, onError }: SingleTopicInputProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = topic.trim();
      if (!trimmed) {
        onError('Please enter or paste a topic.');
        return;
      }
      // Same brief shape as file parser: one item array
      const brief: Brief = {
        id: `brief-single-${Date.now()}`,
        content: trimmed,
      };
      onBriefsLoaded([brief]);
      setTopic('');
    },
    [topic, onBriefsLoaded, onError]
  );

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden />
          <label htmlFor="single-topic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Paste or type one topic
          </label>
        </div>
        <div className="flex gap-2">
          <input
            id="single-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How to build a strong personal brand on LinkedIn"
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-400"
            aria-label="Single topic for post generation"
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Generate post
          </button>
        </div>
      </div>
    </form>
  );
}
