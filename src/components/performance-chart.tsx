'use client';

import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';

import { ChartLine } from '@phosphor-icons/react/dist/ssr/ChartLine';

type Aggregation = 'daily' | 'weekly' | 'monthly';
type Metric = 'impressions' | 'engagements' | 'engagementRate';

export const PerformanceChart: React.FC = () => {
    const { filteredPosts } = useData();
    const [aggregation, setAggregation] = useState<Aggregation>('daily');
    const [selectedMetric, setSelectedMetric] = useState<Metric>('impressions');

    const chartData = React.useMemo(() => {
        const dataMap: Record<string, {
            date: string,
            timestamp: number,
            impressions: number,
            engagements: number,
            reach: number
        }> = {};

        filteredPosts.forEach(post => {
            let dateKey: string;
            let displayDate: string;
            const m = dayjs(post.publishedAt);

            if (aggregation === 'daily') {
                dateKey = m.format('YYYY-MM-DD');
                displayDate = m.format('MMM DD');
            } else if (aggregation === 'weekly') {
                dateKey = m.startOf('week').format('YYYY-MM-DD');
                displayDate = `Week of ${m.startOf('week').format('MMM DD')}`;
            } else { // monthly
                dateKey = m.startOf('month').format('YYYY-MM');
                displayDate = m.format('MMMM');
            }

            if (!dataMap[dateKey]) {
                dataMap[dateKey] = {
                    date: displayDate,
                    timestamp: m.toDate().getTime(),
                    impressions: 0,
                    engagements: 0,
                    reach: 0
                };
            }
            dataMap[dateKey].impressions += post.impressions;
            dataMap[dateKey].engagements += post.engagements;
            dataMap[dateKey].reach += (post.reach || 0);
        });

        return Object.values(dataMap)
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(d => ({
                ...d,
                engagementRate: d.reach > 0 ? (d.engagements * 100) / d.reach : 0,
            }));
    }, [filteredPosts, aggregation]);


    const metricConfig: Record<Metric, { name: string, color: string, isPercentage: boolean }> = {
        impressions: { name: 'Impressions', color: 'hsl(var(--primary))', isPercentage: false },
        engagements: { name: 'Engagements', color: 'hsl(var(--chart-2))', isPercentage: false },
        engagementRate: { name: 'Eng. Rate (%)', color: 'hsl(var(--chart-3))', isPercentage: true },
    };

    return (
        <Card className="h-full flex flex-col border-border/50 animate-in" style={{ animationDelay: '500ms' }}>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <ChartLine className="w-5 h-5 text-primary" />
                        Performance Over Time
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">
                        {metricConfig[selectedMetric].name} trends across the selected period
                    </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-muted/50 rounded-lg p-1 border border-border/50">
                        {(['daily', 'weekly', 'monthly'] as Aggregation[]).map((mode) => (
                            <Button
                                key={mode}
                                variant={aggregation === mode ? 'secondary' : 'ghost'}
                                size="sm"
                                className={`h-7 px-3 text-[10px] font-bold uppercase tracking-wider transition-all ${aggregation === mode ? 'bg-background shadow-sm border border-border/50' : 'text-muted-foreground'
                                    }`}
                                onClick={() => setAggregation(mode)}
                            >
                                {mode}
                            </Button>
                        ))}
                    </div>

                    <div className="flex bg-muted/50 rounded-lg p-1 border border-border/50">
                        {(Object.keys(metricConfig) as Metric[]).map(m => (
                            <Button
                                key={m}
                                variant={selectedMetric === m ? 'secondary' : 'ghost'}
                                size="sm"
                                className={`h-7 px-3 text-[10px] font-bold uppercase transition-all ${selectedMetric === m ? 'bg-background shadow-sm border border-border/50' : 'text-muted-foreground'
                                    }`}
                                onClick={() => setSelectedMetric(m)}
                            >
                                <div
                                    className="w-1.5 h-1.5 rounded-full mr-1.5"
                                    style={{ backgroundColor: metricConfig[m].color }}
                                />
                                {metricConfig[m].name.split(' (')[0]}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-[400px] pt-4 flex items-center justify-center">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                {(Object.keys(metricConfig) as Metric[]).map(m => (
                                    <linearGradient key={m} id={`color${m}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={metricConfig[m].color} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={metricConfig[m].color} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                minTickGap={30}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey={selectedMetric}
                                name={metricConfig[selectedMetric].name}
                                stroke={metricConfig[selectedMetric].color}
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill={`url(#color${selectedMetric})`}
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <ChartLine size={20} className="opacity-40" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">No data for selected period</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
