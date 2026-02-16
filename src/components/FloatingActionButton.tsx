import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function FloatingActionButton() {
    return (
        <Link
            href="/contracts/new"
            className="fab fixed flex h-14 w-14 items-center justify-center rounded-full border-none text-white transition-all duration-250 hover:scale-110 hover:rotate-45 focus:outline-none"
            style={{
                bottom: '32px',
                right: '32px',
                background: 'var(--accent-red)',
                boxShadow: '0 4px 24px rgba(224, 92, 74, 0.5), 0 0 0 0 rgba(224, 92, 74, 0.4)',
                animation: 'fabPulse 2.5s infinite'
            }}
            aria-label="New Contract"
        >
            <Plus className="h-6 w-6" />
        </Link>
    );
}
