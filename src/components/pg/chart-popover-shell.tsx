"use client";

import React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChartBarLineIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ChartPopoverShellProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    onOpenChange?: (open: boolean) => void;
    triggerLabel?: string;
    extraHeaderAction?: React.ReactNode;
    contentClassName?: string;
}

export const ChartPopoverShell: React.FC<ChartPopoverShellProps> = ({
    title,
    subtitle,
    children,
    onOpenChange,
    triggerLabel = "Visualize",
    extraHeaderAction,
    contentClassName = "h-[300px]",
}) => {
    return (
        <Popover onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-8 px-3 text-xs font-medium bg-white hover:bg-gray-50 border-gray-200">
                    <HugeiconsIcon icon={ChartBarLineIcon} size={14} />
                    {triggerLabel}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[780px] p-6 rounded-xl shadow-xl border-gray-200 bg-white">
                <div className="flex items-start justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{title}</h3>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                            {subtitle}
                        </p>
                    </div>
                    {extraHeaderAction}
                </div>

                <div className={`w-full ${contentClassName}`}>
                    {children}
                </div>
            </PopoverContent>
        </Popover>
    );
};
