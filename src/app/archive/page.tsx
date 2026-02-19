import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ContractCard from '@/components/ContractCard';
import ArchiveBrowser from '@/components/ArchiveBrowser';
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
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
            <Navbar />

            <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex items-center">
                    <Link href="/dashboard" className="mr-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--text-primary)]">Archive</h1>
                </div>
                <p className="mb-8 text-[var(--text-secondary)] font-serif italic">A history of your promises kept and lessons learned.</p>

                <ArchiveBrowser contracts={archivedContracts} />
            </main>
        </div>
    );
}
