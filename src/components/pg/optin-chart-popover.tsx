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
    formatKM,
    prepareChartData
} from "@/lib/pg/chart-constants";

interface OptInChartPopoverProps {
    data: TableData;
    onOpenChange?: (open: boolean) => void;
}

export const OptInChartPopover: React.FC<OptInChartPopoverProps> = ({ data, onOpenChange }) => {
    // 1. GMV Data (Single line)
    const gmvRow = data.rows.find(r => r[0] === 'Affiliate GMV');
    const gmvChartData = prepareChartData(data.headers, undefined, gmvRow);

    // 2. Sign Ups Data (Plan vs Actual)
    const signUpsPlanRow = data.rows.find(r => r[0] === 'Opt-In Sign Ups Plan');
    const signUpsActualRow = data.rows.find(r => r[0] === 'Opt-In Sign Ups Actual');
    const signUpsChartData = prepareChartData(data.headers, signUpsPlanRow, signUpsActualRow);

    const formatGmvAxis = (value: number) => `$${formatKM(value)}`;

    return (
        <ChartPopoverShell
            title="Opt-In Progress"
            subtitle="OPT-IN · MONTHLY"
            onOpenChange={onOpenChange}
            contentClassName=""
        >
            <div className="flex flex-col gap-10 py-2">
                {/* GMV Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Affiliate GMV</span>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={gmvChartData} margin={CHART_MARGIN}>
                                <CartesianGrid {...GRID_PROPS} />
                                <XAxis dataKey="month" {...AXIS_PROPS} tick={false} axisLine={false} />
                                <YAxis {...AXIS_PROPS} tickFormatter={formatGmvAxis} />
                                <Tooltip
                                    {...TOOLTIP_STYLE}
                                    separator=""
                                    formatter={((value: number) => [formatGmvAxis(value), ""]) as never}
                                />
                                <Legend {...LEGEND_STYLE} />
                                <Line
                                    name="Actual GMV"
                                    type="monotone"
                                    dataKey="actual"
                                    stroke="#10b981"
                                    strokeWidth={2.5}
                                    dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sign Ups Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opt-In Sign-ups</span>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={signUpsChartData} margin={CHART_MARGIN}>
                                <CartesianGrid {...GRID_PROPS} />
                                <XAxis dataKey="month" {...AXIS_PROPS} />
                                <YAxis {...AXIS_PROPS} tickFormatter={formatKM} />
                                <Tooltip
                                    {...TOOLTIP_STYLE}
                                    separator=""
                                    formatter={((value: number) => [value.toLocaleString(), ""]) as never}
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
