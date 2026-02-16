'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
            router.refresh();
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Panel - Dark Atmosphere */}
            <div
                className="hidden md:flex md:w-[55%] flex-col justify-between p-12 sticky top-0 h-screen"
                style={{
                    backgroundColor: '#0e0c0a',
                    backgroundImage: `
                        radial-gradient(ellipse 70% 60% at 30% 40%, rgba(224, 92, 74, 0.1) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 40% at 80% 80%, rgba(212, 146, 74, 0.06) 0%, transparent 50%)
                    `
                }}
            >
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div
                        className="h-2 w-2 rounded-full"
                        style={{
                            background: '#e05c4a',
                            boxShadow: '0 0 8px #e05c4a',
                            animation: 'pulse 2s infinite'
                        }}
                    />
                    <span
                        className="text-xl italic"
                        style={{
                            fontFamily: "'Lora', serif",
                            color: '#f0ead8'
                        }}
                    >
                        Future-You
                    </span>
                </div>

                {/* Quote Section */}
                <div className="flex-1 flex flex-col justify-center max-w-md">
                    <p
                        className="text-3xl italic leading-relaxed"
                        style={{
                            fontFamily: "'Lora', serif",
                            color: '#f0ead8',
                            lineHeight: '1.3'
                        }}
                    >
                        &quot;The version of you
                        <br />
                        that keeps promises
                        <br />
                        is already inside.&quot;
                    </p>
                    <div
                        className="mt-6 h-0.5 w-10"
                        style={{ backgroundColor: '#e05c4a' }}
                    />
                    <p
                        className="mt-4 text-xs uppercase tracking-widest"
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.15em',
                            color: '#5a5248'
                        }}
                    >
                        Write · Commit · Become
                    </p>
                </div>

                {/* Mini Stats */}
                <div className="flex gap-12">
                    <div>
                        <p
                            className="text-xs uppercase tracking-wider mb-1"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                color: '#5a5248'
                            }}
                        >
                            Contracts Written
                        </p>
                        <p
                            className="text-2xl"
                            style={{
                                fontFamily: "'Lora', serif",
                                color: '#9a8f7e'
                            }}
                        >
                            2,847
                        </p>
                    </div>
                    <div>
                        <p
                            className="text-xs uppercase tracking-wider mb-1"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                color: '#5a5248'
                            }}
                        >
                            Promises Kept
                        </p>
                        <p
                            className="text-2xl"
                            style={{
                                fontFamily: "'Lora', serif",
                                color: '#9a8f7e'
                            }}
                        >
                            71%
                        </p>
                    </div>
                    <div>
                        <p
                            className="text-xs uppercase tracking-wider mb-1"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                color: '#5a5248'
                            }}
                        >
                            People Growing
                        </p>
                        <p
                            className="text-2xl"
                            style={{
                                fontFamily: "'Lora', serif",
                                color: '#9a8f7e'
                            }}
                        >
                            growing
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div
                className="w-full md:w-[45%] min-h-screen flex items-center justify-center p-12"
                style={{ background: '#f5f0e8' }}
            >
                <div className="w-full max-w-sm form-container" style={{ animation: 'fadeSlideUp 0.6s ease forwards' }}>
                    {/* Title */}
                    <h1
                        className="text-4xl font-bold mb-1"
                        style={{
                            fontFamily: "'Lora', serif",
                            color: '#0f0e0c'
                        }}
                    >
                        Welcome back.
                    </h1>
                    <p
                        className="text-sm mb-9"
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: '#6b6458'
                        }}
                    >
                        Your future self is waiting.
                    </p>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 rounded-lg border px-5 py-3.5 text-sm font-medium transition-all duration-200"
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            background: '#ffffff',
                            borderColor: '#d4cfc2',
                            borderWidth: '1.5px',
                            color: '#0f0e0c'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#b8b0a4';
                            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d4cfc2';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.01-.19.01-.38.01-.58z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </button>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t" style={{ borderColor: '#d4cfc2' }} />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span
                                className="px-2"
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    background: '#f5f0e8',
                                    color: '#9a8f7e'
                                }}
                            >
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form className="space-y-5" onSubmit={handleEmailLogin}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs uppercase tracking-widest mb-2"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    letterSpacing: '0.12em',
                                    color: '#6b6458'
                                }}
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full rounded-lg px-4 py-3.5 text-sm outline-none transition-all duration-200"
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    background: '#ffffff',
                                    border: '1.5px solid #d4cfc2',
                                    color: '#0f0e0c'
                                }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#e05c4a';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224, 92, 74, 0.12)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#d4cfc2';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs uppercase tracking-widest mb-2"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    letterSpacing: '0.12em',
                                    color: '#6b6458'
                                }}
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full rounded-lg px-4 py-3.5 text-sm outline-none transition-all duration-200"
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    background: '#ffffff',
                                    border: '1.5px solid #d4cfc2',
                                    color: '#0f0e0c'
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#e05c4a';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224, 92, 74, 0.12)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#d4cfc2';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {error && (
                            <p className="text-sm" style={{ color: '#c9443a' }}>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg border-none px-4 py-3.5 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50"
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                background: '#e05c4a',
                                boxShadow: '0 4px 20px rgba(224, 92, 74, 0.35)'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.background = '#c94d3c';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 6px 28px rgba(224, 92, 74, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#e05c4a';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(224, 92, 74, 0.35)';
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <span style={{ color: '#6b6458' }}>Don&apos;t have an account? </span>
                        <Link
                            href="/auth/signup"
                            className="font-medium transition-all"
                            style={{ color: '#e05c4a' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.textDecoration = 'none';
                            }}
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
