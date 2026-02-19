'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

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
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-base)] p-4 text-center">
            <div className="mb-4 rounded-full bg-red-900/20 p-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-[var(--text-primary)]">Failed to load contract</h2>
            <p className="mb-6 max-w-md text-sm text-[var(--text-secondary)]">
                We couldn't find the contract you're looking for, or there was an error loading it.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="flex items-center gap-2 rounded-lg bg-[var(--component-bg)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:opacity-80 transition-opacity"
                >
                    Try again
                </button>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
