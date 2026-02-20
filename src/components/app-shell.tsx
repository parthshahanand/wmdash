'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { useData } from '@/lib/data-context';
import { Input } from '@/components/ui/input';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { filters, setFilters } = useData();
    const pathname = usePathname();
    const isPG = pathname === '/pg';

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-20 border-b border-border flex items-center px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
                    {/* Left: Logo */}
                    <div className="flex-1 flex justify-start items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Image src="/spark.svg" alt="Walmart Spark" width={40} height={40} className="w-10 h-10" priority />
                            <h1 className="text-xl font-bold tracking-tight hidden lg:block text-primary whitespace-nowrap">Dashboard</h1>
                        </div>

                        <nav className="flex items-center bg-secondary/30 p-1 rounded-xl border border-border/40">
                            <Link
                                href="/dash"
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${!isPG
                                    ? 'bg-background text-primary shadow-sm ring-1 ring-border/20'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/pg"
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isPG
                                    ? 'bg-background text-primary shadow-sm ring-1 ring-border/20'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Progress Grid
                            </Link>
                        </nav>
                    </div>

                    {/* Center: Search */}
                    <div className="flex-[2] flex justify-center max-w-2xl px-4">
                        {!isPG && (
                            <div className="w-full relative group">
                                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-all group-focus-within:text-primary group-focus-within:scale-110" />
                                <Input
                                    placeholder="Search campaigns, content, reach..."
                                    className="pl-12 pr-12 h-11 bg-secondary/20 border-border/60 hover:border-border focus:bg-background focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-base rounded-xl shadow-sm"
                                    value={filters.searchQuery}
                                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                                />
                                {filters.searchQuery && (
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:scale-110 transition-all p-1"
                                        aria-label="Clear search"
                                    >
                                        <X className="w-4 h-4" weight="bold" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Title + GitHub */}
                    <div className="flex-1 flex items-center justify-end gap-4">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground transition-colors cursor-default text-right">
                            Walmart Social Insights | 2025 Dashboard
                        </div>
                    </div>
                </header>
                <div className="p-8 pb-16 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};
