import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ContractCard from '@/components/ContractCard';
import { ContractWithConditions } from '@/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
    const supabase = createServerSupabaseClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/auth/login');
    }

    const { data: contractsData } = await supabase
        .from('contracts')
        .select('*, conditions(*)')
        .eq('user_id', session.user.id)
        .in('status', ['completed', 'failed'])
        .order('created_at', { ascending: false });

    const archivedContracts = (contractsData || []) as ContractWithConditions[];

    return (
        <div className="min-h-screen bg-[#f5f0e8] text-[#0f0e0c]">
            <Navbar />

            <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex items-center">
                    <Link href="/dashboard" className="mr-4 text-[#6b6458] hover:text-[#0f0e0c]">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="font-serif text-3xl font-bold tracking-tight">Archive</h1>
                </div>
                <p className="mb-8 text-[#6b6458]">A history of your promises kept and lessons learned.</p>

                {archivedContracts.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#d4cfc2] bg-[#f9f6f0] p-12 text-center">
                        <p className="text-[#6b6458]">You don&apos;t have any archived contracts yet.</p>
                        <Link
                            href="/dashboard"
                            className="mt-4 inline-block font-medium text-[#c9443a] hover:text-[#b03028]"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {archivedContracts.map((contract) => (
                            <ContractCard key={contract.id} contract={contract} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
