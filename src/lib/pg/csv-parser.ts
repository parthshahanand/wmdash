import Papa from 'papaparse';
import { TableData } from '@/types/pg-types';

const CSV_FILES = [
    { name: 'wmpg-followers', title: 'Followers' },
    { name: 'wmpg-impressions', title: 'Impressions' },
    { name: 'wmpg-er', title: 'Engagement Rate (ER)' },
    { name: 'wmpg-sentiment', title: 'Sentiment' },
    { name: 'wmpg-optin', title: 'Opt-In' },
    { name: 'wmpg-cm', title: 'Community Management (CM)' },
];

/**
 * Cleans and formats cell values based on global rules:
 * - Capitalizes K/M suffixes at the end of numbers
 * - Adds space after '<' if followed by a digit
 * - Adds space after 'B:' in ER table
 * - Fixes missing colon after 'B' in ER table (B1.08% -> B: 1.08%)
 */
const cleanValue = (val: string): string => {
    let cleaned = val.replace(/\u200B/g, '').trim();

    // Capitalize k/m at end of numeric strings (e.g., 600k -> 600K, 4.32m -> 4.32M)
    cleaned = cleaned.replace(/(\d+)(k|m)\b/gi, (match, num, suffix) => {
        return num + suffix.toUpperCase();
    });

    // Add space after < (global, mid-string)
    cleaned = cleaned.replace(/<(\d)/g, '< $1');

    // Fix B: spacing and colons
    // 1. Missing space: B:3.93% -> B: 3.93%
    cleaned = cleaned.replace(/B:(\d)/g, 'B: $1');
    // 2. Missing colon: B1.08% -> B: 1.08%
    cleaned = cleaned.replace(/\bB(\d)/g, 'B: $1');

    return cleaned;
};

const METRIC_RENAMES: Record<string, string> = {
    'IG Actual': 'Instagram Actual',
    'Tik Tok Actual': 'TikTok Actual',
    'Opt-In Sign Ups': 'Opt-In Sign Ups Plan',
};

// Data Row 2 (index 1) of Sentiment is actually "Actual" data
const getSentimentRename = (index: number, val: string) => {
    if (val === 'Organic Negative Sentiment Plan' && index === 1) return 'Organic Negative Sentiment Actual';
    return METRIC_RENAMES[val] || val;
};

export const fetchAllTables = async (): Promise<TableData[]> => {
    const tableDataPromises = CSV_FILES.map(async (file) => {
        const response = await fetch(`/pg-data/${file.name}.csv`);
        const csvString = await response.text();

        return new Promise<TableData>((resolve, reject) => {
            Papa.parse<string[]>(csvString, {
                header: false,
                skipEmptyLines: true,
                complete: (results) => {
                    const rawData = results.data;
                    if (rawData.length === 0) {
                        resolve({ title: file.title, headers: [], rows: [] });
                        return;
                    }

                    // Clean all values
                    const cleanedData = rawData.map(row => row.map(cleanValue));

                    const headers = cleanedData[0];
                    const rows = cleanedData.slice(1).map((row, rowIndex) =>
                        row.map((cell, cellIndex) => {
                            if (cellIndex === 0) {
                                // Specific renames for sentiment table rows
                                if (file.name === 'wmpg-sentiment') {
                                    return getSentimentRename(rowIndex, cell);
                                }


                                return METRIC_RENAMES[cell] || cell;
                            }
                            return cell;
                        })
                    );

                    // Final pass for ER table multi-line labels
                    const finalRows = rows.map((row, idx) => {
                        const cell = row[0];
                        if (file.name === 'wmpg-er') {
                            // Target: Paid/Boosted ER (Opt-In and Spark Squad) 
                            // Third last row is Plan
                            if (idx === rows.length - 3 && (cell.includes("Paid/Boosted ER") || cell.includes("Paid/ Boosted ER"))) {
                                return ["Paid/Boosted ER Plan\n(Opt-In and Spark Squad)", ...row.slice(1)];
                            }
                            // Second last row is Actual
                            if (idx === rows.length - 2 && (cell.includes("Paid/Boosted ER") || cell.includes("Paid/ Boosted ER"))) {
                                return ["Paid/Boosted ER Actual\n(Opt-In and Spark Squad)", ...row.slice(1)];
                            }
                        }
                        return row;
                    });

                    resolve({
                        title: file.title,
                        headers,
                        rows: finalRows,
                    });
                },
                error: (error: Error) => {
                    reject(error);
                },
            });
        });
    });

    return Promise.all(tableDataPromises);
};
