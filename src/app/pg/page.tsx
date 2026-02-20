'use client';

import { useState } from "react";
import { DataProvider as PGDataProvider, useData as usePGData } from "@/lib/pg/data-context";
import { DataTable } from "@/components/pg/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
    UserGroupIcon,
    ViewIcon,
    PercentCircleIcon,
    MaskTheater02Icon,
    TaskEdit02Icon,
    MailOpenLoveIcon
} from "@hugeicons/core-free-icons";
import { CmChartPopover } from "@/components/pg/cm-chart-popover";
import { OptInChartPopover } from "@/components/pg/optin-chart-popover";
import { SentimentChartPopover } from "@/components/pg/sentiment-chart-popover";
import { ErChartPopover } from "@/components/pg/er-chart-popover";
import { FollowersChartPopover } from "@/components/pg/followers-chart-popover";
import { ImpressionsChartPopover } from "@/components/pg/impressions-chart-popover";

function ProgressGridContent() {
    const { tables, isLoading, error } = usePGData();
    const [activePopoverIndex, setActivePopoverIndex] = useState<number | null>(null);

    const getIconForTable = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('followers')) return UserGroupIcon;
        if (lowerTitle.includes('impressions')) return ViewIcon;
        if (lowerTitle.includes('engagement rate')) return PercentCircleIcon;
        if (lowerTitle.includes('sentiment')) return MaskTheater02Icon;
        if (lowerTitle.includes('opt-in')) return TaskEdit02Icon;
        if (lowerTitle.includes('community management')) return MailOpenLoveIcon;
        return undefined;
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20 max-w-md">
                    <h2 className="text-xl font-bold text-destructive mb-2">Something went wrong</h2>
                    <p className="text-foreground">{error}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-12">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-6 w-48 ml-1" />
                        <Skeleton className="h-[400px] w-full rounded-lg" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12 w-full mx-auto pb-20">
            {tables.map((table, index) => (
                <section
                    key={index}
                    id={table.title.toLowerCase().replace(/\s+/g, '-')}
                    className="transition-all duration-300"
                    style={
                        activePopoverIndex !== null && activePopoverIndex !== index
                            ? { filter: 'blur(2px)', opacity: 0.5 }
                            : undefined
                    }
                >
                    <DataTable
                        data={table}
                        icon={getIconForTable(table.title)}
                        actionSlot={
                            table.title.toLowerCase().includes('community management')
                                ? <CmChartPopover
                                    data={table}
                                    onOpenChange={(open) => setActivePopoverIndex(open ? index : null)}
                                />
                                : table.title.toLowerCase().includes('opt-in')
                                    ? <OptInChartPopover
                                        data={table}
                                        onOpenChange={(open) => setActivePopoverIndex(open ? index : null)}
                                    />
                                    : table.title.toLowerCase().includes('sentiment')
                                        ? <SentimentChartPopover
                                            data={table}
                                            onOpenChange={(open) => setActivePopoverIndex(open ? index : null)}
                                        />
                                        : table.title.toLowerCase().includes('engagement rate')
                                            ? <ErChartPopover
                                                data={table}
                                                onOpenChange={(open) => setActivePopoverIndex(open ? index : null)}
                                            />
                                            : table.title.toLowerCase().includes('followers')
                                                ? <FollowersChartPopover
                                                    data={table}
                                                    onOpenChange={(open) => setActivePopoverIndex(open ? index : null)}
                                                />
                                                : table.title.toLowerCase().includes('impressions')
                                                    ? <ImpressionsChartPopover
                                                        data={table}
                                                        onOpenChange={(open) => setActivePopoverIndex(open ? index : null)}
                                                    />
                                                    : undefined
                        }
                    />
                </section>
            ))}
        </div>
    );
}

export default function ProgressGridPage() {
    return (
        <PGDataProvider>
            <div className="space-y-10">
                <div id="overview" className="scroll-mt-20 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Progress Grid</h1>
                    <p className="text-muted-foreground text-sm max-w-2xl">
                        Performance targets vs actuals for Walmart Canada social channels.
                    </p>
                </div>
                <ProgressGridContent />
            </div>
        </PGDataProvider>
    );
}
