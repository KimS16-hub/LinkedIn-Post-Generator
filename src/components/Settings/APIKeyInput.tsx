import { useState } from 'react';
import { Key } from 'lucide-react';

interface APIKeyInputProps {
  onSave: (apiKey: string) => void;
  initialKey?: string;
}

export function APIKeyInput({ onSave, initialKey }: APIKeyInputProps) {
  const [apiKey, setApiKey] = useState(initialKey || '');
  const [isEditing, setIsEditing] = useState(!initialKey);

  const handleSave = () => {
    onSave(apiKey);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-2">
        <Key className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">OpenAI API Key</h3>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <button
            onClick={handleSave}
            disabled={!apiKey}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            Save API Key
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">API key is set</div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}
