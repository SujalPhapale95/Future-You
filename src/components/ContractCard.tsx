'use client';

import Link from 'next/link';
import { ContractWithConditions } from '@/types';
import ConditionBadge from './ConditionBadge';
import StatusBadge from './StatusBadge';

interface ContractCardProps {
    contract: ContractWithConditions;
}

const categoryColors: Record<string, string> = {
    study: 'var(--accent-amber)',
    health: 'var(--accent-green)',
    focus: 'var(--accent-red)',
    relationships: '#7a8fd4',
    finance: 'var(--accent-gold)',
    other: 'var(--border-bright)'
};

export default function ContractCard({ contract }: ContractCardProps) {
    const categoryColor = categoryColors[contract.category] || categoryColors.other;

    return (
        <Link href={`/contracts/${contract.id}`} className="block">
            <div
                className="group relative rounded-xl border p-5 shadow-sm transition-all duration-200"
                style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    borderLeftWidth: '3px',
                    borderLeftColor: categoryColor
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                    e.currentTarget.style.borderColor = 'var(--border-bright)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <span
                            className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                backgroundColor: `${categoryColor}26`,
                                color: categoryColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            {contract.category}
                        </span>
                        <h3
                            className="mt-2 font-serif text-lg font-semibold transition-colors"
                            style={{
                                fontFamily: "'Lora', serif",
                                color: 'var(--text-primary)'
                            }}
                        >
                            {contract.title}
                        </h3>
                    </div>
                    <StatusBadge status={contract.status} />
                </div>

                <p
                    className="mt-3 line-clamp-2 text-sm"
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: 'var(--text-secondary)'
                    }}
                >
                    {contract.body}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {contract.conditions.map((condition) => (
                        <ConditionBadge key={condition.id} condition={condition} />
                    ))}
                </div>
            </div>
        </Link>
    );
}
