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
import { parseMetricValue } from "@/lib/pg/parse-metric";
import { ChartPopoverShell } from "./chart-popover-shell";
import {
    AXIS_PROPS,
    CHART_COLORS,
    CHART_MARGIN,
    GRID_PROPS,
    LEGEND_STYLE,
    TOOLTIP_STYLE,
    formatPct
} from "@/lib/pg/chart-constants";

interface ErChartPopoverProps {
    data: TableData;
    onOpenChange?: (open: boolean) => void;
}

function parseErCell(cell: string | undefined): { organic: number | null; boosted: number | null } {
    if (!cell) return { organic: null, boosted: null };
    const lines = cell.split('\n');
    const organic = parseMetricValue(lines[0]);
    const boostedLine = lines.find(l => l.trim().startsWith('B:') || l.trim().startsWith('B '));
    const boosted = boostedLine ? parseMetricValue(boostedLine.replace(/^B:?\s*/i, '')) : null;
    return { organic, boosted };
}

export const ErChartPopover: React.FC<ErChartPopoverProps> = ({ data, onOpenChange }) => {
    const [view, setView] = useState<'organic' | 'paid'>('organic');
    const [showInstagram, setShowInstagram] = useState(false);
    const [showTikTok, setShowTikTok] = useState(false);
    const [showSparkSquad, setShowSparkSquad] = useState(false);

    // Identify rows
    const organicPlanRow = data.rows.find(r => r[0] === 'Organic ER Plan');
    const organicActualRow = data.rows.find(r => r[0] === 'Organic ER Actual');
    const igRow = data.rows.find(r => r[0] === 'Instagram Actual');
    const tiktokRow = data.rows.find(r => r[0] === 'TikTok Actual');
    const sparkSquadRow = data.rows.find(r => r[0].includes('Spark Squad'));
    const paidPlanRow = data.rows.find(r => r[0].includes('Paid/Boosted ER Plan'));
    const paidActualRow = data.rows.find(r => r[0].includes('Paid/Boosted ER Actual'));

    const headers = data.headers;

    const organicChartData = headers.slice(2, 14).map((header, i) => {
        const col = i + 2;
        const erCell = parseErCell(organicActualRow?.[col]);
        const igCell = parseErCell(igRow?.[col]);
        const ttCell = parseErCell(tiktokRow?.[col]);
        return {
            month: header,
            plan: parseMetricValue(organicPlanRow?.[col]),
            actual: erCell.organic,
            ig: igCell.organic,
            igBoosted: igCell.boosted,
            tiktok: ttCell.organic,
            tiktokBoosted: ttCell.boosted,
            sparkSquad: parseMetricValue(sparkSquadRow?.[col]),
        };
    });

    const paidChartData = headers.slice(2, 14).map((header, i) => {
        const col = i + 2;
        const monthIndex = i;
        const planVal = monthIndex >= 3 ? 1.35 : parseMetricValue(paidPlanRow?.[col]?.split('\n')[0]);
        return {
            month: header,
            plan: planVal,
            actual: parseMetricValue(paidActualRow?.[col]),
        };
    });

    const extraHeaderAction = (
        <Select value={view} onValueChange={(v) => setView(v as 'organic' | 'paid')}>
            <SelectTrigger className="w-[110px] h-8 text-[11px] font-semibold uppercase tracking-wider bg-slate-50 border-slate-200">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
                <SelectItem value="organic" className="text-[11px] font-semibold uppercase tracking-wider">Organic</SelectItem>
                <SelectItem value="paid" className="text-[11px] font-semibold uppercase tracking-wider">Paid</SelectItem>
            </SelectContent>
        </Select>
    );

    return (
        <ChartPopoverShell
            title="ER Progress"
            subtitle="ENGAGEMENT RATE · MONTHLY"
            onOpenChange={onOpenChange}
            extraHeaderAction={extraHeaderAction}
        >
            <div className="flex flex-col h-full gap-4">
                {view === 'organic' && (
                    <div className="flex gap-6 px-1">
                        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={showInstagram}
                                onChange={(e) => setShowInstagram(e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                            />
                            SHOW INSTAGRAM
                        </label>
                        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={showTikTok}
                                onChange={(e) => setShowTikTok(e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                            />
                            SHOW TIKTOK
                        </label>
                        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={showSparkSquad}
                                onChange={(e) => setShowSparkSquad(e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            SHOW SPARK SQUAD
                        </label>
                    </div>
                )}

                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={view === 'organic' ? organicChartData : paidChartData} margin={CHART_MARGIN}>
                            <CartesianGrid {...GRID_PROPS} />
                            <XAxis dataKey="month" {...AXIS_PROPS} dy={10} />
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

                            {view === 'organic' && showInstagram && (
                                <>
                                    <Line
                                        name="Instagram"
                                        type="monotone"
                                        dataKey="ig"
                                        stroke="#db2777"
                                        strokeWidth={1.5}
                                        dot={{ r: 2, fill: '#db2777', strokeWidth: 0 }}
                                    />
                                    <Line
                                        name="IG Boosted"
                                        type="monotone"
                                        dataKey="igBoosted"
                                        stroke="#9d174d"
                                        strokeWidth={1.5}
                                        strokeDasharray="4 4"
                                        dot={{ r: 2, fill: '#9d174d', strokeWidth: 0 }}
                                    />
                                </>
                            )}

                            {view === 'organic' && showTikTok && (
                                <>
                                    <Line
                                        name="TikTok"
                                        type="monotone"
                                        dataKey="tiktok"
                                        stroke="#06b6d4"
                                        strokeWidth={1.5}
                                        dot={{ r: 2, fill: '#06b6d4', strokeWidth: 0 }}
                                    />
                                    <Line
                                        name="TT Boosted"
                                        type="monotone"
                                        dataKey="tiktokBoosted"
                                        stroke="#0e7490"
                                        strokeWidth={1.5}
                                        strokeDasharray="4 4"
                                        dot={{ r: 2, fill: '#0e7490', strokeWidth: 0 }}
                                    />
                                </>
                            )}

                            {view === 'organic' && showSparkSquad && (
                                <Line
                                    name="Spark Squad"
                                    type="monotone"
                                    dataKey="sparkSquad"
                                    stroke="#10b981"
                                    strokeWidth={1.5}
                                    dot={{ r: 2, fill: '#10b981', strokeWidth: 0 }}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </ChartPopoverShell>
    );
};
