'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '@/lib/data-context';
import { Post } from '@/types/post';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { InstagramLogo } from '@phosphor-icons/react/dist/ssr/InstagramLogo';
import { TiktokLogo } from '@phosphor-icons/react/dist/ssr/TiktokLogo';
import { ArrowsDownUp } from '@phosphor-icons/react/dist/ssr/ArrowsDownUp';
import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft';
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { ChatText } from '@phosphor-icons/react/dist/ssr/ChatText';
import { ArrowSquareOut } from '@phosphor-icons/react/dist/ssr/ArrowSquareOut';
import dayjs from 'dayjs';

export const PostsTable: React.FC = () => {
    const { filteredPosts } = useData();
    const [sortConfig, setSortConfig] = useState<{ key: keyof Post; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredPosts, itemsPerPage]);

    const handleSort = (key: keyof Post) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedPosts = useMemo(() => {
        let sortableItems = [...filteredPosts];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal === null) return 1;
                if (bVal === null) return -1;

                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredPosts, sortConfig]);

    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedPosts.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedPosts, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);

    const getNetworkIcon = (network: string) => {
        switch (network) {
            case 'TIKTOK': return <TiktokLogo weight="fill" className="w-5 h-5 text-[#000000]" />;
            case 'INSTAGRAM': return <InstagramLogo weight="fill" className="w-5 h-5 text-[#E4405F]" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-in" style={{ animationDelay: '800ms' }}>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight">Content Inventory</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        Analysis of individual post performance
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">Show</span>
                    <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(parseInt(v))}>
                        <SelectTrigger className="h-8 w-[130px] text-xs font-bold border-border/50 bg-muted/30">
                            <SelectValue placeholder="Entries" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10 entries</SelectItem>
                            <SelectItem value="25">25 entries</SelectItem>
                            <SelectItem value="50">50 entries</SelectItem>
                            <SelectItem value="100">100 entries</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden text-sm">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border/40">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/40">
                                <TableHead className="w-[60px] pl-6 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">Platform</TableHead>
                                <TableHead onClick={() => handleSort('publishedAt')} className="w-[100px] cursor-pointer hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80 whitespace-nowrap" aria-label={`Sort by date ${sortConfig?.key === 'publishedAt' ? (sortConfig.direction === 'asc' ? 'descending' : 'ascending') : ''}`}>
                                    Date <ArrowsDownUp className="ml-1 h-3 w-3 inline opacity-40" />
                                </TableHead>
                                <TableHead className="min-w-[300px] max-w-md text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">Caption</TableHead>
                                <TableHead className="w-[80px] text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">URL</TableHead>
                                <TableHead className="w-[90px] text-center text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">Type</TableHead>
                                <TableHead onClick={() => handleSort('impressions')} className="w-[100px] cursor-pointer hover:text-primary text-right whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80" aria-label={`Sort by impressions ${sortConfig?.key === 'impressions' ? (sortConfig.direction === 'asc' ? 'descending' : 'ascending') : ''}`}>
                                    Impr. <ArrowsDownUp className="ml-1 h-3 w-3 inline opacity-40" />
                                </TableHead>
                                <TableHead onClick={() => handleSort('engagements')} className="w-[100px] cursor-pointer hover:text-primary text-right whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">
                                    Eng. <ArrowsDownUp className="ml-1 h-3 w-3 inline opacity-40" />
                                </TableHead>
                                <TableHead className="w-[100px] text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80 pr-6">
                                    ER% <ArrowsDownUp className="ml-1 h-3 w-3 inline opacity-40" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedPosts.length > 0 ? (
                                paginatedPosts.map((post) => {
                                    return (
                                        <TableRow
                                            key={post.id}
                                            className={`group transition-colors border-b border-border/30 last:border-0 ${post.boosted ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/10'}`}
                                        >
                                            <TableCell className="pl-6">
                                                {getNetworkIcon(post.network)}
                                            </TableCell>
                                            <TableCell className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                                                {dayjs(post.publishedAt).format('MMM DD, YYYY')}
                                            </TableCell>
                                            <TableCell className="max-w-[400px]">
                                                <p className="text-sm font-medium leading-relaxed line-clamp-1 group-hover:text-foreground transition-colors overflow-hidden text-ellipsis">
                                                    {post.text}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                {post.url && (
                                                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors inline-block" title="View Source Post">
                                                        <ArrowSquareOut size={18} weight="bold" />
                                                    </a>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="text-[9px] px-2 py-0.5 font-bold uppercase tracking-tighter bg-muted/20 border-border/30 text-muted-foreground/70">
                                                    {post.postType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm font-bold tabular-nums text-foreground">
                                                {post.impressions.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm font-bold tabular-nums text-foreground">
                                                {post.engagements.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm font-bold tabular-nums text-foreground pr-6">
                                                {(post.engagementRate * 100).toFixed(2)}%
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                                        No posts found matching the current filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Showing {Math.min(paginatedPosts.length + (currentPage - 1) * itemsPerPage, sortedPosts.length)} of {sortedPosts.length} Results • Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="h-8 px-4 font-bold text-[10px] uppercase tracking-widest border-border/50 bg-muted/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-none"
                        aria-label="Previous page"
                    >
                        <CaretLeft className="h-3 w-3 mr-1.5" weight="bold" /> Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="h-8 px-4 font-bold text-[10px] uppercase tracking-widest border-border/50 bg-muted/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-none"
                        aria-label="Next page"
                    >
                        Next <CaretRight className="h-3 w-3 ml-1.5" weight="bold" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
