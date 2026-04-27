import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { LINKEDIN_SYSTEM_PROMPT } from '../config/prompts';

const STORAGE_KEY = 'system_prompt';

interface SettingsContextValue {
  systemPrompt: string;
  updateSystemPrompt: (newPrompt: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [systemPrompt, setSystemPrompt] = useState(LINKEDIN_SYSTEM_PROMPT);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setSystemPrompt(stored);
  }, []);

  const updateSystemPrompt = (newPrompt: string) => {
    setSystemPrompt(newPrompt);
    localStorage.setItem(STORAGE_KEY, newPrompt);
  };

  return (
    <SettingsContext.Provider value={{ systemPrompt, updateSystemPrompt }}>
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
