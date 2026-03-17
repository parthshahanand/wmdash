'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TableData } from '@/types/pg-types';
import { fetchAllTables } from '@/lib/pg/csv-parser';

interface DataContextType {
    tables: TableData[];
    isLoading: boolean;
    error: string | null;
    activeYear: string;
    setActiveYear: (year: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tables, setTables] = useState<TableData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeYear, setActiveYear] = useState('FY27');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchAllTables(activeYear);
                setTables(data);
                setError(null);
            } catch (err) {
                console.error('Failed to load CSV data:', err);
                setError('Failed to load dashboard data. Please check if the CSV files are in the public/pg-data directory.');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [activeYear]);

    return (
        <DataContext.Provider value={{ tables, isLoading, error, activeYear, setActiveYear }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
