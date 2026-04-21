import { useState } from 'react';
import { Copy, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { GeneratedPost } from '../types';

const MAX_LINKEDIN_CHARS = 3000;

interface PostPreviewProps {
  post: GeneratedPost;
}

export function PostPreview({ post }: PostPreviewProps) {
  const [stepsOpen, setStepsOpen] = useState(false);

  const contentLength = post.content?.length ?? 0;
  const isOverLimit = contentLength > MAX_LINKEDIN_CHARS;
  const isNearLimit = !isOverLimit && contentLength > MAX_LINKEDIN_CHARS * 0.9;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(post.content);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (post.status === 'error') {
    return (
      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/40">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">{post.error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (post.status === 'pending') {
    return (
      <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Agenten analyserer, skriver og forbedrer...</p>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-4 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow dark:bg-gray-900 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Færdigt opslag</h4>
          <div className="flex items-center gap-4">
            <div
              className={`text-xs font-medium rounded-full px-3 py-1 border ${
                isOverLimit
                  ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300'
                  : isNearLimit
                  ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300'
                  : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {contentLength}/{MAX_LINKEDIN_CHARS} tegn
            </div>
            <button
              onClick={copyToClipboard}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300"
              title="Kopiér til udklipsholder"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <p className="font-medium">Brief:</p>
          <p className="mt-1">{post.brief}</p>
        </div>

        <div className="mt-4 text-sm text-gray-900 dark:text-gray-100">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>

      {post.agentSteps && post.agentSteps.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setStepsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span>Vis agent-arbejde ({post.agentSteps.length} trin)</span>
            {stepsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {stepsOpen && (
            <div className="px-4 pb-4 space-y-3">
              {post.agentSteps.map((step, i) => (
                <div key={i} className="rounded-md bg-gray-50 dark:bg-gray-800 p-3">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    Trin {i + 1}: {step.label}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {step.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
