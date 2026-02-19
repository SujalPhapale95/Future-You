'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 rounded-full bg-red-900/20 p-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-[var(--text-primary)]">Something went wrong!</h2>
            <p className="mb-6 max-w-md text-sm text-[var(--text-secondary)]">
                We couldn't load your dashboard data. This might be due to a connection issue or a temporary glitch.
            </p>
            <button
                onClick={() => reset()}
                className="flex items-center gap-2 rounded-lg bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors border border-[var(--border)]"
            >
                <RefreshCcw className="h-4 w-4" />
                Try again
            </button>
        </div>
    );
}
