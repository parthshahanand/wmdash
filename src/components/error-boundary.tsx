'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in">
                    <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mb-6">
                        <Warning size={32} weight="bold" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm">
                        An unexpected error occurred while rendering the dashboard.
                        Our team has been notified.
                    </p>
                    <div className="bg-muted/30 border border-border/50 rounded-lg p-4 mb-8 max-w-xl w-full text-left overflow-auto max-h-40">
                        <code className="text-[10px] font-mono whitespace-pre text-muted-foreground">
                            {this.state.error?.toString()}
                        </code>
                    </div>
                    <Button
                        onClick={this.handleReset}
                        className="font-bold uppercase tracking-widest text-[10px] px-8"
                    >
                        Reload Application
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
