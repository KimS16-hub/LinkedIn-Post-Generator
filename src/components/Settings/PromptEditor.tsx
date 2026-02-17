import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface PromptEditorProps {
  initialPrompt: string;
  onSave: (prompt: string) => void;
}

export function PromptEditor({ initialPrompt, onSave }: PromptEditorProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(prompt);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">System Prompt</h3>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-48 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setPrompt(initialPrompt);
                setIsEditing(false);
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <pre className="mb-2 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
            {prompt}
          </pre>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Edit Prompt
          </button>
        </div>
      )}
    </div>
  );
}
