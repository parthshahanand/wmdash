"use client";

import React, { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

interface ImpressionsChartPopoverProps {
    data: TableData;
    onOpenChange?: (open: boolean) => void;
}

export const ImpressionsChartPopover: React.FC<ImpressionsChartPopoverProps> = ({ data, onOpenChange }) => {
    const [view, setView] = useState<'overall' | 'spark-squad' | 'organic' | 'opt-in'>('overall');

    const ROW_MAP = {
        'overall': { plan: 'Impressions Plan', actual: 'Impressions Actual' },
        'spark-squad': { plan: 'Spark Squad Plan', actual: 'Spark Squad Actual' },
        'organic': { plan: 'Organic Plan', actual: 'Organic Actual' },
        'opt-in': { plan: 'Opt-In Plan', actual: 'Opt-In Actual' },
    };

    const { plan: planLabel, actual: actualLabel } = ROW_MAP[view];
    const planRow = data.rows.find(r => r[0] === planLabel);
    const actualRow = data.rows.find(r => r[0] === actualLabel);

    const chartData = prepareChartData(data.headers, planRow, actualRow);

    const extraHeaderAction = (
        <Select value={view} onValueChange={(v) => setView(v as 'overall' | 'spark-squad' | 'organic' | 'opt-in')}>
            <SelectTrigger className="w-[160px] h-8 text-[11px] font-semibold uppercase tracking-wider bg-slate-50 border-slate-200">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
                <SelectItem value="overall" className="text-[11px] font-semibold uppercase tracking-wider">Overall</SelectItem>
                <SelectItem value="spark-squad" className="text-[11px] font-semibold uppercase tracking-wider">Spark Squad</SelectItem>
                <SelectItem value="organic" className="text-[11px] font-semibold uppercase tracking-wider">Organic</SelectItem>
                <SelectItem value="opt-in" className="text-[11px] font-semibold uppercase tracking-wider">Opt-In</SelectItem>
            </SelectContent>
        </Select>
    );

    return (
        <ChartPopoverShell
            title="Impressions Progress"
            subtitle="IMPRESSIONS · MONTHLY"
            onOpenChange={onOpenChange}
            extraHeaderAction={extraHeaderAction}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={CHART_MARGIN}>
                    <CartesianGrid {...GRID_PROPS} />
                    <XAxis dataKey="month" {...AXIS_PROPS} dy={10} />
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
        </ChartPopoverShell>
    );
};
