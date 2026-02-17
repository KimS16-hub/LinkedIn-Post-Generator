import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { Brief } from '../types';

type RowCell = string | number | boolean | null | undefined;
type RowData = RowCell[];

function toBriefsFromRows(rows: RowData[]): Brief[] {
  return rows
    .filter((row): row is [string, ...RowCell[]] => typeof row[0] === 'string' && row[0].trim().length > 0)
    .map((row, index) => ({
      content: row[0].trim(),
      id: `brief-${index}`,
    }));
}

export async function parseFile(file: File): Promise<Brief[]> {
  if (!file) throw new Error('No file provided');

  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (!['csv', 'xlsx'].includes(extension || '')) {
    throw new Error('Invalid file format. Please upload a CSV or XLSX file.');
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
  } else {
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
}
