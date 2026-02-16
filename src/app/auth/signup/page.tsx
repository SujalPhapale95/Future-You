'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // For now, redirect to dashboard or show check email message
            // Supabase defaults to requiring email confirmation unless disabled
            router.push('/dashboard');
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f0e8] p-4 text-[#0f0e0c]">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="font-serif text-3xl font-bold tracking-tight">Future-You</h1>
                    <p className="mt-2 text-sm text-[#6b6458]">Create your account to start making promises.</p>
                </div>

                <div className="space-y-4">
                    <form className="space-y-4" onSubmit={handleSignup}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#0f0e0c]">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-md border border-[#d4cfc2] bg-white px-3 py-2 shadow-sm focus:border-[#c9443a] focus:outline-none focus:ring-1 focus:ring-[#c9443a]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#0f0e0c]">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 block w-full rounded-md border border-[#d4cfc2] bg-white px-3 py-2 shadow-sm focus:border-[#c9443a] focus:outline-none focus:ring-1 focus:ring-[#c9443a]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md border border-transparent bg-[#c9443a] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#b03028] focus:outline-none focus:ring-2 focus:ring-[#c9443a] focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-[#6b6458]">Already have an account? </span>
                        <Link href="/auth/login" className="font-medium text-[#c9443a] hover:text-[#b03028]">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
