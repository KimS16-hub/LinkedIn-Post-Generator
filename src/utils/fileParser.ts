import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { Brief } from '../types';

type RowCell = string | number | boolean | null | undefined;
type RowData = RowCell[];

const SUPPORTED_EXTENSIONS = ['csv', 'xlsx', 'txt', 'md', 'pdf', 'docx'];

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/legacy/build/pdf.worker.min.mjs`;

function toBriefsFromRows(rows: RowData[]): Brief[] {
  return rows
    .filter((row): row is [string, ...RowCell[]] => typeof row[0] === 'string' && row[0].trim().length > 0)
    .map((row, index) => ({
      content: row[0].trim(),
      id: `brief-${index}`,
    }));
}

function toSingleBrief(text: string): Brief[] {
  const content = text.trim();
  if (!content) return [];

  return [
    {
      id: 'brief-0',
      content,
    },
  ];
}

async function parsePdf(file: File): Promise<Brief[]> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocument({ data: bytes }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim();

    if (pageText) pages.push(pageText);
  }

  return toSingleBrief(pages.join('\n\n'));
}

async function parseDocx(file: File): Promise<Brief[]> {
  const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return toSingleBrief(value);
}

export async function parseFile(file: File): Promise<Brief[]> {
  if (!file) throw new Error('No file provided');

  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!SUPPORTED_EXTENSIONS.includes(extension || '')) {
    throw new Error('Invalid file format. Please upload CSV, XLSX, TXT, MD, PDF, or DOCX.');
  }

  if (extension === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse<RowData>(file, {
        complete: (results) => {
          const briefs = toBriefsFromRows(results.data);
          resolve(briefs);
        },
        error: (error) => reject(error),
      });
    });
  }

  if (extension === 'xlsx') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json<RowData>(firstSheet, { header: 1 });

          const briefs = toBriefsFromRows(rows);
          resolve(briefs);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  if (extension === 'txt' || extension === 'md') {
    return toSingleBrief(await file.text());
  }

  if (extension === 'pdf') {
    return parsePdf(file);
  }

  if (extension === 'docx') {
    return parseDocx(file);
  }

  throw new Error('Unsupported file format');
}
