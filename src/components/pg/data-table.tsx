import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TableData } from '@/types/pg-types';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';

interface DataTableProps {
    data: TableData;
    icon?: IconSvgElement;
    actionSlot?: React.ReactNode;
}

// Column widths for the 16-column structure:
// Metric (0): 260px
// Annual (1): 80px
// Months (2-13): 90px each
// YTD Actual (14): 110px
// YTD Progress (15): 130px
const COLUMN_WIDTHS = [
    260, 80, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 110, 130
];

export const DataTable: React.FC<DataTableProps> = ({ data, icon, actionSlot }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-fit mx-auto">
                <div className="flex items-center gap-2 mb-3 px-1 min-h-[32px]">
                    <div className="flex items-center gap-2">
                        {icon && (
                            <HugeiconsIcon
                                icon={icon}
                                size={20}
                                className="text-slate-900"
                            />
                        )}
                        <h2 className="text-lg font-semibold text-slate-900">
                            {data.title}
                        </h2>
                    </div>
                    {actionSlot && (
                        <div className="ml-auto">
                            {actionSlot}
                        </div>
                    )}
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden w-fit mx-auto">
                    <div className="overflow-x-auto w-full">
                        <Table className="" style={{ tableLayout: 'fixed', width: '1660px' }}>
                            <colgroup>
                                {COLUMN_WIDTHS.map((width, i) => (
                                    <col key={i} style={{ width: `${width}px` }} />
                                ))}
                            </colgroup>
                            <TableHeader>
                                <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                                    {data.headers.map((header, index) => (
                                        <TableHead
                                            key={index}
                                            className={`h-10 px-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-center first:text-left first:pl-4 ${index === 1 ? 'bg-sky-600/10' : ''}`}
                                        >
                                            {header}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.rows.map((row, rowIndex) => {
                                    const isPlanRow = row[0]?.includes('Plan');

                                    return (
                                        <TableRow
                                            key={rowIndex}
                                            className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0"
                                        >
                                            {row.map((cell, cellIndex) => (
                                                <TableCell
                                                    key={cellIndex}
                                                    className={`px-3 py-3.5 text-xs sm:text-sm whitespace-nowrap whitespace-pre-line align-top text-center first:text-left first:pl-4 ${isPlanRow ? 'font-bold text-slate-900' : 'text-slate-600'
                                                        } ${cellIndex === 1
                                                            ? 'bg-sky-600/10' // Blue Annual target always wins
                                                            : (isPlanRow ? 'bg-amber-400/10' : '') // Amber for other cells in Plan row
                                                        } ${cellIndex === 0 && isPlanRow ? 'font-medium text-slate-900' : ''
                                                        }`}
                                                >
                                                    {cell || '—'}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};
