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

interface CmChartPopoverProps {
    data: TableData;
    onOpenChange?: (open: boolean) => void;
}

export const CmChartPopover: React.FC<CmChartPopoverProps> = ({ data, onOpenChange }) => {
    const planRow = data.rows.find((row) => row[0].includes("Plan"));
    const actualRow = data.rows.find((row) => !row[0].includes("Plan") && !row[0].includes("Metric"));

    const finalData = prepareChartData(data.headers, planRow, actualRow);

    return (
        <ChartPopoverShell
            title="CM Progress"
            subtitle="PLAN VS ACTUAL · MONTHLY"
            onOpenChange={onOpenChange}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={finalData} margin={CHART_MARGIN}>
                    <CartesianGrid {...GRID_PROPS} />
                    <XAxis dataKey="month" {...AXIS_PROPS} dy={10} />
                    <YAxis {...AXIS_PROPS} tickFormatter={formatKM} />
                    <Tooltip
                        {...TOOLTIP_STYLE}
                        separator=""
                        formatter={((value: number) => [formatKM(value), ""]) as never}
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
        </ChartPopoverShell>
    );
};
