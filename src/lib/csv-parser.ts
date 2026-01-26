import Papa from 'papaparse';
import dayjs from 'dayjs';
import { Post, Network, PostType, Language, FollowerData } from '@/types/post';

interface RawCSVRow {
    'Post ID': string;
    'Network': string;
    'Published time (America/Toronto)': string;
    'Post Type': string;
    'Placement': string;
    'Boosted': string;
    'Post text': string;
    'Post URL': string;
    'Impressions': string;
    'Engagements': string;
    'Reach': string;
    'Engagement rate': string;
    [key: string]: string;
}

export const parseCSV = (csvString: string): Post[] => {
    const result = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
    });

    return (result.data as RawCSVRow[]).map((row) => {
        const parsePercentage = (val: string): number => {
            if (!val) return 0;
            const parsed = parseFloat(val.replace('%', ''));
            return isNaN(parsed) ? 0 : parsed / 100;
        };

        const parseNumber = (val: string): number => {
            if (!val || val === '-' || val === '') return 0;
            const parsed = parseInt(val.replace(/,/g, ''));
            return isNaN(parsed) ? 0 : parsed;
        };

        // Date format is "MMM DD", we assume year 2025
        const dateStr = row['Published time (America/Toronto)'];
        const publishedAt = dayjs(`${dateStr} 2025`, 'MMM DD YYYY').toDate();

        return {
            id: row['Post ID'],
            network: row['Network'] as Network,
            publishedAt,
            postType: row['Post Type'] as PostType,
            placement: row['Placement'],
            boosted: row['Boosted'] === 'Yes',
            text: row['Post text'] || '',
            url: row['Post URL'] || '',
            impressions: parseNumber(row['Impressions']),
            reach: row['Reach'] === '-' ? null : parseNumber(row['Reach']),
            engagementRate: parsePercentage(row['Engagement rate']),
            engagements: parseNumber(row['Engagements']),
        };
    });
};

export const fetchAndParseData = async (): Promise<Post[]> => {
    try {
        const response = await fetch('/wm2025.csv');
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvString = await response.text();
        return parseCSV(csvString);
    } catch (error) {
        console.error('Error fetching/parsing CSV data:', error);
        throw error;
    }
};

interface RawFollowerRow {
    'Date': string;
    'FB followers': string;
    'IG followers': string;
    'TT followers': string;
}

export const fetchFollowerData = async (): Promise<FollowerData[]> => {
    try {
        const response = await fetch('/wm-followers.csv');
        if (!response.ok) {
            throw new Error(`Failed to fetch followers CSV: ${response.statusText}`);
        }
        const csvString = await response.text();
        const result = Papa.parse(csvString, {
            header: true,
            skipEmptyLines: true,
        });

        return (result.data as RawFollowerRow[]).map((row) => {
            const parseNumber = (val: string): number => {
                if (!val || val === '-' || val === '') return 0;
                return parseInt(val.replace(/,/g, ''));
            };

            const date = dayjs(row['Date']).toDate();
            return {
                date,
                month: dayjs(date).format('MMMM'),
                facebook: parseNumber(row['FB followers']),
                instagram: parseNumber(row['IG followers']),
                tiktok: parseNumber(row['TT followers']),
            };
        });
    } catch (error) {
        console.error('Error fetching/parsing follower data:', error);
        throw error;
    }
};
