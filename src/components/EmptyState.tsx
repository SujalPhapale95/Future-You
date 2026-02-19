'use client';

import Link from 'next/link';
import { ScrollText, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
    href: string;
}

export default function EmptyState({ href }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] p-12 text-center animate-fade-in">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-4xl shadow-inner">
                📜
            </div>

            <h3 className="mb-3 font-serif text-2xl font-bold text-[var(--text-primary)]">
                Your future self is waiting.
            </h3>

            <p className="mb-8 max-w-sm text-[var(--text-secondary)]">
                You haven't written any contracts yet. A contract is a promise you make to yourself that fires exactly when it matters.
            </p>

            <div className="flex flex-col items-center gap-4">
                <Link
                    href={href}
                    className="group flex items-center gap-2 rounded-full bg-[var(--accent-red)] px-8 py-3 font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/20 active:scale-95"
                >
                    Start with a template
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                    href={href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
                >
                    or write from scratch
                </Link>
            </div>
        </div>
    );
}
