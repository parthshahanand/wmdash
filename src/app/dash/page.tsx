'use client';

import React from 'react';
import { FiltersBar } from '@/components/filters-bar';
import { PerformanceChart } from '@/components/performance-chart';
import { NetworkBreakdown } from '@/components/network-breakdown';
import { PostsTable } from '@/components/posts-table';
import { useData } from '@/lib/data-context';
import { StatCards as Stats } from '@/components/stat-cards';
import { FollowersChart } from '@/components/followers-chart';
import { X } from '@phosphor-icons/react/dist/ssr/X';

export default function DashboardPage() {
  const { isLoading, error } = useData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-sans text-sm font-medium animate-pulse">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
            <X className="w-6 h-6" weight="bold" />
          </div>
          <h2 className="text-xl font-sans font-bold">Data Access Error</h2>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div id="overview" className="scroll-mt-20 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Executive Overview</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Real-time social media performance metrics for Walmart Canada campaigns and organic content.
        </p>
      </div>

      <Stats />

      <FollowersChart />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <PerformanceChart />
        </div>
        <div className="space-y-8">
          <NetworkBreakdown />
        </div>
      </div>

      <div id="inventory" className="scroll-mt-20 space-y-6">
        <FiltersBar />
        <PostsTable />
      </div>
    </div>
  );
}
