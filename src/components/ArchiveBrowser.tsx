'use client';

import { useState } from 'react';
import { ContractWithConditions } from '@/types';
import ContractCard from './ContractCard';
import { Filter, SortDesc, SortAsc } from 'lucide-react';

interface ArchiveBrowserProps {
    contracts: ContractWithConditions[];
}

type FilterType = 'all' | 'completed' | 'failed';
type SortType = 'newest' | 'oldest';

export default function ArchiveBrowser({ contracts }: ArchiveBrowserProps) {
    const [filter, setFilter] = useState<FilterType>('all');
    const [sort, setSort] = useState<SortType>('newest');

    const filteredContracts = contracts
        .filter(c => {
            if (filter === 'all') return true;
            return c.status === filter;
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sort === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex bg-[var(--bg-elevated)] p-1 rounded-lg self-start">
                    {(['all', 'completed', 'failed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`
                                px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize
                                ${filter === f
                                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }
                            `}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSort(sort === 'newest' ? 'oldest' : 'newest')}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        {sort === 'newest' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                        {sort === 'newest' ? 'Newest First' : 'Oldest First'}
                    </button>
                </div>
            </div>

            {filteredContracts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-surface)] p-12 text-center">
                    <p className="text-[var(--text-secondary)]">
                        {filter === 'all'
                            ? "You don't have any archived contracts yet."
                            : `No ${filter} contracts found.`}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    {filteredContracts.map((contract) => (
                        <ContractCard key={contract.id} contract={contract} />
                    ))}
                </div>
            )}
        </div>
    );
}
