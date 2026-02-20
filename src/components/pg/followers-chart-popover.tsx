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

interface FollowersChartPopoverProps {
    data: TableData;
    onOpenChange?: (open: boolean) => void;
}

export const FollowersChartPopover: React.FC<FollowersChartPopoverProps> = ({ data, onOpenChange }) => {
    const [view, setView] = useState<'overall' | 'instagram' | 'tiktok'>('overall');

    const ROW_MAP = {
        overall: { plan: 'Followers Plan', actual: 'Followers Actual' },
        instagram: { plan: 'Instagram Plan', actual: 'Instagram Actual' },
        tiktok: { plan: 'TikTok Plan', actual: 'TikTok Actual' },
    };

    const { plan: planLabel, actual: actualLabel } = ROW_MAP[view];
    const planRow = data.rows.find(r => r[0] === planLabel);
    const actualRow = data.rows.find(r => r[0] === actualLabel);

    const chartData = prepareChartData(data.headers, planRow, actualRow);

    const extraHeaderAction = (
        <Select value={view} onValueChange={(v) => setView(v as 'overall' | 'instagram' | 'tiktok')}>
            <SelectTrigger className="w-[140px] h-8 text-[11px] font-semibold uppercase tracking-wider bg-slate-50 border-slate-200">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
                <SelectItem value="overall" className="text-[11px] font-semibold uppercase tracking-wider">Overall</SelectItem>
                <SelectItem value="instagram" className="text-[11px] font-semibold uppercase tracking-wider">Instagram</SelectItem>
                <SelectItem value="tiktok" className="text-[11px] font-semibold uppercase tracking-wider">TikTok</SelectItem>
            </SelectContent>
        </Select>
    );

    return (
        <ChartPopoverShell
            title="Followers Progress"
            subtitle="FOLLOWERS · MONTHLY"
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
