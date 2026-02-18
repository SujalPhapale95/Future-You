'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
        router.refresh();
    };

    return (
        <nav
            className="sticky top-0 z-50 border-b px-4 py-3 sm:px-6"
            style={{
                backgroundColor: 'rgba(14, 12, 10, 0.85)',
                backdropFilter: 'blur(12px)',
                borderColor: 'var(--border)'
            }}
        >
            <div className="mx-auto flex max-w-4xl items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div
                        className="h-2 w-2 rounded-full"
                        style={{
                            background: 'var(--accent-red)',
                            boxShadow: '0 0 8px var(--accent-red)'
                        }}
                    />
                    <span
                        className="font-serif text-xl font-semibold italic tracking-tight"
                        style={{
                            fontFamily: "'Lora', serif",
                            color: 'var(--text-primary)'
                        }}
                    >
                        Future-You
                    </span>
                    <span className="hidden rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent-green)] opacity-80 sm:inline-block">
                        v2.0
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        href="/archive"
                        className="text-xs uppercase tracking-wider transition-all hover:underline"
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.08em',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        Archive
                    </Link>
                    <Link
                        href="/account"
                        className="text-xs uppercase tracking-wider transition-all hover:underline"
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.08em',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        Account
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 text-xs uppercase tracking-wider transition-all hover:underline"
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.08em',
                            color: 'var(--text-secondary)'
                        }}
                        title="Sign out"
                    >
                        <span className="hidden sm:inline">Sign out</span>
                        <LogOut className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
