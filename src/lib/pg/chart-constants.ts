import { parseMetricValue } from "./parse-metric";

export const CHART_COLORS = {
    plan: "#f59e0b", // Amber 500
    actual: "#3b82f6", // Blue 500
};

export const CHART_MARGIN = { top: 5, right: 10, left: 0, bottom: 0 };

export const GRID_PROPS = {
    strokeDasharray: "3 3",
    vertical: false,
    stroke: "#E2E8F0",
};

export const AXIS_PROPS = {
    axisLine: false,
    tickLine: false,
    tick: { fill: '#94A3B8', fontSize: 10, fontWeight: 500 },
};

export const TOOLTIP_STYLE = {
    contentStyle: {
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        padding: '10px 12px'
    },
    labelStyle: { fontSize: '11px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' },
    itemStyle: { fontSize: '11px', padding: '1px 0' },
};

export const LEGEND_STYLE = {
    verticalAlign: "top" as const,
    align: "right" as const,
    iconType: "circle" as const,
    iconSize: 8,
    wrapperStyle: {
        paddingBottom: '20px',
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em'
    },
};

/**
 * Common formatters for Y-Axis and Tooltips
 */
export const formatKM = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
};

export const formatPct = (value: number) => {
    return `${value.toFixed(1)}%`;
};

/**
 * Shared data preparer for standard Plan/Actual monthly charts
 */
export const prepareChartData = (headers: string[], planRow?: string[], actualRow?: string[]) => {
    return headers.slice(2, 14).map((header, index) => ({
        month: header,
        plan: planRow ? parseMetricValue(planRow[index + 2]) : null,
        actual: actualRow ? parseMetricValue(actualRow[index + 2]) : null,
    })).filter(d => d.plan !== null || d.actual !== null);
};
