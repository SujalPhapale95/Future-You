'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, PenLine, Bell, X, ChevronRight } from 'lucide-react';

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        // Check if user has seen welcome. 
        // Note: The prompt implies checking if user has 0 contracts too, 
        // but that logic is best handled in the parent (Dashboard) to avoid fetching here.
        // For now, we'll rely on the parent to only render this if specific conditions met,
        // OR we just check the flag. user said: "Check localStorage... if true, don't show"
        if (!hasSeenWelcome) {
            setIsOpen(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenWelcome', 'true');
    };

    const handleFinish = () => {
        handleDismiss();
        router.push('/contracts/new');
    };

    const nextSlide = () => setCurrentSlide(prev => prev + 1);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleDismiss}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl">
                <button
                    onClick={handleDismiss}
                    className="absolute right-4 top-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-8">
                    {/* Slides */}
                    <div className="min-h-[300px]">
                        {currentSlide === 0 && (
                            <div className="flex animate-fade-in flex-col items-center text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-4xl">
                                    📜
                                </div>
                                <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text-primary)]">
                                    Welcome to Future-You
                                </h2>
                                <p className="text-[var(--text-secondary)]">
                                    The app that helps you keep promises to your future self.
                                    Integrity is a muscle. Let's start building it.
                                </p>
                            </div>
                        )}

                        {currentSlide === 1 && (
                            <div className="animate-fade-in space-y-6">
                                <h3 className="text-center font-serif text-xl font-semibold">How it works</h3>

                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                                        <PenLine className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--text-primary)]">Write a Contract</p>
                                        <p className="text-sm text-[var(--text-secondary)]">Make a specific promise to yourself.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--text-primary)]">Set Conditions</p>
                                        <p className="text-sm text-[var(--text-secondary)]">Choose exactly when you need to be reminded.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--text-primary)]">Get Reminded</p>
                                        <p className="text-sm text-[var(--text-secondary)]">Receive a notification at the perfect moment.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentSlide === 2 && (
                            <div className="flex animate-fade-in flex-col items-center text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-red)] text-white shadow-lg shadow-red-900/20">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text-primary)]">
                                    Ready to start?
                                </h2>
                                <p className="mb-8 text-[var(--text-secondary)]">
                                    Your first contract is waiting. What will you promise yourself today?
                                </p>
                                <button
                                    onClick={handleFinish}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-red)] px-6 py-3 font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Create my first contract
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation Dots & Buttons */}
                    {currentSlide < 2 && (
                        <div className="mt-8 flex items-center justify-between">
                            <button
                                onClick={handleDismiss}
                                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                Skip
                            </button>

                            <div className="flex gap-2">
                                {[0, 1, 2].map((idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all ${idx === currentSlide
                                                ? 'w-6 bg-[var(--accent-red)]'
                                                : 'w-1.5 bg-[var(--border)]'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextSlide}
                                className="flex items-center gap-1 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-red)]"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
