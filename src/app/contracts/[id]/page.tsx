import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Tag, Clock } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import CategoryTag from '@/components/CategoryTag';
import ContractActions from '@/components/ContractActions';
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
        <div className="min-h-screen bg-[#f5f0e8] text-[#0f0e0c]">
            <Navbar />

            <main className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex items-center">
                    <Link href="/dashboard" className="mr-4 text-[#6b6458] hover:text-[#0f0e0c]">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <span className="text-sm font-medium text-[#6b6458]">Back to Dashboard</span>
                </div>

                <div className="overflow-hidden rounded-lg border border-[#d4cfc2] bg-white shadow-sm">
                    <div className="border-b border-[#d4cfc2] bg-[#f9f6f0] px-6 py-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <CategoryTag category={contract.category} />
                                    <span className="text-xs text-[#6b6458]">
                                        Created on {new Date(contract.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h1 className="font-serif text-2xl font-bold text-[#0f0e0c] sm:text-3xl">
                                    {contract.title}
                                </h1>
                            </div>
                            <StatusBadge status={contract.status} />
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        <div className="prose prose-stone max-w-none">
                            <h3 className="font-serif text-lg font-bold text-[#0f0e0c]">The Promise</h3>
                            <p className="text-lg leading-relaxed text-[#0f0e0c]">{contract.body}</p>
                        </div>

                        <div className="mt-8 border-t border-[#d4cfc2] pt-6">
                            <h3 className="mb-4 font-serif text-lg font-bold text-[#0f0e0c]">Conditions</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {contract.conditions.length === 0 ? (
                                    <p className="text-sm italic text-[#6b6458]">No specific conditions set.</p>
                                ) : (
                                    contract.conditions.map((condition) => (
                                        <div
                                            key={condition.id}
                                            className="flex items-center rounded-md border border-[#d4cfc2] bg-[#f9f6f0] px-4 py-3"
                                        >
                                            {condition.type === 'time' && <Clock className="mr-3 h-5 w-5 text-[#c9443a]" />}
                                            {condition.type === 'day' && <Calendar className="mr-3 h-5 w-5 text-[#c9443a]" />}
                                            {condition.type === 'location_tag' && <MapPin className="mr-3 h-5 w-5 text-[#c9443a]" />}
                                            {condition.type === 'situation_tag' && <Tag className="mr-3 h-5 w-5 text-[#c9443a]" />}

                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wider text-[#6b6458]">
                                                    {condition.type.replace('_', ' ')}
                                                </p>
                                                <p className="font-medium text-[#0f0e0c]">{condition.value}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <ContractActions contractId={contract.id} currentStatus={contract.status} />
                    </div>
                </div>
            </main>
        </div>
    );
}
