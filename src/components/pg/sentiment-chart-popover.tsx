"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { TableData } from "@/types/pg-types";
import { ChartPopoverShell } from "./chart-popover-shell";
import {
    AXIS_PROPS,
    CHART_COLORS,
    CHART_MARGIN,
    GRID_PROPS,
    LEGEND_STYLE,
    TOOLTIP_STYLE,
    formatPct,
    prepareChartData
} from "@/lib/pg/chart-constants";

interface SentimentChartPopoverProps {
    data: TableData;
    onOpenChange?: (open: boolean) => void;
}

export const SentimentChartPopover: React.FC<SentimentChartPopoverProps> = ({ data, onOpenChange }) => {
    // 1. Organic Data
    const organicPlanRow = data.rows.find(r => r[0] === 'Organic Negative Sentiment Plan');
    const organicActualRow = data.rows.find(r => r[0] === 'Organic Negative Sentiment Actual');
    const organicChartData = prepareChartData(data.headers, organicPlanRow, organicActualRow);

    // 2. Paid Data
    const paidPlanRow = data.rows.find(r => r[0] === 'Paid Negative Sentiment Plan');
    const paidActualRow = data.rows.find(r => r[0] === 'Paid Negative Sentiment Actual');
    const paidChartData = prepareChartData(data.headers, paidPlanRow, paidActualRow);

    return (
        <ChartPopoverShell
            title="Sentiment Progress"
            subtitle="SENTIMENT · MONTHLY"
            onOpenChange={onOpenChange}
            contentClassName=""
        >
            <div className="flex flex-col gap-10 py-2">
                {/* Organic Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organic Sentiment</span>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={organicChartData} margin={CHART_MARGIN}>
                                <CartesianGrid {...GRID_PROPS} />
                                <XAxis dataKey="month" {...AXIS_PROPS} tick={false} axisLine={false} />
                                <YAxis {...AXIS_PROPS} tickFormatter={formatPct} />
                                <Tooltip
                                    {...TOOLTIP_STYLE}
                                    separator=""
                                    formatter={((value: number) => [formatPct(value), ""]) as never}
                                />
                                <Legend {...LEGEND_STYLE} />
                                <Line
                                    name="Plan"
                                    type="monotone"
                                    dataKey="plan"
                                    stroke={CHART_COLORS.plan}
                                    strokeWidth={2.5}
                                    dot={{ r: 3, fill: CHART_COLORS.plan, strokeWidth: 0 }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                                <Line
                                    name="Actual"
                                    type="monotone"
                                    dataKey="actual"
                                    stroke={CHART_COLORS.actual}
                                    strokeWidth={2.5}
                                    dot={{ r: 3, fill: CHART_COLORS.actual, strokeWidth: 0 }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Paid Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paid Sentiment</span>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={paidChartData} margin={CHART_MARGIN}>
                                <CartesianGrid {...GRID_PROPS} />
                                <XAxis dataKey="month" {...AXIS_PROPS} />
                                <YAxis {...AXIS_PROPS} tickFormatter={formatPct} />
                                <Tooltip
                                    {...TOOLTIP_STYLE}
                                    separator=""
                                    formatter={((value: number) => [formatPct(value), ""]) as never}
                                />
                                <Legend {...LEGEND_STYLE} />
                                <Line
                                    name="Plan"
                                    type="monotone"
                                    dataKey="plan"
                                    stroke={CHART_COLORS.plan}
                                    strokeWidth={2.5}
                                    dot={{ r: 3, fill: CHART_COLORS.plan, strokeWidth: 0 }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                                <Line
                                    name="Actual"
                                    type="monotone"
                                    dataKey="actual"
                                    stroke={CHART_COLORS.actual}
                                    strokeWidth={2.5}
                                    dot={{ r: 3, fill: CHART_COLORS.actual, strokeWidth: 0 }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </ChartPopoverShell>
    );
};
