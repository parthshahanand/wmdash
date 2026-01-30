'use client';

import React from 'react';
import { useData } from '@/lib/data-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Calendar } from '@phosphor-icons/react/dist/ssr/Calendar';
import { getWalmartWeeks } from '@/lib/week-utils';

export const WeeklyFilter: React.FC = () => {
    const { filters, setFilters } = useData();
    const weeks = React.useMemo(() => getWalmartWeeks(), []);

    const toggleWeek = (weekId: string) => {
        setFilters(prev => ({
            ...prev,
            selectedWeeks: prev.selectedWeeks.includes(weekId)
                ? prev.selectedWeeks.filter(id => id !== weekId)
                : [...prev.selectedWeeks, weekId]
        }));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-9 gap-2 font-bold text-[11px] uppercase tracking-wider border-border/50",
                        filters.selectedWeeks.length === 0 && "text-muted-foreground"
                    )}
                >
                    <Calendar className="w-4 h-4" />
                    Weekly Range
                    {filters.selectedWeeks.length > 0 && (
                        <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                            {filters.selectedWeeks.length}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[260px] max-h-[400px] overflow-y-auto">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Walmart Fiscal Weeks</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {weeks.map((week) => (
                    <DropdownMenuCheckboxItem
                        key={week.id}
                        checked={filters.selectedWeeks.includes(week.id)}
                        onCheckedChange={() => toggleWeek(week.id)}
                        onSelect={(e) => e.preventDefault()}
                        className="text-xs"
                    >
                        {week.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
