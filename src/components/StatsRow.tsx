'use client';

import { Check, X } from 'lucide-react';

interface StatsRowProps {
    activeCount: number;
    keptCount: number;
    brokeCount: number;
}

export default function StatsRow({ activeCount, keptCount, brokeCount }: StatsRowProps) {
    return (
        <div className="stats-row grid grid-cols-3 gap-4">
            {/* Active Card */}
            <div
                className="group rounded-xl border p-7 text-center transition-all duration-250"
                style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-primary)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(240, 234, 216, 0.06)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <p
                    className="text-[10px] uppercase tracking-widest"
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.2em',
                        color: 'var(--text-faint)'
                    }}
                >
                    Active
                </p>
                <p
                    className="mt-2 text-5xl font-bold"
                    style={{
                        fontFamily: "'Lora', serif",
                        color: 'var(--text-primary)'
                    }}
                >
                    {activeCount}
                </p>
            </div>

            {/* Kept Card */}
            <div
                className="group rounded-xl border p-7 text-center transition-all duration-250"
                style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-green)';
                    e.currentTarget.style.boxShadow = '0 0 20px var(--glow-green)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <p
                    className="text-[10px] uppercase tracking-widest"
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.2em',
                        color: 'var(--text-faint)'
                    }}
                >
                    Kept
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                    <p
                        className="text-5xl font-bold"
                        style={{
                            fontFamily: "'Lora', serif",
                            color: 'var(--accent-green)'
                        }}
                    >
                        {keptCount}
                    </p>
                    <Check className="h-5 w-5" style={{ color: 'var(--accent-green)' }} />
                </div>
            </div>

            {/* Broken Card */}
            <div
                className="group rounded-xl border p-7 text-center transition-all duration-250"
                style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-red)';
                    e.currentTarget.style.boxShadow = '0 0 20px var(--glow-red)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <p
                    className="text-[10px] uppercase tracking-widest"
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.2em',
                        color: 'var(--text-faint)'
                    }}
                >
                    Broken
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                    <p
                        className="text-5xl font-bold"
                        style={{
                            fontFamily: "'Lora', serif",
                            color: 'var(--accent-red)'
                        }}
                    >
                        {brokeCount}
                    </p>
                    <X className="h-5 w-5" style={{ color: 'var(--accent-red)' }} />
                </div>
            </div>
        </div>
    );
}
