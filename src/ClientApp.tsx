'use client';

import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';

export function ClientApp() {
  return (
    <SettingsProvider>
      <App />
    </SettingsProvider>
  );
}
