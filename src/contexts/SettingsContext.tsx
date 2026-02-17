import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { LINKEDIN_SYSTEM_PROMPT } from '../config/prompts';

const STORAGE_KEYS = {
  API_KEY: 'openai_api_key',
  SYSTEM_PROMPT: 'system_prompt',
};

interface SettingsContextValue {
  apiKey: string;
  systemPrompt: string;
  updateApiKey: (newKey: string) => void;
  updateSystemPrompt: (newPrompt: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string>('');
  const [systemPrompt, setSystemPrompt] = useState(LINKEDIN_SYSTEM_PROMPT);

  useEffect(() => {
    const storedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
    const storedPrompt = localStorage.getItem(STORAGE_KEYS.SYSTEM_PROMPT);

    if (storedApiKey) setApiKey(storedApiKey);
    if (storedPrompt) setSystemPrompt(storedPrompt);
  }, []);

  const updateApiKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem(STORAGE_KEYS.API_KEY, newKey);
  };

  const updateSystemPrompt = (newPrompt: string) => {
    setSystemPrompt(newPrompt);
    localStorage.setItem(STORAGE_KEYS.SYSTEM_PROMPT, newPrompt);
  };

  return (
    <SettingsContext.Provider
      value={{ apiKey, systemPrompt, updateApiKey, updateSystemPrompt }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
