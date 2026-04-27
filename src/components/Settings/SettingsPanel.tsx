import { Settings } from 'lucide-react';
import { PromptEditor } from './PromptEditor';
import { useSettings } from '../../hooks/useSettings';

export function SettingsPanel() {
  const { systemPrompt, updateSystemPrompt } = useSettings();

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
      </div>
      <PromptEditor initialPrompt={systemPrompt} onSave={updateSystemPrompt} />
    </div>
  );
}
