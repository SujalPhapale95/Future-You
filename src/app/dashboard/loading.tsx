import Navbar from '@/components/Navbar';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[var(--bg-base)]">
            <Navbar />
            <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                {/* Header Skeleton */}
                <div className="mb-10 animate-pulse">
                    <div className="h-4 w-32 rounded bg-[var(--bg-elevated)] mb-4"></div>
                    <div className="h-12 w-3/4 rounded bg-[var(--bg-elevated)] mb-2"></div>
                    <div className="h-12 w-1/2 rounded bg-[var(--bg-elevated)]"></div>
                    <div className="mt-4 h-px w-16 bg-[var(--bg-elevated)]"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="mb-10 animate-pulse flex gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 flex-1 rounded-xl bg-[var(--bg-elevated)]"></div>
                    ))}
                </div>

                {/* Contracts Skeleton */}
                <div className="animate-pulse">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--bg-elevated)]"></div>
                        <div className="h-8 w-48 rounded bg-[var(--bg-elevated)]"></div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-48 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
                                <div className="mb-4 h-6 w-1/3 rounded bg-[var(--bg-surface)]"></div>
                                <div className="mb-2 h-4 w-full rounded bg-[var(--bg-surface)]"></div>
                                <div className="mb-4 h-4 w-2/3 rounded bg-[var(--bg-surface)]"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
