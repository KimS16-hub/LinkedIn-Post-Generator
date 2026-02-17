import { Copy, AlertCircle } from 'lucide-react';
import type { GeneratedPost } from '../types';

// Maximum character limit for a single LinkedIn post.
// LinkedIn currently allows up to ~3,000 characters.
// We keep this as a constant so we can easily change it later if LinkedIn updates their limits.
const MAX_LINKEDIN_CHARS = 3000;

interface PostPreviewProps {
  post: GeneratedPost;
}

export function PostPreview({ post }: PostPreviewProps) {
  // Calculate character count for the generated post content.
  // We use optional chaining and a default empty string to be safe.
  const contentLength = post.content?.length ?? 0;

  // Simple rule: if the post is close to or above the LinkedIn limit,
  // we show a gentle warning color to tell the user to shorten it.
  const isOverLimit = contentLength > MAX_LINKEDIN_CHARS;
  const isNearLimit =
    !isOverLimit && contentLength > MAX_LINKEDIN_CHARS * 0.9; // 90% threshold

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
      <div className="animate-pulse rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800"></div>
        <div className="space-y-3 mt-4">
          <div className="h-4 rounded bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-900">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Generated Post</h4>
        <div className="flex items-center gap-4">
          {/* 
            Character counter:
            - Shows current length and maximum allowed.
            - Changes color when we get close to or exceed the limit.
          */}
          <div
            className={`text-xs font-medium rounded-full px-3 py-1 border ${
              isOverLimit
                ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300'
                : isNearLimit
                ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300'
                : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {contentLength}/{MAX_LINKEDIN_CHARS} chars
          </div>

          {/* Copy button to quickly copy the generated post into LinkedIn */}
          <button
            onClick={copyToClipboard}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300"
            title="Copy to clipboard"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium">Original Brief:</p>
        <p className="mt-1">{post.brief}</p>
      </div>
      <div className="mt-4 text-sm text-gray-900 dark:text-gray-100">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>
    </div>
  );
}
