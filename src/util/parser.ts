// src/utils/parser.ts
import fs from 'fs';
import { parse } from 'csv-parse';
import { stringify as csvStringify } from 'csv-stringify';
import logger from './logger';

export const parseCSV = (filePath: string): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const results: string[][] = [];
    const parser = parse({ skip_empty_lines: true, trim: true });

    parser.on('readable', () => {
      let row: string[] | null;
      while ((row = parser.read() as string[] | null) !== null) {
        results.push(row);
      }
    });
    parser.on('end', () => resolve(results));
    parser.on('error', (error) => {
      logger.error("Error while reading the stream of file %s, $o", filePath, error);
      reject(error);
    });

    fs.createReadStream(filePath, { encoding: 'utf-8' })
      .on('error', reject)
      .pipe(parser);
  });
};

export const writeCSVFile = async (filePath: string, data: string[][]): Promise<void> => {
  try {
    const csvContent = await new Promise<string>((resolve, reject) => {
      csvStringify(data, (err, output) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(output);
      });
    });
    await fs.promises.writeFile(filePath, csvContent, "utf-8");
  } catch (error) {
    const wrappedError = new Error(`Error writing csv file: ${error}`);
    (wrappedError as Error & { cause: unknown }).cause = error;
    throw wrappedError;
  }
};
