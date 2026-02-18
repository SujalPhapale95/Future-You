import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Tag, Clock } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import CategoryTag from '@/components/CategoryTag';
import ContractActions from '@/components/ContractActions';
import ContractPreview from '@/components/ContractPreview';
import { ContractWithConditions } from '@/types';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ContractDetailPage({ params }: PageProps) {
    const supabase = createServerSupabaseClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/auth/login');
    }

    const { data: contractData, error } = await supabase
        .from('contracts')
        .select('*, conditions(*)')
        .eq('id', params.id)
        .single();

    if (error || !contractData) {
        notFound();
    }

    const contract = contractData as ContractWithConditions;

    // Verify ownership
    if (contract.user_id !== session.user.id) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
            <Navbar />

            <main className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex items-center">
                    <Link href="/dashboard" className="mr-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Back to Dashboard</span>
                </div>

                <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm">
                    <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <CategoryTag category={contract.category} />
                                    <span className="text-xs text-[var(--text-secondary)] font-mono">
                                        CREATED ON {new Date(contract.created_at).toLocaleDateString().toUpperCase()}
                                    </span>
                                </div>
                                <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                                    {contract.title}
                                </h1>
                            </div>
                            <StatusBadge status={contract.status} />
                        </div>
                    </div>

                    <div className="px-6 py-6 transition-all duration-300">
                        <div className="prose prose-invert max-w-none">
                            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">The Promise</h3>
                            <p className="text-lg leading-relaxed text-[var(--text-primary)] font-serif italic opacity-90">
                                "{contract.body}"
                            </p>
                        </div>

                        <div className="mt-8 border-t border-[var(--border)] pt-6">
                            <h3 className="mb-4 font-serif text-lg font-bold text-[var(--text-primary)]">Conditions</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {contract.conditions.length === 0 ? (
                                    <p className="text-sm italic text-[var(--text-secondary)]">No specific conditions set.</p>
                                ) : (
                                    contract.conditions.map((condition) => (
                                        <div
                                            key={condition.id}
                                            className="flex items-center rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3"
                                        >
                                            {condition.type === 'time' && <Clock className="mr-3 h-5 w-5 text-[var(--accent-red)]" />}
                                            {condition.type === 'day' && <Calendar className="mr-3 h-5 w-5 text-[var(--accent-red)]" />}
                                            {condition.type === 'location_tag' && <MapPin className="mr-3 h-5 w-5 text-[var(--accent-red)]" />}
                                            {condition.type === 'situation_tag' && <Tag className="mr-3 h-5 w-5 text-[var(--accent-red)]" />}

                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-faint)] font-mono">
                                                    {condition.type.replace('_', ' ')}
                                                </p>
                                                <p className="font-medium text-[var(--text-primary)]">{condition.value}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-[var(--border)]">
                            <h3 className="mb-6 font-serif text-lg font-bold text-[var(--text-primary)]">Official Document</h3>
                            <ContractPreview
                                title={contract.title}
                                body={contract.body}
                                category={contract.category}
                                conditions={contract.conditions.map(c => ({ id: c.id, type: c.type, value: c.value }))}
                                userEmail={session.user.email}
                            />
                        </div>

                        <ContractActions contractId={contract.id} currentStatus={contract.status} />
                    </div>
                </div>
            </main>
        </div>
    );
}
