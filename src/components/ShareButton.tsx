'use client';

import { Share2, Check, Copy } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton({ title, text }: { title: string; text: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Future-You Contract',
                    text: `I made a promise to my future self: ${title}`,
                    url,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to copy link
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
        >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
            {copied ? 'Copied Link' : 'Share Promise'}
        </button>
    );
}
