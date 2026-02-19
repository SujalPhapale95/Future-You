'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Check, X, ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Reminder, Contract } from '@/types';

// We need a joined type for the fetch
type ReminderWithContract = Reminder & {
    contracts: Contract;
};

export default function ReminderPage({ params }: { params: { reminderId: string } }) {
    const [reminder, setReminder] = useState<ReminderWithContract | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReflection, setShowReflection] = useState(false);
    const [reflection, setReflection] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchReminder = async () => {
            const { data, error } = await supabase
                .from('reminders')
                .select('*, contracts(*)')
                .eq('id', params.reminderId)
                .single();

            if (error) {
                setError('Could not find this reminder.');
            } else {
                setReminder(data as any); // Type assertion needed due to join
            }
            setLoading(false);
        };

        fetchReminder();
    }, [params.reminderId, supabase]);

    const handleResponse = async (status: 'kept' | 'broken') => {
        if (status === 'broken' && !showReflection) {
            setShowReflection(true);
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('reminders')
                .update({
                    response: status,
                    responded_at: new Date().toISOString(),
                    reflection_note: status === 'broken' ? reflection : null
                } as any) // Casting as any because reflection_note might not be in types yet
                .eq('id', params.reminderId);

            if (error) throw error;

            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            console.error('Error updating reminder:', err);
            setError('Failed to save response. Please try again.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] text-[var(--text-secondary)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !reminder) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-base)] p-4 text-center">
                <p className="mb-4 text-[var(--text-secondary)]">{error || 'Reminder not found'}</p>
                <Link href="/dashboard" className="text-[var(--accent-red)] hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    // Identify if it's already responded
    if (reminder.response) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-base)] p-4 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-4xl">
                    {reminder.response === 'kept' ? '✅' : '❌'}
                </div>
                <h1 className="mb-2 font-serif text-2xl font-bold text-[var(--text-primary)]">
                    You already responded
                </h1>
                <p className="mb-8 text-[var(--text-secondary)]">
                    This promise was marked as <span className="font-bold uppercase">{reminder.response}</span>.
                </p>
                <Link
                    href="/dashboard"
                    className="rounded-lg bg-[var(--bg-elevated)] px-6 py-3 font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                >
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-base)]">
            <Navbar />

            <main className="mx-auto max-w-2xl p-4 py-12 sm:p-6 lg:p-8">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-xl">
                    <div className="bg-[var(--bg-elevated)] px-8 py-6 border-b border-[var(--border)]">
                        <span className="mb-2 inline-block rounded-full bg-[var(--bg-base)] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                            {reminder.contracts.category}
                        </span>
                        <h1 className="font-serif text-2xl font-bold leading-tight text-[var(--text-primary)]">
                            {reminder.contracts.title}
                        </h1>
                    </div>

                    <div className="p-8">
                        <div className="mb-8 space-y-4">
                            <p className="font-serif text-lg italic text-[var(--text-secondary)] opacity-80">
                                "I promise to..."
                            </p>
                            <p className="font-serif text-xl leading-relaxed text-[var(--text-primary)]">
                                {reminder.contracts.body}
                            </p>
                            <div className="h-px w-20 bg-[var(--border)]" />
                        </div>

                        {!showReflection ? (
                            <div className="space-y-6">
                                <p className="text-center text-sm font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                                    Did you keep this promise?
                                </p>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <button
                                        onClick={() => handleResponse('kept')}
                                        disabled={submitting}
                                        className="group relative flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 py-4 text-emerald-400 transition-all hover:bg-emerald-500 hover:text-white"
                                    >
                                        <Check className="h-5 w-5" />
                                        <span className="font-bold">Yes, I kept it</span>
                                    </button>

                                    <button
                                        onClick={() => handleResponse('broken')}
                                        disabled={submitting}
                                        className="group relative flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-4 text-red-400 transition-all hover:bg-red-500 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                        <span className="font-bold">No, I broke it</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fade-in space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                                        Why did you break this promise? <span className="font-normal text-[var(--text-secondary)]">(Optional)</span>
                                    </label>
                                    <textarea
                                        value={reflection}
                                        onChange={(e) => setReflection(e.target.value)}
                                        placeholder="I was too tired, I forgot, something came up..."
                                        className="h-32 w-full rounded-lg bg-[var(--bg-elevated)] p-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none focus:ring-2 focus:ring-[var(--accent-red)]/20"
                                        style={{ border: '1px solid var(--border)' }}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleResponse('broken')} // Submit with empty reflection if skipped
                                        className="flex-1 rounded-lg border border-[var(--border)] py-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                                    >
                                        Skip
                                    </button>
                                    <button
                                        onClick={() => handleResponse('broken')}
                                        className="flex-[2] rounded-lg bg-[var(--accent-red)] py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Saving...' : 'Save & Mark Broken'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
