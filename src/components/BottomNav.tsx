'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, Archive, User } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    // Don't show on auth pages or landing page
    if (pathname.startsWith('/auth') || pathname === '/') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[var(--border)] bg-[var(--bg-elevated)] px-4 pb-safe md:hidden">
            <Link
                href="/dashboard"
                className={`flex flex-col items-center gap-1 ${isActive('/dashboard') ? 'text-[var(--accent-red)]' : 'text-[var(--text-secondary)]'
                    }`}
            >
                <Home className="h-6 w-6" />
                <span className="text-[10px] font-medium">Home</span>
            </Link>

            <Link
                href="/contracts/new"
                className={`flex flex-col items-center gap-1 ${isActive('/contracts/new') ? 'text-[var(--accent-red)]' : 'text-[var(--text-secondary)]'
                    }`}
            >
                <PlusSquare className="h-6 w-6" />
                <span className="text-[10px] font-medium">Create</span>
            </Link>

            <Link
                href="/archive"
                className={`flex flex-col items-center gap-1 ${isActive('/archive') ? 'text-[var(--accent-red)]' : 'text-[var(--text-secondary)]'
                    }`}
            >
                <Archive className="h-6 w-6" />
                <span className="text-[10px] font-medium">Archive</span>
            </Link>

            <Link
                href="/account"
                className={`flex flex-col items-center gap-1 ${isActive('/account') ? 'text-[var(--accent-red)]' : 'text-[var(--text-secondary)]'
                    }`}
            >
                <User className="h-6 w-6" />
                <span className="text-[10px] font-medium">Profile</span>
            </Link>
        </div>
    );
}
