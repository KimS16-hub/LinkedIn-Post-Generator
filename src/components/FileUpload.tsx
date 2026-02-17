import { useCallback, useRef, type ChangeEvent, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { parseFile } from '../utils/fileParser';
import type { Brief } from '../types';

interface FileUploadProps {
  onBriefsLoaded: (briefs: Brief[]) => void;
  onError: (error: string) => void;
}

export function FileUpload({ onBriefsLoaded, onError }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      try {
        const briefs = await parseFile(file);
        onBriefsLoaded(briefs);
        // Reset the file input after successful upload
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to parse file');
        // Also reset on error
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onBriefsLoaded, onError]
  );

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      await processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await processFile(file);
    },
    [processFile]
  );

  return (
    <div
      className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Upload a file</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Drag and drop or click to upload CSV, XLSX, TXT, MD, PDF, or DOCX
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.txt,.md,.pdf,.docx"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="mt-4 inline-flex cursor-pointer items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        Select File
      </label>
    </div>
  );
}
