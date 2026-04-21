import { useState, useCallback } from 'react';
import { PenLine } from 'lucide-react';
import type { Brief } from '../types';

interface SingleTopicInputProps {
  onBriefsLoaded: (briefs: Brief[]) => void;
  onError: (error: string) => void;
}

interface StructuredBrief {
  what: string;
  detail: string;
  point: string;
}

function formatBrief({ what, detail, point }: StructuredBrief): string {
  const lines = [`Hvad skete der: ${what}`];
  if (detail.trim()) lines.push(`Konkret detalje: ${detail}`);
  if (point.trim()) lines.push(`Min pointe: ${point}`);
  return lines.join('\n');
}

export function SingleTopicInput({ onBriefsLoaded, onError }: SingleTopicInputProps) {
  const [what, setWhat] = useState('');
  const [detail, setDetail] = useState('');
  const [point, setPoint] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedWhat = what.trim();
      if (!trimmedWhat) {
        onError('Skriv mindst hvad der skete.');
        return;
      }
      const brief: Brief = {
        id: `brief-single-${Date.now()}`,
        content: formatBrief({ what: trimmedWhat, detail, point }),
      };
      onBriefsLoaded([brief]);
      setWhat('');
      setDetail('');
      setPoint('');
    },
    [what, detail, point, onBriefsLoaded, onError]
  );

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-4">
          <PenLine className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ny idé til opslag
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="brief-what" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Hvad skete der? <span className="text-red-500">*</span>
            </label>
            <input
              id="brief-what"
              type="text"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="fx: Spillede kamp i aftes trods influenza – holdet vandt"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="brief-detail" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Ét konkret detalje{' '}
              <span className="font-normal text-gray-400 dark:text-gray-500">(navn, sted, sansning – det der gør det virkeligt)</span>
            </label>
            <input
              id="brief-detail"
              type="text"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="fx: halvkold håndklæde i omklædningen, træner Lars sagde ingenting"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="brief-point" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Din ene pointe{' '}
              <span className="font-normal text-gray-400 dark:text-gray-500">(hvad skal læseren tage med?)</span>
            </label>
            <input
              id="brief-point"
              type="text"
              value={point}
              onChange={(e) => setPoint(e.target.value)}
              placeholder="fx: kroppen lyver ikke – men fællesskabet bærer"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!what.trim()}
          className="mt-4 w-full inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900"
        >
          Generer opslag
        </button>
      </div>
    </form>
  );
}
