'use client';

import Link from 'next/link';
import { useState } from 'react';

interface EmptyStateProps {
    href: string;
}

export default function EmptyState({ href }: EmptyStateProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="rounded-2xl border border-dashed p-16 text-center"
            style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border)'
            }}
        >
            <div className="text-5xl opacity-20">📜</div>
            <h3
                className="mt-6 text-2xl italic"
                style={{
                    fontFamily: "'Lora', serif",
                    color: 'var(--text-secondary)'
                }}
            >
                No promises yet.
            </h3>
            <p
                className="mt-2 text-sm"
                style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--text-faint)'
                }}
            >
                Your future self is waiting.
                <br />
                Write your first contract.
            </p>
            <Link
                href={href}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border-none px-7 py-3 text-sm font-medium text-white transition-all duration-200"
                style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: isHovered ? '#c94d3c' : 'var(--accent-red)',
                    transform: isHovered ? 'translateY(-1px) scale(1.05)' : 'scale(1)',
                    boxShadow: isHovered ? '0 6px 28px rgba(224, 92, 74, 0.45)' : '0 4px 20px rgba(224, 92, 74, 0.3)'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                → Write your first contract
            </Link>
        </div>
    );
}
