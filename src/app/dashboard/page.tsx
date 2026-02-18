import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatsRow from '@/components/StatsRow';
import ContractCard from '@/components/ContractCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import PushNotificationManager from '@/components/PushNotificationManager';
import EmptyState from '@/components/EmptyState';
import { ContractWithConditions } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = createServerSupabaseClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/auth/login');
    }

    // Fetch active contracts
    const { data: contractsData } = await supabase
        .from('contracts')
        .select('*, conditions(*)')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    const activeContracts = (contractsData || []) as ContractWithConditions[];

    // Fetch completed contracts for stats
    const { data: completedData } = await supabase
        .from('contracts')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('status', 'completed');

    // Fetch failed contracts for stats
    const { data: failedData } = await supabase
        .from('contracts')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('status', 'failed');

    const stats = {
        active: activeContracts.length,
        kept: completedData?.length || 0,
        broke: failedData?.length || 0,
    };

    // Get current date for header
    const now = new Date();
    const dateLabel = now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }).toUpperCase();

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                <header className="dashboard-header mb-10">
                    <p
                        className="text-[11px] uppercase tracking-widest"
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: '0.15em',
                            color: 'var(--text-faint)'
                        }}
                    >
                        DASHBOARD · {dateLabel}
                    </p>
                    <h1
                        className="mt-2 text-4xl font-bold leading-tight sm:text-5xl"
                        style={{
                            fontFamily: "'Lora', serif",
                            color: 'var(--text-primary)',
                            lineHeight: '1.1'
                        }}
                    >
                        Your Promises,
                        <br />
                        Future You.
                    </h1>
                    <div
                        className="mt-4 h-px w-16"
                        style={{
                            backgroundColor: 'var(--accent-red)'
                        }}
                    />
                </header>

                <section className="mb-10">
                    <div className="mb-6 flex justify-end">
                        <PushNotificationManager />
                    </div>
                    <StatsRow
                        activeCount={stats.active}
                        keptCount={stats.kept}
                        brokeCount={stats.broke}
                    />
                </section>

                <section className="contracts-section">
                    <div className="mb-6 flex items-center gap-3">
                        <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                                background: 'var(--accent-red)',
                                animation: 'pulse 2s infinite'
                            }}
                        />
                        <h2
                            className="text-2xl font-semibold"
                            style={{
                                fontFamily: "'Lora', serif",
                                color: 'var(--text-primary)'
                            }}
                        >
                            Active Contracts
                        </h2>
                    </div>

                    {activeContracts.length === 0 ? (
                        <EmptyState href="/contracts/new" />
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2">
                            {activeContracts.map((contract) => (
                                <ContractCard key={contract.id} contract={contract} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <FloatingActionButton />
        </div>
    );
}
