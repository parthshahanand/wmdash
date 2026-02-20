'use client';

import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import {
    PieChart,
    Pie,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const NETWORK_COLORS: Record<string, string> = {
    INSTAGRAM: '#db2777', // pink-600
    TIKTOK: '#000000',    // black
};

import { ChartPie } from '@phosphor-icons/react/dist/ssr/ChartPie';

type Metric = 'posts' | 'impressions' | 'engagements' | 'engagementRate';

export const NetworkBreakdown: React.FC = () => {
    const { filteredPosts } = useData();
    const [metric, setMetric] = useState<Metric>('posts');

    const data = React.useMemo(() => {
        const networkStats: Record<string, { posts: number, impressions: number, engagements: number, reach: number }> = {};

        filteredPosts.forEach(post => {
            if (!networkStats[post.network]) {
                networkStats[post.network] = { posts: 0, impressions: 0, engagements: 0, reach: 0 };
            }
            networkStats[post.network].posts += 1;
            networkStats[post.network].impressions += post.impressions;
            networkStats[post.network].engagements += post.engagements;
            networkStats[post.network].reach += (post.reach || 0);
        });

        return Object.entries(networkStats).map(([name, stats]) => {
            let value = 0;
            if (metric === 'posts') value = stats.posts;
            else if (metric === 'impressions') value = stats.impressions;
            else if (metric === 'engagements') value = stats.engagements;
            else if (metric === 'engagementRate') value = stats.reach > 0 ? (stats.engagements * 100) / stats.reach : 0;

            return {
                name,
                value,
                fill: NETWORK_COLORS[name as keyof typeof NETWORK_COLORS] || 'hsl(var(--muted))'
            };
        }).filter(d => d.value > 0);
    }, [filteredPosts, metric]);

    const isPercentage = metric === 'engagementRate';

    return (
        <Card className="h-full flex flex-col border-border/50 animate-in" style={{ animationDelay: '600ms' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ChartPie className="w-5 h-5 text-primary" />
                    Network Breakdown
                </CardTitle>
                <Select value={metric} onValueChange={(val: Metric) => setMetric(val)}>
                    <SelectTrigger className="h-7 w-[120px] text-[10px] font-bold uppercase border-border/50 bg-secondary/30">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="posts" className="text-[10px] font-bold uppercase">Posts</SelectItem>
                        <SelectItem value="impressions" className="text-[10px] font-bold uppercase">Impressions</SelectItem>
                        <SelectItem value="engagements" className="text-[10px] font-bold uppercase">Engagements</SelectItem>
                        <SelectItem value="engagementRate" className="text-[10px] font-bold uppercase">Eng. Rate %</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-1 min-h-[400px] flex items-center justify-center">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={125}
                                dataKey="value"
                                animationDuration={1000}
                                stroke="hsl(var(--card))"
                                strokeWidth={12}
                                className="outline-none"
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
                                formatter={((value: number) => isPercentage ? `${value.toFixed(2)}%` : value.toLocaleString()) as never}
                            />
                            <Legend
                                iconType="circle"
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{
                                    fontSize: '9px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    paddingTop: '10px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <ChartPie size={20} className="opacity-40" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">No data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
